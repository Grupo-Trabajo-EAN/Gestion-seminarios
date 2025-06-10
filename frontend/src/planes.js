import { useEffect, useState } from "react";
import "./planes.css";

const formatFecha = (fechaISO) => {
  if (!fechaISO) return "";
  const fecha = new Date(fechaISO);
  return fecha.toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

function Planes({ changeView, rol, username }) {
  const [groupedPlans, setGroupedPlans] = useState({});
  const [studentName, setStudentName] = useState("");
  const [planes, setPlanes] = useState([]);
  const [semillerosMap, setSemillerosMap] = useState({});
  const [actividadesMap, setActividadesMap] = useState({});
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nuevaActividad, setNuevaActividad] = useState({
    nombre: "",
    plan: "",
  });
  const cardStyle = {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "16px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [aprobadores, setAprobadores] = useState([]);

  useEffect(() => {
    if (rol === "admin") {
      fetchPlanes();
      fetchSemilleros();
    } else {
      if (!username) {
        setLoading(false);
        setError("No se ha proporcionado un nombre de usuario.");
        return;
      }
      fetchStudentData();
    }
  }, []);
  const fetchStudentData = async () => {
    try {
      setLoading(true);
      // Usamos la URL completa que definimos
      const response = await fetch(
        `http://localhost:4000/api/estudiantes/informe/${username}`
      );
      if (!response.ok) {
        throw new Error("Error al obtener los datos del estudiante");
      }
      const data = await response.json();

      if (data.length > 0) {
        setStudentName(data[0].nombre_estudiante);
      }

      // Agrupar los resultados por plan_id
      const plans = data.reduce((acc, item) => {
        if (item.plan_id) {
          if (!acc[item.plan_id]) {
            acc[item.plan_id] = {
              plan_id: item.plan_id,
              nombre_plan: item.nombre_plan,
              semillero: item.semillero,
              actividades: [],
            };
          }
          if (item.actividad) {
            acc[item.plan_id].actividades.push(item.actividad);
          }
        }
        return acc;
      }, {});

      setGroupedPlans(plans);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSemilleros = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/semilleros");
      if (!response.ok) {
        throw new Error("Error al obtener semilleros");
      }
      const data = await response.json();
      const map = {};
      data.forEach((semillero) => {
        map[semillero.id] = semillero.nombre;
      });
      setSemillerosMap(map);
    } catch (error) {
      console.error("Error cargando semilleros:", error);
    }
  };

  const fetchActividades = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/actividades");
      if (!response.ok) {
        throw new Error("Error al obtener actividades");
      }
      const data = await response.json();
      const map = {};
      data.forEach((actividad) => {
        if (!map[actividad.plan]) {
          map[actividad.plan] = [];
        }
        map[actividad.plan].push(actividad.nombre);
      });
      setActividadesMap(map);
    } catch (error) {
      console.error("Error cargando actividades:", error);
    }
  };

  const fetchPlanes = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/planactividades");
      if (!response.ok) {
        throw new Error("Failed to fetch planes");
      }
      const data = await response.json();
      setPlanes(data);
      setLoading(false);
      fetchActividades();
    } catch (error) {
      console.error("Failed to fetch planes:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    setNuevaActividad({ ...nuevaActividad, plan: selectedId });
  }, [selectedId]);

  if (loading) return <p>Cargando planes...</p>;
  if (error)
    return (
      <main className="student-content">
        <div className="greeting-card">
          <h2>Error</h2>
          <p>Error de conexión</p>
        </div>
      </main>
    );

  const openModal = () => {
    if (selectedId) {
      // Reset plan name for new entry and ensure plan ID is current
      setNuevaActividad({ nombre: "", plan: selectedId });
      setIsModalOpen(true);
    } else {
      alert("Por favor, seleccione un plan de la tabla primero.");
    }
  };

  const openConfirm = async () => {
    if (!selectedId) {
      alert("Por favor, seleccione un plan de la tabla primero.");
      return;
    }
    const planSeleccionado = planes.find((p) => p.ID === selectedId);
    if (planSeleccionado && planSeleccionado.estado_aprobacion === "aprobado") {
      alert("Este plan ya ha sido aprobado.");
      return;
    }
    // La lógica aquí también se beneficia del .split()
    setAprobadores(
      planSeleccionado.aprobadores
        ? planSeleccionado.aprobadores.split("; ")
        : ["No hay profesores asignados"]
    );
    setIsConfirmOpen(true);
  };

  const closeConfirm = () => setIsConfirmOpen(false);

  const handleConfirmarPlanSubmit = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/planactividades/${selectedId}/aprobar`,
        {
          method: "POST",
        }
      );
      if (!response.ok) throw new Error("Fallo al aprobar el plan.");
      alert("Plan aprobado exitosamente.");
      closeConfirm();
      fetchPlanes();
    } catch (err) {
      alert(`Error: ${err.message}`);
      console.error(err);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handlePlanNombreChange = (event) => {
    setNuevaActividad({ ...nuevaActividad, nombre: event.target.value });
  };

  // This function will be called when the "Crear" button in the modal is clicked
  const handleCrearPlanSubmit = async () => {
    if (!nuevaActividad.nombre.trim()) {
      alert("El nombre del plan de actividades no puede estar vacío.");
      return;
    }
    if (!nuevaActividad.plan) {
      alert("Error: ID del plan no está asignado. Seleccione un plan.");
      return;
    }

    console.log("Enviando nuevo plan:", nuevaActividad);

    try {
      const response = await fetch("http://localhost:4000/api/actividades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevaActividad),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Error desconocido al crear el plan." }));
        throw new Error(
          errorData.message || `Error ${response.status} al crear la actividad`
        );
      }

      const result = await response.json(); // Or handle as needed
      console.log("Actividad creada:", result);

      setNuevaActividad({ nombre: "", plan: selectedId });

      alert("Actividad creada exitosamente!");
      closeModal(); // Close modal on success
      fetchPlanes();
    } catch (err) {
      console.error("Failed to create plan de actividades:", err);
      alert(`Error al crear la actividad: ${err.message}`);
    }
  };
  const infoCreate = () => {
    alert("Para poder crear un plan debes seleccionar un semillero!");
    alert(
      "Serás redireccionado a semilleros para seleccionar el semillero correspondiente y agregar allí el plan directamente"
    );
    changeView("semilleros");
  };
  const plansArray = Object.values(groupedPlans);
  return (
    <>
      {rol === "admin" ? (
        <div className="planes-container">
          <div className="planes-actions">
            <button onClick={() => infoCreate()}>Agregar Plan</button>
            <button
              disabled={!selectedId}
              onClick={() => alert(`Editar plan ${selectedId}`)}
            >
              Editar Seleccionado
            </button>
            <button
              disabled={!selectedId}
              onClick={() => alert(`Eliminar plan ${selectedId}`)}
            >
              Eliminar Seleccionado
            </button>
            <button
              disabled={!selectedId}
              onClick={openModal} // Changed to open the modal
            >
              Agregar Actividad
            </button>

            <button
              disabled={!selectedId}
              onClick={openConfirm} // Changed to open the modal
            >
              Aprobar
            </button>
          </div>

          <table className="planes-table">
            <thead>
              <tr>
                <th></th>
                <th>ID</th>
                <th>Nombre</th>
                <th>Semillero</th>
                <th>Actividades</th>
                <th>Aprobado por</th>
                <th>Fecha de Aprobación</th>
                <th>Informe</th>
              </tr>
            </thead>
            <tbody>
              {planes.map((plan) => (
                <tr
                  key={plan.ID}
                  className={plan.ID === selectedId ? "selected" : ""}
                  onClick={() => setSelectedId(plan.ID)}
                >
                  <td>
                    <input
                      type="radio"
                      name="selectedplan"
                      checked={plan.ID === selectedId}
                      onChange={() => setSelectedId(plan.ID)}
                    />
                  </td>
                  <td>{plan.ID}</td>
                  <td>{plan.Nombre}</td>
                  <td>{semillerosMap[plan.Semillero] || "Cargando..."}</td>
                  <td>
                    {actividadesMap[plan.ID] &&
                    actividadesMap[plan.ID].length > 0 ? (
                      <ul className="actividad-info">
                        {actividadesMap[plan.ID].map(
                          (nombreActividad, index) => (
                            <li key={index}>{nombreActividad}</li>
                          )
                        )}
                      </ul>
                    ) : (
                      <span className="no-actividad">
                        Sin actividades asignadas
                      </span>
                    )}
                  </td>
                  <td>
                    {plan.estado_aprobacion === "aprobado" ? (
                      <ul className="estado-aprobado">
                        {plan.aprobadores ? (
                          plan.aprobadores
                            .split("; ")
                            .map((encargado, index) => (
                              <li key={index}>{encargado}</li>
                            ))
                        ) : (
                          <li>Equipo del Semillero</li>
                        )}
                      </ul>
                    ) : (
                      <span className="estado-pendiente">
                        Plan aún no aprobado
                      </span>
                    )}
                  </td>
                  <td>
                    {plan.estado_aprobacion === "aprobado" ? (
                      formatFecha(plan.fecha_aprobacion)
                    ) : (
                      <span className="estado-pendiente">
                        Plan aún no aprobado
                      </span>
                    )}
                  </td>
                  <td className="objetivos-cell">
                    {plan.Informe ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <span>{plan.Informe}</span>
                        <a
                          href={`http://localhost:4000/api/estudiantes/informe/download/${plan.Informe}`}
                          download
                          title="Descargar"
                          style={{ color: "#007bff", cursor: "pointer" }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="currentColor"
                            className="bi bi-download"
                            viewBox="0 0 16 16"
                          >
                            <path d="M.5 9.9a.5.5 0 0 1 .5.5V13a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.6a.5.5 0 0 1 1 0V13a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.6a.5.5 0 0 1 .5-.5z" />
                            <path d="M5.354 8.354a.5.5 0 0 1 .707 0L8 10.293V1.5a.5.5 0 0 1 1 0v8.793l1.939-1.939a.5.5 0 1 1 .707.707l-2.646 2.647a.5.5 0 0 1-.708 0L5.354 9.061a.5.5 0 0 1 0-.707z" />
                          </svg>
                        </a>
                      </div>
                    ) : (
                      <span className="no-informe">Sin informe subido</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {isModalOpen && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h2>Agregar Nueva actividad</h2>
                <p>
                  Para el plan:{" "}
                  {planes.find((s) => s.ID === selectedId)?.Nombre ||
                    "Desconocido"}
                </p>
                <div>
                  <label htmlFor="planNombre">Nombre de la actividad:</label>
                  <input
                    type="text"
                    id="actividadNombre"
                    value={nuevaActividad.nombre}
                    onChange={handlePlanNombreChange}
                    placeholder="Ingrese el nombre del plan"
                  />
                </div>
                <div className="modal-actions">
                  <button onClick={handleCrearPlanSubmit}>Crear</button>
                  <button onClick={closeModal}>Cancelar</button>
                </div>
              </div>
            </div>
          )}
          {isConfirmOpen && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h2>Confirmar Aprobación</h2>
                <p>
                  Estás a punto de aprobar el plan:{" "}
                  <strong>
                    {planes.find((p) => p.ID === selectedId)?.Nombre}
                  </strong>
                </p>
                <h4>Será aprobado en nombre de:</h4>
                <ul>
                  {aprobadores.map((nombre, index) => (
                    <li key={index}>{nombre}</li>
                  ))}
                </ul>
                <div className="modal-actions">
                  <button onClick={handleConfirmarPlanSubmit}>Confirmar</button>
                  <button onClick={closeConfirm}>Cancelar</button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="student-plans-container">
          <h2>Planes de Actividades de: {studentName}</h2>
          {plansArray.length > 0 ? (
            plansArray.map((plan) => (
              <div key={plan.plan_id} style={cardStyle}>
                <h3>{plan.nombre_plan}</h3>
                <p>
                  <strong>Semillero:</strong> {plan.semillero}
                </p>
                <h4>Actividades:</h4>
                {plan.actividades.length > 0 ? (
                  <ul>
                    {plan.actividades.map((actividad, index) => (
                      <li key={index}>{actividad}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No hay actividades registradas para este plan.</p>
                )}
              </div>
            ))
          ) : (
            <p>No tienes planes de actividades asignados.</p>
          )}{" "}
        </div>
      )}
    </>
  );
}

export default Planes;
