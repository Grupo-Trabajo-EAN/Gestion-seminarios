const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
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
      res.status(201).json({
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

// GET datos académicos del estudiante por username
router.get("/informe/:username", (req, res) => {
  const { username } = req.params;

  const query = `
    SELECT 
      e.nombre AS nombre_estudiante,
      gi.campo_investigacion,
      s.nombre AS semillero,
      p.ID AS plan_id,
      p.Nombre AS nombre_plan,
      a.nombre AS actividad,
      p.Informe
    FROM estudiantes e
    LEFT JOIN grupos_investigacion gi ON e.grupo_investigacion = gi.id
    LEFT JOIN semilleros s ON gi.id = s.grupo_investigacion_id
    LEFT JOIN plan_actividades p ON s.id = p.Semillero
    LEFT JOIN actividades a ON a.plan = p.ID
    WHERE e.username = ?`;

  db.query(query, [username], (err, results) => {
    if (err) {
      console.error("Error consultando datos del informe:", err);
      return res.status(500).json({ error: "Error en la consulta" });
    }
    res.json(results);
  });
});

// PUT para actualizar el informe
router.put("/informe/:planId", (req, res) => {
  const { planId } = req.params;
  const { fileName } = req.body;

  db.query(
    "UPDATE plan_actividades SET Informe = ? WHERE ID = ?",
    [fileName, planId],
    (err, result) => {
      if (err) {
        console.error("Error actualizando informe:", err);
        return res.status(500).json({ error: "Error al actualizar informe" });
      }
      res.json({ success: true });
    }
  );
});

const fs = require("fs");
const path = require("path");

// Crear carpeta /uploads si no existe
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `informe_${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

// Subida del informe
router.post("/informe/:planId", upload.single("informe"), (req, res) => {
  const { planId } = req.params;
  const filePath = req.file.filename;

  const query = "UPDATE plan_actividades SET Informe = ? WHERE ID = ?";
  db.query(query, [filePath, planId], (err, result) => {
    if (err)
      return res.status(500).json({ message: "Error al guardar archivo" });
    res.json({ success: true, file: filePath });
  });
});

// Servir archivos
router.get("/informe/download/:filename", (req, res) => {
  const { filename } = req.params;
  const file = path.join(__dirname, "../uploads", filename);
  res.download(file);
});

module.exports = router;
