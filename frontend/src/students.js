import { useEffect, useState } from "react";
import "./students.css";

function Students() {
  const [students, setStudents] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);

  const [nuevoStudent, setNuevoStudent] = useState({
    nombre: "",
    apellido: "",
    identificacion: "",
    email: "",
    carrera: "",
    semestre: "",
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/estudiantes");
      const data = await response.json();
      setStudents(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch students:", error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleAgregar = () => {
    fetch("http://localhost:4000/api/estudiantes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoStudent),
    })
      .then((res) => res.json())
      .then(() => {
        setNuevoStudent({
          nombre: "",
          apellido: "",
          identificacion: "",
          email: "",
          carrera: "",
          semestre: "",
        });
        alert("Estudiante creado exitosamente!");
        closeModal();
        fetchStudents();
      })
      .catch((err) => {
        console.error("Error al crear estudiante:", err);
      });
  };

  const handleEditar = (id) => {
    const estudiante = students.find((s) => s.id === id);
    if (estudiante) {
      setNuevoStudent(estudiante);
      setModoEdicion(true);
      setIsModalOpen(true);
    }
  };

  const handleGuardarCambios = () => {
    fetch(`http://localhost:4000/api/estudiantes/${nuevoStudent.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoStudent),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Estudiante actualizado exitosamente!");
        closeModal();
        fetchStudents();
      })
      .catch((err) => {
        console.error("Error al actualizar estudiante:", err);
      });
  };

  const handleEliminar = (id) => {
    if (window.confirm("¿Estás seguro de eliminar este estudiante?")) {
      fetch(`http://localhost:4000/api/estudiantes/${id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then(() => {
          alert("Estudiante eliminado");
          setSelectedId(null);
          fetchStudents();
        })
        .catch((err) => {
          console.error("Error al eliminar estudiante:", err);
        });
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModoEdicion(false);
    setNuevoStudent({
      nombre: "",
      apellido: "",
      identificacion: "",
      email: "",
      carrera: "",
      semestre: "",
    });
  };

  if (loading) return <p>Cargando estudiantes...</p>;
  if (students.error)
    return (
      <main className="student-content">
        <div className="greeting-card">
          <h2>Error</h2>
          <p>Error de conexión</p>
        </div>
      </main>
    );
  return (
    <div className="students-container">
      <div className="students-actions">
        <button onClick={openModal}>Agregar estudiante</button>
        <button
          disabled={!selectedId}
          onClick={() => handleEditar(selectedId)}
        >
          Editar seleccionado
        </button>
        <button
          disabled={!selectedId}
          onClick={() => handleEliminar(selectedId)}
        >
          Eliminar seleccionado
        </button>
      </div>

      <table className="students-table">
        <thead>
          <tr>
            <th></th>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Identificación</th>
            <th>Email</th>
            <th>Carrera</th>
            <th>Semestre</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr
              key={s.id}
              onClick={() => setSelectedId(s.id)}
              style={{
                backgroundColor: selectedId === s.id ? "#eef" : "transparent",
                cursor: "pointer",
              }}
            >
              <td>
                <input
                  type="radio"
                  name="id"
                  checked={s.id === selectedId}
                  onChange={() => setSelectedId(s.id)}
                />
              </td>
              <td>{s.id}</td>
              <td>{s.nombre}</td>
              <td>{s.apellido}</td>
              <td>{s.identificacion}</td>
              <td>{s.email}</td>
              <td>{s.carrera}</td>
              <td>{s.semestre}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{modoEdicion ? "Editar estudiante" : "Agregar nuevo estudiante"}</h3>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={nuevoStudent.nombre}
              onChange={handleChange}
            />
            <input
              type="text"
              name="apellido"
              placeholder="Apellido"
              value={nuevoStudent.apellido}
              onChange={handleChange}
            />
            <input
              type="number"
              name="identificacion"
              placeholder="Identificación"
              value={nuevoStudent.identificacion}
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Correo"
              value={nuevoStudent.email}
              onChange={handleChange}
            />
            <input
              type="text"
              name="carrera"
              placeholder="Carrera"
              value={nuevoStudent.carrera}
              onChange={handleChange}
            />
            <input
              type="number"
              name="semestre"
              placeholder="Semestre"
              value={nuevoStudent.semestre}
              onChange={handleChange}
            />
            <div className="modal-actions">
              <button onClick={modoEdicion ? handleGuardarCambios : handleAgregar}>
                {modoEdicion ? "Guardar cambios" : "Crear"}
              </button>
              <button onClick={closeModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Students;
