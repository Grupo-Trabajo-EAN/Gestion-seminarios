import React, { useState, useRef } from "react";
import "./studentLanding.css";

const ALLOWED_EXTENSIONS = ["pdf", "docx", "xlsx"];
const DEFAULT_FILE_NAME = "Ningún archivo seleccionado";

function UploadForm() {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState(DEFAULT_FILE_NAME);
  const [alert, setAlert] = useState(null); // null, 'success', 'error'

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const extension = file.name.split(".").pop().toLowerCase();
      const isValid = ALLOWED_EXTENSIONS.includes(extension);

      if (isValid) {
        setFileName(file.name);
        setAlert(null);
      } else {
        setFileName(DEFAULT_FILE_NAME);
        fileInputRef.current.value = "";
        setAlert("error");
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (fileName === DEFAULT_FILE_NAME) {
      setAlert("error");
    } else {
      setAlert("success");
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const UploadIconSVG = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="36"
      height="36"
      fill="currentColor"
      viewBox="0 0 16 16"
    >
      <path
        fillRule="evenodd"
        d="M4.406 1.342A5.53 5.53 0 0 1 8 0c2.69 0 4.923 2 5.166 4.579C14.758 4.804 16 6.137 16 7.773 16 9.569 14.502 11 12.687 11H10a.5.5 0 0 1 0-1h2.688C13.979 10 15 8.988 15 7.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 2.825 10.328 1 8 1a4.53 4.53 0 0 0-2.941 1.1c-.757.652-1.153 1.438-1.153 2.055v.448l-.445.049C2.064 4.805 1 5.952 1 7.318 1 8.785 2.23 10 3.781 10H6a.5.5 0 0 1 0 1H3.781C1.708 11 0 9.366 0 7.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383"
      />
      <path
        fillRule="evenodd"
        d="M7.646 4.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V14.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708z"
      />
    </svg>
  );

  return (
    <div className="form-wrapper">
      <h2>Subir Informe</h2>
      <form className="upload-form" onSubmit={handleSubmit}>
        <div
          className="upload-icon"
          onClick={() => fileInputRef.current.click()}
          title="Solo se permite PDF, DOCX o XLSX"
          role="img"
        >
          {UploadIconSVG}
        </div>

        <span className="file-name">{fileName}</span>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.docx,.xlsx"
          className="file-input-hidden"
        />

        <div className="form-actions">
          <button type="submit" className="btn primary">
            Subir
          </button>
        </div>

        {alert === "success" && (
          <div className="success-message">✅ Informe subido con éxito</div>
        )}
        {alert === "error" && (
          <div className="error-message">
            ❌ Formato inválido. Solo se permiten PDF, DOCX o XLSX.
          </div>
        )}
      </form>
    </div>
  );
}
function StudentLanding({ nombre, onLogout }) {
  const [view, setView] = useState("home");

  const renderContent = () => {
    if (view === "upload") return <UploadForm />;
    return (
      <main className="student-content">
        <div className="greeting-card">
          <h2>Portal del Estudiante</h2>
          <p>
            Has iniciado sesión exitosamente en el sistema de gestión de
            seminarios.
          </p>
        </div>
      </main>
    );
  };

  return (
    <div className="layout">
      <header className="header">
        <h1>Bienvenido, {nombre}!</h1>
        <button className="logout" onClick={onLogout}>
          Cerrar Sesión
        </button>
      </header>
      <div className="content">
        <aside className="sidebar">
          <ul>
            <li onClick={() => setView("home")}>Inicio</li>
            <li onClick={() => setView("upload")}>Subir Informe</li>
          </ul>
        </aside>
        <main className="main">{renderContent()}</main>
      </div>
    </div>
  );
}

export default StudentLanding;
