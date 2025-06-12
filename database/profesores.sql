USE semilleros;
DROP TABLE IF EXISTS `profesores`;
-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:33078
-- Tiempo de generación: 10-06-2025 a las 18:14:17
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
-- Estructura de tabla para la tabla `profesores`
--

CREATE TABLE `profesores` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `identificacion` varchar(20) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `Estado` varchar(150) NOT NULL DEFAULT 'Activo',
  `especialidad` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `profesores`
--

INSERT INTO `profesores` (`id`, `nombre`, `apellido`, `identificacion`, `email`, `Estado`, `especialidad`) VALUES
(1, 'jorge', 'bernal', '156456', 'jorge@gmail.com', 'Activo', 'calculo'),
(2, 'María Elena', 'Rodríguez', '987654321', 'mrodriguez@universidad.edu.co', 'Activo', 'Inteligencia Artificial'),
(3, 'Carlos Alberto', 'Mendoza', '456789123', 'cmendoza@universidad.edu.co', 'Activo', 'Biotecnología'),
(4, 'Ana Patricia', 'García', '789123456', 'agarcia@universidad.edu.co', 'Activo', 'Energías Renovables'),
(5, 'Luis Fernando', 'López', '321654987', 'llopez@universidad.edu.co', 'Activo', 'Ciencias Sociales'),
(6, 'Sandra Milena', 'Vargas', '654987321', 'svargas@universidad.edu.co', 'Activo', 'Nanotecnología'),
(7, 'Roberto Carlos', 'Jiménez', '147258369', 'rjimenez@universidad.edu.co', 'Activo', 'Tecnología Educativa'),
(8, 'Diana Carolina', 'Morales', '963852741', 'dmorales@universidad.edu.co', 'Activo', 'Medio Ambiente');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `profesores`
--
ALTER TABLE `profesores`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `profesores`
--
ALTER TABLE `profesores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
