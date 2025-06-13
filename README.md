# Gestión de Seminarios

Este proyecto permite la gestión de estudiantes y administración de seminarios en una plataforma web con frontend, backend y base de datos MySQL.

## Estructura del Proyecto

```
Gestion-seminarios/
├── backend/
│   └── db.js
├── database/
│   └── semilleros.sql
├── frontend/
├── .gitignore
└── package-lock.json
```

## Requisitos

- Node.js
- XAMPP o similar con MySQL en el puerto `33078`
- phpMyAdmin para gestionar la base de datos

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/usuario/gestion-seminarios.git
cd gestion-seminarios
```

### 2. Instalar dependencias

#### Backend

```bash
cd backend
npm install --force
```

#### Frontend

```bash
cd ../frontend
npm install --force
```

---

## Base de Datos

1. Iniciar XAMPP y asegurarse de que MySQL esté ejecutándose en el puerto `33078`.
2. Abrir [phpMyAdmin](http://localhost/phpmyadmin).
3. Ejecutar el script `semilleros.sql` ubicado en la carpeta `database/` para crear toda la estructura de la base de datos.

---

## Configuración de la conexión a la base de datos

Editar el archivo `backend/db.js` y configurar según el entorno local:

```js
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'semilleros',
  port: 33078,
  decimalNumbers: true 
});

connection.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err);
    return;
  }
  console.log('Connected to MySQL');
});

module.exports = connection;
```

> **Nota:** Cambiar el puerto, usuario o contraseña si tu configuración local es diferente.

---

## Usuarios del Sistema

### Administrador

- **Usuario:** `admin`
- **Contraseña:** `123456`

Accede al panel de administración desde el frontend usando este usuario.

### Estudiantes

- Al crear un estudiante desde el sistema, se le asigna automáticamente la contraseña: `123456`
- **Excepción:** el estudiante `juan123` tiene la contraseña personalizada:

  - **Usuario:** `juan123`
  - **Contraseña:** `password123`

---

## Licencia

Este proyecto es de uso académico y libre para modificar.
