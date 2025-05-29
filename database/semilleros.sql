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