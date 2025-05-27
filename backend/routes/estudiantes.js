const express = require('express');
const router = express.Router();
const db = require('../db'); 

// GET /estudiantes
router.get('/', (req, res) => {
  db.query('SELECT * FROM estudiantes', (err, results) => {
    if (err) {
      console.error('Error fetching estudiantes:', err);
      return res.status(500).json({ error: 'Fallo al recuperar los estudiantes' });
    }
    res.json(results);
  });
});

module.exports = router;
