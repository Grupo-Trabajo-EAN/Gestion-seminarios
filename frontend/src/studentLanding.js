import React from 'react';
import './studentLanding.css';

function StudentLanding({ nombre, onLogout }) {
  return (
    <div className="student-landing">
      <header className="student-header">
        <h1>Bienvenido, {nombre}!</h1>
        <button className="logout-btn" onClick={onLogout}>
          Cerrar Sesión
        </button>
      </header>
      
      <main className="student-content">
        <div className="greeting-card">
          <h2>Portal del Estudiante</h2>
          <p>Has iniciado sesión exitosamente en el sistema de gestión de seminarios.</p>
        </div>
      </main>
    </div>
  );
}

export default StudentLanding;
