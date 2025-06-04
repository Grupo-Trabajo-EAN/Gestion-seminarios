import { useEffect, useState } from "react";
import "./planes.css";

function Planes({ changeView }) {
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
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchPlanes();
    fetchSemilleros();
  }, []);

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
  else if (!planes.length)
    return (
      <main className="student-content">
        <div className="greeting-card">
          <h2>Atención</h2>
          <p>No hay planes registrados</p>
          <button onClick={() => changeView("semilleros")}>Agregar Plan</button>
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

  return (
    <div className="planes-container">
      <div className="planes-actions">
        <button onClick={() => changeView("semilleros")}>Agregar Plan</button>
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
      </div>

      <table className="planes-table">
        <thead>
          <tr>
            <th></th>
            <th>ID</th>
            <th>Nombre</th>
            <th>Semillero</th>
            <th>Actividades</th>
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
                    {actividadesMap[plan.ID].map((nombreActividad, index) => (
                      <li key={index}>{nombreActividad}</li>
                    ))}
                  </ul>
                ) : (
                  <span className="no-actividad">
                    Sin actividades asignadas
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
              {planes.find((s) => s.ID === selectedId)?.Nombre || "Desconocido"}
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
    </div>
  );
}

export default Planes;
