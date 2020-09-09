
CREATE SCHEMA IF NOT EXISTS `siapd`;
USE `siapd` ;

-- -----------------------------------------------------
-- Table `siapd`.`t_usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `siapd`.`t_usuario` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `cedula` VARCHAR(45) NOT NULL,
  `foto` BLOB NULL,
  `nombre` VARCHAR(55) NOT NULL,
  `apellido` VARCHAR(100) NOT NULL,
  `nacimiento` DATE NOT NULL,
  `usuario` VARCHAR(45) NOT NULL,
  `clave` VARCHAR(45) NOT NULL,
  `sexo` VARCHAR(45) NOT NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `username_UNIQUE` (`usuario`),
  UNIQUE INDEX `cedula_UNIQUE` (`cedula`) );


-- -----------------------------------------------------
-- Table `siapd`.`t_usuario_temp`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `siapd`.`t_usuario_temp` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `cedula` VARCHAR(45) NOT NULL,
  `nombre` VARCHAR(55) NOT NULL,
  `apellido` VARCHAR(100) NOT NULL,
  `nacimiento` DATE NOT NULL,
  `celular` VARCHAR(10) NULL,
  `telefono` VARCHAR(10) NULL,
  `correo` VARCHAR(45) NOT NULL,
  `direccion` VARCHAR(255) NULL,
  `usuario` VARCHAR(45) NOT NULL,
  `clave` VARCHAR(45) NOT NULL,
  `estado` INT NOT NULL,
  `moroso` INT NOT NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `username_UNIQUE` (`usuario`) ,
  UNIQUE INDEX `correo_UNIQUE` (`correo`) ,
  UNIQUE INDEX `cedula_UNIQUE` (`cedula`) );


-- -----------------------------------------------------
-- Table `siapd`.`t_estudiante`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `siapd`.`t_estudiante` (
  `id` INT NOT NULL,
  `usuario` INT NOT NULL,
  `correo` VARCHAR(45) NOT NULL,
  `celular` VARCHAR(10) NULL,
  `telefono` VARCHAR(10) NULL,
  `nivel` INT NOT NULL DEFAULT 0,
  `carrera_departamento` VARCHAR(100) NOT NULL,
  `cantidad_dias` INT NOT NULL,
  `telefono_emergencia` VARCHAR(150) NULL,
  `notas` VARCHAR(255) NULL,
  `provincia` VARCHAR(11) NULL,
  `canton` VARCHAR(50) NULL,
  `distrito` VARCHAR(60) NULL,
  `direccion` VARCHAR(255) NULL,
  `prematricula` DATE NULL,
  `moroso` INT NOT NULL DEFAULT 0,
  `estado` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  INDEX `fk_t_estudiante_t_usuario1_idx` (`usuario`) ,
  CONSTRAINT `fk_t_estudiante_t_usuario1`
    FOREIGN KEY (`usuario`)
    REFERENCES `siapd`.`t_usuario` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


-- -----------------------------------------------------
-- Table `siapd`.`t_padecimiento`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `siapd`.`t_padecimiento` (
  `id` INT NOT NULL,
  `descripcion` VARCHAR(255) NOT NULL,
  `estudiante` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_t_padecimiento_t_estudiante1_idx` (`estudiante`) ,
  CONSTRAINT `fk_t_padecimiento_t_estudiante1`
    FOREIGN KEY (`estudiante`)
    REFERENCES `siapd`.`t_estudiante` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


-- -----------------------------------------------------
-- Table `siapd`.`t_horario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `siapd`.`t_horario` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `dia` VARCHAR(55) NOT NULL,
  `hora` DATE NOT NULL,
  `inicio` DATE NOT NULL,
  `fin` DATE NOT NULL,
  PRIMARY KEY (`id`));


-- -----------------------------------------------------
-- Table `siapd`.`t_profesor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `siapd`.`t_profesor` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `usuario` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_t_profesor_t_usuario1_idx` (`usuario`) ,
  CONSTRAINT `fk_t_profesor_t_usuario1`
    FOREIGN KEY (`usuario`)
    REFERENCES `siapd`.`t_usuario` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


-- -----------------------------------------------------
-- Table `siapd`.`t_taller`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `siapd`.`t_taller` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `codigo` VARCHAR(45) NOT NULL,
  `descripcion` VARCHAR(255) NOT NULL,
  `nivel` INT NOT NULL,
  `costo` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`));


-- -----------------------------------------------------
-- Table `siapd`.`t_grupo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `siapd`.`t_grupo` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `horario` INT NOT NULL,
  `profesor` INT NOT NULL,
  `taller` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_t_taller_t_horario1_idx` (`horario`) ,
  INDEX `fk_t_taller_t_profesor1_idx` (`profesor`) ,
  INDEX `fk_t_grupo_t_taller1_idx` (`taller`) ,
  CONSTRAINT `fk_t_taller_t_horario1`
    FOREIGN KEY (`horario`)
    REFERENCES `siapd`.`t_horario` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_t_taller_t_profesor1`
    FOREIGN KEY (`profesor`)
    REFERENCES `siapd`.`t_profesor` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_t_grupo_t_taller1`
    FOREIGN KEY (`taller`)
    REFERENCES `siapd`.`t_taller` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


