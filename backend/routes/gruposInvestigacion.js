const express = require("express");
const router = express.Router();
const db = require("../db");

// GET /grupos-investigacion
router.get("/", (req, res) => {
  db.query("SELECT * FROM grupos_investigacion", (err, results) => {
    if (err) {
      console.error("Error fetching grupos de investigación:", err);
      return res
        .status(500)
        .json({ error: "Fallo al recuperar los grupos de investigación" });
    }
    res.json(results);
  });
});

// POST /grupos-investigacion
router.post("/", (req, res) => {
  const {
    campo_investigacion,
    categoria,
    codigo,
    lider,
    lineas_investigacion,
  } = req.body;

  if (
    !campo_investigacion ||
    !categoria ||
    !codigo ||
    !lider ||
    !lineas_investigacion
  ) {
    return res.status(400).json({ error: "Todos los campos son requeridos" });
  }

  const query =
    "INSERT INTO grupos_investigacion (campo_investigacion, categoria, codigo, lider, lineas_investigacion) VALUES (?, ?, ?, ?, ?)";

  db.query(
    query,
    [campo_investigacion, categoria, codigo, lider, lineas_investigacion],
    (err, result) => {
      if (err) {
        console.error("Error creating grupo de investigación:", err);
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(409).json({ error: "El código ya existe" });
        }
        return res
          .status(500)
          .json({ error: "Fallo al crear el grupo de investigación" });
      }
      res.status(201).json({
        id: result.insertId,
        campo_investigacion,
        categoria,
        codigo,
        lider,
        lineas_investigacion,
      });
    }
  );
});

// PUT /grupos-investigacion/:id
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const {
    campo_investigacion,
    categoria,
    codigo,
    lider,
    lineas_investigacion,
  } = req.body;

  if (
    !campo_investigacion ||
    !categoria ||
    !codigo ||
    !lider ||
    !lineas_investigacion
  ) {
    return res.status(400).json({ error: "Todos los campos son requeridos" });
  }

  const query =
    "UPDATE grupos_investigacion SET campo_investigacion = ?, categoria = ?, codigo = ?, lider = ?, lineas_investigacion = ? WHERE id = ?";

  db.query(
    query,
    [campo_investigacion, categoria, codigo, lider, lineas_investigacion, id],
    (err, result) => {
      if (err) {
        console.error("Error updating grupo de investigación:", err);
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(409).json({ error: "El código ya existe" });
        }
        return res
          .status(500)
          .json({ error: "Fallo al actualizar el grupo de investigación" });
      }

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ error: "Grupo de investigación no encontrado" });
      }

      res.json({
        id: parseInt(id),
        campo_investigacion,
        categoria,
        codigo,
        lider,
        lineas_investigacion,
      });
    }
  );
});

// DELETE /grupos-investigacion/:id
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM grupos_investigacion WHERE id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting grupo de investigación:", err);
      return res
        .status(500)
        .json({ error: "Fallo al eliminar el grupo de investigación" });
    }

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Grupo de investigación no encontrado" });
    }

    res.json({ message: "Grupo de investigación eliminado exitosamente" });
  });
});

// POST /api/asignar-estudiantes
router.post("/asignar-estudiantes", (req, res) => {
  const { grupoId, estudiantesIds } = req.body;

  if (
    !grupoId ||
    !Array.isArray(estudiantesIds) ||
    estudiantesIds.length === 0
  ) {
    return res.status(400).json({ error: "Datos inválidos" });
  }

  const query = "UPDATE estudiantes SET grupo_investigacion = ? WHERE id = ?";

  const updates = estudiantesIds.map((id) => {
    return new Promise((resolve, reject) => {
      db.query(query, [grupoId, id], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  });

  Promise.all(updates)
    .then(() =>
      res.json({
        success: true,
        message: "Estudiantes asignados correctamente",
      })
    )
    .catch((err) => {
      console.error("Error asignando estudiantes:", err);
      res.status(500).json({ error: "Error al asignar estudiantes" });
    });
});

module.exports = router;
