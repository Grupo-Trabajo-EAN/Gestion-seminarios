const express = require('express');
const router = express.Router();
const db = require('../db');


router.get('/', (req, res) => {
  db.query('SELECT * FROM plan_actividades', (err, results) => {
    if (err) {
      console.error('Error fetching plan_actividades:', err);
      return res.status(500).json({ error: 'Fallo al recuperar los plan_actividades' });
    }
    res.json(results);
  });
});


router.post('/', (req, res) => {
  const { nombre, semillero } = req.body;

  if (!nombre || !semillero ) {
    return res.status(400).json({ error: 'Faltan datos para crear el plan de actividades' });
  }

  const query = `INSERT INTO plan_actividades (nombre, Semillero) VALUES (?, ${semillero})`;
  db.query(query, [nombre, semillero], (err, results) => {
    if (err) {
      console.error('Error al insertar plan actividades:', err);
      return res.status(500).json({ error: 'Error al agregar el plan actividades' });
    }
    res.status(201).json({
      nombre,
      semillero,
    });
  });
});

module.exports = router;
