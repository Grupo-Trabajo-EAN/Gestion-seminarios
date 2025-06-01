const express = require('express');
const router = express.Router();
const db = require('../db'); 


router.get('/', (req, res) => {
  const sql = 'SELECT * FROM metodologias';

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al obtener metodologias' });
    }
    res.json(results);
  });
});

module.exports = router;
