-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema creighton4good
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema creighton4good
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `creighton4good` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `creighton4good` ;

-- -----------------------------------------------------
-- Table `creighton4good`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `creighton4good`.`users` (
  `user_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(254) NOT NULL,
  `display_name` VARCHAR(120) NOT NULL,
  `sso_subject` VARCHAR(255) NULL DEFAULT NULL,
  `role` ENUM('STUDENT', 'STAFF', 'ADMIN') NOT NULL DEFAULT 'STUDENT',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `email` (`email` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `creighton4good`.`organizations`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `creighton4good`.`organizations` (
  `org_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(150) NOT NULL,
  `type` ENUM('DINING', 'DEPARTMENT', 'CLUB', 'EXTERNAL') NOT NULL DEFAULT 'DINING',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`org_id`),
  UNIQUE INDEX `name` (`name` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `creighton4good`.`locations`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `creighton4good`.`locations` (
  `location_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `org_id` BIGINT UNSIGNED NOT NULL,
  `name` VARCHAR(120) NOT NULL,
  `building` VARCHAR(120) NULL DEFAULT NULL,
  `room` VARCHAR(40) NULL DEFAULT NULL,
  `latitude` DECIMAL(9,6) NULL DEFAULT NULL,
  `longitude` DECIMAL(9,6) NULL DEFAULT NULL,
  PRIMARY KEY (`location_id`),
  UNIQUE INDEX `uniq_loc` (`org_id` ASC, `name` ASC, `room` ASC) VISIBLE,
  INDEX `idx_loc_org` (`org_id` ASC) VISIBLE,
  CONSTRAINT `fk_loc_org`
    FOREIGN KEY (`org_id`)
    REFERENCES `creighton4good`.`organizations` (`org_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `creighton4good`.`events`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `creighton4good`.`events` (
  `event_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `org_id` BIGINT UNSIGNED NOT NULL,
  `location_id` BIGINT UNSIGNED NOT NULL,
  `created_by` BIGINT UNSIGNED NOT NULL,
  `title` VARCHAR(160) NOT NULL,
  `description` TEXT NULL DEFAULT NULL,
  `start_time` TIMESTAMP NOT NULL,
  `end_time` TIMESTAMP NULL DEFAULT NULL,
  `status` ENUM('DRAFT', 'PUBLISHED', 'ACTIVE', 'ENDED', 'CANCELLED') NOT NULL DEFAULT 'DRAFT',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`event_id`),
  INDEX `idx_evt_time` (`status` ASC, `start_time` ASC) VISIBLE,
  INDEX `idx_evt_loc` (`location_id` ASC, `start_time` ASC) VISIBLE,
  INDEX `idx_evt_org` (`org_id` ASC, `start_time` ASC) VISIBLE,
  INDEX `fk_evt_creator` (`created_by` ASC) VISIBLE,
  CONSTRAINT `fk_evt_creator`
    FOREIGN KEY (`created_by`)
    REFERENCES `creighton4good`.`users` (`user_id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_evt_loc`
    FOREIGN KEY (`location_id`)
    REFERENCES `creighton4good`.`locations` (`location_id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_evt_org`
    FOREIGN KEY (`org_id`)
    REFERENCES `creighton4good`.`organizations` (`org_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `creighton4good`.`event_items`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `creighton4good`.`event_items` (
  `event_item_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `event_id` BIGINT UNSIGNED NOT NULL,
  `name` VARCHAR(140) NOT NULL,
  `portions_available` INT UNSIGNED NOT NULL,
  `portions_claimed` INT UNSIGNED NOT NULL DEFAULT '0',
  `per_user_limit` SMALLINT UNSIGNED NOT NULL DEFAULT '0',
  PRIMARY KEY (`event_item_id`),
  INDEX `idx_item_event` (`event_id` ASC) VISIBLE,
  CONSTRAINT `fk_item_event`
    FOREIGN KEY (`event_id`)
    REFERENCES `creighton4good`.`events` (`event_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `creighton4good`.`claims`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `creighton4good`.`claims` (
  `claim_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `event_id` BIGINT UNSIGNED NOT NULL,
  `event_item_id` BIGINT UNSIGNED NULL DEFAULT NULL,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `quantity` SMALLINT UNSIGNED NOT NULL DEFAULT '1',
  `status` ENUM('CLAIMED', 'REDEEMED', 'CANCELLED', 'EXPIRED') NOT NULL DEFAULT 'CLAIMED',
  `claimed_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `redeemed_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`claim_id`),
  INDEX `idx_claim_event` (`event_id` ASC) VISIBLE,
  INDEX `idx_claim_user` (`user_id` ASC) VISIBLE,
  INDEX `fk_claim_item` (`event_item_id` ASC) VISIBLE,
  CONSTRAINT `fk_claim_event`
    FOREIGN KEY (`event_id`)
    REFERENCES `creighton4good`.`events` (`event_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_claim_item`
    FOREIGN KEY (`event_item_id`)
    REFERENCES `creighton4good`.`event_items` (`event_item_id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT `fk_claim_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `creighton4good`.`users` (`user_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
