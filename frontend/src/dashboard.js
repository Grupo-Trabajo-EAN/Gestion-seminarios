import React, { useState } from 'react';
import './dashboard.css'; 
import Students from './students';
import ProfesoresList from './ProfesoresList';

function Dashboard({ onLogout }) {
    const [view, setView] = useState('home');

    const renderContent = () => {
        if (view === 'estudiantes') return <Students />;
        if (view === 'profesores') return <ProfesoresList />;
        return <p>Selecciona una opción del menu lateral.</p>;
      };

  return (
    <div className="layout">
      <header className="header">
        <h1>Gestión de Semilleros</h1>
        <button className="logout" onClick={onLogout}>Cerrar sesión</button>
      </header>
      <div className="content">
        <aside className="sidebar">
          <ul>
          <li onClick={() => setView('estudiantes')}>Estudiantes</li>
          <li onClick={() => setView('profesores')}>Profesores</li>         
          </ul>
        </aside>
        <main className="main">
            {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
