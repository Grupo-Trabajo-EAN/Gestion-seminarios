USE semilleros;
DROP TABLE IF EXISTS `plan_actividades`;
-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 10, 2025 at 02:38 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `semilleros`
--

-- --------------------------------------------------------

--
-- Table structure for table `plan_actividades`
--

CREATE TABLE `plan_actividades` (
  `ID` int(11) NOT NULL,
  `Nombre` varchar(100) NOT NULL,
  `Informe` varchar(900) NOT NULL,
  `Semillero` int(11) NOT NULL,
  `estado_aprobacion` enum('pendiente','aprobado') NOT NULL DEFAULT 'pendiente',
  `fecha_aprobacion` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `plan_actividades`
--

INSERT INTO `plan_actividades` (`ID`, `Nombre`, `Informe`, `Semillero`, `estado_aprobacion`, `fecha_aprobacion`) VALUES
(1, 'Plan de Actividades 1 ', '', 1, 'pendiente', NULL),
(2, 'Plan 2', '', 1, 'aprobado', '2025-06-09 19:15:45'),
(3, 'Plan 3', '', 3, 'pendiente', NULL),
(4, 'plan prueba', '', 6, 'aprobado', '2025-06-09 19:27:25');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `plan_actividades`
--
ALTER TABLE `plan_actividades`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `ID` (`Semillero`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `plan_actividades`
--
ALTER TABLE `plan_actividades`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `plan_actividades`
--
ALTER TABLE `plan_actividades`
  ADD CONSTRAINT `plan_actividades_ibfk_1` FOREIGN KEY (`Semillero`) REFERENCES `semilleros` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
