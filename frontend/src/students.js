import { useEffect, useState } from "react";
import "./students.css";

function Students() {
  const [students, setStudents] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        alert("student creado exitosamente!");
        closeModal();
        fetchStudents();
      })
      .catch((err) => {});
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (loading) return <p>Cargando students...</p>;
  if (students.error)
    return (
      <main className="student-content">
        <div className="greeting-card">
          <h2>Error</h2>
          <p>Error de conexión</p>
        </div>
      </main>
    );
  else if (!students.length)
    return (
      <main className="student-content">
        <div className="greeting-card">
          <h2>Atención</h2>
          <p>No hay estudiantes registrados</p>
          <button onClick={openModal}>Agregar estudiante</button>
          {isModalOpen && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3>Agregar nuevo estudiante</h3>
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
                  <button onClick={handleAgregar}>Crear</button>
                  <button onClick={closeModal}>Cancelar</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    );

  return (
    <div className="students-container">
      <div className="students-actions">
        <button onClick={openModal}>Agregar estudiante</button>
        <button
          disabled={!selectedId}
          onClick={() => alert(`Editar student ${selectedId}`)}
        >
          Edit Selected
        </button>
        <button
          disabled={!selectedId}
          onClick={() => alert(`Eliminar student ${selectedId}`)}
        >
          Delete Selected
        </button>
      </div>

      <table className="students-table">
        <thead>
          <tr>
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
          {!students.error || students.length ? (
            students.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.nombre}</td>
                <td>{s.apellido}</td>
                <td>{s.identificacion}</td>
                <td>{s.email}</td>
                <td>{s.carrera}</td>
                <td>{s.semestre}</td>
              </tr>
            ))
          ) : (
            <h1>No hay informacion disponible</h1>
          )}
        </tbody>
      </table>
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Agregar nuevo estudiante</h3>
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
              <button onClick={handleAgregar}>Crear</button>
              <button onClick={closeModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Students;
