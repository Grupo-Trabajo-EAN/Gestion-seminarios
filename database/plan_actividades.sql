USE semilleros;
DROP TABLE IF EXISTS `plan_actividades`;
-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:33078
-- Tiempo de generación: 03-06-2025 a las 07:31:44
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

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `plan_actividades`
--
ALTER TABLE `plan_actividades`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `ID` (`Semillero`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `plan_actividades`
--
ALTER TABLE `plan_actividades`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `plan_actividades`
--
ALTER TABLE `plan_actividades`
  ADD CONSTRAINT `plan_actividades_ibfk_1` FOREIGN KEY (`Semillero`) REFERENCES `semilleros` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
