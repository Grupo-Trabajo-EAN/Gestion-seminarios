USE semilleros;
DROP TABLE IF EXISTS `estudiantes`;

-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:33078
-- Tiempo de generación: 04-06-2025 a las 23:08:28
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
  `grupo_investigacion` int(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `estudiantes`
--

INSERT INTO `estudiantes` (`id`, `username`, `password`, `nombre`, `apellido`, `identificacion`, `email`, `carrera`, `semestre`, `grupo_investigacion`, `created_at`, `updated_at`) VALUES
(1, 'pdelgad99203', '123456', 'Paula Catalina', 'Delgado Almendrales', 1001299203, 'pdelgad99203@universidadean.edu.co', 'ingenieria de sistemas', 5, 1, '2025-06-03 05:09:33', '2025-06-04 20:25:11'),
(2, 'juan123', 'password123', 'Juan', 'Perez', 12589842, 'juan123@universidadean.edu.co', 'Ingenieria industrial', 2, NULL, '2025-06-03 05:17:50', '2025-06-04 21:02:32'),
(3, 'Jesus123', '123456', 'Jesus', 'Torres', 312545, 'Jesus123@universidadean.edu.co', 'ingenieria de sistemas', 8, NULL, '2025-06-03 05:20:19', '2025-06-04 21:02:39');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `estudiantes`
--
ALTER TABLE `estudiantes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `grupo_investigacion` (`grupo_investigacion`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `estudiantes`
--
ALTER TABLE `estudiantes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `estudiantes`
--
ALTER TABLE `estudiantes`
  ADD CONSTRAINT `estudiantes_ibfk_1` FOREIGN KEY (`grupo_investigacion`) REFERENCES `grupos_investigacion` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
