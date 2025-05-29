use semilleros;
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
