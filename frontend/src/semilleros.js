import React, { useEffect, useState } from 'react';
import './semilleros.css';

function Semilleros() {
  const [semilleros, setSemilleros] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchSemilleros = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/semilleros');
        if (!response.ok) {
          throw new Error('Failed to fetch semilleros');
        }
        const data = await response.json();
        setSemilleros(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch semilleros:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchSemilleros();
  }, []);

  if (loading) return <p>Cargando semilleros...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="semilleros-container">
      <div className="semilleros-actions">
        <button onClick={() => alert('Agregar Semillero')}>Agregar Semillero</button>
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
              className={semillero.id === selectedId ? 'selected' : ''}
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
              <td className="objetivos-cell">{semillero.objetivos_especificos}</td>
              <td>
                {semillero.grupo_nombre ? (
                  <span className="grupo-info">
                    <strong>{semillero.grupo_codigo}</strong><br/>
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
    </div>
  );
}

export default Semilleros;
