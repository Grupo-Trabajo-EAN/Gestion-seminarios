
import { useEffect, useState } from "react";
import "./profesoreslist.css";

function ProfesoresList() {
  const [profesores, setProfesores] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const [nuevoProfesor, setNuevoProfesor] = useState({
    nombre: "",
    apellido: "",
    identificacion: "",
    email: "",
    especialidad: "",
  });

  useEffect(() => {
    cargarProfesores();
  }, []);

  const cargarProfesores = () => {
    fetch("http://localhost:4000/api/profesores")
      .then((res) => res.json())
      .then((data) => {
        const profesoresActivos = data.filter(
          (profesor) => profesor.Estado === "Activo"
        );
        setProfesores(profesoresActivos);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoProfesor((prev) => ({ ...prev, [name]: value }));
  };

  const handleAgregar = () => {
    fetch("http://localhost:4000/api/profesores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...nuevoProfesor, Estado: "Activo" }),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Profesor creado exitosamente!");
        closeModal();
        cargarProfesores();
      });
  };

  const handleEditar = (id) => {
    const profesor = profesores.find((p) => p.id === id);
    if (profesor) {
      setNuevoProfesor(profesor);
      setModoEdicion(true);
      setIsModalOpen(true);
    }
  };

  const handleGuardarCambios = () => {
    fetch(`http://localhost:4000/api/profesores/${nuevoProfesor.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoProfesor),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert(data?.error);
          return;
        }
        alert("Profesor actualizado exitosamente!");
        closeModal();
        cargarProfesores();
      });
  };

  const handleEliminar = (id) => {
    setSelectedId(id); // Asegura que esté definido
    setIsConfirmDeleteOpen(true);
  };

  const confirmarEliminar = () => {
    fetch(`http://localhost:4000/api/profesores/inhabilitar/${selectedId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Estado: "Inactivo" }),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Profesor desactivado correctamente");
        setSelectedId(null);
        setIsConfirmDeleteOpen(false);
        cargarProfesores();
      });
  };

  const cerrarConfirmacion = () => {
    setIsConfirmDeleteOpen(false);
  };
  const openModal = () => {
    setNuevoProfesor({
      nombre: "",
      apellido: "",
      identificacion: "",
      email: "",
      especialidad: "",
    });
    setModoEdicion(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModoEdicion(false);
    setNuevoProfesor({
      nombre: "",
      apellido: "",
      identificacion: "",
      email: "",
      especialidad: "",
    });
  };

  if (loading) return <p>Cargando profesores...</p>;
  if (profesores.error)
    return (
      <main className="profesor-content">
        <div className="greeting-card">
          <h2>Error</h2>
          <p>Error de conexión</p>
        </div>
      </main>
    );
  else if (!profesores.length)
    return (
      <main className="profesor-content">
        <div className="greeting-card">
          <h2>Atención</h2>
          <p>No hay profesores activos registrados</p>
          <button onClick={openModal}>Agregar profesor</button>
        </div>
      </main>
    );

  return (
    <div className="profesores-container">
      <div className="profesores-actions">
        <button onClick={openModal}>Agregar profesor</button>
        <button disabled={!selectedId} onClick={() => handleEditar(selectedId)}>
          Editar seleccionado
        </button>
        <button
          disabled={!selectedId}
          onClick={() => handleEliminar(selectedId)}
        >
          Eliminar seleccionado
        </button>
      </div>

      <table className="profesores-table">
        <thead>
          <tr>
            <th></th>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Identificación</th>
            <th>Email</th>
            <th>Especialidad</th>
          </tr>
        </thead>
        <tbody>
          {profesores.map((p) => (
            <tr
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              style={{
                backgroundColor: selectedId === p.id ? "#eef" : "transparent",
                cursor: "pointer",
              }}
            >
              <td>
                <input
                  type="radio"
                  name="id"
                  checked={p.id === selectedId}
                  onChange={() => setSelectedId(p.id)}
                />
              </td>
              <td>{p.id}</td>
              <td>{p.nombre}</td>
              <td>{p.apellido}</td>
              <td>{p.identificacion}</td>
              <td>{p.email}</td>
              <td>{p.especialidad}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>
              {modoEdicion ? "Editar profesor" : "Agregar nuevo profesor"}
            </h2>
            <label>Nombre:</label>
            <input
              type="text"
              name="nombre"
              value={nuevoProfesor.nombre}
              onChange={handleChange}
            />

            <label>Apellido:</label>
            <input
              type="text"
              name="apellido"
              value={nuevoProfesor.apellido}
              onChange={handleChange}
            />

            <label>Identificación:</label>
            <input
              type="number"
              name="identificacion"
              value={nuevoProfesor.identificacion}
              onChange={handleChange}
            />

            <label>Correo:</label>
            <input
              type="email"
              name="email"
              value={nuevoProfesor.email}
              onChange={handleChange}
            />

            <label>Especialidad:</label>
            <input
              type="text"
              name="especialidad"
              value={nuevoProfesor.especialidad}
              onChange={handleChange}
            />

            <div className="modal-actions">
              <button
                onClick={modoEdicion ? handleGuardarCambios : handleAgregar}
              >
                {modoEdicion ? "Guardar cambios" : "Crear"}
              </button>
              <button onClick={closeModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
      {isConfirmDeleteOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Confirmar Eliminación</h2>
            <p>
              ¿Estás seguro de que deseas desactivar al profesor seleccionado?
            </p>
            <div className="modal-actions">
              <button onClick={confirmarEliminar}>Confirmar</button>
              <button onClick={cerrarConfirmacion}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfesoresList;