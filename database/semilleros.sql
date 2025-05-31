-- MySQL dump 10.13  Distrib 8.0.42, for macos15 (arm64)
--
-- Host: 127.0.0.1    Database: semilleros
-- ------------------------------------------------------
-- Server version	8.0.32
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;

/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;

/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;

/*!50503 SET NAMES utf8 */;

/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;

/*!40103 SET TIME_ZONE='+00:00' */;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;

/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;

/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

/* drop database if exist and Create database after*/
DROP DATABASE if EXISTS semilleros;

Create DATABASE semilleros;

USE semilleros;

--
-- Base de datos: `semilleros`
--
-- --------------------------------------------------------
--
-- Table structure for table `estudiantes`
--
DROP TABLE IF EXISTS `estudiantes`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE
    `estudiantes` (
        `cliente_id` int NOT NULL AUTO_INCREMENT,
        `username` varchar(50) NOT NULL,
        `password` varchar(255) NOT NULL,
        `nombre` varchar(100) NOT NULL,
        `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
        `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (`cliente_id`),
        UNIQUE KEY `username` (`username`)
    ) ENGINE = InnoDB AUTO_INCREMENT = 4 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estudiantes`
--
LOCK TABLES `estudiantes` WRITE;

/*!40000 ALTER TABLE `estudiantes` DISABLE KEYS */;

INSERT INTO
    `estudiantes`
VALUES
    (
        1,
        'juan123',
        'password123',
        'Juan Pérez',
        '2025-05-27 17:08:52',
        '2025-05-27 17:08:52'
    ),
    (
        2,
        'maria456',
        'mypass456',
        'María González',
        '2025-05-27 17:08:52',
        '2025-05-27 17:08:52'
    ),
    (
        3,
        'carlos789',
        'secret789',
        'Carlos Rodríguez',
        '2025-05-27 17:08:52',
        '2025-05-27 17:08:52'
    );

/*!40000 ALTER TABLE `estudiantes` ENABLE KEYS */;

UNLOCK TABLES;

--
-- Estructura de tabla para la tabla `profesores`
--
CREATE TABLE
    `profesores` (
        `id` int (11) NOT NULL,
        `nombre` varchar(100) NOT NULL,
        `email` varchar(100) NOT NULL,
        `especialidad` varchar(100) DEFAULT NULL
    ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `profesores`
--
INSERT INTO
    `profesores` (`id`, `nombre`, `email`, `especialidad`)
VALUES
    (1, 'Jorge ', 'jorge@gmail.com', 'Calculo ');

--
-- Índices para tablas volcadas
--
--
-- Indices de la tabla `profesores`
--
ALTER TABLE `profesores` ADD PRIMARY KEY (`id`),
ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--
--
-- AUTO_INCREMENT de la tabla `profesores`
--
ALTER TABLE `profesores` MODIFY `id` int (11) NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 2;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;

/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;

/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
--
-- Table structure for table `grupos_investigacion`
--

DROP TABLE IF EXISTS `grupos_investigacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grupos_investigacion` (
  `id` int NOT NULL AUTO_INCREMENT,
  `campo_investigacion` varchar(150) NOT NULL,
  `categoria` varchar(100) NOT NULL,
  `codigo` varchar(50) NOT NULL,
  `lider` varchar(100) NOT NULL,
  `lineas_investigacion` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigo` (`codigo`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grupos_investigacion`
--

LOCK TABLES `grupos_investigacion` WRITE;
/*!40000 ALTER TABLE `grupos_investigacion` DISABLE KEYS */;
INSERT INTO `grupos_investigacion` VALUES (1,'Inteligencia Artificial','A1','GIA-001','Dr. Carlos Mendoza','Machine Learning, Redes Neuronales, Procesamiento de Lenguaje Natural','2025-05-29 22:18:27','2025-05-29 22:18:27'),(2,'Biotecnología','A','GBT-002','Dra. María Elena Vargas','Ingeniería Genética, Bioinformática, Medicina Molecular','2025-05-29 22:18:27','2025-05-29 22:18:27'),(3,'Energías Renovables','B','GER-003','Prof. Luis Alberto Castro','Energía Solar, Energía Eólica, Biomasa','2025-05-29 22:18:27','2025-05-29 22:18:27'),(4,'Ciencias Sociales','C','GCS-004','Dra. Ana Patricia Ruiz','Sociología Urbana, Desarrollo Comunitario, Políticas Públicas','2025-05-29 22:18:27','2025-05-29 22:18:27'),(5,'Nanotecnología','A1','GNT-005','Dr. Roberto Jiménez','Nanomateriales, Nanoelectrónica, Nanomedicina','2025-05-29 22:18:27','2025-05-29 22:18:27'),(6,'Educación Digital','B','GED-006','Prof. Carmen López','E-learning, Tecnología Educativa, Realidad Virtual','2025-05-29 22:18:27','2025-05-29 22:18:27'),(7,'Cambio Climático','A','GCC-007','Dr. Fernando Morales','Modelado Climático, Adaptación, Mitigación de GEI','2025-05-29 22:18:27','2025-05-29 22:18:27'),(8,'Robótica','A1','GRB-008','Dra. Silvia Hernández','Robótica Industrial, Robótica Médica, Automatización','2025-05-29 22:18:27','2025-05-29 22:18:27');
/*!40000 ALTER TABLE `grupos_investigacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `semilleros`
--

DROP TABLE IF EXISTS `semilleros`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `semilleros` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) NOT NULL,
  `objetivo_principal` text NOT NULL,
  `objetivos_especificos` text NOT NULL,
  `grupo_investigacion_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `grupo_investigacion_id` (`grupo_investigacion_id`),
  CONSTRAINT `semilleros_ibfk_1` FOREIGN KEY (`grupo_investigacion_id`) REFERENCES `grupos_investigacion` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `semilleros`
--

LOCK TABLES `semilleros` WRITE;
/*!40000 ALTER TABLE `semilleros` DISABLE KEYS */;
INSERT INTO `semilleros` VALUES (1,'Semillero de Machine Learning','Desarrollar competencias en aprendizaje automático y aplicaciones de inteligencia artificial','Estudiar algoritmos de ML, Implementar proyectos prácticos, Participar en competencias de datos, Publicar artículos científicos',1,'2025-05-29 22:29:10','2025-05-29 22:29:10'),(2,'Semillero de Biotecnología Aplicada','Formar investigadores en biotecnología con enfoque en aplicaciones médicas y ambientales','Realizar experimentos de laboratorio, Desarrollar prototipos biotecnológicos, Colaborar con empresas del sector, Presentar en congresos',2,'2025-05-29 22:29:10','2025-05-29 22:29:10'),(3,'Semillero de Energías Limpias','Investigar y desarrollar tecnologías de energías renovables sostenibles','Diseñar sistemas solares, Evaluar eficiencia energética, Crear prototipos eólicos, Analizar impacto ambiental',3,'2025-05-29 22:29:10','2025-05-29 22:29:10'),(4,'Semillero de Innovación Social','Generar soluciones innovadoras para problemáticas sociales comunitarias','Identificar problemas sociales, Diseñar metodologías participativas, Implementar proyectos comunitarios, Evaluar impacto social',4,'2025-05-29 22:29:10','2025-05-29 22:29:10'),(5,'Semillero de Nanociencias','Explorar aplicaciones de la nanotecnología en diferentes campos científicos','Sintetizar nanomateriales, Caracterizar propiedades, Desarrollar aplicaciones médicas, Estudiar toxicidad',5,'2025-05-29 22:29:10','2025-05-29 22:29:10'),(6,'Semillero de Tecnología Educativa','Innovar en el uso de tecnologías para mejorar procesos de enseñanza-aprendizaje','Desarrollar aplicaciones educativas, Evaluar herramientas digitales, Capacitar docentes, Medir efectividad pedagógica',6,'2025-05-29 22:29:10','2025-05-29 22:29:10'),(7,'Semillero de Sostenibilidad Ambiental','Investigar estrategias de adaptación y mitigación del cambio climático','Monitorear variables climáticas, Modelar escenarios futuros, Proponer medidas de adaptación, Sensibilizar comunidades',7,'2025-05-29 22:29:10','2025-05-29 22:29:10'),(8,'Semillero de Robótica Educativa','Desarrollar competencias en robótica aplicada a la educación y la industria','Construir robots educativos, Programar sistemas autónomos, Participar en competencias, Crear talleres de robótica',8,'2025-05-29 22:29:10','2025-05-29 22:29:10');
/*!40000 ALTER TABLE `semilleros` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-29 18:19:25

-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 01, 2025 at 01:07 AM
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
  `Semillero` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `plan_actividades`
--

INSERT INTO `plan_actividades` (`ID`, `Nombre`, `Informe`, `Semillero`) VALUES
(1, 'Plan de Actividades 1 ', '', 1),
(3, 'Plan 2', '', 1),
(4, 'Plan 3', '', 3);

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