-- -----------------------------------------------------
-- Table `siapd`.`t_matricula`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `siapd`.`t_matricula` (
  `id` INT NOT NULL,
  `taller` INT NOT NULL,
  `estudiante` INT NOT NULL,
  `consentimiento` TINYINT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_t_matricula_t_taller1_idx` (`taller`) ,
  INDEX `fk_t_matricula_t_estudiante1_idx` (`estudiante`) ,
  CONSTRAINT `fk_t_matricula_t_taller1`
    FOREIGN KEY (`taller`)
    REFERENCES `siapd`.`t_grupo` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_t_matricula_t_estudiante1`
    FOREIGN KEY (`estudiante`)
    REFERENCES `siapd`.`t_estudiante` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


-- -----------------------------------------------------
-- Table `siapd`.`t_actividad`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `siapd`.`t_actividad` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `usuario` VARCHAR(45) NOT NULL,
  `descripcion` VARCHAR(100) NOT NULL,
  `created_at` TIMESTAMP NOT NULL,
  `updated_at` TIMESTAMP NOT NULL,
  PRIMARY KEY (`id`));


-- -----------------------------------------------------
-- Table `siapd`.`t_administrativo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `siapd`.`t_administrativo` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `rol` INT NOT NULL DEFAULT 0,
  `usuario` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_t_administrativo_t_usuario1_idx` (`usuario`) ,
  CONSTRAINT `fk_t_administrativo_t_usuario1`
    FOREIGN KEY (`usuario`)
    REFERENCES `siapd`.`t_usuario` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


-- -----------------------------------------------------
-- Table `siapd`.`t_casillero`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `siapd`.`t_casillero` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `codigo` VARCHAR(45) NOT NULL,
  `estudiante` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `codigo_UNIQUE` (`codigo`) ,
  INDEX `fk_t_casillero_t_estudiante1_idx` (`estudiante`) ,
  CONSTRAINT `fk_t_casillero_t_estudiante1`
    FOREIGN KEY (`estudiante`)
    REFERENCES `siapd`.`t_estudiante` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


-- -----------------------------------------------------
-- Table `siapd`.`t_pago`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `siapd`.`t_pago` (
  `id` INT NOT NULL,
  `fecha` DATE NOT NULL,
  `monto` INT NOT NULL,
  `estudiante` INT NOT NULL,
  `documento` VARCHAR(55) NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_t_pago_t_estudiante1_idx` (`estudiante`) ,
  CONSTRAINT `fk_t_pago_t_estudiante1`
    FOREIGN KEY (`estudiante`)
    REFERENCES `siapd`.`t_estudiante` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


-- -----------------------------------------------------
-- Table `siapd`.`t_asistencia`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `siapd`.`t_asistencia` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `dia` DATE NOT NULL,
  `hora` TIME NOT NULL,
  `estudiante` INT NOT NULL,
  `grupo` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_t_asistencia_t_estudiante1_idx` (`estudiante`) ,
  INDEX `fk_t_asistencia_t_grupo1_idx` (`grupo`) ,
  CONSTRAINT `fk_t_asistencia_t_estudiante1`
    FOREIGN KEY (`estudiante`)
    REFERENCES `siapd`.`t_estudiante` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_t_asistencia_t_grupo1`
    FOREIGN KEY (`grupo`)
    REFERENCES `siapd`.`t_grupo` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


-- -----------------------------------------------------
-- Table `siapd`.`t_reposicion`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `siapd`.`t_reposicion` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `estudiante` INT NOT NULL,
  `grupo_origen` INT NOT NULL,
  `grupo_reposicion` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_t_reposicion_t_estudiante1_idx` (`estudiante`) ,
  INDEX `fk_t_reposicion_t_grupo2_idx` (`grupo_origen`) ,
  INDEX `fk_t_reposicion_t_grupo1_idx` (`grupo_reposicion`) ,
  CONSTRAINT `fk_t_reposicion_t_estudiante1`
    FOREIGN KEY (`estudiante`)
    REFERENCES `siapd`.`t_estudiante` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_t_reposicion_t_grupo2`
    FOREIGN KEY (`grupo_origen`)
    REFERENCES `siapd`.`t_grupo` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_t_reposicion_t_grupo1`
    FOREIGN KEY (`grupo_reposicion`)
    REFERENCES `siapd`.`t_grupo` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


-- -----------------------------------------------------
-- Table `siapd`.`t_anotaciones`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `siapd`.`t_anotaciones` (
  `id` INT NOT NULL,
  `nota` VARCHAR(300) NOT NULL,
  `profesor` INT NOT NULL,
  `estudiante` INT NOT NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_t_anotaciones_t_profesor1_idx` (`profesor`) ,
  INDEX `fk_t_anotaciones_t_estudiante1_idx` (`estudiante`) ,
  CONSTRAINT `fk_t_anotaciones_t_profesor1`
    FOREIGN KEY (`profesor`)
    REFERENCES `siapd`.`t_profesor` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_t_anotaciones_t_estudiante1`
    FOREIGN KEY (`estudiante`)
    REFERENCES `siapd`.`t_estudiante` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
