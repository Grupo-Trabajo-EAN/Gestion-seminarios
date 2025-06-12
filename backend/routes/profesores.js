
const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", (req, res) => {
  db.query("SELECT * FROM profesores", (err, results) => {
    if (err) {
      console.error("Error fetching profesores:", err);
      return res
        .status(500)
        .json({ error: "Fallo al recuperar los profesores" });
    }
    res.json(results);
  });
});

router.post("/", (req, res) => {
  const { nombre, apellido, identificacion, email, especialidad } = req.body;

  if (!nombre || !apellido || !identificacion || !email || !especialidad) {
    return res
      .status(400)
      .json({ error: "Faltan datos para crear el profesor" });
  }

  const query =
    "INSERT INTO profesores (nombre, apellido, identificacion, email, especialidad) VALUES (?, ?, ?, ?, ?)";
  db.query(
    query,
    [nombre, apellido, identificacion, email, especialidad],
    (err, results) => {
      if (err) {
        console.error("Error al insertar profesor:", err);
        return res.status(500).json({ error: "Error al agregar el profesor" });
      }
      res.status(201).json({
        id: results.insertId,
        nombre,
        apellido,
        identificacion,
        email,
        especialidad,
        estado: "Activo",
      });
    }
  );
});

router.put("/inhabilitar/:id", (req, res) => {
  const { id } = req.params;
  const { Estado } = req.body;

  if (!Estado) {
    return res.status(400).json({ error: "Se requiere el campo Estado" });
  }

  const query = "UPDATE profesores SET Estado = ? WHERE id = ?";
  db.query(query, [Estado, id], (err, results) => {
    if (err) {
      console.error("Error al actualizar profesor:", err);
      return res
        .status(500)
        .json({ error: "Error al inhabilitar el profesor" });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Profesor no encontrado" });
    }
    res.json({ message: "Profesor inhabilitado correctamente" });
  });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, identificacion, email, especialidad } = req.body;

  if (!nombre || !apellido || !identificacion || !email || !especialidad) {
    return res
      .status(400)
      .json({ error: "Faltan datos para editar el profesor" });
  }

  const query =
    "UPDATE profesores SET nombre = ? , apellido = ?, identificacion = ?, email = ?, especialidad = ? WHERE id = ?";
  db.query(
    query,
    [nombre, apellido, identificacion, email, especialidad, id],
    (err, results) => {
      if (err) {
        console.error("Error al editar profesor:", err);
        return res.status(500).json({ error: "Error al editar el profesor" });
      }
      res.status(201).json({
        id: id,
        nombre,
        apellido,
        identificacion,
        email,
        especialidad,
      });
    }
  );
});
module.exports = router;