USE semilleros;
DROP TABLE IF EXISTS `semillero_profesores`;

-- Tabla de relación muchos a muchos entre semilleros y profesores
-- Cada semillero debe tener al menos 1 profesor

CREATE TABLE `semillero_profesores` (
  `id` int(11) NOT NULL,
  `semillero_id` int(11) NOT NULL,
  `profesor_id` int(11) NOT NULL,
  `fecha_asignacion` date NOT NULL DEFAULT (current_date()),
  `rol` enum('director','co-director','asesor','colaborador') NOT NULL DEFAULT 'asesor',
  `estado` enum('activo','inactivo') NOT NULL DEFAULT 'activo',
  `horas_semanales` int(11) DEFAULT 2 COMMENT 'Horas semanales dedicadas al semillero',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Datos de ejemplo para la tabla `semillero_profesores`
-- Asegurándonos de que cada semillero tenga al menos 1 profesor
--

INSERT INTO `semillero_profesores` (`id`, `semillero_id`, `profesor_id`, `fecha_asignacion`, `rol`, `estado`, `horas_semanales`, `created_at`, `updated_at`) VALUES
-- Cada semillero con al menos 1 profesor (usando el profesor existente id=1)
(1, 1, 1, '2025-01-01', 'director', 'activo', 4, '2025-06-04 23:00:00', '2025-06-04 23:00:00'),
(2, 2, 1, '2025-01-01', 'asesor', 'activo', 3, '2025-06-04 23:00:00', '2025-06-04 23:00:00'),
(3, 3, 1, '2025-01-01', 'co-director', 'activo', 3, '2025-06-04 23:00:00', '2025-06-04 23:00:00'),
(4, 4, 1, '2025-01-01', 'asesor', 'activo', 2, '2025-06-04 23:00:00', '2025-06-04 23:00:00'),
(5, 5, 1, '2025-01-01', 'director', 'activo', 4, '2025-06-04 23:00:00', '2025-06-04 23:00:00'),
(6, 6, 1, '2025-01-01', 'asesor', 'activo', 2, '2025-06-04 23:00:00', '2025-06-04 23:00:00'),
(7, 7, 1, '2025-01-01', 'co-director', 'activo', 3, '2025-06-04 23:00:00', '2025-06-04 23:00:00'),
(8, 8, 1, '2025-01-01', 'director', 'activo', 4, '2025-06-04 23:00:00', '2025-06-04 23:00:00');

--
-- Índices para la tabla `semillero_profesores`
--
ALTER TABLE `semillero_profesores`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_semillero_profesor` (`semillero_id`,`profesor_id`),
  ADD KEY `idx_semillero_id` (`semillero_id`),
  ADD KEY `idx_profesor_id` (`profesor_id`),
  ADD KEY `idx_rol` (`rol`),
  ADD KEY `idx_estado` (`estado`);

--
-- AUTO_INCREMENT de la tabla `semillero_profesores`
--
ALTER TABLE `semillero_profesores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Restricciones para la tabla `semillero_profesores`
--
ALTER TABLE `semillero_profesores`
  ADD CONSTRAINT `fk_semillero_profesores_semillero` FOREIGN KEY (`semillero_id`) REFERENCES `semilleros` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_semillero_profesores_profesor` FOREIGN KEY (`profesor_id`) REFERENCES `profesores` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT;
