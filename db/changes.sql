use siap;
ALTER TABLE `siap`.`t_profesor_asistencia` 
DROP FOREIGN KEY `fk_t_asistencia_t_grupo2`;
ALTER TABLE `siap`.`t_profesor_asistencia` 
DROP COLUMN `grupo`,
DROP INDEX `fk_t_asistencia_t_grupo2_idx` ;
;
ALTER TABLE `siap`.`t_profesor_asistencia` 
ADD COLUMN `grupo` INT NOT NULL AFTER `profesor`;



CREATE TABLE `siap`.`t_oficina_asistencia` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `estado` VARCHAR(45) NOT NULL,
  `fecha` VARCHAR(30) NOT NULL,
  `usuario` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_asistencia_admin_idx` (`usuario` ASC) VISIBLE,
  CONSTRAINT `fk_asistencia_admin`
    FOREIGN KEY (`usuario`)
    REFERENCES `siap`.`t_administrativo` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);

ALTER TABLE `siap`.`t_oficina_asistencia` 
DROP FOREIGN KEY `fk_asistencia_admin`;
ALTER TABLE `siap`.`t_oficina_asistencia` 
ADD INDEX `fk_asistencia_admin_idx` (`usuario` ASC) VISIBLE,
DROP INDEX `fk_asistencia_admin_idx` ;
;
ALTER TABLE `siap`.`t_oficina_asistencia` 
ADD CONSTRAINT `fk_asistencia_admin`
  FOREIGN KEY (`usuario`)
  REFERENCES `siap`.`t_usuario` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;



CREATE TABLE `siap`.`t_horario_asistencia` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `usuario` VARCHAR(200) NOT NULL,
  `tipo` VARCHAR(45) NOT NULL,
  `fecha` VARCHAR(200) NOT NULL,
  PRIMARY KEY (`id`));


CREATE  OR REPLACE VIEW `vta_horario_asistencia` AS
select 
	a.id as id,
	CONCAT(u.nombre ," ", u.apellido) as nombre,
    u.cedula as cedula, 
    a.fecha as fecha,
		a.tipo as tipo
from t_usuario u join t_horario_asistencia a
where u.cedula = a.usuario;




DROP procedure IF EXISTS `prc_actualizar_horario_asistencia`;

DELIMITER $$
USE `siap`$$
CREATE PROCEDURE `prc_actualizar_horario_asistencia` (in _fecha VARCHAR(200), in _tipo varchar(45), in _id INT)
BEGIN
	update t_horario_asistencia set fecha = _fecha, tipo = _tipo where id = _id;
END$$

DELIMITER ;


DROP procedure IF EXISTS `prc_eliminar_horario_asistencia`;

DELIMITER $$
USE `siap`$$
CREATE PROCEDURE `prc_eliminar_horario_asistencia` (in _id INT)
BEGIN
	delete from t_horario_asistencia where id = _id;
END$$

DELIMITER ;


USE `siap`;
DROP procedure IF EXISTS `prc_insertar_horario_asistencia`;

DELIMITER $$
USE `siap`$$
CREATE PROCEDURE `prc_insertar_horario_asistencia` (in _usuario varchar(200), in _fecha varchar(200), in _tipo varchar(45))
BEGIN
	insert into t_horario_asistencia(usuario,fecha,tipo) values(_usuario, _fecha, _tipo);
select last_insert_id() as id from dual;
END$$

DELIMITER ;

USE `siap`;
CREATE  OR REPLACE VIEW `vta_oficina_asistencia` AS

SELECT 
        `oa`.`id` AS `id`,
        `oa`.`estado` AS `estado`,
        `oa`.`fecha` AS `fecha`,
        `oa`.`usuario` AS `id_admin`,
        `u`.`cedula` AS `cedula`,
        CONCAT(`u`.`nombre` , " ", `u`.`apellido` ) as `nombre`
    FROM
        (`t_oficina_asistencia` `oa`
        JOIN `t_usuario` `u`)
    WHERE
        (`oa`.`usuario` = `u`.`id`);


USE `siap`;
DROP procedure IF EXISTS `prc_insertar_asistencia_horario_all`;

DELIMITER $$
USE `siap`$$
CREATE PROCEDURE `prc_insertar_asistencia_horario_all` (in _estado varchar(45), in _fecha varchar(30), in _usuario INT)
BEGIN
	insert into t_oficina_asistencia (estado, fecha, usuario) values(_estado, _fecha, _usuario);
END$$

DELIMITER ;

