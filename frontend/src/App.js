// App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Login from './login';
import Dashboard from './dashboard';
import StudentLanding from './studentLanding'; 
import ProfesoresList from './ProfesoresList';
import EstudiantesList from './EstudiantesList';



function App() {
  const [session, setSession] = useState(() => {
    const stored = localStorage.getItem('session');
    return stored ? JSON.parse(stored) : null;
  });

  const handleLogin = (userSession) => {
    localStorage.setItem('session', JSON.stringify(userSession));
    setSession(userSession);
  };

  const handleLogout = () => {
    localStorage.removeItem('session');
    setSession(null);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            session ? (
              session.role === 'admin' ? <Navigate to="/dashboard" /> : <Navigate to="/student" />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            session && session.role === 'admin' ? (
              <Dashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/" />
            )
          
          }
        />
        <Route
        path="/profesores"
        element={
          session && session.role === 'admin' ? (
            <ProfesoresList />
          ) : (
            <Navigate to="/" />
          )
        }

        
        
      />
      
        <Route
         path="/estudiantes"
         element={
            session && session.role === 'admin' ? (
              <EstudiantesList />
            ) : (
              <Navigate to="/" />
            )
          }

        
        
      />
        <Route
          path="/student"
          element={
            session && session.role === 'estudiante' ? (
              <StudentLanding clientId={session.clientId} nombre={session.nombre} onLogout={handleLogout} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
