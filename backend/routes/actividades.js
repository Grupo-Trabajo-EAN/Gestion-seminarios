const express = require('express');
const router = express.Router();
const db = require('../db');


router.get('/', (req, res) => {
  db.query('SELECT * FROM actividades', (err, results) => {
    if (err) {
      console.error('Error fetching actividades:', err);
      return res.status(500).json({ error: 'Fallo al recuperar las actividades' });
    }
    res.json(results);
  });
});


router.post('/', (req, res) => {
  const { nombre, plan } = req.body;

  if (!nombre || !plan ) {
    return res.status(400).json({ error: 'Faltan datos para crear la actividad' });
  }

  const query = `INSERT INTO actividades (nombre, plan) VALUES (?, ${plan})`;
  db.query(query, [nombre, plan], (err, results) => {
    if (err) {
      console.error('Error al insertar la actividad:', err);
      return res.status(500).json({ error: 'Error al agregar la actividad' });
    }
    res.status(201).json({
      nombre,
      plan,
    });
  });
});

module.exports = router;
