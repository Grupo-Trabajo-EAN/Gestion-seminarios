USE semilleros;
DROP TABLE IF EXISTS `semillero_estudiantes`;

-- Tabla de relación muchos a muchos entre semilleros y estudiantes
-- Cada semillero debe tener al menos 2 estudiantes

CREATE TABLE `semillero_estudiantes` (
  `id` int(11) NOT NULL,
  `semillero_id` int(11) NOT NULL,
  `estudiante_id` int(11) NOT NULL,
  `fecha_ingreso` date NOT NULL DEFAULT (current_date()),
  `estado` enum('activo','inactivo','graduado') NOT NULL DEFAULT 'activo',
  `rol` varchar(100) DEFAULT NULL COMMENT 'Rol del estudiante en el semillero (ej: líder, investigador junior, etc.)',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Datos de ejemplo para la tabla `semillero_estudiantes`
-- Asegurándonos de que cada semillero tenga al menos 2 estudiantes
--

INSERT INTO `semillero_estudiantes` (`id`, `semillero_id`, `estudiante_id`, `fecha_ingreso`, `estado`, `rol`, `created_at`, `updated_at`) VALUES
-- Semillero 1 (Machine Learning) - 3 estudiantes
(1, 1, 1, '2025-01-15', 'activo', 'Líder estudiantil', '2025-06-04 23:00:00', '2025-06-04 23:00:00'),
(2, 1, 2, '2025-02-01', 'activo', 'Investigador junior', '2025-06-04 23:00:00', '2025-06-04 23:00:00'),
(3, 1, 3, '2025-03-10', 'activo', 'Investigador junior', '2025-06-04 23:00:00', '2025-06-04 23:00:00'),

-- Semillero 2 (Biotecnología) - 2 estudiantes
(4, 2, 1, '2025-01-20', 'activo', 'Investigador senior', '2025-06-04 23:00:00', '2025-06-04 23:00:00'),
(5, 2, 3, '2025-02-15', 'activo', 'Investigador junior', '2025-06-04 23:00:00', '2025-06-04 23:00:00'),

-- Semillero 3 (Energías Limpias) - 2 estudiantes
(6, 3, 2, '2025-01-10', 'activo', 'Líder estudiantil', '2025-06-04 23:00:00', '2025-06-04 23:00:00'),
(7, 3, 3, '2025-02-05', 'activo', 'Investigador junior', '2025-06-04 23:00:00', '2025-06-04 23:00:00'),

-- Semillero 4 (Innovación Social) - 2 estudiantes
(8, 4, 1, '2025-03-01', 'activo', 'Investigador junior', '2025-06-04 23:00:00', '2025-06-04 23:00:00'),
(9, 4, 2, '2025-03-15', 'activo', 'Investigador junior', '2025-06-04 23:00:00', '2025-06-04 23:00:00'),

-- Semillero 5 (Nanociencias) - 2 estudiantes
(10, 5, 1, '2025-02-20', 'activo', 'Investigador senior', '2025-06-04 23:00:00', '2025-06-04 23:00:00'),
(11, 5, 3, '2025-03-05', 'activo', 'Investigador junior', '2025-06-04 23:00:00', '2025-06-04 23:00:00'),

-- Semillero 6 (Tecnología Educativa) - 2 estudiantes
(12, 6, 2, '2025-01-25', 'activo', 'Líder estudiantil', '2025-06-04 23:00:00', '2025-06-04 23:00:00'),
(13, 6, 3, '2025-02-10', 'activo', 'Investigador junior', '2025-06-04 23:00:00', '2025-06-04 23:00:00'),

-- Semillero 7 (Sostenibilidad Ambiental) - 3 estudiantes
(14, 7, 1, '2025-01-30', 'activo', 'Investigador junior', '2025-06-04 23:00:00', '2025-06-04 23:00:00'),
(15, 7, 2, '2025-02-20', 'activo', 'Investigador junior', '2025-06-04 23:00:00', '2025-06-04 23:00:00'),
(16, 7, 3, '2025-03-20', 'activo', 'Investigador junior', '2025-06-04 23:00:00', '2025-06-04 23:00:00'),

-- Semillero 8 (Robótica Educativa) - 2 estudiantes
(17, 8, 1, '2025-02-01', 'activo', 'Líder estudiantil', '2025-06-04 23:00:00', '2025-06-04 23:00:00'),
(18, 8, 2, '2025-02-25', 'activo', 'Investigador junior', '2025-06-04 23:00:00', '2025-06-04 23:00:00');

--
-- Índices para la tabla `semillero_estudiantes`
--
ALTER TABLE `semillero_estudiantes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_semillero_estudiante` (`semillero_id`,`estudiante_id`),
  ADD KEY `idx_semillero_id` (`semillero_id`),
  ADD KEY `idx_estudiante_id` (`estudiante_id`),
  ADD KEY `idx_estado` (`estado`);

--
-- AUTO_INCREMENT de la tabla `semillero_estudiantes`
--
ALTER TABLE `semillero_estudiantes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Restricciones para la tabla `semillero_estudiantes`
--
ALTER TABLE `semillero_estudiantes`
  ADD CONSTRAINT `fk_semillero_estudiantes_semillero` FOREIGN KEY (`semillero_id`) REFERENCES `semilleros` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_semillero_estudiantes_estudiante` FOREIGN KEY (`estudiante_id`) REFERENCES `estudiantes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT;
