USE semilleros;

-- Agregar más profesores para hacer el ejemplo más realista
INSERT INTO `profesores` (`id`, `nombre`, `apellido`, `identificacion`, `email`, `especialidad`) VALUES
(2, 'María Elena', 'Rodríguez', 987654321, 'mrodriguez@universidad.edu.co', 'Inteligencia Artificial'),
(3, 'Carlos Alberto', 'Mendoza', 456789123, 'cmendoza@universidad.edu.co', 'Biotecnología'),
(4, 'Ana Patricia', 'García', 789123456, 'agarcia@universidad.edu.co', 'Energías Renovables'),
(5, 'Luis Fernando', 'López', 321654987, 'llopez@universidad.edu.co', 'Ciencias Sociales'),
(6, 'Sandra Milena', 'Vargas', 654987321, 'svargas@universidad.edu.co', 'Nanotecnología'),
(7, 'Roberto Carlos', 'Jiménez', 147258369, 'rjimenez@universidad.edu.co', 'Tecnología Educativa'),
(8, 'Diana Carolina', 'Morales', 963852741, 'dmorales@universidad.edu.co', 'Medio Ambiente');

-- Actualizar las asignaciones de profesores para que sea más realista
-- Cada semillero tendrá profesores especialistas en su área

DELETE FROM semillero_profesores;

INSERT INTO `semillero_profesores` (`id`, `semillero_id`, `profesor_id`, `fecha_asignacion`, `rol`, `estado`, `horas_semanales` , `created_at`, `updated_at`) VALUES
-- Semillero 1 (Machine Learning) - 2 profesores
(1, 1, 2, '2025-01-01', 'director', 'activo', 6, '2025-06-04 23:00:00', '2025-06-04 23:00:00'),
(2, 1, 1, '2025-01-01', 'asesor', 'activo', 3, '2025-06-04 23:00:00', '2025-06-04 23:00:00'),

-- Semillero 2 (Biotecnología) - 1 profesor
(3, 2, 3, '2025-01-01', 'director', 'activo', 5, '2025-06-04 23:00:00', '2025-06-04 23:00:00'),

-- Semillero 3 (Energías Limpias) - 1 profesor
(4, 3, 4, '2025-01-01', 'director', 'activo', 4, '2025-06-04 23:00:00', '2025-06-04 23:00:00'),

-- Semillero 4 (Innovación Social) - 2 profesores
(5, 4, 5, '2025-01-01', 'director', 'activo', 4, '2025-06-04 23:00:00', '2025-06-04 23:00:00'),
(6, 4, 1, '2025-01-01', 'colaborador', 'activo', 2, '2025-06-04 23:00:00', '2025-06-04 23:00:00'),

-- Semillero 5 (Nanociencias) - 1 profesor
(7, 5, 6, '2025-01-01', 'director', 'activo', 5, '2025-06-04 23:00:00', '2025-06-04 23:00:00'),

-- Semillero 6 (Tecnología Educativa) - 1 profesor
(8, 6, 7, '2025-01-01', 'director', 'activo', 4, '2025-06-04 23:00:00', '2025-06-04 23:00:00'),

-- Semillero 7 (Sostenibilidad Ambiental) - 1 profesor
(9, 7, 8, '2025-01-01', 'director', 'activo', 4, '2025-06-04 23:00:00', '2025-06-04 23:00:00'),

-- Semillero 8 (Robótica Educativa) - 2 profesores
(10, 8, 2, '2025-01-01', 'co-director', 'activo', 3, '2025-06-04 23:00:00', '2025-06-04 23:00:00'),
(11, 8, 7, '2025-01-01', 'director', 'activo', 4, '2025-06-04 23:00:00', '2025-06-04 23:00:00');

COMMIT;
