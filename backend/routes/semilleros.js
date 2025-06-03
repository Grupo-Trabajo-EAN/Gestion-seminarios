const express = require('express');
const router = express.Router();
const db = require('../db'); 

// GET /semilleros - Get all semilleros with research group information
router.get('/', (req, res) => {
  const query = `
    SELECT s.*, gi.campo_investigacion as grupo_nombre, gi.codigo as grupo_codigo
    FROM semilleros s
    LEFT JOIN grupos_investigacion gi ON s.grupo_investigacion_id = gi.id
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching semilleros:', err);
      return res.status(500).json({ error: 'Fallo al recuperar los semilleros' });
    }
    res.json(results);
  });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT s.nombre
    FROM semilleros s where s.id = ${id}
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching nombre semillero:', err);
      return res.status(500).json({ error: 'Fallo al recuperar el nombre del semillero' });
    }
    res.json(results);
  });
});

router.post('/', (req, res) => {
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

    const insertQuery = 'INSERT INTO semilleros (nombre, objetivo_principal, objetivos_especificos, grupo_investigacion_id) VALUES (?, ?, ?, ?)';
    
    db.query(insertQuery, [nombre, objetivo_principal, objetivos_especificos, grupo_investigacion_id], (err, result) => {
      if (err) {
        console.error('Error creating semillero:', err);
        return res.status(500).json({ error: 'Fallo al crear el semillero' });
      }
      res.status(201).json({ 
        id: result.insertId, 
        nombre, 
        objetivo_principal, 
        objetivos_especificos, 
        grupo_investigacion_id 
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
