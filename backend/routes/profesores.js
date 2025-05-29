const express = require('express');
const router = express.Router();
const db = require('../db');


router.get('/', (req, res) => {
  db.query('SELECT * FROM profesores', (err, results) => {
    if (err) {
      console.error('Error fetching profesores:', err);
      return res.status(500).json({ error: 'Fallo al recuperar los profesores' });
    }
    res.json(results);
  });
});


router.post('/', (req, res) => {
  const { nombre, email, especialidad } = req.body;

  if (!nombre || !email || !especialidad) {
    return res.status(400).json({ error: 'Faltan datos para crear el profesor' });
  }

  const query = 'INSERT INTO profesores (nombre, email, especialidad) VALUES (?, ?, ?)';
  db.query(query, [nombre, email, especialidad], (err, results) => {
    if (err) {
      console.error('Error al insertar profesor:', err);
      return res.status(500).json({ error: 'Error al agregar el profesor' });
    }
    res.status(201).json({
      id: results.insertId,
      nombre,
      email,
      especialidad,
    });
  });
});

module.exports = router;
