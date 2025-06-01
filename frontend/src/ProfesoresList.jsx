import React, { useEffect, useState } from 'react';

function ProfesoresList() {
  const [profesores, setProfesores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  const [nuevoProfesor, setNuevoProfesor] = useState({
    nombre: '',
    apellido: '',
    identificacion: '',
    email: '',
    especialidad: '',
  });

  useEffect(() => {
    cargarProfesores();
  }, []);

  const cargarProfesores = () => {
    fetch('http://localhost:4000/api/profesores')
      .then((res) => res.json())
      .then((data) => {
        setProfesores(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoProfesor((prev) => ({ ...prev, [name]: value }));
  };

  const handleAgregar = () => {
    fetch('http://localhost:4000/api/profesores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoProfesor),
    })
      .then((res) => res.json())
      .then(() => {
        setNuevoProfesor({ nombre: '', apellido: '', identificacion:'', email: '', especialidad: '' });
        cargarProfesores();
      });
  };

  if (loading) return <p>Cargando profesores...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Lista de Profesores</h2>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Identificacion</th>
            <th>Email</th>
            <th>Especialidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {profesores.map((profesor) => (
            <tr key={profesor.id}>
              <td>{profesor.id}</td>
              <td>{profesor.nombre}</td>
              <td>{profesor.apellido}</td>
              <td>{profesor.identificacion}</td>
              <td>{profesor.email}</td>
              <td>{profesor.especialidad}</td>
              <td>
                <button>Editar</button>
                <button>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Agregar nuevo profesor</h3>
      <input
        type="text"
        name="nombre"
        placeholder="Nombre"
        value={nuevoProfesor.nombre}
        onChange={handleChange}
      />
      <input
        type="text"
        name="apellido"
        placeholder="Apellido"
        value={nuevoProfesor.apellido}
        onChange={handleChange}
      />
      <input
        type="number"
        name="identificacion"
        placeholder="Identificacion"
        value={nuevoProfesor.identificacion}
        onChange={handleChange}
      />
      <input
        type="email"
        name="email"
        placeholder="Correo"
        value={nuevoProfesor.email}
        onChange={handleChange}
      />
      <input
        type="text"
        name="especialidad"
        placeholder="Especialidad"
        value={nuevoProfesor.especialidad}
        onChange={handleChange}
      />
      <button onClick={handleAgregar}>Agregar</button>
    </div>
  );
}

export default ProfesoresList;
