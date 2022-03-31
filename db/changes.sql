ALTER TABLE `siap`.`t_pago` 
DROP COLUMN `fecha`,
ADD COLUMN `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER `cuenta`,
CHANGE COLUMN `documento` `cuenta` VARCHAR(55) NULL DEFAULT NULL ;

ALTER TABLE `siap`.`t_pago` 
ADD COLUMN `grupo` INT NOT NULL AFTER `estudiante`,
ADD INDEX `fk_t_pago_t_grupo_idx` (`grupo` ASC) VISIBLE;
;
ALTER TABLE `siap`.`t_pago` 
ADD CONSTRAINT `fk_t_pago_t_grupo`
  FOREIGN KEY (`grupo`)
  REFERENCES `siap`.`t_grupo` (`id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;


CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `vta_pagos` AS
    SELECT 
        `t`.`codigo` AS `codigo_taller`,
        `t`.`nivel` AS `nivel_taller`,
        `t`.`descripcion` AS `descripcion`,
        `g`.`id` AS `id_grupo`,
        DATE_FORMAT(`g`.`periodo`, '%Y-%m-%d') AS `periodo`,
        DATE_FORMAT(`g`.`periodo_final`, '%Y-%m-%d') AS `periodo_final`,
        `h`.`dia` AS `dia`,
        `h`.`hora` AS `hora`,
        `h`.`hora_final` AS `hora_final`,
        CONCAT(`up`.`nombre`, ' ', `up`.`apellido`) AS `nombre_profesor`,
        `m`.`id` AS `id_matricula`,
        `m`.`activa` AS `activa`,
        DATE_FORMAT(`m`.`created_at`, '%Y-%m-%d') AS `created_at`,
        `e`.`id` AS `id_estudiante`,
        `u`.`id` AS `id_usuario`,
        `u`.`cedula` AS `cedula`,
        `u`.`apellido` AS `apellido`,
        `u`.`nombre` AS `nombre`,
        `u`.`foto` AS `foto`,
        `u`.`correo` AS `correo`,
        `pa`.`id` AS `id_pago`,
        `pa`.`monto` AS `monto_pagado`,
        `pa`.`cuenta` AS `cuenta_pago`,
        `pa`.`created_at` AS `pagado_fecha`
    FROM
        ((((((((`t_taller` `t`
        JOIN `t_grupo` `g`)
        JOIN `t_matricula` `m`)
        JOIN `t_estudiante` `e`)
        JOIN `t_usuario` `u`)
        JOIN `t_usuario` `up`)
        JOIN `t_horario` `h`)
        JOIN `t_profesor` `p`)
        JOIN `t_pago` `pa`)
    WHERE
        ((`m`.`grupo` = `g`.`id`)
            AND (`g`.`taller` = `t`.`id`)
            AND (`m`.`estudiante` = `e`.`id`)
            AND (`e`.`usuario` = `u`.`id`)
            AND (`h`.`id` = `g`.`horario`)
            AND (`p`.`id` = `g`.`profesor`)
            AND (`up`.`id` = `p`.`usuario`)
            AND (`pa`.`estudiante` = `e`.`id`)
            AND (`g`.`id` = `pa`.`grupo`))
    ORDER BY `t`.`codigo` , `g`.`id` , `u`.`apellido` , `u`.`nombre`


DROP procedure IF EXISTS `prc_insertar_pago`;
DELIMITER $$
USE `siap`$$
CREATE PROCEDURE `prc_insertar_pago` (in vpi_est INT, in vpv_cuenta VARCHAR(55), in vpi_monto INT)
BEGIN
	insert into t_pago (estudiante,monto,cuenta) values(vpi_est,vpi_monto,vpi_cuenta);
END$$

DELIMITER ;


DROP procedure IF EXISTS `prc_actualizar_pago`;

DELIMITER $$
USE `siap`$$
CREATE PROCEDURE `prc_actualizar_pago` (in id_pago INT, in vpi_est INT, in vpv_cuenta VARCHAR(55), in vpi_monto INT)
BEGIN
	update t_pago set estudiante = vpi_est , monto = vpi_monto , cuenta = vpv_cuenta where id = id_pago;
END$$

DELIMITER ;

DROP procedure IF EXISTS `prc_eliminar_pago`;

DELIMITER $$
USE `siap`$$
CREATE PROCEDURE `prc_eliminar_pago` (in id_pago INT)
BEGIN
	delete from t_pago where id = id_pago;
END$$

DELIMITER ;

