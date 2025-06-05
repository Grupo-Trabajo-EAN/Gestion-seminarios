DROP DATABASE if EXISTS semilleros;

CREATE DATABASE semilleros;

USE semilleros;


-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:33078
-- Tiempo de generación: 06-06-2025 a las 01:15:28
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

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `ValidarReglasNegocioSemilleros` ()   BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE semillero_id INT;
    DECLARE semillero_nombre VARCHAR(150);
    DECLARE estudiantes_count INT;
    DECLARE profesores_count INT;
    
    DECLARE semillero_cursor CURSOR FOR 
        SELECT id, nombre FROM semilleros;
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    CREATE TEMPORARY TABLE IF NOT EXISTS temp_validation_results (
        semillero_id INT,
        semillero_nombre VARCHAR(150),
        estudiantes_activos INT,
        profesores_activos INT,
        cumple_reglas BOOLEAN,
        mensaje TEXT
    );
    
    OPEN semillero_cursor;
    
    read_loop: LOOP
        FETCH semillero_cursor INTO semillero_id, semillero_nombre;
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        -- Contar estudiantes activos
        SELECT COUNT(*) INTO estudiantes_count 
        FROM semillero_estudiantes 
        WHERE semillero_id = semillero_id AND estado = 'activo';
        
        -- Contar profesores activos
        SELECT COUNT(*) INTO profesores_count 
        FROM semillero_profesores 
        WHERE semillero_id = semillero_id AND estado = 'activo';
        
        -- Insertar resultado
        INSERT INTO temp_validation_results VALUES (
            semillero_id,
            semillero_nombre,
            estudiantes_count,
            profesores_count,
            (estudiantes_count >= 2 AND profesores_count >= 1),
            CASE 
                WHEN estudiantes_count < 2 AND profesores_count < 1 THEN 
                    CONCAT('Faltan ', (2 - estudiantes_count), ' estudiantes y ', (1 - profesores_count), ' profesor')
                WHEN estudiantes_count < 2 THEN 
                    CONCAT('Faltan ', (2 - estudiantes_count), ' estudiantes')
                WHEN profesores_count < 1 THEN 
                    'Falta 1 profesor'
                ELSE 
                    'Cumple todas las reglas'
            END
        );
        
    END LOOP;
    
    CLOSE semillero_cursor;
    
    -- Mostrar resultados
    SELECT * FROM temp_validation_results;
    
    DROP TEMPORARY TABLE temp_validation_results;
END$$

DELIMITER ;

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
(3, 'Plan 3', '', 3),
(4, 'plan prueba', '', 6);

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
(1, 'jorge', 'bernal', 156456, 'jorge@gmail.com', 'calculo'),
(2, 'María Elena', 'Rodríguez', 987654321, 'mrodriguez@universidad.edu.co', 'Inteligencia Artificial'),
(3, 'Carlos Alberto', 'Mendoza', 456789123, 'cmendoza@universidad.edu.co', 'Biotecnología'),
(4, 'Ana Patricia', 'García', 789123456, 'agarcia@universidad.edu.co', 'Energías Renovables'),
(5, 'Luis Fernando', 'López', 321654987, 'llopez@universidad.edu.co', 'Ciencias Sociales'),
(6, 'Sandra Milena', 'Vargas', 654987321, 'svargas@universidad.edu.co', 'Nanotecnología'),
(7, 'Roberto Carlos', 'Jiménez', 147258369, 'rjimenez@universidad.edu.co', 'Tecnología Educativa'),
(8, 'Diana Carolina', 'Morales', 963852741, 'dmorales@universidad.edu.co', 'Medio Ambiente');

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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `semillero_estudiantes`
--

