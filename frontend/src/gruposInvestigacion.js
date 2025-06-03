import { useEffect, useState } from "react";
import "./gruposInvestigacion.css";

function GruposInvestigacion() {
  const [grupos, setGrupos] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div className="grupos-container">
      <div className="grupos-actions">
        <button onClick={() => alert("Agregar Grupo de Investigación")}>
          Agregar Grupo
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
    </div>
  );
}

export default GruposInvestigacion;
