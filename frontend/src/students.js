import { useEffect, useState } from 'react';
import './students.css';

function Students() {
  const [students, setStudents] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('http://localhost:4000/estudiantes');
        const data = await response.json();
        setStudents(data);
        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch students:', error);
        setLoading(false)
      }
    };

    fetchStudents();
  }, []);

  if (loading) return <p>Cargando estudiantes...</p>;
  if (students.error || !students.length) return       <main className="student-content">
        <div className="greeting-card">
          <h2>Error</h2>
          <p>
            Error de conexión
          </p>
        </div>
      </main>;
  return (
    <div className="students-container">
      <div className="students-actions">
        <button onClick={() => alert('Add student')}>Agregar Estudiante</button>
        <button
          disabled={!selectedId}
          onClick={() => alert(`Editar estudiante ${selectedId}`)}
        >
          Edit Selected
        </button>
        <button
          disabled={!selectedId}
          onClick={() => alert(`Eliminar estudiante ${selectedId}`)}
        >
          Delete Selected
        </button>
      </div>

      <table className="students-table">
      <thead>
        <tr>
            <th></th>
            <th>ID</th>
            <th>Nombre</th>
            <th>Username</th>
        </tr>
        </thead>
        <tbody>
            {(!students.error || students.length) ? students.map((s) => (
                <tr
                key={s.cliente_id}
                className={s.cliente_id === selectedId ? 'selected' : ''}
                onClick={() => setSelectedId(s.cliente_id)}
                >
                <td>
                    <input
                    type="radio"
                    name="selectedStudent"
                    checked={s.cliente_id === selectedId}
                    onChange={() => setSelectedId(s.cliente_id)}
                    />
                </td>
                <td>{s.cliente_id}</td>
                <td>{s.nombre}</td>
                <td>{s.username}</td>
                </tr>
            )): <h1>No hay informacion disponible</h1>}
            </tbody>
      </table>
    </div>
  );
}

export default Students;
