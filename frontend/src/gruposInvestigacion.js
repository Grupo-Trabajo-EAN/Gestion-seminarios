import { useEffect, useState } from "react";
import "./gruposInvestigacion.css";

function GruposInvestigacion() {
  const [grupos, setGrupos] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModalEstudiantes, setShowModalEstudiantes] = useState(false);
  const [estudiantesSinGrupo, setEstudiantesSinGrupo] = useState([]);
  const [estudiantesSeleccionados, setEstudiantesSeleccionados] = useState([]);

  useEffect(() => {
    const fetchGrupos = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/api/grupos-investigacion"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch grupos de investigación");
        }
        const data = await response.json();
        setGrupos(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch grupos de investigación:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchGrupos();
  }, []);

  if (loading) return <p>Cargando grupos de investigación...</p>;
  if (error)
    return (
      <main className="student-content">
        <div className="greeting-card">
          <h2>Error</h2>
          <p>Error de conexión</p>
        </div>
      </main>
    );
  else if (!grupos.length)
    return (
      <main className="student-content">
        <div className="greeting-card">
          <h2>Atención</h2>
          <p>No hay grupos registrados</p>
          <button onClick={() => alert("Agregar Grupo de Investigación")}>
            Agregar Grupo
          </button>
        </div>
      </main>
    );
  const asignarEstudiantesAGrupo = async () => {
    if (!selectedId || estudiantesSeleccionados.length === 0) return;

    try {
      const response = await fetch(
        "http://localhost:4000/api/grupos-investigacion/asignar-estudiantes",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            grupoId: selectedId,
            estudiantesIds: estudiantesSeleccionados,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert("Estudiantes asignados correctamente");
        setShowModalEstudiantes(false);
        setEstudiantesSeleccionados([]);
        // Recargar tabla si lo deseas
      } else {
        alert(result.error || "Error asignando estudiantes");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error del servidor");
    }
  };

  const openModalEstudiante = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/estudiantes");
      const data = await response.json();
      const sinGrupo = data.filter((est) => !est.grupo_investigacion);
      setEstudiantesSinGrupo(sinGrupo);
      setShowModalEstudiantes(true);
    } catch (err) {
      console.error("Error al obtener estudiantes:", err);
    }
  };
  const toggleSeleccionEstudiante = (id) => {
    setEstudiantesSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  return (
    <div className="grupos-container">
      <div className="grupos-actions">
        <button onClick={() => alert("Agregar Grupo de Investigación")}>
          Agregar Grupo
        </button>
        <button disabled={!selectedId} onClick={() => openModalEstudiante()}>
          Asignar estudiante
        </button>
        <button
          disabled={!selectedId}
          onClick={() => alert(`Editar grupo ${selectedId}`)}
        >
          Editar Seleccionado
        </button>
        <button
          disabled={!selectedId}
          onClick={() => alert(`Eliminar grupo ${selectedId}`)}
        >
          Eliminar Seleccionado
        </button>
      </div>

      <table className="grupos-table">
        <thead>
          <tr>
            <th></th>
            <th>ID</th>
            <th>Campo de Investigación</th>
            <th>Categoría</th>
            <th>Código</th>
            <th>Líder</th>
            <th>Líneas de Investigación</th>
          </tr>
        </thead>
        <tbody>
          {grupos.map((grupo) => (
            <tr
              key={grupo.id}
              className={grupo.id === selectedId ? "selected" : ""}
              onClick={() => setSelectedId(grupo.id)}
            >
              <td>
                <input
                  type="radio"
                  name="selectedGrupo"
                  checked={grupo.id === selectedId}
                  onChange={() => setSelectedId(grupo.id)}
                />
              </td>
              <td>{grupo.id}</td>
              <td>{grupo.campo_investigacion}</td>
              <td>{grupo.categoria}</td>
              <td>{grupo.codigo}</td>
              <td>{grupo.lider}</td>
              <td className="lineas-cell">{grupo.lineas_investigacion}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {showModalEstudiantes && (
        <div className="modal">
          <div className="modal-content">
            <h3>Selecciona estudiantes sin grupo</h3>
            <div className="modal-table-wrapper">
              <table className="modal-table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Email</th>
                    <th>Carrera</th>
                    <th>Semestre</th>
                  </tr>
                </thead>
                <tbody>
                  {estudiantesSinGrupo.map((est) => (
                    <tr key={est.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={estudiantesSeleccionados.includes(est.id)}
                          onChange={() => toggleSeleccionEstudiante(est.id)}
                        />
                      </td>
                      <td>{est.nombre}</td>
                      <td>{est.apellido}</td>
                      <td>{est.email}</td>
                      <td>{est.carrera}</td>
                      <td>{est.semestre}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="modal-buttons">
              <button onClick={asignarEstudiantesAGrupo}>
                Asignar al grupo
              </button>
              <button
                className="btn-cancel"
                onClick={() => setShowModalEstudiantes(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GruposInvestigacion;
