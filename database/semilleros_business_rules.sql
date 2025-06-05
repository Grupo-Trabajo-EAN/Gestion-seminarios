USE semilleros;

-- Script para validar las reglas de negocio de semilleros
-- Cada semillero debe tener al menos 2 estudiantes y 1 profesor

DELIMITER ;;

-- Trigger para validar que un semillero tenga al menos 2 estudiantes antes de eliminar uno
CREATE TRIGGER `validate_min_students_before_delete`
BEFORE DELETE ON `semillero_estudiantes`
FOR EACH ROW
BEGIN
    DECLARE student_count INT;
    
    SELECT COUNT(*) INTO student_count 
    FROM semillero_estudiantes 
    WHERE semillero_id = OLD.semillero_id AND estado = 'activo';
    
    IF student_count <= 2 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Error: Un semillero debe tener al menos 2 estudiantes activos. No se puede eliminar este estudiante.';
    END IF;
END;;

-- Trigger para validar que un semillero tenga al menos 1 profesor antes de eliminar uno
CREATE TRIGGER `validate_min_professors_before_delete`
BEFORE DELETE ON `semillero_profesores`
FOR EACH ROW
BEGIN
    DECLARE professor_count INT;
    
    SELECT COUNT(*) INTO professor_count 
    FROM semillero_profesores 
    WHERE semillero_id = OLD.semillero_id AND estado = 'activo';
    
    IF professor_count <= 1 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Error: Un semillero debe tener al menos 1 profesor activo. No se puede eliminar este profesor.';
    END IF;
END;;

-- Trigger para validar que un semillero tenga al menos 2 estudiantes antes de cambiar estado a inactivo
CREATE TRIGGER `validate_min_students_before_update`
BEFORE UPDATE ON `semillero_estudiantes`
FOR EACH ROW
BEGIN
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
END;;

-- Trigger para validar que un semillero tenga al menos 1 profesor antes de cambiar estado a inactivo
CREATE TRIGGER `validate_min_professors_before_update`
BEFORE UPDATE ON `semillero_profesores`
FOR EACH ROW
BEGIN
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
END;;

DELIMITER ;

-- Vista para obtener información completa de semilleros con sus miembros
CREATE OR REPLACE VIEW `vista_semilleros_completa` AS
SELECT 
    s.id as semillero_id,
    s.nombre as semillero_nombre,
    s.objetivo_principal,
    s.objetivos_especificos,
    gi.campo_investigacion as grupo_nombre,
    gi.codigo as grupo_codigo,
    
    -- Contar estudiantes activos
    (SELECT COUNT(*) FROM semillero_estudiantes se WHERE se.semillero_id = s.id AND se.estado = 'activo') as total_estudiantes_activos,
    
    -- Contar profesores activos
    (SELECT COUNT(*) FROM semillero_profesores sp WHERE sp.semillero_id = s.id AND sp.estado = 'activo') as total_profesores_activos,
    
    -- Validar reglas de negocio
    CASE 
        WHEN (SELECT COUNT(*) FROM semillero_estudiantes se WHERE se.semillero_id = s.id AND se.estado = 'activo') >= 2 
             AND (SELECT COUNT(*) FROM semillero_profesores sp WHERE sp.semillero_id = s.id AND sp.estado = 'activo') >= 1 
        THEN 'VÁLIDO' 
        ELSE 'INVÁLIDO' 
    END as estado_validacion,
    
    s.created_at,
    s.updated_at
FROM semilleros s
LEFT JOIN grupos_investigacion gi ON s.grupo_investigacion_id = gi.id
ORDER BY s.id;

-- Vista para obtener detalles de estudiantes por semillero
CREATE OR REPLACE VIEW `vista_estudiantes_por_semillero` AS
SELECT 
    s.id as semillero_id,
    s.nombre as semillero_nombre,
    e.id as estudiante_id,
    e.nombre as estudiante_nombre,
    e.apellido as estudiante_apellido,
    e.email as estudiante_email,
    e.carrera,
    e.semestre,
    se.fecha_ingreso,
    se.estado,
    se.rol
FROM semilleros s
INNER JOIN semillero_estudiantes se ON s.id = se.semillero_id
INNER JOIN estudiantes e ON se.estudiante_id = e.id
ORDER BY s.id, se.fecha_ingreso;

-- Vista para obtener detalles de profesores por semillero
CREATE OR REPLACE VIEW `vista_profesores_por_semillero` AS
SELECT 
    s.id as semillero_id,
    s.nombre as semillero_nombre,
    p.id as profesor_id,
    p.nombre as profesor_nombre,
    p.apellido as profesor_apellido,
    p.email as profesor_email,
    p.especialidad,
    sp.fecha_asignacion,
    sp.rol,
    sp.estado,
    sp.horas_semanales
FROM semilleros s
INNER JOIN semillero_profesores sp ON s.id = sp.semillero_id
INNER JOIN profesores p ON sp.profesor_id = p.id
ORDER BY s.id, sp.fecha_asignacion;

-- Procedimiento almacenado para validar semilleros
DELIMITER ;;

CREATE PROCEDURE `ValidarReglasNegocioSemilleros`()
BEGIN
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
END;;

DELIMITER ;

COMMIT;
