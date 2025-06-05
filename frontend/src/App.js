// App.js
import { useState } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Dashboard from "./dashboard";
import Login from "./login";
import ProfesoresList from "./ProfesoresList";
import StudentLanding from "./studentLanding";
import Students from "./students";

function App() {
  const [session, setSession] = useState(() => {
    const stored = localStorage.getItem("session");
    return stored ? JSON.parse(stored) : null;
  });

  const handleLogin = (userSession) => {
    localStorage.setItem("session", JSON.stringify(userSession));
    setSession(userSession);
  };

  const handleLogout = () => {
    localStorage.removeItem("session");
    setSession(null);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            session ? (
              session.role === "admin" ? (
                <Navigate to="/dashboard" />
              ) : (
                <Navigate to="/student" />
              )
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            session && session.role === "admin" ? (
              <Dashboard onLogout={handleLogout} rol={session.role}/>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/profesores"
          element={
            session && session.role === "admin" ? (
              <ProfesoresList />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/estudiantes"
          element={
            session && session.role === "admin" ? (
              <Students />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/student"
          element={
            session && session.role === "estudiante" ? (
              <StudentLanding
              rol={session.role}
                username={session.username}
                nombre={session.nombre}
                onLogout={handleLogout}
              />
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
