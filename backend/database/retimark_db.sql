CREATE TABLE IF NOT EXISTS `PatientTbl` (
	`id` INT NOT NULL AUTO_INCREMENT,
    `version` INT NOT NULL DEFAULT 1,
	`date_of_birth` DATE,
	`sex` VARCHAR(1),
	`left_eye_image` VARCHAR(255),
	`right_eye_image` VARCHAR(255),
	`left_diabetic_retinography_stage` TINYINT,
    `left_diabetic_retinography_prob` FLOAT,
    `right_diabetic_retinography_stage` TINYINT,
    `right_diabetic_retinography_prob` FLOAT,
    `left_ocular_prob` FLOAT,
    `right_ocular_prob` FLOAT,
    `left_glaucoma_prob` FLOAT,
    `right_glaucoma_prob` FLOAT,
    `visit_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `PatientHistoryTbl` (
	`id` INT NOT NULL,
    `version` INT NOT NULL,
	`date_of_birth` DATE,
	`sex` VARCHAR(1),
	`left_eye_image` VARCHAR(255),
	`right_eye_image` VARCHAR(255),
	`left_diabetic_retinography_stage` TINYINT,
    `left_diabetic_retinography_prob` FLOAT,
    `right_diabetic_retinography_stage` TINYINT,
    `right_diabetic_retinography_prob` FLOAT,
    `left_ocular_prob` FLOAT,
    `right_ocular_prob` FLOAT,
    `left_glaucoma_prob` FLOAT,
    `right_glaucoma_prob` FLOAT,
    `visit_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`, `version`)
);

CREATE TABLE IF NOT EXISTS `UserTbl` (
	`id` INT NOT NULL AUTO_INCREMENT,
    `password` VARCHAR(255),
    `username` VARCHAR(255),
    
	PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `TokenTbl` (
	`id` INT NOT NULL AUTO_INCREMENT,
    `user_id` INT NOT NULL,
    `value` VARCHAR(255),
    `types` ENUM('access', 'refresh'),
    `expires` DATETIME,
    `blacklisted` TINYINT,
    
	PRIMARY KEY (`id`),
    FOREIGN KEY (`user_id`) REFERENCES UserTbl(`id`)
);

-- TRIGGER


DELIMITER $$

CREATE TRIGGER before_patient_update
BEFORE UPDATE
ON PatientTbl FOR EACH ROW
BEGIN
    SET NEW.`version` = OLD.`version` + 1;
    SET NEW.`visit_date` = now();
END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER after_patient_update
AFTER UPDATE
ON PatientTbl FOR EACH ROW
BEGIN
	INSERT INTO PatientHistoryTbl
	VALUES(NEW.id, NEW.`version`, NEW.date_of_birth, NEW.sex, NEW.left_eye_image,
    NEW.right_eye_image, NEW.left_diabetic_retinography_stage, NEW.left_diabetic_retinography_prob,
    NEW.right_diabetic_retinography_stage, NEW.right_diabetic_retinography_prob,
    NEW.left_ocular_prob, NEW.right_ocular_prob, NEW.left_glaucoma_prob, NEW.right_glaucoma_prob,
    NEW.visit_date);
END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER after_patient_insert
AFTER INSERT
ON PatientTbl FOR EACH ROW
BEGIN
	INSERT INTO PatientHistoryTbl
	VALUES(NEW.id, NEW.`version`, NEW.date_of_birth, NEW.sex, NEW.left_eye_image,
    NEW.right_eye_image, NEW.left_diabetic_retinography_stage, NEW.left_diabetic_retinography_prob,
    NEW.right_diabetic_retinography_stage, NEW.right_diabetic_retinography_prob,
    NEW.left_ocular_prob, NEW.right_ocular_prob, NEW.left_glaucoma_prob, NEW.right_glaucoma_prob,
    NEW.visit_date);
END$$

DELIMITER ;

-- INSERT PATIENT

INSERT INTO PatientTbl (date_of_birth, sex, left_eye_image,
    right_eye_image, left_diabetic_retinography_stage, left_diabetic_retinography_prob,
    right_diabetic_retinography_stage, right_diabetic_retinography_prob,
    left_ocular_prob, right_ocular_prob, left_glaucoma_prob, right_glaucoma_prob)
VALUES ('2000-01-01', 'M', 'left_image.jpg', 'right_image.jpg',
    0, 0.85, 0, 0.92, 0.75, 0.88, 0.6, 0.7)


-- UPDATE PATIENT

UPDATE PatientTbl
SET
    left_eye_image = 'new_left_image.jpg',
    right_eye_image = 'new_right_image.jpg',
    left_diabetic_retinography_stage = 0,
    left_diabetic_retinography_prob = 0.95,
    right_diabetic_retinography_stage = 0,
    right_diabetic_retinography_prob = 0.98,
    left_ocular_prob = 0.88,
    right_ocular_prob = 0.92,
    left_glaucoma_prob = 0.75,
    right_glaucoma_prob = 0.78
WHERE id = 1; 