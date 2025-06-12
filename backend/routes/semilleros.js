const express = require('express');
const router = express.Router();
const db = require('../db'); 

// GET /semilleros - Get all semilleros with complete information using the comprehensive view
router.get('/', (req, res) => {
  const query = `
    SELECT 
      semillero_id as id,
      semillero_nombre as nombre,
      objetivo_principal,
      objetivos_especificos,
      grupo_nombre,
      grupo_codigo,
      total_estudiantes_activos,
      total_profesores_activos,
      estado_validacion,
      created_at,
      updated_at
    FROM vista_semilleros_completa
    ORDER BY semillero_nombre
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching semilleros:', err);
      return res.status(500).json({ error: 'Fallo al recuperar los semilleros' });
    }
    res.json(results);
  });
});

// GET /semilleros/available/estudiantes - Get students available for assignment
router.get('/available/estudiantes', (req, res) => {
  const query = `
    SELECT 
      e.id,
      e.nombre,
      e.apellido,
      e.identificacion,
      e.email,
      e.carrera,
      e.semestre,
      COALESCE(assignment_count.count, 0) as current_semilleros
    FROM estudiantes e
    LEFT JOIN (
      SELECT estudiante_id, COUNT(*) as count 
      FROM semillero_estudiantes 
      WHERE estado = 'activo' 
      GROUP BY estudiante_id
    ) assignment_count ON e.id = assignment_count.estudiante_id
    ORDER BY assignment_count.count ASC, e.apellido, e.nombre
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching available students:', err);
      return res.status(500).json({ error: 'Error al obtener estudiantes disponibles' });
    }
    res.json(results);
  });
});

// GET /semilleros/available/profesores - Get professors available for assignment  
router.get('/available/profesores', (req, res) => {
  const query = `
    SELECT p.*
    FROM profesores p
    ORDER BY p.nombre, p.apellido
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching available professors:', err);
      return res.status(500).json({ error: 'Fallo al recuperar profesores disponibles' });
    }
    res.json(results);
  });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT 
      s.*,
      gi.campo_investigacion as grupo_nombre,
      gi.codigo as grupo_codigo,
      gi.descripcion as grupo_descripcion
    FROM semilleros s
    LEFT JOIN grupos_investigacion gi ON s.grupo_investigacion_id = gi.id
    WHERE s.id = ? AND s.activo = 1
  `;
  
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error fetching semillero details:', err);
      return res.status(500).json({ error: 'Fallo al recuperar el semillero' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Semillero no encontrado' });
    }
    
    res.json(results[0]);
  });
});

