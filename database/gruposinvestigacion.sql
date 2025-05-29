use semilleros;
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
