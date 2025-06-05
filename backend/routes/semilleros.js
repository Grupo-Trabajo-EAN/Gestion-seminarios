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
      e.*,
      COALESCE(assignment_count.count, 0) as current_semilleros
    FROM estudiantes e
    LEFT JOIN (
      SELECT estudiante_id, COUNT(*) as count 
      FROM semillero_estudiantes 
      WHERE estado = 'activo' 
      GROUP BY estudiante_id
    ) assignment_count ON e.id = assignment_count.estudiante_id
    ORDER BY assignment_count.count ASC, e.nombre, e.apellido
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching available students:', err);
      return res.status(500).json({ error: 'Fallo al recuperar estudiantes disponibles' });
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
    WHERE s.id = ?
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

// GET /semilleros/:id/estudiantes - Get students assigned to a specific semillero
router.get('/:id/estudiantes', (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT 
      e.*,
      se.rol,
      se.estado,
      se.fecha_ingreso,
      se.created_at as fecha_asignacion
    FROM estudiantes e
    INNER JOIN semillero_estudiantes se ON e.id = se.estudiante_id
    WHERE se.semillero_id = ? AND se.estado = 'activo'
    ORDER BY e.nombre, e.apellido
  `;
  
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error fetching semillero students:', err);  
      return res.status(500).json({ error: 'Fallo al recuperar los estudiantes del semillero' });
    }
    res.json(results);
  });
});

// GET /semilleros/:id/profesores - Get professors assigned to a specific semillero
router.get('/:id/profesores', (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT 
      p.*,
      sp.rol,
      sp.estado,
      sp.fecha_asignacion,
      sp.horas_semanales
    FROM profesores p
    INNER JOIN semillero_profesores sp ON p.id = sp.profesor_id
    WHERE sp.semillero_id = ? AND sp.estado = 'activo'
    ORDER BY p.nombre, p.apellido
  `;
  
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error fetching semillero professors:', err);
      return res.status(500).json({ error: 'Fallo al recuperar los profesores del semillero' });
    }
    res.json(results);
  });
});

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
      const insertSemilleroQuery = 'INSERT INTO semilleros (nombre, objetivo_principal, objetivos_especificos, grupo_investigacion_id) VALUES (?, ?, ?, ?)';
      
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
              
              const insertStudentQuery = 'INSERT INTO semillero_estudiantes (semillero_id, estudiante_id, rol, estado) VALUES (?, ?, ?, ?)';
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
              
              const insertProfessorQuery = 'INSERT INTO semillero_profesores (semillero_id, profesor_id, rol, estado) VALUES (?, ?, ?, ?)';
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

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, objetivo_principal, objetivos_especificos, grupo_investigacion_id } = req.body;
  
  if (!nombre || !objetivo_principal || !objetivos_especificos || !grupo_investigacion_id) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
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

    const updateQuery = 'UPDATE semilleros SET nombre = ?, objetivo_principal = ?, objetivos_especificos = ?, grupo_investigacion_id = ? WHERE id = ?';
    
    db.query(updateQuery, [nombre, objetivo_principal, objetivos_especificos, grupo_investigacion_id, id], (err, result) => {
      if (err) {
        console.error('Error updating semillero:', err);
        return res.status(500).json({ error: 'Fallo al actualizar el semillero' });
      }
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Semillero no encontrado' });
      }
      
      res.json({ 
        id: parseInt(id), 
        nombre, 
        objetivo_principal, 
        objetivos_especificos, 
        grupo_investigacion_id 
      });
    });
  });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  const query = 'DELETE FROM semilleros WHERE id = ?';
  
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting semillero:', err);
      return res.status(500).json({ error: 'Fallo al eliminar el semillero' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Semillero no encontrado' });
    }
    
    res.json({ message: 'Semillero eliminado exitosamente' });
  });
});

module.exports = router;
