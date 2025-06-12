USE semilleros;
DROP TABLE IF EXISTS `semilleros`;

-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:33078
-- Tiempo de generación: 03-06-2025 a las 07:32:14
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
-- Estructura de tabla para la tabla `semilleros`
--

CREATE TABLE `semilleros` (
  `id` int(11) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `objetivo_principal` text NOT NULL,
  `objetivos_especificos` text NOT NULL,
  `grupo_investigacion_id` int(11) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `semilleros`
--

INSERT INTO `semilleros` (`id`, `nombre`, `objetivo_principal`, `objetivos_especificos`, `grupo_investigacion_id`, `activo`, `created_at`, `updated_at`) VALUES
(1, 'Semillero de Machine Learning', 'Desarrollar competencias en aprendizaje automático y aplicaciones de inteligencia artificial', 'Estudiar algoritmos de ML, Implementar proyectos prácticos, Participar en competencias de datos, Publicar artículos científicos', 1, 1, '2025-05-29 22:29:10', '2025-05-29 22:29:10'),
(2, 'Semillero de Biotecnología Aplicada', 'Formar investigadores en biotecnología con enfoque en aplicaciones médicas y ambientales', 'Realizar experimentos de laboratorio, Desarrollar prototipos biotecnológicos, Colaborar con empresas del sector, Presentar en congresos', 2, 1, '2025-05-29 22:29:10', '2025-05-29 22:29:10'),
(3, 'Semillero de Energías Limpias', 'Investigar y desarrollar tecnologías de energías renovables sostenibles', 'Diseñar sistemas solares, Evaluar eficiencia energética, Crear prototipos eólicos, Analizar impacto ambiental', 3, 1, '2025-05-29 22:29:10', '2025-05-29 22:29:10'),
(4, 'Semillero de Innovación Social', 'Generar soluciones innovadoras para problemáticas sociales comunitarias', 'Identificar problemas sociales, Diseñar metodologías participativas, Implementar proyectos comunitarios, Evaluar impacto social', 4, 1, '2025-05-29 22:29:10', '2025-05-29 22:29:10'),
(5, 'Semillero de Nanociencias', 'Explorar aplicaciones de la nanotecnología en diferentes campos científicos', 'Sintetizar nanomateriales, Caracterizar propiedades, Desarrollar aplicaciones médicas, Estudiar toxicidad', 5, 1, '2025-05-29 22:29:10', '2025-05-29 22:29:10'),
(6, 'Semillero de Tecnología Educativa', 'Innovar en el uso de tecnologías para mejorar procesos de enseñanza-aprendizaje', 'Desarrollar aplicaciones educativas, Evaluar herramientas digitales, Capacitar docentes, Medir efectividad pedagógica', 6, 1, '2025-05-29 22:29:10', '2025-05-29 22:29:10'),
(7, 'Semillero de Sostenibilidad Ambiental', 'Investigar estrategias de adaptación y mitigación del cambio climático', 'Monitorear variables climáticas, Modelar escenarios futuros, Proponer medidas de adaptación, Sensibilizar comunidades', 7, 1, '2025-05-29 22:29:10', '2025-05-29 22:29:10'),
(8, 'Semillero de Robótica Educativa', 'Desarrollar competencias en robótica aplicada a la educación y la industria', 'Construir robots educativos, Programar sistemas autónomos, Participar en competencias, Crear talleres de robótica', 8, 1, '2025-05-29 22:29:10', '2025-05-29 22:29:10');

--
-- Índices para tablas volcadas
--

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
-- AUTO_INCREMENT de la tabla `semilleros`
--
ALTER TABLE `semilleros`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `semilleros`
--
ALTER TABLE `semilleros`
  ADD CONSTRAINT `semilleros_ibfk_1` FOREIGN KEY (`grupo_investigacion_id`) REFERENCES `grupos_investigacion` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
