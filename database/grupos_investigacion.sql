USE semilleros;
DROP TABLE IF EXISTS `grupos_investigacion`;
-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:33078
-- Tiempo de generación: 03-06-2025 a las 07:31:21
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

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `grupos_investigacion`
--
ALTER TABLE `grupos_investigacion`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `codigo` (`codigo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `grupos_investigacion`
--
ALTER TABLE `grupos_investigacion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
