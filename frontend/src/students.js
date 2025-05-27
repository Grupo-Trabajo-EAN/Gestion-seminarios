import React, { useEffect, useState } from 'react';
import './students.css';

function Students() {
  const [students, setStudents] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('http://localhost:4000/estudiantes');
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error('Failed to fetch students:', error);
      }
    };

    fetchStudents();
  }, []);

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
            {students.map((s) => (
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
            ))}
            </tbody>
      </table>
    </div>
  );
}

export default Students;
