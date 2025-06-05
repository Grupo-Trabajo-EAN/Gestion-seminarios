import { useEffect, useState } from "react";
import "./semilleros.css";

function Semilleros() {
  const [semilleros, setSemilleros] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nuevoPlan, setNuevoPlan] = useState({
    nombre: "",
    semillero: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSemilleroModalOpen, setIsSemilleroModalOpen] = useState(false);
  const [gruposInvestigacion, setGruposInvestigacion] = useState([]);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [availableProfessors, setAvailableProfessors] = useState([]);
  const [nuevoSemillero, setNuevoSemillero] = useState({
    nombre: "",
    objetivo_principal: "",
    objetivos_especificos: "",
    grupo_investigacion_id: "",
    estudiantes_ids: [],
    profesores_ids: [],
  });

  useEffect(() => {
    fetchSemilleros();
    fetchGruposInvestigacion();
    fetchAvailableStudents();
    fetchAvailableProfessors();
  }, []);

  const fetchSemilleros = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/semilleros");
      if (!response.ok) {
        throw new Error("Failed to fetch semilleros");
      }
      const data = await response.json();
      setSemilleros(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch semilleros:", error);
      setError(error.message);
      setLoading(false);
    }
  };

  const fetchGruposInvestigacion = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/grupos-investigacion");
      if (!response.ok) {
        throw new Error("Failed to fetch grupos de investigación");
      }
      const data = await response.json();
      setGruposInvestigacion(data);
    } catch (error) {
      console.error("Failed to fetch grupos de investigación:", error);
    }
  };

  const fetchAvailableStudents = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/semilleros/available/estudiantes");
      if (!response.ok) {
        throw new Error("Failed to fetch available students");
      }
      const data = await response.json();
      setAvailableStudents(data);
    } catch (error) {
      console.error("Failed to fetch available students:", error);
    }
  };

  const fetchAvailableProfessors = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/semilleros/available/profesores");
      if (!response.ok) {
        throw new Error("Failed to fetch available professors");
      }
      const data = await response.json();
      setAvailableProfessors(data);
    } catch (error) {
      console.error("Failed to fetch available professors:", error);
    }
  };

  useEffect(() => {
    setNuevoPlan({ ...nuevoPlan, semillero: selectedId });
  }, [selectedId]);

  if (loading) return <p>Cargando semilleros...</p>;
  if (error)
    return (
      <main className="student-content">
        <div className="greeting-card">
          <h2>Error</h2>
          <p>Error de conexión</p>
        </div>
      </main>
    );
  else if (!semilleros.length)
    return (
      <main className="student-content">
        <div className="greeting-card">
          <h2>Atención</h2>
          <p>No hay semilleros registrados</p>
          <button onClick={openSemilleroModal}>
            Agregar Semillero
          </button>
        </div>
      </main>
    );

  const openModal = () => {
    if (selectedId) {
      setNuevoPlan({ nombre: "", semillero: selectedId });
      setIsModalOpen(true);
    } else {
      alert("Por favor, seleccione un semillero de la tabla primero.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openSemilleroModal = () => {
    setIsSemilleroModalOpen(true);
  };

  const closeSemilleroModal = () => {
    setIsSemilleroModalOpen(false);
    setNuevoSemillero({
      nombre: "",
      objetivo_principal: "",
      objetivos_especificos: "",
      grupo_investigacion_id: "",
      estudiantes_ids: [],
      profesores_ids: [],
    });
  };

  const handleSemilleroChange = (e) => {
    const { name, value } = e.target;
    setNuevoSemillero((prev) => ({ ...prev, [name]: value }));
  };

  const handleStudentSelection = (studentId) => {
    setNuevoSemillero((prev) => {
      const isSelected = prev.estudiantes_ids.includes(studentId);
      return {
        ...prev,
        estudiantes_ids: isSelected
          ? prev.estudiantes_ids.filter(id => id !== studentId)
          : [...prev.estudiantes_ids, studentId]
      };
    });
  };

  const handleProfessorSelection = (professorId) => {
    setNuevoSemillero((prev) => {
      const isSelected = prev.profesores_ids.includes(professorId);
      return {
        ...prev,
        profesores_ids: isSelected
          ? prev.profesores_ids.filter(id => id !== professorId)
          : [...prev.profesores_ids, professorId]
      };
    });
  };

  const handleAgregarSemillero = async () => {
    if (!nuevoSemillero.nombre.trim() || !nuevoSemillero.objetivo_principal.trim() || 
        !nuevoSemillero.objetivos_especificos.trim() || !nuevoSemillero.grupo_investigacion_id) {
      alert("Todos los campos básicos son obligatorios");
      return;
    }

    if (nuevoSemillero.estudiantes_ids.length < 2) {
      alert("Un semillero debe tener al menos 2 estudiantes asignados");
      return;
    }

    if (nuevoSemillero.profesores_ids.length < 1) {
      alert("Un semillero debe tener al menos 1 profesor asignado");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/semilleros", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoSemillero),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al crear el semillero");
      }

      const result = await response.json();
      console.log("Semillero creado:", result);

      setNuevoSemillero({
        nombre: "",
        objetivo_principal: "",
        objetivos_especificos: "",
        grupo_investigacion_id: "",
        estudiantes_ids: [],
        profesores_ids: [],
      });
      alert("Semillero creado exitosamente!");
      closeSemilleroModal();
      fetchSemilleros();
      fetchAvailableStudents(); // Refresh available students
      fetchAvailableProfessors(); // Refresh available professors
    } catch (err) {
      console.error("Failed to create semillero:", err);
      alert(`Error al crear el semillero: ${err.message}`);
    }
  };

  const handlePlanNombreChange = (event) => {
    setNuevoPlan({ ...nuevoPlan, nombre: event.target.value });
  };

  const handleCrearPlanSubmit = async () => {
    if (!nuevoPlan.nombre.trim()) {
      alert("El nombre del plan de actividades no puede estar vacío.");
      return;
    }
    if (!nuevoPlan.semillero) {
      alert(
        "Error: ID del semillero no está asignado. Seleccione un semillero."
      );
      return;
    }

    console.log("Enviando nuevo plan:", nuevoPlan);

    try {
      const response = await fetch(
        "http://localhost:4000/api/planactividades",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nuevoPlan),
        }
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Error desconocido al crear el plan." }));
        throw new Error(
          errorData.message ||
            `Error ${response.status} al crear el plan de actividades`
        );
      }

      const result = await response.json(); // Or handle as needed
      console.log("Plan de actividades creado:", result);

      setNuevoPlan({ nombre: "", semillero: selectedId });
      alert("Plan de actividades creado exitosamente!");
      closeModal();
    } catch (err) {
      console.error("Failed to create plan de actividades:", err);
      alert(`Error al crear el plan: ${err.message}`);
    }
  };

  return (
    <div className="semilleros-container">
      <div className="semilleros-actions">
        <button onClick={openSemilleroModal}>
          Agregar Semillero
        </button>
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
        <button
          disabled={!selectedId}
          onClick={openModal} // Changed to open the modal
        >
          Agregar Plan Actividades
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
              className={semillero.id === selectedId ? "selected" : ""}
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
              <td className="objetivos-cell">
                {semillero.objetivos_especificos}
              </td>
              <td>
                {semillero.grupo_nombre ? (
                  <span className="grupo-info">
                    <strong>{semillero.grupo_codigo}</strong>
                    <br />
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
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Agregar Nuevo Plan de Actividades</h2>
            <p>
              Para el semillero:{" "}
              {semilleros.find((s) => s.id === selectedId)?.nombre ||
                "Desconocido"}
            </p>
            <div>
              <label htmlFor="planNombre">Nombre del Plan:</label>
              <input
                type="text"
                id="planNombre"
                value={nuevoPlan.nombre}
                onChange={handlePlanNombreChange}
                placeholder="Ingrese el nombre del plan"
              />
            </div>
            <div className="modal-actions">
              <button onClick={handleCrearPlanSubmit}>Crear</button>
              <button onClick={closeModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
      {isSemilleroModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Agregar Nuevo Semillero</h3>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre del Semillero"
              value={nuevoSemillero.nombre}
              onChange={handleSemilleroChange}
            />
            <textarea
              name="objetivo_principal"
              placeholder="Objetivo Principal"
              value={nuevoSemillero.objetivo_principal}
              onChange={handleSemilleroChange}
              rows="3"
            />
            <textarea
              name="objetivos_especificos"
              placeholder="Objetivos Específicos"
              value={nuevoSemillero.objetivos_especificos}
              onChange={handleSemilleroChange}
              rows="4"
            />
            <select
              name="grupo_investigacion_id"
              value={nuevoSemillero.grupo_investigacion_id}
              onChange={handleSemilleroChange}
            >
              <option value="">Seleccione un Grupo de Investigación</option>
              {gruposInvestigacion.map((grupo) => (
                <option key={grupo.id} value={grupo.id}>
                  {grupo.codigo} - {grupo.campo_investigacion}
                </option>
              ))}
            </select>
            
            <div className="section-title">
              <h4>Estudiantes (mínimo 2 requeridos)</h4>
              <p className="selected-count">Seleccionados: {nuevoSemillero.estudiantes_ids.length}</p>
            </div>
            <div className="members-selection">
              {availableStudents.map((student) => (
                <div key={student.id} className="member-item">
                  <input
                    type="checkbox"
                    id={`student-${student.id}`}
                    checked={nuevoSemillero.estudiantes_ids.includes(student.id)}
                    onChange={() => handleStudentSelection(student.id)}
                  />
                  <label htmlFor={`student-${student.id}`}>
                    {student.nombre} {student.apellido} - {student.codigo}
                  </label>
                </div>
              ))}
            </div>

            <div className="section-title">
              <h4>Profesores (mínimo 1 requerido)</h4>
              <p className="selected-count">Seleccionados: {nuevoSemillero.profesores_ids.length}</p>
            </div>
            <div className="members-selection">
              {availableProfessors.map((professor) => (
                <div key={professor.id} className="member-item">
                  <input
                    type="checkbox"
                    id={`professor-${professor.id}`}
                    checked={nuevoSemillero.profesores_ids.includes(professor.id)}
                    onChange={() => handleProfessorSelection(professor.id)}
                  />
                  <label htmlFor={`professor-${professor.id}`}>
                    {professor.nombre} {professor.apellido} - {professor.especialidad}
                  </label>
                </div>
              ))}
            </div>
            
            <div className="modal-actions">
              <button onClick={handleAgregarSemillero}>Crear</button>
              <button onClick={closeSemilleroModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Semilleros;
