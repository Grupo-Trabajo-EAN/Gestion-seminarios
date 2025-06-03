DROP DATABASE if EXISTS semilleros;
CREATE DATABASE semilleros;

USE semilleros;

-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:33078
-- Tiempo de generación: 03-06-2025 a las 07:30:04
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `semilleros`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `actividades`
--

CREATE TABLE `actividades` (
  `id` int(20) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `plan` int(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `actividades`
--

INSERT INTO `actividades` (`id`, `nombre`, `plan`) VALUES
(1, 'Actividad evaluativa', 2),
(2, 'Actividad en grupo', 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estudiantes`
--

CREATE TABLE `estudiantes` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `identificacion` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `carrera` varchar(100) NOT NULL,
  `semestre` int(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `estudiantes`
--

INSERT INTO `estudiantes` (`id`, `username`, `password`, `nombre`, `apellido`, `identificacion`, `email`, `carrera`, `semestre`, `created_at`, `updated_at`) VALUES
(1, 'pdelgad99203', '123456', 'Paula Catalina', 'Delgado Almendrales', 1001299203, 'pdelgad99203@universidadean.edu.co', 'ingenieria de sistemas', 5, '2025-06-03 05:09:33', '2025-06-03 05:15:08'),
(2, 'juan123', 'password123', 'Juan', 'Perez', 12589842, 'juan123@universidadean.edu.co', 'Ingenieria industrial', 2, '2025-06-03 05:17:50', '2025-06-03 05:29:42'),
(3, 'Jesus123', '123456', 'Jesus', 'Torres', 312545, 'Jesus123@universidadean.edu.co', 'ingenieria de sistemas', 8, '2025-06-03 05:20:19', '2025-06-03 05:20:32');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `grupos_investigacion`
--

CREATE TABLE `grupos_investigacion` (
  `id` int(11) NOT NULL,
  `campo_investigacion` varchar(150) NOT NULL,
  `categoria` varchar(100) NOT NULL,
  `codigo` varchar(50) NOT NULL,
  `lider` varchar(100) NOT NULL,
  `lineas_investigacion` text NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `grupos_investigacion`
--

INSERT INTO `grupos_investigacion` (`id`, `campo_investigacion`, `categoria`, `codigo`, `lider`, `lineas_investigacion`, `created_at`, `updated_at`) VALUES
(1, 'Inteligencia Artificial', 'A1', 'GIA-001', 'Dr. Carlos Mendoza', 'Machine Learning, Redes Neuronales, Procesamiento de Lenguaje Natural', '2025-05-29 22:18:27', '2025-05-29 22:18:27'),
(2, 'Biotecnología', 'A', 'GBT-002', 'Dra. María Elena Vargas', 'Ingeniería Genética, Bioinformática, Medicina Molecular', '2025-05-29 22:18:27', '2025-05-29 22:18:27'),
(3, 'Energías Renovables', 'B', 'GER-003', 'Prof. Luis Alberto Castro', 'Energía Solar, Energía Eólica, Biomasa', '2025-05-29 22:18:27', '2025-05-29 22:18:27'),
(4, 'Ciencias Sociales', 'C', 'GCS-004', 'Dra. Ana Patricia Ruiz', 'Sociología Urbana, Desarrollo Comunitario, Políticas Públicas', '2025-05-29 22:18:27', '2025-05-29 22:18:27'),
(5, 'Nanotecnología', 'A1', 'GNT-005', 'Dr. Roberto Jiménez', 'Nanomateriales, Nanoelectrónica, Nanomedicina', '2025-05-29 22:18:27', '2025-05-29 22:18:27'),
(6, 'Educación Digital', 'B', 'GED-006', 'Prof. Carmen López', 'E-learning, Tecnología Educativa, Realidad Virtual', '2025-05-29 22:18:27', '2025-05-29 22:18:27'),
(7, 'Cambio Climático', 'A', 'GCC-007', 'Dr. Fernando Morales', 'Modelado Climático, Adaptación, Mitigación de GEI', '2025-05-29 22:18:27', '2025-05-29 22:18:27'),
(8, 'Robótica', 'A1', 'GRB-008', 'Dra. Silvia Hernández', 'Robótica Industrial, Robótica Médica, Automatización', '2025-05-29 22:18:27', '2025-05-29 22:18:27');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `plan_actividades`
--

CREATE TABLE `plan_actividades` (
  `ID` int(11) NOT NULL,
  `Nombre` varchar(100) NOT NULL,
  `Informe` varchar(900) NOT NULL,
  `Semillero` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `plan_actividades`
--

INSERT INTO `plan_actividades` (`ID`, `Nombre`, `Informe`, `Semillero`) VALUES
(1, 'Plan de Actividades 1 ', '', 1),
(2, 'Plan 2', '', 1),
(3, 'Plan 3', '', 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `profesores`
--

CREATE TABLE `profesores` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `identificacion` int(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `especialidad` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `profesores`
--

INSERT INTO `profesores` (`id`, `nombre`, `apellido`, `identificacion`, `email`, `especialidad`) VALUES
(1, 'jorge', 'bernal', 156456, 'jorge@gmail.com', 'calculo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `semilleros`
--

CREATE TABLE `semilleros` (
  `id` int(11) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `objetivo_principal` text NOT NULL,
  `objetivos_especificos` text NOT NULL,
  `grupo_investigacion_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `semilleros`
--

INSERT INTO `semilleros` (`id`, `nombre`, `objetivo_principal`, `objetivos_especificos`, `grupo_investigacion_id`, `created_at`, `updated_at`) VALUES
(1, 'Semillero de Machine Learning', 'Desarrollar competencias en aprendizaje automático y aplicaciones de inteligencia artificial', 'Estudiar algoritmos de ML, Implementar proyectos prácticos, Participar en competencias de datos, Publicar artículos científicos', 1, '2025-05-29 22:29:10', '2025-05-29 22:29:10'),
(2, 'Semillero de Biotecnología Aplicada', 'Formar investigadores en biotecnología con enfoque en aplicaciones médicas y ambientales', 'Realizar experimentos de laboratorio, Desarrollar prototipos biotecnológicos, Colaborar con empresas del sector, Presentar en congresos', 2, '2025-05-29 22:29:10', '2025-05-29 22:29:10'),
(3, 'Semillero de Energías Limpias', 'Investigar y desarrollar tecnologías de energías renovables sostenibles', 'Diseñar sistemas solares, Evaluar eficiencia energética, Crear prototipos eólicos, Analizar impacto ambiental', 3, '2025-05-29 22:29:10', '2025-05-29 22:29:10'),
(4, 'Semillero de Innovación Social', 'Generar soluciones innovadoras para problemáticas sociales comunitarias', 'Identificar problemas sociales, Diseñar metodologías participativas, Implementar proyectos comunitarios, Evaluar impacto social', 4, '2025-05-29 22:29:10', '2025-05-29 22:29:10'),
(5, 'Semillero de Nanociencias', 'Explorar aplicaciones de la nanotecnología en diferentes campos científicos', 'Sintetizar nanomateriales, Caracterizar propiedades, Desarrollar aplicaciones médicas, Estudiar toxicidad', 5, '2025-05-29 22:29:10', '2025-05-29 22:29:10'),
(6, 'Semillero de Tecnología Educativa', 'Innovar en el uso de tecnologías para mejorar procesos de enseñanza-aprendizaje', 'Desarrollar aplicaciones educativas, Evaluar herramientas digitales, Capacitar docentes, Medir efectividad pedagógica', 6, '2025-05-29 22:29:10', '2025-05-29 22:29:10'),
(7, 'Semillero de Sostenibilidad Ambiental', 'Investigar estrategias de adaptación y mitigación del cambio climático', 'Monitorear variables climáticas, Modelar escenarios futuros, Proponer medidas de adaptación, Sensibilizar comunidades', 7, '2025-05-29 22:29:10', '2025-05-29 22:29:10'),
(8, 'Semillero de Robótica Educativa', 'Desarrollar competencias en robótica aplicada a la educación y la industria', 'Construir robots educativos, Programar sistemas autónomos, Participar en competencias, Crear talleres de robótica', 8, '2025-05-29 22:29:10', '2025-05-29 22:29:10');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `actividades`
--
ALTER TABLE `actividades`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id` (`plan`);

--
-- Indices de la tabla `estudiantes`
--
ALTER TABLE `estudiantes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indices de la tabla `grupos_investigacion`
--
ALTER TABLE `grupos_investigacion`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `codigo` (`codigo`);

--
-- Indices de la tabla `plan_actividades`
--
ALTER TABLE `plan_actividades`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `ID` (`Semillero`);

--
-- Indices de la tabla `profesores`
--
ALTER TABLE `profesores`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `semilleros`
--
ALTER TABLE `semilleros`
  ADD PRIMARY KEY (`id`),
  ADD KEY `grupo_investigacion_id` (`grupo_investigacion_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `actividades`
--
ALTER TABLE `actividades`
  MODIFY `id` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `estudiantes`
--
ALTER TABLE `estudiantes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `grupos_investigacion`
--
ALTER TABLE `grupos_investigacion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `plan_actividades`
--
ALTER TABLE `plan_actividades`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `profesores`
--
ALTER TABLE `profesores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `semilleros`
--
ALTER TABLE `semilleros`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `actividades`
--
ALTER TABLE `actividades`
  ADD CONSTRAINT `actividades_ibfk_1` FOREIGN KEY (`plan`) REFERENCES `plan_actividades` (`ID`);

--
-- Filtros para la tabla `plan_actividades`
--
ALTER TABLE `plan_actividades`
  ADD CONSTRAINT `plan_actividades_ibfk_1` FOREIGN KEY (`Semillero`) REFERENCES `semilleros` (`id`);

--
-- Filtros para la tabla `semilleros`
--
ALTER TABLE `semilleros`
  ADD CONSTRAINT `semilleros_ibfk_1` FOREIGN KEY (`grupo_investigacion_id`) REFERENCES `grupos_investigacion` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