// POST /semilleros - Create a new semillero
router.post('/', (req, res) => {
  const { 
    nombre, 
    objetivo_principal, 
    objetivos_especificos, 
    grupo_investigacion_id,
    estudiantes_ids = [],
    profesores_ids = []
  } = req.body;
  
  if (!nombre || !objetivo_principal || !objetivos_especificos || !grupo_investigacion_id) {
    return res.status(400).json({ error: 'Todos los campos básicos son requeridos' });
  }

  // Validate minimum requirements
  if (estudiantes_ids.length < 2) {
    return res.status(400).json({ error: 'Un semillero debe tener al menos 2 estudiantes' });
  }

  if (profesores_ids.length < 1) {
    return res.status(400).json({ error: 'Un semillero debe tener al menos 1 profesor' });
  }

  const checkGroupQuery = 'SELECT id FROM grupos_investigacion WHERE id = ?';
  
  db.query(checkGroupQuery, [grupo_investigacion_id], (err, groupResults) => {
    if (err) {
      console.error('Error checking research group:', err);
      return res.status(500).json({ error: 'Error al verificar el grupo de investigación' });
    }
    
    if (groupResults.length === 0) {
      return res.status(400).json({ error: 'El grupo de investigación especificado no existe' });
    }

    // Start transaction
    db.beginTransaction((err) => {
      if (err) {
        console.error('Error starting transaction:', err);
        return res.status(500).json({ error: 'Error al iniciar la transacción' });
      }

      // Insert semillero
      const insertSemilleroQuery = 'INSERT INTO semilleros (nombre, objetivo_principal, objetivos_especificos, grupo_investigacion_id, activo) VALUES (?, ?, ?, ?, 1)';
      
      db.query(insertSemilleroQuery, [nombre, objetivo_principal, objetivos_especificos, grupo_investigacion_id], (err, result) => {
        if (err) {
          console.error('Error creating semillero:', err);
          return db.rollback(() => {
            res.status(500).json({ error: 'Fallo al crear el semillero' });
          });
        }

        const semilleroId = result.insertId;

        // Insert student assignments
        const insertStudentPromises = estudiantes_ids.map((estudianteId, index) => {
          return new Promise((resolve, reject) => {
            const rol = index === 0 ? 'coordinador' : 'miembro';
            
            // Check if student is already assigned to this semillero
            const checkQuery = 'SELECT id FROM semillero_estudiantes WHERE semillero_id = ? AND estudiante_id = ? AND estado = "activo"';
            db.query(checkQuery, [semilleroId, estudianteId], (err, existing) => {
              if (err) {
                reject(err);
                return;
              }
              
              if (existing.length > 0) {
                reject(new Error(`El estudiante ${estudianteId} ya está asignado a este semillero`));
                return;
              }
              
              const insertStudentQuery = 'INSERT INTO semillero_estudiantes (semillero_id, estudiante_id, rol, estado, fecha_ingreso) VALUES (?, ?, ?, ?, CURDATE())';
              db.query(insertStudentQuery, [semilleroId, estudianteId, rol, 'activo'], (err, result) => {
                if (err) reject(err);
                else resolve(result);
              });
            });
          });
        });

        // Insert professor assignments
        const insertProfessorPromises = profesores_ids.map((profesorId, index) => {
          return new Promise((resolve, reject) => {
            const rol = index === 0 ? 'director' : 'co-director';
            
            // Check if professor is already assigned to this semillero
            const checkQuery = 'SELECT id FROM semillero_profesores WHERE semillero_id = ? AND profesor_id = ? AND estado = "activo"';
            db.query(checkQuery, [semilleroId, profesorId], (err, existing) => {
              if (err) {
                reject(err);
                return;
              }
              
              if (existing.length > 0) {
                reject(new Error(`El profesor ${profesorId} ya está asignado a este semillero`));
                return;
              }
              
              const insertProfessorQuery = 'INSERT INTO semillero_profesores (semillero_id, profesor_id, rol, estado, fecha_asignacion) VALUES (?, ?, ?, ?, CURDATE())';
              db.query(insertProfessorQuery, [semilleroId, profesorId, rol, 'activo'], (err, result) => {
                if (err) reject(err);
                else resolve(result);
              });
            });
          });
        });

        // Execute all assignments
        Promise.all([...insertStudentPromises, ...insertProfessorPromises])
          .then(() => {
            db.commit((err) => {
              if (err) {
                console.error('Error committing transaction:', err);
                return db.rollback(() => {
                  res.status(500).json({ error: 'Error al finalizar la creación del semillero' });
                });
              }

              res.status(201).json({ 
                id: semilleroId, 
                nombre, 
                objetivo_principal, 
                objetivos_especificos, 
                grupo_investigacion_id,
                estudiantes_asignados: estudiantes_ids.length,
                profesores_asignados: profesores_ids.length
              });
            });
          })
          .catch((err) => {
            console.error('Error assigning members:', err);
            db.rollback(() => {
              res.status(500).json({ error: 'Error al asignar miembros al semillero' });
            });
          });
      });
    });
  });
});

// PUT /semilleros/:id - Update an existing semillero
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, objetivo_principal, objetivos_especificos, grupo_investigacion_id } = req.body;
  
  // Check if at least one field to update is provided
  if (!nombre && !objetivo_principal && !objetivos_especificos && !grupo_investigacion_id) {
    return res.status(400).json({ error: 'Al menos un campo debe ser proporcionado para actualizar' });
  }

  // Build dynamic query based on provided fields
  const fieldsToUpdate = [];
  const values = [];
  
  if (nombre) {
    fieldsToUpdate.push('nombre = ?');
    values.push(nombre);
  }
  
  if (objetivo_principal) {
    fieldsToUpdate.push('objetivo_principal = ?');
    values.push(objetivo_principal);
  }
  
  if (objetivos_especificos) {
    fieldsToUpdate.push('objetivos_especificos = ?');
    values.push(objetivos_especificos);
  }
  
  if (grupo_investigacion_id) {
    fieldsToUpdate.push('grupo_investigacion_id = ?');
    values.push(grupo_investigacion_id);
  }
  
  values.push(id); // Add id for WHERE clause

  // If grupo_investigacion_id is provided, validate it exists
  if (grupo_investigacion_id) {
    const checkGroupQuery = 'SELECT id FROM grupos_investigacion WHERE id = ?';
    
    db.query(checkGroupQuery, [grupo_investigacion_id], (err, groupResults) => {
      if (err) {
        console.error('Error checking research group:', err);
        return res.status(500).json({ error: 'Error al verificar el grupo de investigación' });
      }
      
      if (groupResults.length === 0) {
        return res.status(400).json({ error: 'El grupo de investigación especificado no existe' });
      }

      executeUpdate();
    });
  } else {
    executeUpdate();
  }

  function executeUpdate() {
    const updateQuery = `UPDATE semilleros SET ${fieldsToUpdate.join(', ')} WHERE id = ? AND activo = 1`;
    
    db.query(updateQuery, values, (err, result) => {
      if (err) {
        console.error('Error updating semillero:', err);
        return res.status(500).json({ error: 'Fallo al actualizar el semillero' });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Semillero no encontrado o no está activo' });
      }
      
      // Return the updated fields
      const response = { id: parseInt(id) };
      if (nombre) response.nombre = nombre;
      if (objetivo_principal) response.objetivo_principal = objetivo_principal;
      if (objetivos_especificos) response.objetivos_especificos = objetivos_especificos;
      if (grupo_investigacion_id) response.grupo_investigacion_id = grupo_investigacion_id;
      
      res.json(response);
    });
  }
});

