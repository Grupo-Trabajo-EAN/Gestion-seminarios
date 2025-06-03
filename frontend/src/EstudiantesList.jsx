import React, { useEffect, useState } from 'react';

function EstudiantesList() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [nuevoEstudiante, setNuevoEstudiante] = useState({
    nombre: '',
    apellido: '',
    identificacion: '',
    email: '',
    carrera: '',
    semestre: '',
  });

  useEffect(() => {
    cargarEstudiantes();
  }, []);

  const cargarEstudiantes = () => {
    fetch('http://localhost:4000/api/estudiantes')
      .then((res) => res.json())
      .then((data) => {
        setEstudiantes(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoEstudiante((prev) => ({ ...prev, [name]: value }));
  };

  const handleAgregar = () => {
    fetch('http://localhost:4000/api/estudiantes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoEstudiante),
    })
      .then((res) => res.json())
      .then(() => {
        setNuevoEstudiante({ nombre: '', apellido: '', identificacion: '', email: '', carrera: '', semestre: '' });
        cargarEstudiantes();
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  if (loading) return <p>Cargando estudiantes...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Lista de Estudiantes</h2>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Identificación</th>
            <th>Email</th>
            <th>Carrera</th>
            <th>Semestre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {estudiantes.map((estudiante) => (
            <tr key={estudiante.id}>
              <td>{estudiante.id}</td>
              <td>{estudiante.nombre}</td>
              <td>{estudiante.apellido}</td>
              <td>{estudiante.identificacion}</td>
              <td>{estudiante.email}</td>
              <td>{estudiante.carrera}</td>
              <td>{estudiante.semestre}</td>
              <td>
                <button>Editar</button>
                <button>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Agregar nuevo estudiante</h3>
      <input
        type="text"
        name="nombre"
        placeholder="Nombre"
        value={nuevoEstudiante.nombre}
        onChange={handleChange}
      />
      <input
        type="text"
        name="apellido"
        placeholder="Apellido"
        value={nuevoEstudiante.apellido}
        onChange={handleChange}
      />
      <input
        type="number"
        name="identificacion"
        placeholder="Identificación"
        value={nuevoEstudiante.identificacion}
        onChange={handleChange}
      />
      <input
        type="email"
        name="email"
        placeholder="Correo"
        value={nuevoEstudiante.email}
        onChange={handleChange}
      />
      <input
        type="text"
        name="carrera"
        placeholder="Carrera"
        value={nuevoEstudiante.carrera}
        onChange={handleChange}
      />
      <input
        type="number"
        name="semestre"
        placeholder="Semestre"
        value={nuevoEstudiante.semestre}
        onChange={handleChange}
      />
      <button onClick={handleAgregar}>Agregar</button>
    </div>
  );
}

export default EstudiantesList;
