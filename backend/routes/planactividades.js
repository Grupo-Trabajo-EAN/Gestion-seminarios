const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", (req, res) => {
  // Esta consulta une los planes con sus posibles aprobadores (profesores del semillero)
  const query = `
SELECT pa.ID, pa.Nombre, pa.Informe, pa.Semillero, pa.estado_aprobacion, pa.fecha_aprobacion, 
( SELECT GROUP_CONCAT(CONCAT(p.nombre, ' ', p.apellido, ' (', sp.rol, ')') SEPARATOR '; ')
 FROM semillero_profesores sp JOIN profesores p ON sp.profesor_id = p.id WHERE sp.semillero_id = pa.Semillero AND sp.estado = 'activo' )
  AS aprobadores FROM plan_actividades pa JOIN semilleros s ON s.id = pa.Semillero WHERE s.activo = 1 GROUP BY pa.ID ORDER BY pa.ID;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching plan_actividades:", err);
      return res
        .status(500)
        .json({ error: "Fallo al recuperar los plan_actividades" });
    }
    res.json(results);
  });
});

router.post("/", (req, res) => {
  const { nombre, semillero } = req.body;

  if (!nombre || !semillero) {
    return res
      .status(400)
      .json({ error: "Faltan datos para crear el plan de actividades" });
  }

  const query = `INSERT INTO plan_actividades (nombre, Semillero) VALUES (?, ${semillero})`;
  db.query(query, [nombre, semillero], (err, results) => {
    if (err) {
      console.error("Error al insertar plan actividades:", err);
      return res
        .status(500)
        .json({ error: "Error al agregar el plan actividades" });
    }
    res.status(201).json({
      nombre,
      semillero,
    });
  });
});
// Devuelve la lista de profesores (y directores) de un semillero asociado a un plan.
router.get("/:planId/aprobadores", (req, res) => {
  const { planId } = req.params;
  const query = `
        SELECT p.nombre, p.apellido, sp.rol
        FROM semillero_profesores sp
        JOIN profesores p ON sp.profesor_id = p.id
        WHERE sp.estado = 'activo' AND sp.semillero_id = (
            SELECT Semillero FROM plan_actividades WHERE ID = ?
        )
    `;
  db.query(query, [planId], (err, results) => {
    if (err)
      return res.status(500).json({ error: "Error al buscar aprobadores" });
    res.json(results);
  });
});

// POST /api/planes/:planId/aprobar
// Cambia el estado del plan a "aprobado".
router.post("/:planId/aprobar", (req, res) => {
  const { planId } = req.params;
  const query = `
        UPDATE plan_actividades 
        SET estado_aprobacion = 'aprobado', fecha_aprobacion = NOW() 
        WHERE ID = ?
    `;
  db.query(query, [planId], (err, result) => {
    if (err) return res.status(500).json({ error: "Error al aprobar el plan" });
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Plan no encontrado" });
    res.json({ message: "Plan aprobado exitosamente" });
  });
});

module.exports = router;