// DELETE /semilleros/:id - Soft delete a semillero
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  // Soft delete: set activo = 0 instead of deleting the record
  const query = 'UPDATE semilleros SET activo = 0 WHERE id = ? AND activo = 1';
  
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error soft deleting semillero:', err);
      return res.status(500).json({ error: 'Fallo al eliminar el semillero' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Semillero no encontrado o ya está eliminado' });
    }
    
    res.json({ message: 'Semillero eliminado exitosamente' });
  });
});

// POST /semilleros/:id/estudiantes - Assign students to a semillero
router.post('/:id/estudiantes', (req, res) => {
  const { id: semilleroId } = req.params;
  const { estudiantesIds } = req.body;

  if (!estudiantesIds || !Array.isArray(estudiantesIds) || estudiantesIds.length === 0) {
    return res.status(400).json({ error: 'Debe proporcionar al menos un estudiante' });
  }

  // First verify that the semillero exists and is active
  const checkSemilleroQuery = 'SELECT id FROM semilleros WHERE id = ? AND activo = 1';
  
  db.query(checkSemilleroQuery, [semilleroId], (err, semilleroResults) => {
    if (err) {
      console.error('Error checking semillero:', err);
      return res.status(500).json({ error: 'Error al verificar el semillero' });
    }
    
    if (semilleroResults.length === 0) {
      return res.status(404).json({ error: 'Semillero no encontrado o inactivo' });
    }

    // Check if students exist and are active
    const checkStudentsQuery = `
      SELECT id FROM estudiantes 
      WHERE id IN (${estudiantesIds.map(() => '?').join(',')}) 
      AND Estado = 'Activo'
    `;
    
    db.query(checkStudentsQuery, estudiantesIds, (err, studentResults) => {
      if (err) {
        console.error('Error checking students:', err);
        return res.status(500).json({ error: 'Error al verificar estudiantes' });
      }
      
      if (studentResults.length !== estudiantesIds.length) {
        return res.status(400).json({ error: 'Algunos estudiantes no existen o están inactivos' });
      }

      // Insert assignments
      const insertQuery = `
        INSERT INTO semillero_estudiantes (semillero_id, estudiante_id, fecha_ingreso, estado)
        VALUES ${estudiantesIds.map(() => '(?, ?, CURDATE(), \'activo\')').join(', ')}
        ON DUPLICATE KEY UPDATE 
          estado = 'activo'
      `;
      
      const insertValues = estudiantesIds.flatMap(estudianteId => [semilleroId, estudianteId]);
      
      db.query(insertQuery, insertValues, (err, result) => {
        if (err) {
          console.error('Error assigning students to semillero:', err);
          return res.status(500).json({ error: 'Error al asignar estudiantes al semillero' });
        }
        
        res.status(201).json({ 
          message: 'Estudiantes asignados exitosamente',
          assignedCount: estudiantesIds.length,
          insertedRows: result.affectedRows
        });
      });
    });
  });
});

// DELETE /semilleros/:semilleroId/estudiantes/:estudianteId - Remove student from semillero
router.delete('/:semilleroId/estudiantes/:estudianteId', (req, res) => {
  const { semilleroId, estudianteId } = req.params;

  const updateQuery = `
    UPDATE semillero_estudiantes 
    SET estado = 'inactivo' 
    WHERE semillero_id = ? AND estudiante_id = ?
  `;
  
  db.query(updateQuery, [semilleroId, estudianteId], (err, result) => {
    if (err) {
      console.error('Error removing student from semillero:', err);
      return res.status(500).json({ error: 'Error al remover estudiante del semillero' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Relación estudiante-semillero no encontrada' });
    }
    
    res.json({ message: 'Estudiante removido del semillero exitosamente' });
  });
});

// GET /semilleros/:id/estudiantes - Get students in a specific semillero  
router.get('/:id/estudiantes', (req, res) => {
  const { id } = req.params;
  
  const query = `
    SELECT 
      e.id,
      e.nombre,
      e.apellido,
      e.identificacion,
      e.email,
      e.carrera,
      e.semestre,
      se.fecha_ingreso,
      se.rol,
      se.estado
    FROM semillero_estudiantes se
    JOIN estudiantes e ON se.estudiante_id = e.id
    WHERE se.semillero_id = ? AND se.estado = 'activo'
    ORDER BY e.apellido, e.nombre
  `;
  
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error fetching semillero students:', err);
      return res.status(500).json({ error: 'Error al obtener estudiantes del semillero' });
    }
    res.json(results);
  });
});

module.exports = router;