CREATE TABLE `semillero_estudiantes` (
  `id` int(11) NOT NULL,
  `semillero_id` int(11) NOT NULL,
  `estudiante_id` int(11) NOT NULL,
  `fecha_ingreso` date NOT NULL DEFAULT curdate(),
  `estado` enum('activo','inactivo','graduado') NOT NULL DEFAULT 'activo',
  `rol` varchar(100) DEFAULT NULL COMMENT 'Rol del estudiante en el semillero (ej: líder, investigador junior, etc.)',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `semillero_estudiantes`
--

INSERT INTO `semillero_estudiantes` (`id`, `semillero_id`, `estudiante_id`, `fecha_ingreso`, `estado`, `rol`, `created_at`, `updated_at`) VALUES
(1, 1, 1, '2025-01-15', 'activo', 'Líder estudiantil', '2025-06-05 04:00:00', '2025-06-05 04:00:00'),
(2, 1, 2, '2025-02-01', 'activo', 'Investigador junior', '2025-06-05 04:00:00', '2025-06-05 04:00:00'),
(3, 1, 3, '2025-03-10', 'activo', 'Investigador junior', '2025-06-05 04:00:00', '2025-06-05 04:00:00'),
(4, 2, 1, '2025-01-20', 'activo', 'Investigador senior', '2025-06-05 04:00:00', '2025-06-05 04:00:00'),
(5, 2, 3, '2025-02-15', 'activo', 'Investigador junior', '2025-06-05 04:00:00', '2025-06-05 04:00:00'),
(6, 3, 2, '2025-01-10', 'activo', 'Líder estudiantil', '2025-06-05 04:00:00', '2025-06-05 04:00:00'),
(7, 3, 3, '2025-02-05', 'activo', 'Investigador junior', '2025-06-05 04:00:00', '2025-06-05 04:00:00'),
(8, 4, 1, '2025-03-01', 'activo', 'Investigador junior', '2025-06-05 04:00:00', '2025-06-05 04:00:00'),
(9, 4, 2, '2025-03-15', 'activo', 'Investigador junior', '2025-06-05 04:00:00', '2025-06-05 04:00:00'),
(10, 5, 1, '2025-02-20', 'activo', 'Investigador senior', '2025-06-05 04:00:00', '2025-06-05 04:00:00'),
(11, 5, 3, '2025-03-05', 'activo', 'Investigador junior', '2025-06-05 04:00:00', '2025-06-05 04:00:00'),
(12, 6, 2, '2025-01-25', 'activo', 'Líder estudiantil', '2025-06-05 04:00:00', '2025-06-05 04:00:00'),
(13, 6, 3, '2025-02-10', 'activo', 'Investigador junior', '2025-06-05 04:00:00', '2025-06-05 04:00:00'),
(14, 7, 1, '2025-01-30', 'activo', 'Investigador junior', '2025-06-05 04:00:00', '2025-06-05 04:00:00'),
(15, 7, 2, '2025-02-20', 'activo', 'Investigador junior', '2025-06-05 04:00:00', '2025-06-05 04:00:00'),
(16, 7, 3, '2025-03-20', 'activo', 'Investigador junior', '2025-06-05 04:00:00', '2025-06-05 04:00:00'),
(17, 8, 1, '2025-02-01', 'activo', 'Líder estudiantil', '2025-06-05 04:00:00', '2025-06-05 04:00:00'),
(18, 8, 2, '2025-02-25', 'activo', 'Investigador junior', '2025-06-05 04:00:00', '2025-06-05 04:00:00');

--
-- Disparadores `semillero_estudiantes`
--
DELIMITER $$
CREATE TRIGGER `validate_min_students_before_delete` BEFORE DELETE ON `semillero_estudiantes` FOR EACH ROW BEGIN
    DECLARE student_count INT;
    
    SELECT COUNT(*) INTO student_count 
    FROM semillero_estudiantes 
    WHERE semillero_id = OLD.semillero_id AND estado = 'activo';
    
    IF student_count <= 2 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Error: Un semillero debe tener al menos 2 estudiantes activos. No se puede eliminar este estudiante.';
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `validate_min_students_before_update` BEFORE UPDATE ON `semillero_estudiantes` FOR EACH ROW BEGIN
    DECLARE student_count INT;
    
    IF NEW.estado = 'inactivo' AND OLD.estado = 'activo' THEN
        SELECT COUNT(*) INTO student_count 
        FROM semillero_estudiantes 
        WHERE semillero_id = NEW.semillero_id AND estado = 'activo' AND id != NEW.id;
        
        IF student_count < 2 THEN
            SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'Error: Un semillero debe tener al menos 2 estudiantes activos. No se puede desactivar este estudiante.';
        END IF;
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `semillero_profesores`
--

CREATE TABLE `semillero_profesores` (
  `id` int(11) NOT NULL,
  `semillero_id` int(11) NOT NULL,
  `profesor_id` int(11) NOT NULL,
  `fecha_asignacion` date NOT NULL DEFAULT curdate(),
  `rol` enum('director','co-director','asesor','colaborador') NOT NULL DEFAULT 'asesor',
  `estado` enum('activo','inactivo') NOT NULL DEFAULT 'activo',
  `horas_semanales` int(11) DEFAULT 2 COMMENT 'Horas semanales dedicadas al semillero',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `semillero_profesores`
--

INSERT INTO `semillero_profesores` (`id`, `semillero_id`, `profesor_id`, `fecha_asignacion`, `rol`, `estado`, `horas_semanales`, `created_at`, `updated_at`) VALUES
(1, 1, 2, '2025-01-01', 'director', 'activo', 6, '2025-06-05 04:00:00', '2025-06-05 04:00:00'),
(2, 1, 1, '2025-01-01', 'asesor', 'activo', 3, '2025-06-05 04:00:00', '2025-06-05 04:00:00'),
(3, 2, 3, '2025-01-01', 'director', 'activo', 5, '2025-06-05 04:00:00', '2025-06-05 04:00:00'),
(4, 3, 4, '2025-01-01', 'director', 'activo', 4, '2025-06-05 04:00:00', '2025-06-05 04:00:00'),
(5, 4, 5, '2025-01-01', 'director', 'activo', 4, '2025-06-05 04:00:00', '2025-06-05 04:00:00'),
(6, 4, 1, '2025-01-01', 'colaborador', 'activo', 2, '2025-06-05 04:00:00', '2025-06-05 04:00:00'),
(7, 5, 6, '2025-01-01', 'director', 'activo', 5, '2025-06-05 04:00:00', '2025-06-05 04:00:00'),
(8, 6, 7, '2025-01-01', 'director', 'activo', 4, '2025-06-05 04:00:00', '2025-06-05 04:00:00'),
(9, 7, 8, '2025-01-01', 'director', 'activo', 4, '2025-06-05 04:00:00', '2025-06-05 04:00:00'),
(10, 8, 2, '2025-01-01', 'co-director', 'activo', 3, '2025-06-05 04:00:00', '2025-06-05 04:00:00'),
(11, 8, 7, '2025-01-01', 'director', 'activo', 4, '2025-06-05 04:00:00', '2025-06-05 04:00:00');

--
-- Disparadores `semillero_profesores`
--
DELIMITER $$
CREATE TRIGGER `validate_min_professors_before_delete` BEFORE DELETE ON `semillero_profesores` FOR EACH ROW BEGIN
    DECLARE professor_count INT;
    
    SELECT COUNT(*) INTO professor_count 
    FROM semillero_profesores 
    WHERE semillero_id = OLD.semillero_id AND estado = 'activo';
    
    IF professor_count <= 1 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Error: Un semillero debe tener al menos 1 profesor activo. No se puede eliminar este profesor.';
    END IF;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `validate_min_professors_before_update` BEFORE UPDATE ON `semillero_profesores` FOR EACH ROW BEGIN
    DECLARE professor_count INT;
    
    IF NEW.estado = 'inactivo' AND OLD.estado = 'activo' THEN
        SELECT COUNT(*) INTO professor_count 
        FROM semillero_profesores 
        WHERE semillero_id = NEW.semillero_id AND estado = 'activo' AND id != NEW.id;
        
        IF professor_count < 1 THEN
            SIGNAL SQLSTATE '45000' 
            SET MESSAGE_TEXT = 'Error: Un semillero debe tener al menos 1 profesor activo. No se puede desactivar este profesor.';
        END IF;
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vista_estudiantes_por_semillero`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vista_estudiantes_por_semillero` (
`semillero_id` int(11)
,`semillero_nombre` varchar(150)
,`estudiante_id` int(11)
,`estudiante_nombre` varchar(100)
,`estudiante_apellido` varchar(50)
,`estudiante_email` varchar(100)
,`carrera` varchar(100)
,`semestre` int(100)
,`fecha_ingreso` date
,`estado` enum('activo','inactivo','graduado')
,`rol` varchar(100)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vista_profesores_por_semillero`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vista_profesores_por_semillero` (
`semillero_id` int(11)
,`semillero_nombre` varchar(150)
,`profesor_id` int(11)
,`profesor_nombre` varchar(100)
,`profesor_apellido` varchar(100)
,`profesor_email` varchar(100)
,`especialidad` varchar(100)
,`fecha_asignacion` date
,`rol` enum('director','co-director','asesor','colaborador')
,`estado` enum('activo','inactivo')
,`horas_semanales` int(11)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vista_semilleros_completa`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vista_semilleros_completa` (
`semillero_id` int(11)
,`semillero_nombre` varchar(150)
,`objetivo_principal` text
,`objetivos_especificos` text
,`grupo_nombre` varchar(150)
,`grupo_codigo` varchar(50)
,`total_estudiantes_activos` bigint(21)
,`total_profesores_activos` bigint(21)
,`estado_validacion` varchar(8)
,`created_at` timestamp
,`updated_at` timestamp
);

-- --------------------------------------------------------

--
-- Estructura para la vista `vista_estudiantes_por_semillero`
--
DROP TABLE IF EXISTS `vista_estudiantes_por_semillero`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_estudiantes_por_semillero`  AS SELECT `s`.`id` AS `semillero_id`, `s`.`nombre` AS `semillero_nombre`, `e`.`id` AS `estudiante_id`, `e`.`nombre` AS `estudiante_nombre`, `e`.`apellido` AS `estudiante_apellido`, `e`.`email` AS `estudiante_email`, `e`.`carrera` AS `carrera`, `e`.`semestre` AS `semestre`, `se`.`fecha_ingreso` AS `fecha_ingreso`, `se`.`estado` AS `estado`, `se`.`rol` AS `rol` FROM ((`semilleros` `s` join `semillero_estudiantes` `se` on(`s`.`id` = `se`.`semillero_id`)) join `estudiantes` `e` on(`se`.`estudiante_id` = `e`.`id`)) ORDER BY `s`.`id` ASC, `se`.`fecha_ingreso` ASC ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vista_profesores_por_semillero`
--
DROP TABLE IF EXISTS `vista_profesores_por_semillero`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_profesores_por_semillero`  AS SELECT `s`.`id` AS `semillero_id`, `s`.`nombre` AS `semillero_nombre`, `p`.`id` AS `profesor_id`, `p`.`nombre` AS `profesor_nombre`, `p`.`apellido` AS `profesor_apellido`, `p`.`email` AS `profesor_email`, `p`.`especialidad` AS `especialidad`, `sp`.`fecha_asignacion` AS `fecha_asignacion`, `sp`.`rol` AS `rol`, `sp`.`estado` AS `estado`, `sp`.`horas_semanales` AS `horas_semanales` FROM ((`semilleros` `s` join `semillero_profesores` `sp` on(`s`.`id` = `sp`.`semillero_id`)) join `profesores` `p` on(`sp`.`profesor_id` = `p`.`id`)) ORDER BY `s`.`id` ASC, `sp`.`fecha_asignacion` ASC ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vista_semilleros_completa`
--
DROP TABLE IF EXISTS `vista_semilleros_completa`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_semilleros_completa`  AS SELECT `s`.`id` AS `semillero_id`, `s`.`nombre` AS `semillero_nombre`, `s`.`objetivo_principal` AS `objetivo_principal`, `s`.`objetivos_especificos` AS `objetivos_especificos`, `gi`.`campo_investigacion` AS `grupo_nombre`, `gi`.`codigo` AS `grupo_codigo`, (select count(0) from `semillero_estudiantes` `se` where `se`.`semillero_id` = `s`.`id` and `se`.`estado` = 'activo') AS `total_estudiantes_activos`, (select count(0) from `semillero_profesores` `sp` where `sp`.`semillero_id` = `s`.`id` and `sp`.`estado` = 'activo') AS `total_profesores_activos`, CASE WHEN (select count(0) from `semillero_estudiantes` `se` where `se`.`semillero_id` = `s`.`id` AND `se`.`estado` = 'activo') >= 2 AND (select count(0) from `semillero_profesores` `sp` where `sp`.`semillero_id` = `s`.`id` AND `sp`.`estado` = 'activo') >= 1 THEN 'VÁLIDO' ELSE 'INVÁLIDO' END AS `estado_validacion`, `s`.`created_at` AS `created_at`, `s`.`updated_at` AS `updated_at` FROM (`semilleros` `s` left join `grupos_investigacion` `gi` on(`s`.`grupo_investigacion_id` = `gi`.`id`)) ORDER BY `s`.`id` ASC ;

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
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `grupo_investigacion` (`grupo_investigacion`);

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
-- Indices de la tabla `semillero_estudiantes`
--
ALTER TABLE `semillero_estudiantes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_semillero_estudiante` (`semillero_id`,`estudiante_id`),
  ADD KEY `idx_semillero_id` (`semillero_id`),
  ADD KEY `idx_estudiante_id` (`estudiante_id`),
  ADD KEY `idx_estado` (`estado`);

--
-- Indices de la tabla `semillero_profesores`
--
ALTER TABLE `semillero_profesores`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_semillero_profesor` (`semillero_id`,`profesor_id`),
  ADD KEY `idx_semillero_id` (`semillero_id`),
  ADD KEY `idx_profesor_id` (`profesor_id`),
  ADD KEY `idx_rol` (`rol`),
  ADD KEY `idx_estado` (`estado`);

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
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `profesores`
--
ALTER TABLE `profesores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `semilleros`
--
ALTER TABLE `semilleros`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `semillero_estudiantes`
--
ALTER TABLE `semillero_estudiantes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `semillero_profesores`
--
ALTER TABLE `semillero_profesores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `actividades`
--
ALTER TABLE `actividades`
  ADD CONSTRAINT `actividades_ibfk_1` FOREIGN KEY (`plan`) REFERENCES `plan_actividades` (`ID`);

--
-- Filtros para la tabla `estudiantes`
--
ALTER TABLE `estudiantes`
  ADD CONSTRAINT `estudiantes_ibfk_1` FOREIGN KEY (`grupo_investigacion`) REFERENCES `grupos_investigacion` (`id`) ON DELETE SET NULL;

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

--
-- Filtros para la tabla `semillero_estudiantes`
--
ALTER TABLE `semillero_estudiantes`
  ADD CONSTRAINT `fk_semillero_estudiantes_estudiante` FOREIGN KEY (`estudiante_id`) REFERENCES `estudiantes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_semillero_estudiantes_semillero` FOREIGN KEY (`semillero_id`) REFERENCES `semilleros` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `semillero_profesores`
--
ALTER TABLE `semillero_profesores`
  ADD CONSTRAINT `fk_semillero_profesores_profesor` FOREIGN KEY (`profesor_id`) REFERENCES `profesores` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_semillero_profesores_semillero` FOREIGN KEY (`semillero_id`) REFERENCES `semilleros` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
