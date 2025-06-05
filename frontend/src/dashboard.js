import { useState } from "react";
import ProfesoresList from "./ProfesoresList";
import "./dashboard.css";
import GruposInvestigacion from "./gruposInvestigacion";
import Planes from "./planes";
import Semilleros from "./semilleros";
import Students from "./students";

function Dashboard({ onLogout, rol }) {
  const [view, setView] = useState("home");
  const handleChangeView = (newView) => {
    setView(newView);
  };

  const renderContent = () => {
    if (view === "estudiantes") return <Students />;
    if (view === "profesores") return <ProfesoresList />;
    if (view === "grupos") return <GruposInvestigacion />;
    if (view === "semilleros") return <Semilleros />;
    if (view === "planes") return <Planes changeView={handleChangeView} rol={rol} />;
    return <p>Selecciona una opción del menu lateral.</p>;
  };

  return (
    <div className="layout">
      <header className="header">
        <h1>Gestión de Semilleros</h1>
        <button className="logout" onClick={onLogout}>
          Cerrar sesión
        </button>
      </header>
      <div className="content">
        <aside className="sidebar">
          <ul>
            <li onClick={() => setView("estudiantes")}>Estudiantes</li>
            <li onClick={() => setView("profesores")}>Profesores</li>
            <li onClick={() => setView("grupos")}>Grupos de Investigación</li>
            <li onClick={() => setView("semilleros")}>Semilleros</li>
            <li onClick={() => setView("planes")}>Planes de actividades</li>
          </ul>
        </aside>
        <main className="main">{renderContent()}</main>
      </div>
    </div>
  );
}

export default Dashboard;
