-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema siap
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema siap
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `siap` DEFAULT CHARACTER SET latin1 ;
USE `siap` ;

-- -----------------------------------------------------
-- Table `siap`.`t_actividad`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `siap`.`t_actividad` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `usuario` VARCHAR(45) NOT NULL,
  `descripcion` VARCHAR(100) NOT NULL,
  `ddl` VARCHAR(45) NOT NULL COMMENT 'valores aceptables: \"INSERT\", \"DELETE\", \"UPDATE\"',
  `tabla` VARCHAR(45) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `siap`.`t_usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `siap`.`t_usuario` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `cedula` VARCHAR(45) NOT NULL,
  `foto` VARCHAR(100) NULL DEFAULT 'default-avatar.png',
  `nombre` VARCHAR(55) NOT NULL,
  `apellido` VARCHAR(100) NOT NULL,
  `nacimiento` DATE NULL DEFAULT NULL,
  `usuario` VARCHAR(45) NOT NULL,
  `clave` VARCHAR(45) NOT NULL,
  `sexo` VARCHAR(45) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `correo` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `cedula_UNIQUE` (`cedula` ASC) VISIBLE,
  UNIQUE INDEX `correo_UNIQUE` (`correo` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `siap`.`t_administrativo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `siap`.`t_administrativo` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `rol` INT(11) NOT NULL DEFAULT '0',
  `usuario` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_t_administrativo_t_usuario1_idx` (`usuario` ASC) VISIBLE,
  CONSTRAINT `fk_t_administrativo_t_usuario1`
    FOREIGN KEY (`usuario`)
    REFERENCES `siap`.`t_usuario` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `siap`.`t_estudiante`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `siap`.`t_estudiante` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `usuario` INT(11) NOT NULL,
  `celular` VARCHAR(10) NULL DEFAULT NULL,
  `telefono` VARCHAR(10) NULL DEFAULT NULL,
  `nivel` INT(11) NULL DEFAULT '0',
  `carrera_departamento` VARCHAR(100) NULL DEFAULT NULL,
  `cantidad_dias` INT(11) NULL DEFAULT NULL,
  `telefono_emergencia` VARCHAR(150) NULL DEFAULT NULL,
  `notas` VARCHAR(255) NULL DEFAULT NULL,
  `provincia` VARCHAR(11) NULL DEFAULT NULL,
  `canton` VARCHAR(50) NULL DEFAULT NULL,
  `distrito` VARCHAR(60) NULL DEFAULT NULL,
  `direccion` VARCHAR(255) NULL DEFAULT NULL,
  `prematricula` DATE NULL DEFAULT NULL,
  `moroso` INT(11) NULL DEFAULT '0',
  `estado` INT(11) NULL DEFAULT '1',
  `tipo` VARCHAR(45) NULL DEFAULT 'Estudiante',
  `motivo_ingreso` VARCHAR(255) NULL DEFAULT NULL,
  `consentimiento` TINYINT(4) NOT NULL DEFAULT '0',
  `pago` DATE NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `usuario_UNIQUE` (`usuario` ASC) VISIBLE,
  INDEX `fk_t_estudiante_t_usuario1_idx` (`usuario` ASC) VISIBLE,
  CONSTRAINT `fk_t_estudiante_t_usuario1`
    FOREIGN KEY (`usuario`)
    REFERENCES `siap`.`t_usuario` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `siap`.`t_profesor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `siap`.`t_profesor` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `usuario` INT(11) NOT NULL,
  `rol` INT(3) NOT NULL DEFAULT '2',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `usuario_UNIQUE` (`usuario` ASC) VISIBLE,
  INDEX `fk_t_profesor_t_usuario1_idx` (`usuario` ASC) VISIBLE,
  CONSTRAINT `fk_t_profesor_t_usuario1`
    FOREIGN KEY (`usuario`)
    REFERENCES `siap`.`t_usuario` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `siap`.`t_anotaciones`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `siap`.`t_anotaciones` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `nota` VARCHAR(300) NOT NULL,
  `profesor` INT(11) NOT NULL,
  `estudiante` INT(11) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `fk_t_anotaciones_t_profesor1_idx` (`profesor` ASC) VISIBLE,
  INDEX `fk_t_anotaciones_t_estudiante_idx` (`estudiante` ASC) VISIBLE,
  CONSTRAINT `fk_t_anotaciones_t_estudiante`
    FOREIGN KEY (`estudiante`)
    REFERENCES `siap`.`t_estudiante` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_t_anotaciones_t_profesor1`
    FOREIGN KEY (`profesor`)
    REFERENCES `siap`.`t_profesor` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `siap`.`t_taller`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `siap`.`t_taller` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `codigo` VARCHAR(45) NOT NULL,
  `descripcion` VARCHAR(255) NOT NULL,
  `nivel` INT(11) NOT NULL,
  `costo` INT(10) UNSIGNED NOT NULL,
  `costo_funcionario` INT(10) UNSIGNED NOT NULL,
  `color` VARCHAR(45) NULL DEFAULT 'info',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `codigo_UNIQUE` (`codigo` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `siap`.`t_horario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `siap`.`t_horario` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `dia` VARCHAR(55) NOT NULL,
  `hora` INT(11) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `siap`.`t_grupo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `siap`.`t_grupo` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `horario` INT(11) NOT NULL,
  `profesor` INT(11) NOT NULL,
  `taller` INT(11) NOT NULL,
  `cupo_base` INT(10) UNSIGNED NOT NULL,
  `cupo_extra` INT(10) UNSIGNED NOT NULL,
  `cupo_actual` INT(10) NOT NULL DEFAULT '0',
  `periodo` DATE NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_t_taller_t_horario1_idx` (`horario` ASC) VISIBLE,
  INDEX `fk_t_taller_t_profesor1_idx` (`profesor` ASC) VISIBLE,
  INDEX `fk_t_grupo_t_taller1_idx` (`taller` ASC) VISIBLE,
  CONSTRAINT `fk_t_grupo_t_taller1`
    FOREIGN KEY (`taller`)
    REFERENCES `siap`.`t_taller` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_t_taller_t_horario1`
    FOREIGN KEY (`horario`)
    REFERENCES `siap`.`t_horario` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_t_taller_t_profesor1`
    FOREIGN KEY (`profesor`)
    REFERENCES `siap`.`t_profesor` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `siap`.`t_asistencia`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `siap`.`t_asistencia` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `estado` VARCHAR(25) NOT NULL COMMENT 'Ausente, Tarde, Presente',
  `fecha` VARCHAR(30) NOT NULL,
  `estudiante` INT(11) NOT NULL,
  `grupo` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_t_asistencia_t_estudiante_idx` (`estudiante` ASC) VISIBLE,
  INDEX `fk_t_asistencia_t_grupo_idx` (`grupo` ASC) VISIBLE,
  CONSTRAINT `fk_t_asistencia_t_estudiante`
    FOREIGN KEY (`estudiante`)
    REFERENCES `siap`.`t_estudiante` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_t_asistencia_t_grupo`
    FOREIGN KEY (`grupo`)
    REFERENCES `siap`.`t_grupo` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `siap`.`t_casillero`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `siap`.`t_casillero` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `codigo` VARCHAR(45) NOT NULL,
  `estado` INT(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `codigo_UNIQUE` (`codigo` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `siap`.`t_casillero_estudiante`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `siap`.`t_casillero_estudiante` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `estudiante` INT(11) NOT NULL,
  `casillero` INT(11) NOT NULL,
  `hora_entrada` TIME NOT NULL,
  `hora_salida` TIME NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_casillero_estudiante_estudiante_idx` (`estudiante` ASC) VISIBLE,
  INDEX `fk_casillero_estudiante_casillero_idx` (`casillero` ASC) VISIBLE,
  CONSTRAINT `fk_casillero_estudiante_casillero`
    FOREIGN KEY (`casillero`)
    REFERENCES `siap`.`t_casillero` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_casillero_estudiante_estudiante`
    FOREIGN KEY (`estudiante`)
    REFERENCES `siap`.`t_estudiante` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `siap`.`t_conductas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `siap`.`t_conductas` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `estudiante` INT(11) NOT NULL,
  `texto` VARCHAR(300) NOT NULL,
  `strike` INT(11) NULL DEFAULT '1',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `tipo` VARCHAR(45) NULL DEFAULT 'Eventualidad',
  PRIMARY KEY (`id`),
  INDEX `fk_estudiante_t_estudiante_idx` (`estudiante` ASC) VISIBLE,
  CONSTRAINT `fk_estudiante_t_estudiante`
    FOREIGN KEY (`estudiante`)
    REFERENCES `siap`.`t_estudiante` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `siap`.`t_documento_usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `siap`.`t_documento_usuario` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `tipo_documento` INT(11) NOT NULL,
  `documento` VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `usuario` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_t_documento_usuario_usuario_idx` (`usuario` ASC) VISIBLE,
  CONSTRAINT `fk_t_documento_usuario_t_usuario`
    FOREIGN KEY (`usuario`)
    REFERENCES `siap`.`t_usuario` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `siap`.`t_matricula`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `siap`.`t_matricula` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `grupo` INT(11) NOT NULL,
  `estudiante` INT(11) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `activa` TINYINT(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  INDEX `fk_t_matricula_t_taller1_idx` (`grupo` ASC) VISIBLE,
  INDEX `fk_t_matricula_t_estudiante_idx` (`estudiante` ASC) VISIBLE,
  CONSTRAINT `fk_t_matricula_t_estudiante`
    FOREIGN KEY (`estudiante`)
    REFERENCES `siap`.`t_estudiante` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_t_matricula_t_taller1`
    FOREIGN KEY (`grupo`)
    REFERENCES `siap`.`t_grupo` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `siap`.`t_matricula_reporte`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `siap`.`t_matricula_reporte` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `grupo` VARCHAR(255) NOT NULL,
  `estudiante` VARCHAR(45) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `accion` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `siap`.`t_padecimiento`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `siap`.`t_padecimiento` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `descripcion` VARCHAR(255) NOT NULL,
  `estudiante` INT(11) NOT NULL,
  `observaciones` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_t_padecimiento_t_estudiante_idx` (`estudiante` ASC) VISIBLE,
  CONSTRAINT `fk_t_padecimiento_t_estudiante`
    FOREIGN KEY (`estudiante`)
    REFERENCES `siap`.`t_estudiante` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `siap`.`t_pago`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `siap`.`t_pago` (
  `id` INT(11) NOT NULL,
  `fecha` DATE NOT NULL,
  `monto` INT(11) NOT NULL,
  `estudiante` INT(11) NOT NULL,
  `documento` VARCHAR(55) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_t_pago_t_estudiante_idx` (`estudiante` ASC) VISIBLE,
  CONSTRAINT `fk_t_pago_t_estudiante`
    FOREIGN KEY (`estudiante`)
    REFERENCES `siap`.`t_estudiante` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `siap`.`t_profesor_asistencia`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `siap`.`t_profesor_asistencia` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `estado` VARCHAR(15) NOT NULL,
  `fecha` VARCHAR(30) NOT NULL,
  `profesor` INT(11) NOT NULL,
  `grupo` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_t_profesor_t_profesor_idx` (`profesor` ASC) VISIBLE,
  INDEX `fk_t_asistencia_t_grupo2_idx` (`grupo` ASC) VISIBLE,
  CONSTRAINT `fk_t_asistencia_t_grupo2`
    FOREIGN KEY (`grupo`)
    REFERENCES `siap`.`t_grupo` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_t_profesor_t_profesor`
    FOREIGN KEY (`profesor`)
    REFERENCES `siap`.`t_profesor` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `siap`.`t_profesor_reposicion`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `siap`.`t_profesor_reposicion` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `profesor_origen` INT(11) NOT NULL,
  `profesor_reposicion` INT(11) NOT NULL,
  `fecha_reposicion` VARCHAR(30) NOT NULL,
  `grupo` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_t_profesor_t_profesor1_idx` (`profesor_origen` ASC) VISIBLE,
  INDEX `fk_t_profesor_t_profesor2_idx` (`profesor_reposicion` ASC) VISIBLE,
  INDEX `fk_t_reposicion_t_grupo2_idx` (`grupo` ASC) VISIBLE,
  CONSTRAINT `fk_t_profesor_reposicion_t_grupo2`
    FOREIGN KEY (`grupo`)
    REFERENCES `siap`.`t_grupo` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_t_profesor_reposicion_t_profesor1`
    FOREIGN KEY (`profesor_origen`)
    REFERENCES `siap`.`t_profesor` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_t_profesor_reposicion_t_profesor2`
    FOREIGN KEY (`profesor_reposicion`)
    REFERENCES `siap`.`t_profesor` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `siap`.`t_reposicion`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `siap`.`t_reposicion` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `estudiante` INT(11) NOT NULL,
  `grupo_reposicion` INT(11) NOT NULL,
  `fecha_reposicion` DATE NOT NULL,
  `comprobante` VARCHAR(100) NOT NULL,
  `observacion` VARCHAR(255) NOT NULL,
  `estado` INT(2) NOT NULL DEFAULT '0' COMMENT '0 = no aceptada, 1 = aceptada',
  PRIMARY KEY (`id`),
  INDEX `fk_t_reposicion_t_grupo1_idx` (`grupo_reposicion` ASC) VISIBLE,
  INDEX `fk_t_reposicion_t_estudiante_idx` (`estudiante` ASC) VISIBLE,
  CONSTRAINT `fk_t_reposicion_t_estudiante`
    FOREIGN KEY (`estudiante`)
    REFERENCES `siap`.`t_estudiante` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_t_reposicion_t_grupo1`
    FOREIGN KEY (`grupo_reposicion`)
    REFERENCES `siap`.`t_grupo` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `siap`.`t_rutina`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `siap`.`t_rutina` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `profesor` INT(11) NOT NULL,
  `grupo` INT(11) NOT NULL,
  `texto` VARCHAR(500) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `fk_profesor_rutina_idx` (`profesor` ASC) VISIBLE,
  INDEX `fk_grupo_rutina_idx` (`grupo` ASC) VISIBLE,
  CONSTRAINT `fk_grupo_rutina`
    FOREIGN KEY (`grupo`)
    REFERENCES `siap`.`t_grupo` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_profesor_rutina`
    FOREIGN KEY (`profesor`)
    REFERENCES `siap`.`t_profesor` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `siap`.`t_usuario_temp`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `siap`.`t_usuario_temp` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `cedula` VARCHAR(45) NOT NULL,
  `foto` VARCHAR(100) NULL DEFAULT NULL,
  `nombre` VARCHAR(55) NOT NULL,
  `apellido` VARCHAR(100) NOT NULL,
  `nacimiento` DATE NOT NULL,
  `usuario` VARCHAR(45) NOT NULL,
  `clave` VARCHAR(45) NOT NULL,
  `sexo` VARCHAR(45) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `tipo_usuario` VARCHAR(45) NOT NULL,
  `estado` INT(11) NULL DEFAULT '0',
  `correo` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `cedula_UNIQUE` (`cedula` ASC) VISIBLE,
  UNIQUE INDEX `correo_UNIQUE` (`correo` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;

USE `siap` ;

-- -----------------------------------------------------
-- Placeholder table for view `siap`.`vta_admin_estudiante`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `siap`.`vta_admin_estudiante` (`id` INT, `cedula` INT, `foto` INT, `apellido` INT, `nombre` INT, `nacimiento` INT, `usuario` INT, `sexo` INT, `correo` INT, `id_estudiante` INT, `celular` INT, `telefono` INT, `nivel` INT, `descripcion` INT, `carrera_departamento` INT, `cantidad_dias` INT, `telefono_emergencia` INT, `provincia` INT, `canton` INT, `distrito` INT, `direccion` INT, `moroso` INT, `estado` INT, `notas` INT, `prematricula` INT, `motivo_ingreso` INT, `tipo` INT);

-- -----------------------------------------------------
-- Placeholder table for view `siap`.`vta_administradores`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `siap`.`vta_administradores` (`id` INT, `cedula` INT, `foto` INT, `nombre` INT, `apellido` INT, `nacimiento` INT, `usuario` INT, `sexo` INT, `correo` INT, `clave` INT, `id_administrativo` INT, `rol` INT);

-- -----------------------------------------------------
-- Placeholder table for view `siap`.`vta_anotaciones`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `siap`.`vta_anotaciones` (`id_anotaciones` INT, `nota` INT, `id_profesor` INT, `created_at` INT, `updated_at` INT, `cedula_profesor` INT, `apellido_profesor` INT, `nombre_profesor` INT, `id_estudiante` INT, `cedula_estudiante` INT, `apellido_estudiante` INT, `nombre_estudiante` INT);

-- -----------------------------------------------------
-- Placeholder table for view `siap`.`vta_asistencia`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `siap`.`vta_asistencia` (`id_asistencia` INT, `fecha` INT, `id_matricula` INT, `id_grupo` INT, `id_taller` INT, `codigo` INT, `id_estudiante` INT, `foto` INT, `id_usuario` INT, `cedula` INT, `apellido` INT, `nombre` INT, `estado` INT);

-- -----------------------------------------------------
-- Placeholder table for view `siap`.`vta_asistencia_admin`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `siap`.`vta_asistencia_admin` (`id_asistencia` INT, `fecha` INT, `id_matricula` INT, `id_grupo` INT, `id_taller` INT, `codigo` INT, `id_estudiante` INT, `foto` INT, `id_usuario` INT, `cedula` INT, `apellido` INT, `nombre` INT, `estado` INT, `profesor` INT);

-- -----------------------------------------------------
-- Placeholder table for view `siap`.`vta_cantidad_usuarios_registrados`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `siap`.`vta_cantidad_usuarios_registrados` (`cantidad` INT);

-- -----------------------------------------------------
-- Placeholder table for view `siap`.`vta_casilleros`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `siap`.`vta_casilleros` (`id_casillero` INT, `codigo_casillero` INT, `id_reserva` INT, `id_estudiante` INT, `id_usuario` INT, `cedula` INT, `hora_entrada` INT, `hora_salida` INT);

-- -----------------------------------------------------
-- Placeholder table for view `siap`.`vta_cliente_estudiante`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `siap`.`vta_cliente_estudiante` (`id` INT, `cedula` INT, `foto` INT, `apellido` INT, `nombre` INT, `correo` INT, `nacimiento` INT, `usuario` INT, `sexo` INT, `id_estudiante` INT, `celular` INT, `telefono` INT, `nivel` INT, `carrera_departamento` INT, `cantidad_dias` INT, `telefono_emergencia` INT, `provincia` INT, `canton` INT, `distrito` INT, `direccion` INT, `tipo` INT, `moroso` INT, `motivo_ingreso` INT, `estado` INT, `clave` INT);

-- -----------------------------------------------------
-- Placeholder table for view `siap`.`vta_conductas`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `siap`.`vta_conductas` (`id_conducta` INT, `texto` INT, `strike` INT, `tipo` INT, `created_at` INT, `id_estudiante` INT, `estado` INT, `foto` INT, `cedula` INT, `apellido` INT, `nombre` INT);

-- -----------------------------------------------------
-- Placeholder table for view `siap`.`vta_documentos_usuarios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `siap`.`vta_documentos_usuarios` (`id_documento` INT, `tipo_documento` INT, `documento` INT, `created_at` INT, `updated_at` INT, `id_estudiante` INT, `id_usuario` INT, `cedula` INT);

-- -----------------------------------------------------
-- Placeholder table for view `siap`.`vta_estadistica`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `siap`.`vta_estadistica` (`cantidad_talleres` INT, `cantidad_grupos` INT, `cantidad_matriculados` INT, `cantidad_estudiantes` INT, `cantidad_administrativos` INT, `cantidad_profesores` INT, `cantidad_usuarios` INT, `cantidad_usuarios_temp` INT, `cantidad_horarios` INT);

-- -----------------------------------------------------
-- Placeholder table for view `siap`.`vta_estudiante_moroso`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `siap`.`vta_estudiante_moroso` (`id` INT, `cedula` INT, `foto` INT, `apellido` INT, `nombre` INT, `correo` INT, `nacimiento` INT, `usuario` INT, `sexo` INT, `id_estudiante` INT, `celular` INT, `telefono` INT, `nivel` INT, `carrera_departamento` INT, `cantidad_dias` INT, `telefono_emergencia` INT, `provincia` INT, `pago` INT, `canton` INT, `distrito` INT, `direccion` INT, `tipo` INT, `moroso` INT, `motivo_ingreso` INT, `estado` INT, `clave` INT);

-- -----------------------------------------------------
-- Placeholder table for view `siap`.`vta_grupos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `siap`.`vta_grupos` (`codigo_taller` INT, `costo` INT, `costo_funcionario` INT, `nivel` INT, `descripcion` INT, `id_taller` INT, `id_grupo` INT, `cupo_base` INT, `cupo_extra` INT, `cupo_actual` INT, `periodo` INT, `id_horario` INT, `dia` INT, `hora` INT, `apellido` INT, `nombre` INT, `id_profesor` INT, `cedula` INT);

-- -----------------------------------------------------
-- Placeholder table for view `siap`.`vta_matriculados_grupo_detalle`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `siap`.`vta_matriculados_grupo_detalle` (`id_grupo` INT, `id_estudiante` INT, `cedula_estudiante` INT, `correo_estudiante` INT, `carrera_departamento` INT, `apellido_estudiante` INT, `nombre_estudiante` INT, `foto_estudiante` INT, `sexo_estudiante` INT, `celular_estudiante` INT, `telefono_emergencia_estudiante` INT, `nacimiento_estudiante` INT, `id_profesor` INT, `cedula_profesor` INT);

-- -----------------------------------------------------
-- Placeholder table for view `siap`.`vta_matriculados_por_grupo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `siap`.`vta_matriculados_por_grupo` (`codigo_taller` INT, `nivel_taller` INT, `descripcion` INT, `id_grupo` INT, `dia` INT, `hora` INT, `nombre_profesor` INT, `id_matricula` INT, `activa` INT, `created_at` INT, `periodo` INT, `id_estudiante` INT, `id_usuario` INT, `cedula` INT, `apellido` INT, `nombre` INT, `foto` INT, `correo` INT);

-- -----------------------------------------------------
-- Placeholder table for view `siap`.`vta_padecimientos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `siap`.`vta_padecimientos` (`id_usuario` INT, `cedula` INT, `id_estudiante` INT, `apellido` INT, `nombre` INT, `id_padecimiento` INT, `descripcion` INT, `observaciones` INT);

-- -----------------------------------------------------
-- Placeholder table for view `siap`.`vta_profesor_asistencias`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `siap`.`vta_profesor_asistencias` (`id_profesor_asistencia` INT, `estado` INT, `fecha` INT, `id_profesor` INT, `id_usuario` INT, `cedula` INT, `nombre` INT, `apellido` INT, `id_grupo` INT);

-- -----------------------------------------------------
-- Placeholder table for view `siap`.`vta_profesor_reposiciones`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `siap`.`vta_profesor_reposiciones` (`id_reposicion` INT, `id_profesor_origen` INT, `id_usuario_origen` INT, `cedula_origen` INT, `nombre_origen` INT, `apellido_origen` INT, `id_profesor_reposicion` INT, `id_usuario_reposicion` INT, `cedula_reposicion` INT, `nombre_reposicion` INT, `apellido_reposicion` INT, `fecha_reposicion` INT, `id_grupo` INT, `id_horario` INT, `dia` INT, `hora` INT, `id_taller` INT, `codigo_taller` INT, `nivel` INT, `descripcion` INT, `cupo_base` INT, `cupo_extra` INT, `cupo_actual` INT, `periodo` INT);

-- -----------------------------------------------------
-- Placeholder table for view `siap`.`vta_profesores`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `siap`.`vta_profesores` (`id_usuario` INT, `cedula` INT, `apellido` INT, `nombre` INT, `nacimiento` INT, `usuario` INT, `sexo` INT, `clave` INT, `foto` INT, `correo` INT, `id_profesor` INT, `rol` INT);

-- -----------------------------------------------------
-- Placeholder table for view `siap`.`vta_reposiciones`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `siap`.`vta_reposiciones` (`id_reposicion` INT, `grupo_reposicion` INT, `fecha_reposicion` INT, `dia_reposicion` INT, `hora_reposicion` INT, `comprobante` INT, `observacion` INT, `estado` INT, `descripcion` INT, `id_estudiante` INT, `nivel` INT, `id_usuario` INT, `cedula` INT, `nombre` INT, `apellido` INT);

-- -----------------------------------------------------
-- Placeholder table for view `siap`.`vta_usuario_temp`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `siap`.`vta_usuario_temp` (`id` INT, `cedula` INT, `foto` INT, `nombre` INT, `apellido` INT, `nacimiento` INT, `usuario` INT, `sexo` INT, `tipo_usuario` INT, `creado` INT, `estado` INT, `correo` INT);

-- -----------------------------------------------------
-- Placeholder table for view `siap`.`vta_usuario_temp_admin`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `siap`.`vta_usuario_temp_admin` (`id` INT, `cedula` INT, `foto` INT, `nombre` INT, `apellido` INT, `nacimiento` INT, `usuario` INT, `clave` INT, `sexo` INT, `tipo_usuario` INT, `creado` INT, `estado` INT);

-- -----------------------------------------------------
-- function fd_hora_minuto_segundo_actuales
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `fd_hora_minuto_segundo_actuales`() RETURNS time
    DETERMINISTIC
begin
		declare vli_hora int(2);
        declare vli_minuto int(2);
        declare vli_segundo int(2);
        declare vls_hora_actual varchar(45);
        select hour(sysdate())
        into vli_hora;
        select minute(sysdate())
        into vli_minuto;
        select second(sysdate())
        into vli_segundo;
        set vls_hora_actual = concat(cast(vli_hora as char),':',cast(vli_minuto as char),':',cast(vli_segundo as char));
        return cast(vls_hora_actual as time);
end$$

DELIMITER ;

-- -----------------------------------------------------
-- function fi_cantidad_administrativos
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` FUNCTION `fi_cantidad_administrativos`() RETURNS int(11)
    DETERMINISTIC
begin
	declare vli_cantidad int default 0;
    select count(*) as cantidad
    into vli_cantidad
    from vta_administradores;
    return vli_cantidad;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- function fi_cantidad_asistencias_estudiante_grupo
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` FUNCTION `fi_cantidad_asistencias_estudiante_grupo`(vps_cedula varchar(11), vpi_grupo int) RETURNS int(11)
    DETERMINISTIC
begin
	declare vli_cantidad int default 0;
    select count(*)
    into vli_cantidad
    from vta_asistencia
    where cedula = vps_cedula
    and id_grupo = vpi_grupo
    and estado = 1;
    return vli_cantidad;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- function fi_cantidad_ausencias_estudiante_grupo
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` FUNCTION `fi_cantidad_ausencias_estudiante_grupo`(vps_cedula varchar(11), vpi_grupo int) RETURNS int(11)
    DETERMINISTIC
begin
	declare vli_cantidad int default 0;
    select count(*)
    into vli_cantidad
    from vta_asistencia
    where cedula = vps_cedula
    and id_grupo = vpi_grupo
    and estado = 0;
    return vli_cantidad;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- function fi_cantidad_estudiantes
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` FUNCTION `fi_cantidad_estudiantes`() RETURNS int(11)
    DETERMINISTIC
begin
	declare vli_cantidad int default 0;
    select count(*)
    into vli_cantidad
    from vta_cliente_estudiante;
    return vli_cantidad;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- function fi_cantidad_grupos
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` FUNCTION `fi_cantidad_grupos`() RETURNS int(11)
    DETERMINISTIC
begin
	declare vli_cantidad int default 0;
    select count(*)
    into vli_cantidad
    from vta_grupos;
    return vli_cantidad;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- function fi_cantidad_horarios
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` FUNCTION `fi_cantidad_horarios`() RETURNS int(11)
    DETERMINISTIC
begin
	declare vli_cantidad int default 0;
    select count(*)
    into vli_cantidad
    from t_horario;
    return vli_cantidad;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- function fi_cantidad_matriculados
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` FUNCTION `fi_cantidad_matriculados`() RETURNS int(11)
    DETERMINISTIC
begin
	declare vli_cantidad int default 0;
    select count(*)
    into vli_cantidad
    from t_matricula;
    return vli_cantidad;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- function fi_cantidad_matriculados_en_grupo
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` FUNCTION `fi_cantidad_matriculados_en_grupo`(vpi_id_grupo int) RETURNS int(11)
    DETERMINISTIC
begin
	declare vli_cuenta int default 0;
    select count(*)
    into vli_cuenta
    from vta_matriculados_por_grupo
    where id_grupo = vpi_id_grupo;
    return vli_cuenta;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- function fi_cantidad_profesores
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` FUNCTION `fi_cantidad_profesores`() RETURNS int(11)
    DETERMINISTIC
begin
	declare vli_cantidad int default 0;
    select count(*)
    into vli_cantidad
    from vta_profesores;
    return vli_cantidad;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- function fi_cantidad_talleres
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` FUNCTION `fi_cantidad_talleres`() RETURNS int(11)
    DETERMINISTIC
begin
	declare vli_cantidad int default 0;
    select count(*)
    into vli_cantidad
    from t_taller;
    return vli_cantidad;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- function fi_cantidad_usuarios
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` FUNCTION `fi_cantidad_usuarios`() RETURNS int(11)
    DETERMINISTIC
begin
	declare vli_cantidad int default 0;
    select count(*)
    into vli_cantidad
    from t_usuario;
    return vli_cantidad;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- function fi_cantidad_usuarios_temp
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` FUNCTION `fi_cantidad_usuarios_temp`() RETURNS int(11)
    DETERMINISTIC
begin
	declare vli_cantidad int default 0;
    select count(*)
    into vli_cantidad
    from t_usuario_temp;
    return vli_cantidad;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- function fi_cupo_disponible_grupo
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` FUNCTION `fi_cupo_disponible_grupo`(vpi_id_grupo int) RETURNS int(11)
    DETERMINISTIC
begin
	declare vli_cupo_maximo int;
    declare vli_matriculados int;
    select fi_cantidad_matriculados_en_grupo(vpi_id_grupo)
    into vli_matriculados;
    select nvl(cupo_base,0)
    into vli_cupo_maximo
    from vta_grupos
    where id_grupo = vpi_id_grupo;
    return (vli_cupo_maximo - vli_matriculados);
end$$

DELIMITER ;

-- -----------------------------------------------------
-- function fi_cupos_reposicion_restantes_grupo_fecha
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` FUNCTION `fi_cupos_reposicion_restantes_grupo_fecha`(vpi_id_grupo int, vpd_fecha timestamp) RETURNS int(11)
    DETERMINISTIC
begin
	declare vli_cuenta int default 0;
    declare vli_cupo_maximo int default 0;
    select cupo_extra into vli_cupo_maximo
	from t_grupo where id = vpi_id_grupo;
    select count(*) into vli_cuenta
    from vta_reposiciones_reservadas
    where id_grupo = vpi_id_grupo
    and fecha = vpd_fecha;
    return vli_cupo_maximo - vli_cuenta;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- function fi_id_administrativo_por_cedula
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` FUNCTION `fi_id_administrativo_por_cedula`(vps_cedula varchar(45)) RETURNS int(11)
    DETERMINISTIC
begin
	declare vli_id_adm int default 0;
    select id_administrativo
    into vli_id_adm
    from vta_administradores
    where cedula = vps_cedula;
    return vli_id_adm;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- function fi_id_casillero_casilleroEstudiante_por_id
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `fi_id_casillero_casilleroEstudiante_por_id`(vps_id int) RETURNS int(11)
BEGIN
declare vli_id_casillero int default 0;
    select codigo_casillero
    into vli_id_casillero
    from vta_casilleros
    where id_casillero = vps_id;
    return vli_id_casillero;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- function fi_id_casillero_por_codigo
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` FUNCTION `fi_id_casillero_por_codigo`(vps_codigo varchar(45)) RETURNS int(11)
    DETERMINISTIC
begin
	declare vli_id_casillero int default 0;
    select id
    into vli_id_casillero
    from t_casillero
    where codigo = vps_codigo;
    return vli_id_casillero;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- function fi_id_estudiante_por_cedula
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` FUNCTION `fi_id_estudiante_por_cedula`(vps_cedula varchar(45)) RETURNS int(11)
    DETERMINISTIC
begin
	declare vli_id_est int default 0;
    select id_estudiante
    into vli_id_est
    from vta_cliente_estudiante
    where cedula = vps_cedula;
    return vli_id_est;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- function fi_verificar_casillero_vacante
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `fi_verificar_casillero_vacante`(vps_casillero varchar(45)) RETURNS int(1)
    DETERMINISTIC
begin
		declare vli_id_casillero int;
		declare vli_casillero_vacante int(1);
		declare vli_cuenta_reserva_casillero int default 0;
		declare vld_hora_entrada time;
        declare vld_hora_salida time;
		select fi_id_casillero_por_codigo(vps_casillero)
        into vli_id_casillero;
        select count(id) 
        into vli_cuenta_reserva_casillero
        from t_casillero_estudiante
        where casillero = vli_id_casillero;
        if vli_cuenta_reserva_casillero = 0 then
			set vli_casillero_vacante = 1;
		else
			select max(hora_entrada)
			into vld_hora_entrada
			from t_casillero_estudiante
			where casillero = vli_id_casillero;
			select max(hora_salida)
			into vld_hora_salida
			from t_casillero_estudiante
			where casillero = vli_id_casillero;
            if fd_hora_minuto_segundo_actuales() > vld_hora_salida then
				set vli_casillero_vacante = 1;
			else
				if fd_hora_minuto_segundo_actuales() > vld_hora_entrada then
					set vli_casillero_vacante = 0;
				else
					set vli_casillero_vacante = 1; /*Si la hora actual es anterior al inicio de la última reserva registrada se toma por defecto como vacante*/
				end if;
            end if;
        end if;
        return vli_casillero_vacante;
	end$$

DELIMITER ;

-- -----------------------------------------------------
-- function fi_verificar_usuario_es_administrativo
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` FUNCTION `fi_verificar_usuario_es_administrativo`(vps_cedula varchar(45)) RETURNS int(11)
    DETERMINISTIC
begin
	declare vli_admin_encontrado int;
    select count(cedula)
    into vli_admin_encontrado
    from vta_administradores
    where cedula = vps_cedula;
    if(vli_admin_encontrado = 1) then 
		return 1;
    else 
		return 0;
	end if;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- function fi_verificar_usuario_es_estudiante
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` FUNCTION `fi_verificar_usuario_es_estudiante`(vps_cedula varchar(45)) RETURNS int(11)
    DETERMINISTIC
begin
	declare vli_estudiante_encontrado int;
    select count(cedula)
    into vli_estudiante_encontrado
    from vta_cliente_estudiante
    where cedula = vps_cedula;
    if(vli_estudiante_encontrado = 1) then 
		return 1;
    else 
		return 0;
	end if;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- function fi_verificar_usuario_es_profesor
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` FUNCTION `fi_verificar_usuario_es_profesor`(vps_cedula varchar(45)) RETURNS int(11)
    DETERMINISTIC
begin
	declare vli_profe_encontrado int;
    select count(cedula)
    into vli_profe_encontrado
    from vta_profesores
    where cedula = vps_cedula;
    if(vli_profe_encontrado = 1) then 
		return 1;
    else 
		return 0;
	end if;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- function fs_cedula_estudiante_por_id
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`root`@`localhost` FUNCTION `fs_cedula_estudiante_por_id`(vpi_id int(11)) RETURNS varchar(45) CHARSET latin1
BEGIN
	declare vls_ced_est varchar(45) default 0;
    select cedula
    into vls_ced_est
    from vta_cliente_estudiante
    where id_estudiante = vpi_id;
    return vls_ced_est;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_actualizar_activa_matricula
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_actualizar_activa_matricula`(in vpi_id int,in vpi_activa int)
begin
	update t_matricula set activa = vpi_activa
    where id = vpi_activa;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_actualizar_apellido_usuario
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_actualizar_apellido_usuario`(in vps_cedula varchar(45), in vps_apellido varchar(100))
begin 
	update t_usuario set apellido = vps_apellido
    where cedula = vps_cedula;
    call prc_actualizar_updated_at_usuario(vps_cedula);
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_actualizar_cantidad_dias_estudiante
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_actualizar_cantidad_dias_estudiante`(in vps_cedula varchar(45),in vpi_cantidad_dias int)
begin
	update t_estudiante set cantidad_dias = vpi_cantidad_dias
    where id = fi_id_estudiante_por_cedula(vps_cedula);
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_actualizar_canton_estudiante
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_actualizar_canton_estudiante`(in vps_cedula varchar(45),in vps_canton varchar(50))
begin
	update t_estudiante set canton = vps_canton
    where id = fi_id_estudiante_por_cedula(vps_cedula);
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_actualizar_carrera_departamento_estudiante
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_actualizar_carrera_departamento_estudiante`(in vps_cedula varchar(45),in vps_carrera_departamento varchar(100))
begin
	update t_estudiante set carrera_departamento = vps_carrera_departamento
    where id = fi_id_estudiante_por_cedula(vps_cedula);
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_actualizar_cedula_usuario
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_actualizar_cedula_usuario`(in vps_cedula_actual varchar(45), in vps_cedula_nueva varchar(45))
begin
	update t_usuario set cedula = vps_cedula_nueva
    where cedula = vps_cedula_actual;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_actualizar_celular_estudiante
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_actualizar_celular_estudiante`(in vps_cedula varchar(45),in vps_celular varchar(10))
begin
	update t_estudiante set celular = vps_celular
    where id = fi_id_estudiante_por_cedula(vps_cedula);
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_actualizar_clave_sha1_usuario
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_actualizar_clave_sha1_usuario`(in vps_cedula varchar(45), in vps_clave varchar(45))
begin 
	update t_usuario set clave = sha1(vps_clave)
    where cedula = vps_cedula;
    call prc_actualizar_updated_at_usuario(vps_cedula);
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_actualizar_clave_usuario
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_actualizar_clave_usuario`(in vps_cedula varchar(45), in vps_clave varchar(45))
begin 
	update t_usuario set clave = vps_clave
    where cedula = vps_cedula;
    call prc_actualizar_updated_at_usuario(vps_cedula);
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_actualizar_codigo_taller
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_actualizar_codigo_taller`(in vpi_id int,in vps_codigo varchar(45))
begin 
	update t_taller
    set codigo = vps_codigo
    where id = vpi_id;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_actualizar_comprobante_reposicion
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_actualizar_comprobante_reposicion`(in vpi_id int, in vps_comprobante varchar(100))
begin
	update t_reposicion set comprobante = vps_comprobante 
    where id = vpi_id;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_actualizar_consentimiento_estudiante
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_actualizar_consentimiento_estudiante`(in vps_cedula varchar(45), in vpi_consentimiento tinyint)
begin
	update t_estudiante set consentimiento = vpi_consentimiento
    where id = fi_id_estudiante_por_cedula(vps_cedula);
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_actualizar_correo_usuario
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_actualizar_correo_usuario`(in vps_cedula varchar(45),in vps_correo varchar(45))
begin
	update t_usuario set correo = vps_correo
    where cedula = vps_cedula;
    call prc_actualizar_updated_at_usuario(vps_cedula);
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_actualizar_costo_funcionario_taller
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_actualizar_costo_funcionario_taller`(in vpi_id int,in vpi_costo_funcionario int)
begin 
	update t_taller
    set costo_funcionario = vpi_costo_funcionario
    where id = vpi_id;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_actualizar_costo_taller
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_actualizar_costo_taller`(in vpi_id int,in vpi_costo int)
begin 
	update t_taller
    set costo = vpi_costo
    where id = vpi_id;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_actualizar_cupo_base_grupo
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_actualizar_cupo_base_grupo`(in vpi_id int, in vpi_cupo_base int)
begin
	update t_grupo set cupo_base = vpi_cupo_base
    where id = vpi_id;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_actualizar_datos_cliente_estudiante
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_actualizar_datos_cliente_estudiante`(
	in vps_cedula varchar(45),
    in vps_correo varchar(85),
	in vps_celular varchar(10),
	in vps_telefono varchar(10), 
	in vps_telefono_emergencia varchar(150), 
	in vps_carrera_departamento varchar(100),
	in vps_provincia varchar(11), 
	in vps_canton varchar(50), 
	in vps_distrito varchar(60),
	in vps_direccion varchar(255)
 )
begin 
	call prc_actualizar_correo_usuario(vps_cedula, vps_correo);
    call prc_actualizar_celular_estudiante(vps_cedula, vps_celular);
    call prc_actualizar_telefono_estudiante(vps_cedula, vps_telefono);
	call prc_actualizar_telefono_emergencia_estudiante(vps_cedula, vps_telefono_emergencia);
    call prc_actualizar_carrera_departamento_estudiante(vps_cedula, vps_carrera_departamento);
    call prc_actualizar_provincia_estudiante(vps_cedula, vps_provincia);
    call prc_actualizar_canton_estudiante(vps_cedula, vps_canton);
    call prc_actualizar_distrito_estudiante(vps_cedula, vps_distrito);
    call prc_actualizar_direccion_estudiante(vps_cedula, vps_direccion);
 end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_actualizar_datos_estudiante
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_actualizar_datos_estudiante`(
	in vps_cedula varchar(45), 
	in vps_celular varchar(10),
	in vps_telefono varchar(10), 
	in vpi_nivel int, 
	in vps_carrera_departamento varchar(100),
	in vpi_cantidad_dias int, 
	in vps_telefono_emergencia varchar(150), 
	in vps_notas varchar(255),
	in vps_provincia varchar(11), 
	in vps_canton varchar(50), 
	in vps_distrito varchar(60),
	in vps_direccion varchar(255), 
	in vpd_prematricula date, 
	in vpi_moroso int, in vpi_estado int
 )
begin 
    call prc_actualizar_celular_estudiante(vps_cedula, vps_celular);
    call prc_actualizar_telefono_estudiante(vps_cedula, vps_telefono);
    call prc_actualizar_nivel_estudiante(vps_cedula, vpi_nivel);
    call prc_actualizar_carrera_departamento_estudiante(vps_cedula, vps_carrera_departamento);
    call prc_actualizar_cantidad_dias_estudiante(vps_cedula, vpi_cantidad_dias);
    call prc_actualizar_telefono_emergencia_estudiante(vps_cedula, vps_telefono_emergencia);
    call prc_actualizar_notas_estudiante(vps_cedula, vps_notas);
    call prc_actualizar_provincia_estudiante(vps_cedula, vps_provincia);
    call prc_actualizar_canton_estudiante(vps_cedula, vps_canton);
    call prc_actualizar_distrito_estudiante(vps_cedula, vps_distrito);
    call prc_actualizar_direccion_estudiante(vps_cedula, vps_direccion);
    call prc_actualizar_prematricula_estudiante(vps_cedula, vpd_prematricula);
    call prc_actualizar_moroso_estudiante(vps_cedula, vpi_moroso);
    call prc_actualizar_estado_estudiante(vps_cedula, vpi_estado);
 end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_actualizar_datos_estudiante_admin
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_actualizar_datos_estudiante_admin`(
	in vps_cedula varchar(45),
    in vps_correo varchar(85),
    in vps_usuario varchar(85),
	in vps_celular varchar(10),
	in vps_telefono varchar(10), 
	in vps_telefono_emergencia varchar(10), 
	in vps_carrera_departamento varchar(100),
	in vps_direccion varchar(255), 
	in vps_sexo varchar(50), 
	in vps_perfil varchar(60),
	in vps_nacimiento date
 )
begin 
	update t_usuario 
    set correo = vps_correo, sexo = vps_sexo, usuario = vps_usuario, nacimiento = vps_nacimiento 
    where cedula = vps_cedula;
    
    update t_estudiante 
    set direccion = vps_direccion, telefono = vps_telefono, celular = vps_celular, 
    telefono_emergencia = vps_telefono_emergencia, carrera_departamento = vps_carrera_departamento, tipo = vps_perfil 
    where id = fi_id_estudiante_por_cedula(vps_cedula);
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_actualizar_datos_reposicion
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_actualizar_datos_reposicion`(in vpi_id int, in vpi_grupo_origen int, in vpi_grupo_reposicion int, in vpd_fecha_reposicion date, in vps_comprobante varchar(100), in vpi_estado int)
begin
	call prc_actualizar_grupo_origen_reposicion(vpi_id,vpi_grupo_origen);
    call prc_actualizar_grupo_destino_reposicion(vpi_id,vpi_grupo_reposicion);
    call prc_actualizar_fecha_reposicion_reposicion(vpi_id,vpd_fecha_reposicion);
    call prc_actualizar_comprobante_reposicion(vpi_id, vps_comprobante);
    call prc_actualizar_estado_reposicion(vpi_id, vpi_estado);
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_actualizar_datos_taller
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_actualizar_datos_taller`(in vpi_id int, in vps_codigo varchar(45),
 in vps_descripcion varchar(255), in vpi_nivel int, in vpi_costo int)
begin 
	call prc_actualizar_codigo_taller(vpi_id, vps_codigo);
    call prc_actualizar_descripcion_taller(vpi_id, vps_descripcion);
    call prc_actualizar_nivel_taller(vpi_id, vpi_nivel);
    call prc_actualizar_costo_taller(vpi_id, vpi_costo);
 end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_actualizar_datos_usuario
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_actualizar_datos_usuario`(in vps_cedula varchar(45), in vps_foto varchar(100), in vps_nombre varchar(55), in vps_apellido varchar(100),
in vpd_nacimiento date, in vps_usuario varchar(45), in vps_clave varchar(45), in vps_sexo varchar(45),in vps_correo varchar(45))
begin 
	call prc_actualizar_foto_usuario(vps_cedula, vps_foto);
    call prc_actualizar_nombre_usuario(vps_cedula, vps_nombre);
    call prc_actualizar_apellido_usuario(vps_cedula, vps_apellido);
    call prc_actualizar_nacimiento_usuario(vps_cedula, vpd_nacimiento);
    call prc_actualizar_usuario_usuario(vps_cedula, vps_usuario);
    call prc_actualizar_clave_sha1_usuario(vps_cedula, vps_clave);
    call prc_actualizar_sexo_usuario(vps_cedula, vps_sexo);
    call prc_actualizar_correo_usuario(vps_cedula, vps_correo);
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_actualizar_descripcion_padecimiento
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_actualizar_descripcion_padecimiento`(in vpi_id int, vps_descripcion varchar(255))
begin 
	update t_padecimiento 
    set descripcion = vps_descripcion
    where id = vpi_id;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_actualizar_descripcion_taller
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_actualizar_descripcion_taller`(in vpi_id int,in vps_descripcion varchar(255))
begin 
	update t_taller
    set descripcion = vps_descripcion
    where id = vpi_id;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_actualizar_dia_horario
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_actualizar_dia_horario`(in vpi_id int, in vps_dia varchar(55))
begin 
	update t_horario set dia = vps_dia
    where id = vpi_id;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_actualizar_direccion_estudiante
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_actualizar_direccion_estudiante`(in vps_cedula varchar(45),in vps_direccion varchar(255))
begin
	update t_estudiante set direccion = vps_direccion
    where id = fi_id_estudiante_por_cedula(vps_cedula);
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_actualizar_distrito_estudiante
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_actualizar_distrito_estudiante`(in vps_cedula varchar(45),in vps_distrito varchar(60))
begin
	update t_estudiante set distrito = vps_distrito
    where id = fi_id_estudiante_por_cedula(vps_cedula);
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_actualizar_estado_estudiante
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_actualizar_estado_estudiante`(in vps_cedula varchar(45),in vpi_estado int)
begin
	update t_estudiante set estado = vpi_estado
    where id = fi_id_estudiante_por_cedula(vps_cedula);
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_actualizar_estado_estudiante_temporal
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_actualizar_estado_estudiante_temporal`(in vps_cedula varchar(45),in vpi_estado int)
begin
    call prc_eliminar_usuario_temp(vps_cedula);
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_actualizar_estado_reposicion
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_actualizar_estado_reposicion`(in vpi_id int, in vpi_estado int)
begin
	update t_reposicion
    set estado = vpi_estado
    where id = vpi_id;
 end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_actualizar_estudiante_anotaciones
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_actualizar_estudiante_anotaciones`(in vpi_id int, in vpi_estudiante int)
begin 
	update t_anotaciones set estudiante = vpi_estudiante
    where id = vpi_id;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_actualizar_fecha_reposicion_reposicion
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_actualizar_fecha_reposicion_reposicion`(in vpi_id int, in vpd_fecha_reposicion date)
begin
	update t_reposicion set fecha_reposicion = vpd_fecha_reposicion
    where id = vpi_id;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_actualizar_foto_usuario
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_actualizar_foto_usuario`(in vps_cedula varchar(45),in vps_foto varchar(100))
begin
	update t_usuario set foto = vps_foto
    where cedula = vps_cedula;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_actualizar_grupo
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_actualizar_grupo`(
in vpi_id int, 
in vpi_horario int,
in vpi_profesor int, 
in vpi_taller int,
in vpi_cupobase int,
in vpi_cupoextra int,
in vpi_periodo date
)
begin
	update t_grupo set horario = vpi_horario, profesor = vpi_profesor, taller = vpi_taller, cupo_base = vpi_cupobase, cupo_extra = vpi_cupoextra, periodo = vpi_periodo  
    where id = vpi_id;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_actualizar_grupo_destino_reposicion
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_actualizar_grupo_destino_reposicion`(in vpi_id int, in vpi_grupo_destino int)
begin
	update t_reposicion set grupo_destino = vpi_grupo_destino
    where id = vpi_id;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_actualizar_grupo_origen_reposicion
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_actualizar_grupo_origen_reposicion`(in vpi_id int, in vpi_grupo_origen int)
begin
	update t_reposicion set grupo_origen = vpi_grupo_origen
    where id = vpi_id;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_actualizar_hora_horario
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_actualizar_hora_horario`(in vpi_id int, in vpi_hora int)
begin 
	update t_horario set hora = vpi_hora
    where id = vpi_id;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_actualizar_horario
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_actualizar_horario`(in vpi_id int, in vpi_dia varchar(45), in vpi_hora int)
begin 
	update t_horario set hora = vpi_hora, dia = vpi_dia 
    where id = vpi_id;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_actualizar_horario_grupo
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_actualizar_horario_grupo`(in vpi_id int, in vpi_horario int)
begin
	update t_grupo set horario = vpi_horario
    where id = vpi_id;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_actualizar_matricula_estudiante
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_actualizar_matricula_estudiante`(
in vpi_id_matricula int,
in vpi_estado int
)
begin
	update t_matricula set activa = vpi_estado where id = vpi_id_matricula;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_actualizar_moroso_estudiante
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_actualizar_moroso_estudiante`(in vps_cedula varchar(45),in vpi_moroso int)
begin
	update t_estudiante set moroso = vpi_moroso
    where id = fi_id_estudiante_por_cedula(vps_cedula);
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_actualizar_motivo_ingreso_estudiante
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_actualizar_motivo_ingreso_estudiante`(in vps_cedula varchar(45), in vps_motivo_ingreso varchar(255))
begin
	update t_estudiante set motivo_ingreso = vps_motivo_ingreso
    where id = fi_id_estudiante_por_cedula(vps_cedula);
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_actualizar_nacimiento_usuario
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_actualizar_nacimiento_usuario`(in vps_cedula varchar(45), in vpd_nacimiento date)
begin 
	update t_usuario set nacimiento = vpd_nacimiento
    where cedula = vps_cedula;
    call prc_actualizar_updated_at_usuario(vps_cedula);
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_actualizar_nivel_estudiante
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_actualizar_nivel_estudiante`(in vps_cedula varchar(45),in vpi_nivel int)
begin
	update t_estudiante set nivel = vpi_nivel
    where id = fi_id_estudiante_por_cedula(vps_cedula);
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_actualizar_nivel_taller
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_actualizar_nivel_taller`(in vpi_id int,in vpi_nivel int)
begin 
	update t_taller
    set nivel = vpi_nivel
    where id = vpi_id;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_actualizar_nombre_usuario
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_actualizar_nombre_usuario`(in vps_cedula varchar(45), in vps_nombre varchar(55))
begin 
	update t_usuario set nombre = vps_nombre
    where cedula = vps_cedula;
    call prc_actualizar_updated_at_usuario(vps_cedula);
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_actualizar_nota_anotaciones
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_actualizar_nota_anotaciones`(in vpi_id int, in vps_nota varchar(300))
begin 
	update t_anotaciones set nota = vps_nota
    where id = vpi_id;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_actualizar_notas_estudiante
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_actualizar_notas_estudiante`(in vps_cedula varchar(45),in vps_notas varchar(255))
begin
	update t_estudiante set notas = vps_notas
    where id = fi_id_estudiante_por_cedula(vps_cedula);
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_actualizar_observacion_padecimiento
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_actualizar_observacion_padecimiento`(in vpi_id int, vps_observaciones varchar(255))
begin 
	update t_padecimiento 
    set observaciones = vps_obervaciones
    where id = vpi_id;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_actualizar_prematricula_estudiante
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_actualizar_prematricula_estudiante`(in vps_cedula varchar(45),in vpd_prematricula date)
begin
	update t_estudiante set prematricula = vpd_prematricula
    where id = fi_id_estudiante_por_cedula(vps_cedula);
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_actualizar_profesor_anotaciones
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_actualizar_profesor_anotaciones`(in vpi_id int, in vpi_profesor int)
begin 
	update t_anotaciones set profesor = vpi_profesor
    where id = vpi_id;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_actualizar_profesor_grupo
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_actualizar_profesor_grupo`(in vpi_id int, in vpi_profesor int)
begin
	update t_grupo set profesor = vpi_profesor
    where id = vpi_id;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_actualizar_provincia_estudiante
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_actualizar_provincia_estudiante`(in vps_cedula varchar(45),in vps_provincia varchar(11))
begin
	update t_estudiante set provincia = vps_provincia
    where id = fi_id_estudiante_por_cedula(vps_cedula);
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_actualizar_rol_administrativo
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_actualizar_rol_administrativo`(in vps_cedula varchar(45), in vpi_rol int)
begin
	update t_administrativo 
    set rol = vpi_rol
    where id = fi_id_administrativo_por_cedula(vps_cedula);
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_actualizar_sexo_usuario
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_actualizar_sexo_usuario`(in vps_cedula varchar(45), in vps_sexo varchar(45))
begin 
	update t_usuario set sexo = vps_sexo
    where cedula = vps_cedula;
    call prc_actualizar_updated_at_usuario(vps_cedula);
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_actualizar_taller
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_actualizar_taller`(in vpi_id int, in vpi_descripcion VARCHAR(45),  in vpi_nivel int, in vpi_costo int, in vpi_costof int)
begin
	update t_taller set descripcion = vpi_descripcion, nivel = vpi_nivel, costo = vpi_costo, costo_funcionario = vpi_costof 
    where id = vpi_id;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_actualizar_telefono_emergencia_estudiante
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_actualizar_telefono_emergencia_estudiante`(in vps_cedula varchar(45),in vps_telefono_emergencia varchar(150))
begin
	update t_estudiante set telefono_emergencia = vps_telefono_emergencia
    where id = fi_id_estudiante_por_cedula(vps_cedula);
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_actualizar_telefono_estudiante
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_actualizar_telefono_estudiante`(in vps_cedula varchar(45),in vps_telefono varchar(10))
begin
	update t_estudiante set telefono = vps_telefono
    where id = fi_id_estudiante_por_cedula(vps_cedula);
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_actualizar_updated_at_usuario
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_actualizar_updated_at_usuario`(in vps_cedula varchar(45))
begin
	update t_usuario set updated_at = sysdate()
    where cedula = vps_cedula;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_actualizar_updated_at_usuario_temp
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_actualizar_updated_at_usuario_temp`(in vps_cedula varchar(45))
begin
	update t_usuario_temp set updated_at = sysdate()
    where cedula = vps_cedula;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_actualizar_usuario_usuario
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_actualizar_usuario_usuario`(in vps_cedula varchar(45), in vps_usuario varchar(45))
begin 
	update t_usuario set usuario = vps_usuario
    where cedula = vps_cedula;
    call prc_actualizar_updated_at_usuario(vps_cedula);
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_agregar_actividad
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_agregar_actividad`(in vps_usuario varchar(45),in vps_descripcion varchar(100))
begin
	insert into t_actividad(usuario,descripcion,created_at,updated_at)
    values (vps_usuario, vps_descripcion, sysdate(),sysdate());
    commit;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_cambiar_usuario_temp_a_permanente
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_cambiar_usuario_temp_a_permanente`(IN `vps_cedula` VARCHAR(45))
begin

	declare vls_cedula varchar(45); 

    declare vls_nombre varchar(55);

    declare vls_apellido varchar(100);

    declare vld_nacimiento date;

    declare vls_usuario varchar(45);

    declare vls_clave varchar(45);

    declare vls_sexo varchar(45);

    declare vls_correo varchar(45);
    declare vls_tipo varchar(45);

    declare vli_id int;

    

    select cedula into vls_cedula

		from vta_usuario_temp

		where cedula = vps_cedula;

	select	nombre into vls_nombre

		from vta_usuario_temp

		where cedula = vps_cedula;

	select apellido into vls_apellido

		from vta_usuario_temp

		where cedula = vps_cedula;

    select nacimiento into vld_nacimiento

		from vta_usuario_temp

		where cedula = vps_cedula;    

    select usuario into vls_usuario

		from vta_usuario_temp

		where cedula = vps_cedula;

	select clave into vls_clave

		from vta_usuario_temp_admin 

		where cedula = vps_cedula;

	select sexo into vls_sexo

		from vta_usuario_temp

		where cedula = vps_cedula;

	select correo into vls_correo

		from vta_usuario_temp

        where cedula = vps_cedula;
	select tipo_usuario into vls_tipo
		from vta_usuario_temp
        where cedula = vps_cedula;

        

	call prc_insertar_t_usuario(vls_cedula,vls_nombre,vls_apellido,vld_nacimiento,vls_usuario,vls_clave,vls_sexo,vls_correo);

    call prc_cambiar_usuario_temp_estado(vls_cedula);

    

    select id into vli_id

		from t_usuario 

		where cedula = vps_cedula;

        

    call prc_insertar_estudiante(vli_id,vls_tipo);
    call prc_eliminar_usuario_temp(vls_cedula);

end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_cambiar_usuario_temp_estado
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_cambiar_usuario_temp_estado`(
in vps_cedula varchar(45)
)
BEGIN
	update t_usuario_temp set estado = 1 where cedula = vps_cedula;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_cuenta_repo_aceptada_nivel_gf
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_cuenta_repo_aceptada_nivel_gf`(in vpi_nivel int)
begin
	select count(grupo_reposicion) cuenta, grupo_reposicion,
    fecha_reposicion, nivel, estado
    from vta_reposiciones 
    where nivel = vpi_nivel
    and estado = 1
    and r.fecha_reposicion > sysdate() 
    group by grupo_reposicion, fecha_reposicion, nivel, estado;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_eliminar_administrativo
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `prc_eliminar_administrativo`(in vps_cedula varchar(45))
BEGIN
	declare vli_id int;
    
    select id_administrativo into vli_id
		from vta_administradores 
		where cedula = vps_cedula;
    
	delete from t_administrativo where id = vli_id;
    
    delete from t_usuario where cedula = vps_cedula;
    commit;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_eliminar_anotaciones
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_eliminar_anotaciones`(in vpi_id int)
begin
	delete from t_anotaciones
    where id = vpi_id;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_eliminar_asistencia
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_eliminar_asistencia`(in vpi_id int)
begin
	delete from t_asistencia 
    where id = vpi_id;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_eliminar_casillero
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `prc_eliminar_casillero`(in vpv_codigo varchar(45))
BEGIN
	delete from t_casillero where codigo = vpv_codigo;
    commit;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_eliminar_casillero_estudiante
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `prc_eliminar_casillero_estudiante`(in vpi_id int, in vpv_codigo varchar(45))
begin
	delete from t_casillero_estudiante
    where id = vpi_id;
    update t_casillero set estado=0 where id = fi_id_casillero_por_codigo(vpv_codigo);
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_eliminar_documento_usuario
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_eliminar_documento_usuario`(in vpi_id int)
begin 
	delete from t_documento_usuario
    where id = vpi_id;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_eliminar_grupo
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_eliminar_grupo`(in vpi_id int)
begin
	delete from t_grupo
    where id = vpi_id;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_eliminar_horario
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_eliminar_horario`(in vpi_id int)
begin 
	delete from t_horario
    where id = vpi_id;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_eliminar_matricula
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`proyecto`@`%` PROCEDURE `prc_eliminar_matricula`(in vpi_id_matricula int)
begin
delete from
    t_matricula
where
    id = vpi_id_matricula;

update t_grupo set cupo_actual = cupo_actual - 1;

 end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_eliminar_padecimiento
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_eliminar_padecimiento`(in vpi_id int)
begin
	delete from t_padecimiento
    where id = vpi_id;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_eliminar_profesor
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_eliminar_profesor`(in vpi_id int)
begin
	delete from t_profesor
    where id = vpi_id;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_eliminar_reposicion
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_eliminar_reposicion`(in vpi_id int)
begin
	delete from t_reposicion
    where id = vpi_id;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_eliminar_taller
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_eliminar_taller`(in vpi_id int)
begin 
	delete from t_taller
    where id = vpi_id;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_eliminar_usuario
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_eliminar_usuario`(in vps_cedula VARCHAR(15))
begin 
	delete from t_usuario
    where cedula = vps_cedula;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_eliminar_usuario_temp
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_eliminar_usuario_temp`(in vps_cedula varchar(45))
begin
	delete from t_usuario_temp where cedula = vps_cedula;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_insertar_actividad
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_insertar_actividad`(in vps_usuario varchar(45), in vps_descripcion varchar(100), in vps_ddl varchar(45), in vps_tabla varchar(45))
begin
	insert into t_actividad(usuario,descripcion,ddl,tabla)
    values (vps_usuario,vps_descripcion,vps_ddl,vps_tabla);
    commit;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_insertar_administrador
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_insertar_administrador`(
IN `vps_cedula` VARCHAR(45),
IN `vps_nombre` VARCHAR(45),
IN `vps_apellido` VARCHAR(45),
IN `vps_usuario` VARCHAR(45),
IN `vps_clave` VARCHAR(155),
IN `vps_sexo` VARCHAR(45),
IN `vps_correo` VARCHAR(45),
IN `vps_rol` int(10)
)
begin
	declare vli_id int;
	
    call prc_insertar_t_usuario(vps_cedula,vps_nombre,vps_apellido,null,vps_usuario,vps_clave,vps_sexo,vps_correo);
    
    select id into vli_id
		from t_usuario 
		where cedula = vps_cedula;
    
    call prc_insertar_administrativo(vps_rol,vli_id);
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_insertar_administrativo
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_insertar_administrativo`(in vpi_rol int, in vpi_usuario int)
begin 
	insert into t_administrativo (rol,usuario)
    values (vpi_rol, vpi_usuario);
    commit;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_insertar_anotaciones
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_insertar_anotaciones`(in vps_nota varchar(300), in vpi_profesor int, in vpi_estudiante int)
begin 
	insert into t_anotaciones(nota, profesor, estudiante)
    values (vps_nota, vpi_profesor, vpi_estudiante);
    commit;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_insertar_asistencia
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_insertar_asistencia`(in vpi_estado varchar(25), in vpi_estudiante int, in vpi_grupo int, in vpi_fecha varchar(30))
begin
	insert into t_asistencia(estado, estudiante, grupo, fecha)
    values (vpi_estado, vpi_estudiante, vpi_grupo, vpi_fecha);
    commit;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_insertar_casillero
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_insertar_casillero`(in vpi_codigo VARCHAR(45))
begin
	insert into t_casillero(codigo,estado)
    values (vpi_codigo,0);
    commit;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_insertar_casillero_estudiante
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `prc_insertar_casillero_estudiante`(in vps_cedula varchar(45), in vps_codigo_casillero varchar(45), in vpd_hora_entrada time, in vpd_hora_salida time)
begin
	insert into t_casillero_estudiante(estudiante, casillero, hora_entrada, hora_salida)
    values (fi_id_estudiante_por_cedula(vps_cedula) , fi_id_casillero_por_codigo(vps_codigo_casillero), vpd_hora_entrada, vpd_hora_salida);
    update t_casillero set estado=1 where id = fi_id_casillero_por_codigo(vps_codigo_casillero);
    commit;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_insertar_conducta
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `prc_insertar_conducta`(in vpi_id int,in vpi_nota VARCHAR(300),in vpi_tipo VARCHAR(45))
BEGIN
	insert into t_conductas(estudiante, texto, tipo) 
    values(vpi_id, vpi_nota,vpi_tipo);
    commit;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_insertar_documento_usuario
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_insertar_documento_usuario`(in vpi_tipo_documento int, in vps_documento varchar(100), in vpi_usuario int)
begin 
	insert into t_documento_usuario(tipo_documento,documento,usuario)
    values (vpi_tipo_documento, vps_documento, vpi_usuario);
    commit;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_insertar_estudiante
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_insertar_estudiante`(in vpi_usuario int, in vpi_tipo VARCHAR(45))
begin
	insert into t_estudiante(moroso,estado,nivel,usuario,tipo)
    values (0,1,1,vpi_usuario,vpi_tipo);
    commit;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_insertar_grupo
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_insertar_grupo`(in vpi_horario int, in vpi_profesor int, in vpi_taller int, in vpi_cupo_base int, in vpi_cupo_extra int, in vpd_periodo date)
begin
	insert into t_grupo(horario, profesor, taller, cupo_base, cupo_extra, periodo)
    values (vpi_horario, vpi_profesor, vpi_taller, vpi_cupo_base, vpi_cupo_extra, vpd_periodo);
    commit;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_insertar_horario
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_insertar_horario`(in vps_dia varchar(55), in vpi_hora int)
begin 
	insert into t_horario(dia, hora)
    values (vps_dia, vpi_hora);
    commit;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_insertar_matricula
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_insertar_matricula`(in vpi_grupo int, in vpi_estudiante int)
begin 
	insert into t_matricula(grupo, estudiante)
    values (vpi_grupo, vpi_estudiante);
    
    UPDATE t_grupo 
	SET cupo_actual = cupo_actual + 1 
	WHERE id = vpi_grupo;
    commit;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_insertar_padecimiento_estudiante
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_insertar_padecimiento_estudiante`(in vps_descripcion varchar(255),in vpi_estudiante int, in vps_observacion varchar(255))
begin
	insert into t_padecimiento(descripcion,estudiante,observaciones)
    values (vps_descripcion,vpi_estudiante,vps_observacion);
    commit;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_insertar_profesor
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_insertar_profesor`(in vpi_usuario int)
begin
	insert into t_profesor(usuario)
    values (vpi_usuario);
    commit;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_insertar_profesor_admin
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `prc_insertar_profesor_admin`(
    in `vps_cedula` VARCHAR(30),
    in `vps_nombre` VARCHAR(100),
    in `vps_apellido` VARCHAR(100),
    in `vps_correo` VARCHAR(100),
    in `vps_clave` VARCHAR(100),
    in `vps_sexo` VARCHAR(40),
    in `vps_usuario` VARCHAR(100))
begin
    declare vli_id int;

    insert into `siap`.`t_usuario`(`cedula`, `nombre`, `apellido`, `usuario`, `clave`, `sexo`, `correo`) 
    values (vps_cedula, vps_nombre, vps_apellido, vps_usuario, sha1(vps_clave), vps_sexo, vps_correo);
	
    select id into vli_id
		from t_usuario 
		where cedula = vps_cedula;

	insert into t_profesor(usuario)
    values (vli_id);

    commit;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_insertar_profesor_asistencia
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `prc_insertar_profesor_asistencia`(in vpi_estado VARCHAR(15), in vps_fecha varchar(30), in vpi_profesor int(11), in vpi_grupo int(11))
begin 
		insert into t_profesor_asistencia
        (estado, fecha, profesor, grupo)
        values (vpi_estado, vps_fecha, vpi_profesor, vpi_grupo);
        commit;
    end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_insertar_profesor_reposicion
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `prc_insertar_profesor_reposicion`(
in vpi_profesor_origen int(11), 
in vpi_profesor_reposicion int(11), 
in vps_fecha_reposicion varchar(30),
in vpi_grupo int(11)
)
begin
		insert into t_profesor_reposicion
        (profesor_origen, profesor_reposicion, fecha_reposicion, grupo)
        values (vpi_profesor_origen, vpi_profesor_reposicion, vps_fecha_reposicion, vpi_grupo);
        commit;
    end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_insertar_reposicion
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_insertar_reposicion`(in vpi_estudiante int,  
in vpi_grupo_reposicion int, in vpd_fecha_reposicion date, in vps_observacion varchar(255),in vps_comprobante varchar(100))
begin 
	insert into t_reposicion(estudiante, grupo_reposicion, fecha_reposicion, observacion, comprobante)
    values (vpi_estudiante, vpi_grupo_reposicion, vpd_fecha_reposicion, vps_observacion,vps_comprobante);
    commit;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_insertar_t_usuario
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_insertar_t_usuario`(
IN `vps_cedula` VARCHAR(45), 
IN `vps_nombre` VARCHAR(55), 
IN `vps_apellido` VARCHAR(100), 
IN `vpd_nacimiento` DATE, 
IN `vps_usuario` VARCHAR(45), 
IN `vps_clave` VARCHAR(45), 
IN `vps_sexo` VARCHAR(45), 
IN `vps_correo` VARCHAR(45)
)
begin

	insert into `siap`.`t_usuario`(`cedula`, `nombre`, `apellido`, `nacimiento`, `usuario`, `clave`, `sexo`, `correo`)

    values (vps_cedula, vps_nombre, vps_apellido, vpd_nacimiento, vps_usuario, vps_clave, vps_sexo, vps_correo);

    commit;

end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_insertar_taller
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_insertar_taller`(in vps_codigo varchar(45), in vps_descripcion varchar(255), in vpi_nivel int, in vpi_costo int, in vpi_costo_funcionario int)
begin 
	insert into t_taller (codigo, descripcion, nivel, costo, costo_funcionario)
    values (vps_codigo, vps_descripcion, vpi_nivel, vpi_costo, vpi_costo_funcionario);
    commit;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_insertar_usuario
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_insertar_usuario`(IN `vps_cedula` VARCHAR(45), IN `vps_nombre` VARCHAR(55), IN `vps_apellido` VARCHAR(100), IN `vpd_nacimiento` DATE, IN `vps_usuario` VARCHAR(45), IN `vps_clave` VARCHAR(45), IN `vps_sexo` VARCHAR(45), IN `vps_correo` VARCHAR(45))
begin

	insert into `siap`.`t_usuario`(`cedula`, `nombre`, `apellido`, `nacimiento`, `usuario`, `clave`, `sexo`, `correo`)

    values (vps_cedula, vps_nombre, vps_apellido, vpd_nacimiento, vps_usuario, sha1(vps_clave), vps_sexo, vps_correo);

    commit;

end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_insertar_usuario_admin
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_insertar_usuario_admin`(
IN `vps_cedula` VARCHAR(45), 
IN `vps_nombre` VARCHAR(55), 
IN `vps_apellido` VARCHAR(100), 
IN `vpd_nacimiento` DATE, 
IN `vps_usuario` VARCHAR(45), 
IN `vps_sexo` VARCHAR(45),
IN `vpi_tipo` VARCHAR(45), 
IN `vps_correo` VARCHAR(45)
)
begin
	declare vli_id int;
	insert into `siap`.`t_usuario`(`cedula`, `nombre`, `apellido`, `nacimiento`, `usuario`, `clave`, `sexo`, `correo`)
    values (vps_cedula, vps_nombre, vps_apellido, vpd_nacimiento, vps_usuario, sha1('1234'), vps_sexo, vps_correo);
    
    select id into vli_id
	from t_usuario 
	where cedula = vps_cedula;
    
    insert into t_estudiante(moroso,estado,nivel,usuario,tipo)
    values (0,1,1,vli_id,vpi_tipo);
    
    commit;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_insertar_usuario_temp
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_insertar_usuario_temp`(
in vps_cedula varchar(45),
in vps_nombre varchar(55),
in vps_apellido varchar(100),
in vpd_nacimiento date,
in vps_usuario varchar(45), 
in vps_clave varchar(45), 
in vps_sexo varchar(45), 
in vpi_tipo_usuario varchar(45), 
in vps_correo varchar(45)
)
begin
	insert into t_usuario_temp(cedula, nombre, apellido, nacimiento, usuario, clave, sexo,tipo_usuario, correo)
    values (vps_cedula, vps_nombre, vps_apellido, vpd_nacimiento, vps_usuario, sha1(vps_clave), vps_sexo,vpi_tipo_usuario, vps_correo);
    commit;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_mostrar_actividad_fecha
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `prc_mostrar_actividad_fecha`(in vpd_fecha date)
begin 
		select * from t_actividad
        where day(created_at) = day(vpd_fecha)
        and month(created_at) = month(vpd_fecha)
        and year(created_at) = year(vpd_fecha);
    end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_mostrar_actividad_usuario
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_mostrar_actividad_usuario`(in vps_usuario varchar(45))
begin
	select * from t_actividad
    where usuario = vps_usuario
    order by created_at;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_mostrar_actividad_usuario_ddl
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `prc_mostrar_actividad_usuario_ddl`(in vps_usuario varchar(45), in vps_ddl varchar(45))
begin
		select * from t_actividad
        where usuario = vps_usuario and ddl = vps_ddl;
	end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_mostrar_disponibilidad_casilleros
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `prc_mostrar_disponibilidad_casilleros`()
begin
		select c.id, c.codigo,fi_verificar_casillero_vacante(c.codigo) ocupado
        from t_casillero c
        order by codigo;
	end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_mostrar_usuarios_morosos
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `prc_mostrar_usuarios_morosos`()
begin
		select  `id`, `cedula`, `nombre`, `apellido`, `nacimiento`, `usuario`, `sexo`, `correo`, `nivel`, `estado`
        from vta_admin_estudiante
        where moroso = 1;
    end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_seleccionar_actividad
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `prc_seleccionar_actividad`()
begin
		select id, usuario, descripcion, ddl, tabla, created_at
        from t_actividad
        order by created_at;
    end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_seleccionar_administrativo_cedula
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_seleccionar_administrativo_cedula`(in vps_cedula varchar(45))
begin
	select * from vta_administradores where cedula = vps_cedula;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_seleccionar_anotaciones_por_cedula_estudiante
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_seleccionar_anotaciones_por_cedula_estudiante`(in vps_cedula_estudiante varchar(45))
begin	
	select * from vta_anotaciones
    where cedula_estudiante = vps_cedula_estudiante;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_seleccionar_anotaciones_por_cedula_profesor
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_seleccionar_anotaciones_por_cedula_profesor`(in vps_cedula_profesor varchar(45))
begin
	select * from vta_anotaciones
    where cedula_profesor = vps_cedula_profesor;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_seleccionar_anotaciones_por_profesor_y_estudiante
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_seleccionar_anotaciones_por_profesor_y_estudiante`(in vps_cedula_profesor varchar(45), in vps_cedula_estudiante varchar(45))
begin
	select * from vta_anotaciones
    where cedula_profesor = vps_cedula_profesor
    and cedula_estudiante = vps_cedula_estudiante;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_seleccionar_asistencia
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_seleccionar_asistencia`()
begin
	select * from vta_asistencia
    where estado = 1;
 end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_seleccionar_asistencia_por_dia
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_seleccionar_asistencia_por_dia`(in vpd_dia date)
begin
	select * from vta_asistencia
    where dia = vpd_dia
    and estado = 1;
 end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_seleccionar_asistencia_por_estudiante
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_seleccionar_asistencia_por_estudiante`(in vps_cedula varchar(45))
begin
	select * from vta_asistencia
    where cedula = vps_cedula
    and estado = 1;
 end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_seleccionar_asistencia_por_grupo
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_seleccionar_asistencia_por_grupo`(in vpi_id_grupo int)
begin
	select * from vta_asistencia
    where id_grupo = vpi_id_grupo
    and estado = 1;
 end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_seleccionar_asistencia_por_grupo_y_dia
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_seleccionar_asistencia_por_grupo_y_dia`(in vpi_id_grupo int, in vpd_dia date)
begin
	select * from vta_asistencia
    where id_grupo = vpi_id_grupo
    and dia = vpd_dia
    and estado = 1;
 end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_seleccionar_asistencia_por_grupo_y_estudiante
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_seleccionar_asistencia_por_grupo_y_estudiante`(in vpi_id_grupo int, in vps_cedula varchar(45))
begin
	select * from vta_asistencia
    where id_grupo = vpi_id_grupo
    and cedula = vps_cedula
    and estado = 1;
 end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_seleccionar_asistencia_por_grupo_y_estudiante_y_dia
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_seleccionar_asistencia_por_grupo_y_estudiante_y_dia`(in vpi_id_grupo int, in vps_cedula varchar(45), in vpd_dia date)
begin
	select * from vta_asistencia
    where id_grupo = vpi_id_grupo
    and dia = vpd_dia
    and cedula = vps_cedula
    and estado = 1;
 end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_seleccionar_ausencias
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_seleccionar_ausencias`()
begin
	select * from vta_asistencia
    where estado = 0;
 end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_seleccionar_ausencias_por_dia
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_seleccionar_ausencias_por_dia`(in vpd_dia date)
begin
	select * from vta_asistencia
    where dia = vpd_dia
    and estado = 0;
 end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_seleccionar_ausencias_por_estudiante
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_seleccionar_ausencias_por_estudiante`(in vps_cedula varchar(45))
begin
	select * from vta_asistencia
    where cedula = vps_cedula
    and estado = 0;
 end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_seleccionar_ausencias_por_grupo
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_seleccionar_ausencias_por_grupo`(in vpi_id_grupo int)
begin
	select * from vta_asistencia
    where id_grupo = vpi_id_grupo
    and estado = 0;
 end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_seleccionar_ausencias_por_grupo_y_dia
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_seleccionar_ausencias_por_grupo_y_dia`(in vpi_id_grupo int, in vpd_dia date)
begin
	select * from vta_asistencia
    where id_grupo = vpi_id_grupo
    and dia = vpd_dia
    and estado = 0;
 end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_seleccionar_ausencias_por_grupo_y_estudiante
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_seleccionar_ausencias_por_grupo_y_estudiante`(in vpi_id_grupo int, in vps_cedula varchar(45))
begin
	select * from vta_asistencia
    where id_grupo = vpi_id_grupo
    and cedula = vps_cedula
    and estado = 0;
 end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_seleccionar_ausencias_por_grupo_y_estudiante_y_dia
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_seleccionar_ausencias_por_grupo_y_estudiante_y_dia`(in vpi_id_grupo int, in vps_cedula varchar(45), in vpd_dia date)
begin
	select * from vta_asistencia
    where id_grupo = vpi_id_grupo
    and dia = vpd_dia
    and cedula = vps_cedula
    and estado = 0;
 end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_seleccionar_documentos_usuario
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_seleccionar_documentos_usuario`()
BEGIN
	select * from vta_documentos_usuarios
    order by cedula, id_documento;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_seleccionar_documentos_usuario_por_cedula
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_seleccionar_documentos_usuario_por_cedula`(in vps_cedula varchar(45))
BEGIN
	select * from vta_documentos_usuarios
    where cedula = vps_cedula
    order by cedula, id_documento;
END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_seleccionar_documentos_usuario_por_cedula_y_tipo
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_seleccionar_documentos_usuario_por_cedula_y_tipo`(in vps_cedula varchar(45), in vpi_tipo int)
BEGIN
	select * from vta_documentos_usuarios
    where cedula = vps_cedula
    and tipo_documento = vpi_tipo
    order by cedula, id_documento;

END$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_seleccionar_estudiante_cedula
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_seleccionar_estudiante_cedula`(in vps_cedula varchar(45))
begin
	select * from vta_cliente_estudiante
    where cedula = vps_cedula;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_seleccionar_estudiante_cedula_admin
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_seleccionar_estudiante_cedula_admin`(in vps_cedula varchar(45))
begin
	select * from vta_admin_estudiante
    where cedula = vps_cedula;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_seleccionar_horarios
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_seleccionar_horarios`()
begin
	select * from t_horario
    order by dia,hora;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_seleccionar_matricula_por_estudiante
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_seleccionar_matricula_por_estudiante`(in vps_cedula varchar(45))
begin
	select * from vta_matriculados_por_grupo
    where cedula = vps_cedula and activa = 1;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_seleccionar_padecimientos_estudiante
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_seleccionar_padecimientos_estudiante`(in vps_cedula varchar(11))
begin 
	select * from vta_padecimientos
    where cedula = vps_cedula;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_seleccionar_profesor_cedula
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_seleccionar_profesor_cedula`(in vps_cedula varchar(45))
begin
	select * from vta_profesores where cedula = vps_cedula;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_seleccionar_profesores
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_seleccionar_profesores`()
begin
	select * from vta_profesores;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_seleccionar_reposiciones_aprobadas
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_seleccionar_reposiciones_aprobadas`()
begin
	select * from vta_reposiciones
    where estado = 1;
 end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_seleccionar_reposiciones_aprobadas_cedula
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_seleccionar_reposiciones_aprobadas_cedula`(in vps_cedula varchar(45))
begin
	select * from vta_reposiciones
    where cedula_estudiante = vps_cedula
    and estado = 1;
 end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_seleccionar_reposiciones_aprobadas_por_grupo
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_seleccionar_reposiciones_aprobadas_por_grupo`(in vpi_grupo int)
begin
	select * from vta_reposiciones
    where grupo_reposicion = vpi_grupo
    and estado = 1;
 end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_seleccionar_reposiciones_aprobadas_por_grupo_y_fecha
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_seleccionar_reposiciones_aprobadas_por_grupo_y_fecha`(in vpi_grupo int, in vpd_fecha date)
begin
	select * from vta_reposiciones_reservadas
    where grupo_reposicion = vpi_grupo
    and fecha_reposicion = vpd_fecha
    and estado = 1;
 end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_seleccionar_reposiciones_por_cedula
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_seleccionar_reposiciones_por_cedula`(in vps_cedula varchar(45))
begin
	select * from vta_reposiciones 
    where cedula = vps_cedula;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_seleccionar_reposiciones_por_grupo
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_seleccionar_reposiciones_por_grupo`(in vpi_grupo int)
begin
	select * from vta_reposiciones
    where grupo_reposicion = vpi_grupo;
 end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_seleccionar_reposiciones_por_nivel
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_seleccionar_reposiciones_por_nivel`(in vpi_nivel int)
begin
	select * from vta_reposiciones
    where nivel = vpi_nivel;
 end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_seleccionar_talleres
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_seleccionar_talleres`()
begin
	select * from t_taller
    order by nivel;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_seleccionar_talleres_por_nivel
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_seleccionar_talleres_por_nivel`(in vpi_nivel int)
begin
	select * from t_taller
    where nivel = vpi_nivel
    order by codigo;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- procedure prc_seleccionar_usuarios
-- -----------------------------------------------------

DELIMITER $$
USE `siap`$$
CREATE DEFINER=`perroloco`@`localhost` PROCEDURE `prc_seleccionar_usuarios`()
begin
	select * from t_usuario;
end$$

DELIMITER ;

-- -----------------------------------------------------
-- View `siap`.`vta_admin_estudiante`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `siap`.`vta_admin_estudiante`;
USE `siap`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`perroloco`@`localhost` SQL SECURITY DEFINER VIEW `siap`.`vta_admin_estudiante` AS select `u`.`id` AS `id`,`u`.`cedula` AS `cedula`,`u`.`foto` AS `foto`,`u`.`apellido` AS `apellido`,`u`.`nombre` AS `nombre`,`u`.`nacimiento` AS `nacimiento`,`u`.`usuario` AS `usuario`,`u`.`sexo` AS `sexo`,`u`.`correo` AS `correo`,`e`.`id` AS `id_estudiante`,`e`.`celular` AS `celular`,`e`.`telefono` AS `telefono`,`e`.`nivel` AS `nivel`,`n`.`descripcion` AS `descripcion`,`e`.`carrera_departamento` AS `carrera_departamento`,`e`.`cantidad_dias` AS `cantidad_dias`,`e`.`telefono_emergencia` AS `telefono_emergencia`,`e`.`provincia` AS `provincia`,`e`.`canton` AS `canton`,`e`.`distrito` AS `distrito`,`e`.`direccion` AS `direccion`,`e`.`moroso` AS `moroso`,`e`.`estado` AS `estado`,`e`.`notas` AS `notas`,`e`.`prematricula` AS `prematricula`,`e`.`motivo_ingreso` AS `motivo_ingreso`,`e`.`tipo` AS `tipo` from ((`siap`.`t_usuario` `u` join `siap`.`t_estudiante` `e`) join `siap`.`t_taller` `n`) where ((`u`.`id` = `e`.`usuario`) and (`e`.`nivel` = `n`.`nivel`));

-- -----------------------------------------------------
-- View `siap`.`vta_administradores`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `siap`.`vta_administradores`;
USE `siap`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`perroloco`@`localhost` SQL SECURITY DEFINER VIEW `siap`.`vta_administradores` AS select `u`.`id` AS `id`,`u`.`cedula` AS `cedula`,`u`.`foto` AS `foto`,`u`.`nombre` AS `nombre`,`u`.`apellido` AS `apellido`,`u`.`nacimiento` AS `nacimiento`,`u`.`usuario` AS `usuario`,`u`.`sexo` AS `sexo`,`u`.`correo` AS `correo`,`u`.`clave` AS `clave`,`a`.`id` AS `id_administrativo`,`a`.`rol` AS `rol` from (`siap`.`t_usuario` `u` join `siap`.`t_administrativo` `a`) where (`u`.`id` = `a`.`usuario`) order by `u`.`apellido`,`u`.`nombre`;

-- -----------------------------------------------------
-- View `siap`.`vta_anotaciones`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `siap`.`vta_anotaciones`;
USE `siap`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`perroloco`@`localhost` SQL SECURITY DEFINER VIEW `siap`.`vta_anotaciones` AS select `a`.`id` AS `id_anotaciones`,`a`.`nota` AS `nota`,`a`.`profesor` AS `id_profesor`,`a`.`created_at` AS `created_at`,`a`.`updated_at` AS `updated_at`,`up`.`cedula` AS `cedula_profesor`,`up`.`apellido` AS `apellido_profesor`,`up`.`nombre` AS `nombre_profesor`,`a`.`estudiante` AS `id_estudiante`,`ue`.`cedula` AS `cedula_estudiante`,`ue`.`apellido` AS `apellido_estudiante`,`ue`.`nombre` AS `nombre_estudiante` from ((((`siap`.`t_anotaciones` `a` join `siap`.`t_profesor` `p`) join `siap`.`t_estudiante` `e`) join `siap`.`t_usuario` `up`) join `siap`.`t_usuario` `ue`) where ((`a`.`profesor` = `p`.`id`) and (`p`.`usuario` = `up`.`id`) and (`a`.`estudiante` = `e`.`id`) and (`e`.`usuario` = `ue`.`id`)) order by `up`.`cedula`,`ue`.`cedula`,`a`.`id`;

-- -----------------------------------------------------
-- View `siap`.`vta_asistencia`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `siap`.`vta_asistencia`;
USE `siap`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`perroloco`@`localhost` SQL SECURITY DEFINER VIEW `siap`.`vta_asistencia` AS select distinct `a`.`id` AS `id_asistencia`,date_format(`a`.`fecha`,'%d-%m-%Y-%h-%i') AS `fecha`,`m`.`id` AS `id_matricula`,`g`.`id` AS `id_grupo`,`t`.`id` AS `id_taller`,`t`.`codigo` AS `codigo`,`e`.`id` AS `id_estudiante`,`u`.`foto` AS `foto`,`u`.`id` AS `id_usuario`,`u`.`cedula` AS `cedula`,`u`.`apellido` AS `apellido`,`u`.`nombre` AS `nombre`,`a`.`estado` AS `estado` from (((((`siap`.`t_asistencia` `a` join `siap`.`t_matricula` `m`) join `siap`.`t_grupo` `g`) join `siap`.`t_taller` `t`) join `siap`.`t_estudiante` `e`) join `siap`.`t_usuario` `u`) where ((`a`.`estudiante` = `e`.`id`) and (`a`.`grupo` = `g`.`id`) and (`g`.`taller` = `t`.`id`) and (`m`.`estudiante` = `e`.`id`) and (`m`.`grupo` = `g`.`id`) and (`e`.`usuario` = `u`.`id`));

-- -----------------------------------------------------
-- View `siap`.`vta_asistencia_admin`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `siap`.`vta_asistencia_admin`;
USE `siap`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`perroloco`@`localhost` SQL SECURITY DEFINER VIEW `siap`.`vta_asistencia_admin` AS select distinct `a`.`id` AS `id_asistencia`,date_format(`a`.`fecha`,'%d-%m-%Y-%h-%i') AS `fecha`,`m`.`id` AS `id_matricula`,`g`.`id` AS `id_grupo`,`t`.`id` AS `id_taller`,`t`.`codigo` AS `codigo`,`e`.`id` AS `id_estudiante`,`u`.`foto` AS `foto`,`u`.`id` AS `id_usuario`,`u`.`cedula` AS `cedula`,`u`.`apellido` AS `apellido`,`u`.`nombre` AS `nombre`,`a`.`estado` AS `estado`,concat(`up`.`nombre`,' ',`up`.`apellido`) AS `profesor` from (((((((`siap`.`t_asistencia` `a` join `siap`.`t_matricula` `m`) join `siap`.`t_grupo` `g`) join `siap`.`t_taller` `t`) join `siap`.`t_estudiante` `e`) join `siap`.`t_usuario` `u`) join `siap`.`t_usuario` `up`) join `siap`.`t_profesor` `p`) where ((`a`.`estudiante` = `e`.`id`) and (`a`.`grupo` = `g`.`id`) and (`g`.`taller` = `t`.`id`) and (`m`.`estudiante` = `e`.`id`) and (`m`.`grupo` = `g`.`id`) and (`e`.`usuario` = `u`.`id`) and (`g`.`profesor` = `p`.`id`) and (`p`.`usuario` = `up`.`id`));

-- -----------------------------------------------------
-- View `siap`.`vta_cantidad_usuarios_registrados`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `siap`.`vta_cantidad_usuarios_registrados`;
USE `siap`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`perroloco`@`localhost` SQL SECURITY DEFINER VIEW `siap`.`vta_cantidad_usuarios_registrados` AS select count(`cantidad`.`cedula`) AS `cantidad` from (select `vta_usuario_temp`.`cedula` AS `cedula` from `siap`.`vta_usuario_temp` where (`vta_usuario_temp`.`estado` = 0) union all select `vta_admin_estudiante`.`cedula` AS `cedula` from `siap`.`vta_admin_estudiante`) `cantidad`;

-- -----------------------------------------------------
-- View `siap`.`vta_casilleros`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `siap`.`vta_casilleros`;
USE `siap`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `siap`.`vta_casilleros` AS select `c`.`id` AS `id_casillero`,`c`.`codigo` AS `codigo_casillero`,`r`.`id` AS `id_reserva`,`e`.`id` AS `id_estudiante`,`u`.`id` AS `id_usuario`,`u`.`cedula` AS `cedula`,`r`.`hora_entrada` AS `hora_entrada`,`r`.`hora_salida` AS `hora_salida` from (((`siap`.`t_casillero` `c` join `siap`.`t_casillero_estudiante` `r`) join `siap`.`t_estudiante` `e`) join `siap`.`t_usuario` `u`) where ((`r`.`casillero` = `c`.`id`) and (`r`.`estudiante` = `e`.`id`) and (`e`.`usuario` = `u`.`id`)) order by `c`.`codigo`,`r`.`id`;

-- -----------------------------------------------------
-- View `siap`.`vta_cliente_estudiante`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `siap`.`vta_cliente_estudiante`;
USE `siap`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`perroloco`@`localhost` SQL SECURITY DEFINER VIEW `siap`.`vta_cliente_estudiante` AS select `u`.`id` AS `id`,`u`.`cedula` AS `cedula`,`u`.`foto` AS `foto`,`u`.`apellido` AS `apellido`,`u`.`nombre` AS `nombre`,`u`.`correo` AS `correo`,`u`.`nacimiento` AS `nacimiento`,`u`.`usuario` AS `usuario`,`u`.`sexo` AS `sexo`,`e`.`id` AS `id_estudiante`,`e`.`celular` AS `celular`,`e`.`telefono` AS `telefono`,`e`.`nivel` AS `nivel`,`e`.`carrera_departamento` AS `carrera_departamento`,`e`.`cantidad_dias` AS `cantidad_dias`,`e`.`telefono_emergencia` AS `telefono_emergencia`,`e`.`provincia` AS `provincia`,`e`.`canton` AS `canton`,`e`.`distrito` AS `distrito`,`e`.`direccion` AS `direccion`,`e`.`tipo` AS `tipo`,`e`.`moroso` AS `moroso`,`e`.`motivo_ingreso` AS `motivo_ingreso`,`e`.`estado` AS `estado`,`u`.`clave` AS `clave` from (`siap`.`t_usuario` `u` join `siap`.`t_estudiante` `e`) where (`u`.`id` = `e`.`usuario`) order by `u`.`apellido`,`u`.`nombre`;

-- -----------------------------------------------------
-- View `siap`.`vta_conductas`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `siap`.`vta_conductas`;
USE `siap`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `siap`.`vta_conductas` AS select `a`.`id` AS `id_conducta`,`a`.`texto` AS `texto`,`a`.`strike` AS `strike`,`a`.`tipo` AS `tipo`,`a`.`created_at` AS `created_at`,`a`.`estudiante` AS `id_estudiante`,`e`.`estado` AS `estado`,`ue`.`foto` AS `foto`,`ue`.`cedula` AS `cedula`,`ue`.`apellido` AS `apellido`,`ue`.`nombre` AS `nombre` from ((`siap`.`t_conductas` `a` join `siap`.`t_estudiante` `e`) join `siap`.`t_usuario` `ue`) where ((`a`.`estudiante` = `e`.`id`) and (`e`.`usuario` = `ue`.`id`));

-- -----------------------------------------------------
-- View `siap`.`vta_documentos_usuarios`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `siap`.`vta_documentos_usuarios`;
USE `siap`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`perroloco`@`localhost` SQL SECURITY DEFINER VIEW `siap`.`vta_documentos_usuarios` AS select `d`.`id` AS `id_documento`,`d`.`tipo_documento` AS `tipo_documento`,`d`.`documento` AS `documento`,`d`.`created_at` AS `created_at`,`d`.`updated_at` AS `updated_at`,`e`.`id` AS `id_estudiante`,`u`.`id` AS `id_usuario`,`u`.`cedula` AS `cedula` from ((`siap`.`t_documento_usuario` `d` join `siap`.`t_usuario` `u`) join `siap`.`t_estudiante` `e`) where ((`d`.`usuario` = `u`.`id`) and (`e`.`usuario` = `u`.`id`));

-- -----------------------------------------------------
-- View `siap`.`vta_estadistica`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `siap`.`vta_estadistica`;
USE `siap`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`perroloco`@`localhost` SQL SECURITY DEFINER VIEW `siap`.`vta_estadistica` AS select `fi_cantidad_talleres`() AS `cantidad_talleres`,`fi_cantidad_grupos`() AS `cantidad_grupos`,`fi_cantidad_matriculados`() AS `cantidad_matriculados`,`fi_cantidad_estudiantes`() AS `cantidad_estudiantes`,`fi_cantidad_administrativos`() AS `cantidad_administrativos`,`fi_cantidad_profesores`() AS `cantidad_profesores`,`fi_cantidad_usuarios`() AS `cantidad_usuarios`,`fi_cantidad_usuarios_temp`() AS `cantidad_usuarios_temp`,`fi_cantidad_horarios`() AS `cantidad_horarios`;

-- -----------------------------------------------------
-- View `siap`.`vta_estudiante_moroso`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `siap`.`vta_estudiante_moroso`;
USE `siap`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`perroloco`@`localhost` SQL SECURITY DEFINER VIEW `siap`.`vta_estudiante_moroso` AS select `u`.`id` AS `id`,`u`.`cedula` AS `cedula`,`u`.`foto` AS `foto`,`u`.`apellido` AS `apellido`,`u`.`nombre` AS `nombre`,`u`.`correo` AS `correo`,`u`.`nacimiento` AS `nacimiento`,`u`.`usuario` AS `usuario`,`u`.`sexo` AS `sexo`,`e`.`id` AS `id_estudiante`,`e`.`celular` AS `celular`,`e`.`telefono` AS `telefono`,`e`.`nivel` AS `nivel`,`e`.`carrera_departamento` AS `carrera_departamento`,`e`.`cantidad_dias` AS `cantidad_dias`,`e`.`telefono_emergencia` AS `telefono_emergencia`,`e`.`provincia` AS `provincia`,`e`.`pago` AS `pago`,`e`.`canton` AS `canton`,`e`.`distrito` AS `distrito`,`e`.`direccion` AS `direccion`,`e`.`tipo` AS `tipo`,`e`.`moroso` AS `moroso`,`e`.`motivo_ingreso` AS `motivo_ingreso`,`e`.`estado` AS `estado`,`u`.`clave` AS `clave` from (`siap`.`t_usuario` `u` join `siap`.`t_estudiante` `e`) where ((`u`.`id` = `e`.`usuario`) and (`e`.`moroso` = 1)) order by `u`.`apellido`,`u`.`nombre`;

-- -----------------------------------------------------
-- View `siap`.`vta_grupos`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `siap`.`vta_grupos`;
USE `siap`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`perroloco`@`localhost` SQL SECURITY DEFINER VIEW `siap`.`vta_grupos` AS select `t`.`codigo` AS `codigo_taller`,`t`.`costo` AS `costo`,`t`.`costo_funcionario` AS `costo_funcionario`,`t`.`nivel` AS `nivel`,`t`.`descripcion` AS `descripcion`,`t`.`id` AS `id_taller`,`g`.`id` AS `id_grupo`,`g`.`cupo_base` AS `cupo_base`,`g`.`cupo_extra` AS `cupo_extra`,`g`.`cupo_actual` AS `cupo_actual`,`g`.`periodo` AS `periodo`,`h`.`id` AS `id_horario`,`h`.`dia` AS `dia`,`h`.`hora` AS `hora`,`u`.`apellido` AS `apellido`,`u`.`nombre` AS `nombre`,`p`.`id` AS `id_profesor`,`u`.`cedula` AS `cedula` from ((((`siap`.`t_taller` `t` join `siap`.`t_grupo` `g`) join `siap`.`t_usuario` `u`) join `siap`.`t_profesor` `p`) join `siap`.`t_horario` `h`) where ((`g`.`taller` = `t`.`id`) and (`g`.`profesor` = `p`.`id`) and (`p`.`usuario` = `u`.`id`) and (`g`.`horario` = `h`.`id`)) order by `t`.`codigo`,`g`.`id`;

-- -----------------------------------------------------
-- View `siap`.`vta_matriculados_grupo_detalle`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `siap`.`vta_matriculados_grupo_detalle`;
USE `siap`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `siap`.`vta_matriculados_grupo_detalle` AS select `g`.`id` AS `id_grupo`,`e`.`id` AS `id_estudiante`,`ue`.`cedula` AS `cedula_estudiante`,`ue`.`correo` AS `correo_estudiante`,`e`.`carrera_departamento` AS `carrera_departamento`,`ue`.`apellido` AS `apellido_estudiante`,`ue`.`nombre` AS `nombre_estudiante`,`ue`.`foto` AS `foto_estudiante`,`ue`.`sexo` AS `sexo_estudiante`,`e`.`celular` AS `celular_estudiante`,`e`.`telefono_emergencia` AS `telefono_emergencia_estudiante`,`ue`.`nacimiento` AS `nacimiento_estudiante`,`p`.`id` AS `id_profesor`,`up`.`cedula` AS `cedula_profesor` from (((((`siap`.`t_grupo` `g` join `siap`.`t_estudiante` `e`) join `siap`.`t_profesor` `p`) join `siap`.`t_usuario` `ue`) join `siap`.`t_usuario` `up`) join `siap`.`t_matricula` `m`) where ((`e`.`usuario` = `ue`.`id`) and (`p`.`usuario` = `up`.`id`) and (`m`.`grupo` = `g`.`id`) and (`m`.`estudiante` = `e`.`id`) and (`g`.`profesor` = `p`.`id`)) order by `ue`.`cedula`;

-- -----------------------------------------------------
-- View `siap`.`vta_matriculados_por_grupo`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `siap`.`vta_matriculados_por_grupo`;
USE `siap`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`perroloco`@`localhost` SQL SECURITY DEFINER VIEW `siap`.`vta_matriculados_por_grupo` AS select `t`.`codigo` AS `codigo_taller`,`t`.`nivel` AS `nivel_taller`,`t`.`descripcion` AS `descripcion`,`g`.`id` AS `id_grupo`,`h`.`dia` AS `dia`,`h`.`hora` AS `hora`,concat(`up`.`nombre`,' ',`up`.`apellido`) AS `nombre_profesor`,`m`.`id` AS `id_matricula`,`m`.`activa` AS `activa`,`m`.`created_at` AS `created_at`,`g`.`periodo` AS `periodo`,`e`.`id` AS `id_estudiante`,`u`.`id` AS `id_usuario`,`u`.`cedula` AS `cedula`,`u`.`apellido` AS `apellido`,`u`.`nombre` AS `nombre`,`u`.`foto` AS `foto`,`u`.`correo` AS `correo` from (((((((`siap`.`t_taller` `t` join `siap`.`t_grupo` `g`) join `siap`.`t_matricula` `m`) join `siap`.`t_estudiante` `e`) join `siap`.`t_usuario` `u`) join `siap`.`t_usuario` `up`) join `siap`.`t_horario` `h`) join `siap`.`t_profesor` `p`) where ((`m`.`grupo` = `g`.`id`) and (`g`.`taller` = `t`.`id`) and (`m`.`estudiante` = `e`.`id`) and (`e`.`usuario` = `u`.`id`) and (`h`.`id` = `g`.`horario`) and (`p`.`id` = `g`.`profesor`) and (`up`.`id` = `p`.`usuario`)) order by `t`.`codigo`,`g`.`id`,`u`.`apellido`,`u`.`nombre`;

-- -----------------------------------------------------
-- View `siap`.`vta_padecimientos`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `siap`.`vta_padecimientos`;
USE `siap`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`perroloco`@`localhost` SQL SECURITY DEFINER VIEW `siap`.`vta_padecimientos` AS select `u`.`id` AS `id_usuario`,`u`.`cedula` AS `cedula`,`e`.`id` AS `id_estudiante`,`u`.`apellido` AS `apellido`,`u`.`nombre` AS `nombre`,`p`.`id` AS `id_padecimiento`,`p`.`descripcion` AS `descripcion`,`p`.`observaciones` AS `observaciones` from ((`siap`.`t_usuario` `u` join `siap`.`t_estudiante` `e`) join `siap`.`t_padecimiento` `p`) where ((`u`.`id` = `e`.`usuario`) and (`p`.`estudiante` = `e`.`id`)) order by `u`.`cedula`;

-- -----------------------------------------------------
-- View `siap`.`vta_profesor_asistencias`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `siap`.`vta_profesor_asistencias`;
USE `siap`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `siap`.`vta_profesor_asistencias` AS select `pa`.`id` AS `id_profesor_asistencia`,`pa`.`estado` AS `estado`,`pa`.`fecha` AS `fecha`,`pa`.`profesor` AS `id_profesor`,`p`.`usuario` AS `id_usuario`,`u`.`cedula` AS `cedula`,`u`.`nombre` AS `nombre`,`u`.`apellido` AS `apellido`,`pa`.`grupo` AS `id_grupo` from ((`siap`.`t_profesor_asistencia` `pa` join `siap`.`t_profesor` `p`) join `siap`.`t_usuario` `u`) where ((`pa`.`profesor` = `p`.`id`) and (`p`.`usuario` = `u`.`id`)) order by `u`.`apellido`,`u`.`nombre`,`pa`.`fecha`;

-- -----------------------------------------------------
-- View `siap`.`vta_profesor_reposiciones`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `siap`.`vta_profesor_reposiciones`;
USE `siap`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `siap`.`vta_profesor_reposiciones` AS select `pr`.`id` AS `id_reposicion`,`pr`.`profesor_origen` AS `id_profesor_origen`,`po`.`usuario` AS `id_usuario_origen`,`uo`.`cedula` AS `cedula_origen`,`uo`.`nombre` AS `nombre_origen`,`uo`.`apellido` AS `apellido_origen`,`pr`.`profesor_reposicion` AS `id_profesor_reposicion`,`pd`.`usuario` AS `id_usuario_reposicion`,`ud`.`cedula` AS `cedula_reposicion`,`ud`.`nombre` AS `nombre_reposicion`,`ud`.`apellido` AS `apellido_reposicion`,`pr`.`fecha_reposicion` AS `fecha_reposicion`,`pr`.`grupo` AS `id_grupo`,`g`.`horario` AS `id_horario`,`h`.`dia` AS `dia`,`h`.`hora` AS `hora`,`g`.`taller` AS `id_taller`,`t`.`codigo` AS `codigo_taller`,`t`.`nivel` AS `nivel`,`t`.`descripcion` AS `descripcion`,`g`.`cupo_base` AS `cupo_base`,`g`.`cupo_extra` AS `cupo_extra`,`g`.`cupo_actual` AS `cupo_actual`,`g`.`periodo` AS `periodo` from (((((((`siap`.`t_profesor_reposicion` `pr` join `siap`.`t_profesor` `po`) join `siap`.`t_profesor` `pd`) join `siap`.`t_usuario` `uo`) join `siap`.`t_usuario` `ud`) join `siap`.`t_grupo` `g`) join `siap`.`t_horario` `h`) join `siap`.`t_taller` `t`) where ((`pr`.`profesor_origen` = `po`.`id`) and (`po`.`usuario` = `uo`.`id`) and (`pr`.`profesor_reposicion` = `pd`.`id`) and (`pd`.`usuario` = `ud`.`id`) and (`g`.`id` = `pr`.`grupo`) and (`g`.`horario` = `h`.`id`) and (`g`.`taller` = `t`.`id`)) order by `uo`.`apellido`,`uo`.`nombre`,`ud`.`apellido`,`ud`.`nombre`;

-- -----------------------------------------------------
-- View `siap`.`vta_profesores`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `siap`.`vta_profesores`;
USE `siap`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`perroloco`@`localhost` SQL SECURITY DEFINER VIEW `siap`.`vta_profesores` AS select `u`.`id` AS `id_usuario`,`u`.`cedula` AS `cedula`,`u`.`apellido` AS `apellido`,`u`.`nombre` AS `nombre`,`u`.`nacimiento` AS `nacimiento`,`u`.`usuario` AS `usuario`,`u`.`sexo` AS `sexo`,`u`.`clave` AS `clave`,`u`.`foto` AS `foto`,`u`.`correo` AS `correo`,`p`.`id` AS `id_profesor`,`p`.`rol` AS `rol` from (`siap`.`t_usuario` `u` join `siap`.`t_profesor` `p`) where (`u`.`id` = `p`.`usuario`) order by `u`.`apellido`,`u`.`nombre`;

-- -----------------------------------------------------
-- View `siap`.`vta_reposiciones`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `siap`.`vta_reposiciones`;
USE `siap`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`perroloco`@`localhost` SQL SECURITY DEFINER VIEW `siap`.`vta_reposiciones` AS select `r`.`id` AS `id_reposicion`,`r`.`grupo_reposicion` AS `grupo_reposicion`,`r`.`fecha_reposicion` AS `fecha_reposicion`,`h`.`dia` AS `dia_reposicion`,`h`.`hora` AS `hora_reposicion`,`r`.`comprobante` AS `comprobante`,`r`.`observacion` AS `observacion`,`r`.`estado` AS `estado`,`t`.`descripcion` AS `descripcion`,`e`.`id` AS `id_estudiante`,`e`.`nivel` AS `nivel`,`u`.`id` AS `id_usuario`,`u`.`cedula` AS `cedula`,`u`.`nombre` AS `nombre`,`u`.`apellido` AS `apellido` from (((((`siap`.`t_reposicion` `r` join `siap`.`t_estudiante` `e`) join `siap`.`t_usuario` `u`) join `siap`.`t_taller` `t`) join `siap`.`t_grupo` `g`) join `siap`.`t_horario` `h`) where ((`r`.`estudiante` = `e`.`id`) and (`e`.`usuario` = `u`.`id`) and (`r`.`grupo_reposicion` = `g`.`id`) and (`g`.`taller` = `t`.`id`) and (`g`.`horario` = `h`.`id`));

-- -----------------------------------------------------
-- View `siap`.`vta_usuario_temp`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `siap`.`vta_usuario_temp`;
USE `siap`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`perroloco`@`localhost` SQL SECURITY DEFINER VIEW `siap`.`vta_usuario_temp` AS select `u`.`id` AS `id`,`u`.`cedula` AS `cedula`,`u`.`foto` AS `foto`,`u`.`nombre` AS `nombre`,`u`.`apellido` AS `apellido`,`u`.`nacimiento` AS `nacimiento`,`u`.`usuario` AS `usuario`,`u`.`sexo` AS `sexo`,`u`.`tipo_usuario` AS `tipo_usuario`,`u`.`created_at` AS `creado`,`u`.`estado` AS `estado`,`u`.`correo` AS `correo` from `siap`.`t_usuario_temp` `u` order by `u`.`estado`;

-- -----------------------------------------------------
-- View `siap`.`vta_usuario_temp_admin`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `siap`.`vta_usuario_temp_admin`;
USE `siap`;
CREATE  OR REPLACE ALGORITHM=UNDEFINED DEFINER=`perroloco`@`localhost` SQL SECURITY DEFINER VIEW `siap`.`vta_usuario_temp_admin` AS select `u`.`id` AS `id`,`u`.`cedula` AS `cedula`,`u`.`foto` AS `foto`,`u`.`nombre` AS `nombre`,`u`.`apellido` AS `apellido`,`u`.`nacimiento` AS `nacimiento`,`u`.`usuario` AS `usuario`,`u`.`clave` AS `clave`,`u`.`sexo` AS `sexo`,`u`.`tipo_usuario` AS `tipo_usuario`,`u`.`created_at` AS `creado`,`u`.`estado` AS `estado` from `siap`.`t_usuario_temp` `u` order by `u`.`estado`;
USE `siap`;

DELIMITER $$
USE `siap`$$
CREATE
DEFINER=`root`@`localhost`
TRIGGER `siap`.`t_matricula_AFTER_INSERT`
AFTER INSERT ON `siap`.`t_matricula`
FOR EACH ROW
BEGIN
	declare vls_grupo varchar(255);
    declare vls_estudiante varchar(45);
    select descripcion
    into vls_grupo
    from vta_grupos
    where id_grupo = NEW.grupo;
    select fs_cedula_estudiante_por_id (NEW.estudiante)
    into vls_estudiante;
    insert into t_matricula_reporte (grupo,estudiante,accion)
    values (vls_grupo,vls_estudiante, 'MATRICULA CREADA');
END$$

USE `siap`$$
CREATE
DEFINER=`root`@`localhost`
TRIGGER `siap`.`t_matricula_BEFORE_DELETE`
BEFORE DELETE ON `siap`.`t_matricula`
FOR EACH ROW
BEGIN
declare vls_grupo varchar(255);
    declare vls_estudiante varchar(45);
    select descripcion
    into vls_grupo
    from vta_grupos
    where id_grupo = OLD.grupo;
    select fs_cedula_estudiante_por_id (OLD.estudiante)
    into vls_estudiante;
    insert into t_matricula_reporte (grupo,estudiante,accion)
    values (vls_grupo,vls_estudiante, 'MATRICULA ELIMINADA');
END$$


DELIMITER ;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
