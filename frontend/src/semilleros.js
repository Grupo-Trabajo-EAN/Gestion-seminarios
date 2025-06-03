import { useEffect, useState } from "react";
import "./semilleros.css";

function Semilleros() {
  const [semilleros, setSemilleros] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nuevoPlan, setNuevoPlan] = useState({
    nombre: "",
    semillero: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchSemilleros();
  }, []);

  const fetchSemilleros = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/semilleros");
      if (!response.ok) {
        throw new Error("Failed to fetch semilleros");
      }
      const data = await response.json();
      setSemilleros(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch semilleros:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    setNuevoPlan({ ...nuevoPlan, semillero: selectedId });
  }, [selectedId]);

  if (loading) return <p>Cargando semilleros...</p>;
  if (error)
    return (
      <main className="student-content">
        <div className="greeting-card">
          <h2>Error</h2>
          <p>Error de conexión</p>
        </div>
      </main>
    );
  else if (!semilleros.length)
    return (
      <main className="student-content">
        <div className="greeting-card">
          <h2>Atención</h2>
          <p>No hay semilleros registrados</p>
          <button onClick={() => alert("Agregar Semillero")}>
            Agregar Semillero
          </button>
        </div>
      </main>
    );

  const openModal = () => {
    if (selectedId) {
      setNuevoPlan({ nombre: "", semillero: selectedId });
      setIsModalOpen(true);
    } else {
      alert("Por favor, seleccione un semillero de la tabla primero.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handlePlanNombreChange = (event) => {
    setNuevoPlan({ ...nuevoPlan, nombre: event.target.value });
  };

  const handleCrearPlanSubmit = async () => {
    if (!nuevoPlan.nombre.trim()) {
      alert("El nombre del plan de actividades no puede estar vacío.");
      return;
    }
    if (!nuevoPlan.semillero) {
      alert(
        "Error: ID del semillero no está asignado. Seleccione un semillero."
      );
      return;
    }

    console.log("Enviando nuevo plan:", nuevoPlan);

    try {
      const response = await fetch(
        "http://localhost:4000/api/planactividades",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nuevoPlan),
        }
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Error desconocido al crear el plan." }));
        throw new Error(
          errorData.message ||
            `Error ${response.status} al crear el plan de actividades`
        );
      }

      const result = await response.json(); // Or handle as needed
      console.log("Plan de actividades creado:", result);

      setNuevoPlan({ nombre: "", semillero: selectedId });
      alert("Plan de actividades creado exitosamente!");
      closeModal();
    } catch (err) {
      console.error("Failed to create plan de actividades:", err);
      alert(`Error al crear el plan: ${err.message}`);
    }
  };

  return (
    <div className="semilleros-container">
      <div className="semilleros-actions">
        <button onClick={() => alert("Agregar Semillero")}>
          Agregar Semillero
        </button>
        <button
          disabled={!selectedId}
          onClick={() => alert(`Editar semillero ${selectedId}`)}
        >
          Editar Seleccionado
        </button>
        <button
          disabled={!selectedId}
          onClick={() => alert(`Eliminar semillero ${selectedId}`)}
        >
          Eliminar Seleccionado
        </button>
        <button
          disabled={!selectedId}
          onClick={openModal} // Changed to open the modal
        >
          Agregar Plan Actividades
        </button>
      </div>

      <table className="semilleros-table">
        <thead>
          <tr>
            <th></th>
            <th>ID</th>
            <th>Nombre</th>
            <th>Objetivo Principal</th>
            <th>Objetivos Específicos</th>
            <th>Grupo de Investigación</th>
          </tr>
        </thead>
        <tbody>
          {semilleros.map((semillero) => (
            <tr
              key={semillero.id}
              className={semillero.id === selectedId ? "selected" : ""}
              onClick={() => setSelectedId(semillero.id)}
            >
              <td>
                <input
                  type="radio"
                  name="selectedSemillero"
                  checked={semillero.id === selectedId}
                  onChange={() => setSelectedId(semillero.id)}
                />
              </td>
              <td>{semillero.id}</td>
              <td>{semillero.nombre}</td>
              <td className="objetivo-cell">{semillero.objetivo_principal}</td>
              <td className="objetivos-cell">
                {semillero.objetivos_especificos}
              </td>
              <td>
                {semillero.grupo_nombre ? (
                  <span className="grupo-info">
                    <strong>{semillero.grupo_codigo}</strong>
                    <br />
                    {semillero.grupo_nombre}
                  </span>
                ) : (
                  <span className="no-grupo">Sin grupo asignado</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Agregar Nuevo Plan de Actividades</h2>
            <p>
              Para el semillero:{" "}
              {semilleros.find((s) => s.id === selectedId)?.nombre ||
                "Desconocido"}
            </p>
            <div>
              <label htmlFor="planNombre">Nombre del Plan:</label>
              <input
                type="text"
                id="planNombre"
                value={nuevoPlan.nombre}
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

export default Semilleros;
