CREATE TABLE `siap`.`t_urls` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `description` VARCHAR(300) NOT NULL,
  `url` VARCHAR(100) NOT NULL,
  `variation` VARCHAR(500) NOT NULL,
  `icon` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`));
