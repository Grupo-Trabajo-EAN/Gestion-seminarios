const express = require("express");
const router = express.Router();
const db = require("../db");

// Crear estudiante
router.post("/", (req, res) => {
  const { nombre, apellido, identificacion, email, carrera, semestre } =
    req.body;

  if (
    !nombre ||
    !apellido ||
    !identificacion ||
    !email ||
    !carrera ||
    !semestre
  ) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }
  const username = email.split("@")[0];
  const sql = `INSERT INTO estudiantes (username,nombre, apellido, identificacion, email, carrera, semestre, password) VALUES ('${username}',?, ?, ?, ?, ?, ?,'123456')`;

  db.query(
    sql,
    [nombre, apellido, identificacion, email, carrera, semestre],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Error al crear estudiante" });
      }
      res
        .status(201)
        .json({
          id: result.insertId,
          nombre,
          apellido,
          identificacion,
          email,
          carrera,
          semestre,
        });
    }
  );
});

// Listar todos los estudiantes
router.get("/", (req, res) => {
  const sql = "SELECT * FROM estudiantes";

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error al obtener estudiantes" });
    }
    res.json(results);
  });
});

module.exports = router;
