CREATE TABLE IF NOT EXISTS `PatientTbl` (
	`id` INT NOT NULL AUTO_INCREMENT,
	`age` INT,
	`sex` VARCHAR(1),
	`version` INT NOT NULL DEFAULT 1,
	`left_eye_image` VARCHAR(255),
	`right_eye_image` VARCHAR(255),
	`left_eye_resized_image` VARCHAR(255),
	`right_eye_resized_image` VARCHAR(255),
	`left_diabetic_retinography_stage_0` FLOAT,
    `left_diabetic_retinography_stage_1` FLOAT,
    `left_diabetic_retinography_stage_2` FLOAT,
    `left_diabetic_retinography_stage_3` FLOAT,
    `left_diabetic_retinography_stage_4` FLOAT,
    `right_diabetic_retinography_stage_0` FLOAT,
    `right_diabetic_retinography_stage_1` FLOAT,
    `right_diabetic_retinography_stage_2` FLOAT,
    `right_diabetic_retinography_stage_3` FLOAT,
    `right_diabetic_retinography_stage_4` FLOAT,
    `left_ocular` TINYINT,
    `right_ocular` TINYINT,
    `left_glaucoma` TINYINT,
    `right_glaucoma` TINYINT,
    `updatedDate` DATETIME DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `PatientHistoryTbl` (
	`id` INT NOT NULL,
    `version` INT NOT NULL,
	`age` INT,
	`sex` VARCHAR(1),
	`left_eye_image` VARCHAR(255),
	`right_eye_image` VARCHAR(255),
	`left_eye_resized_image` VARCHAR(255),
	`right_eye_resized_image` VARCHAR(255),
	`left_diabetic_retinography_stage_0` FLOAT,
    `left_diabetic_retinography_stage_1` FLOAT,
    `left_diabetic_retinography_stage_2` FLOAT,
    `left_diabetic_retinography_stage_3` FLOAT,
    `left_diabetic_retinography_stage_4` FLOAT,
    `right_diabetic_retinography_stage_0` FLOAT,
    `right_diabetic_retinography_stage_1` FLOAT,
    `right_diabetic_retinography_stage_2` FLOAT,
    `right_diabetic_retinography_stage_3` FLOAT,
    `right_diabetic_retinography_stage_4` FLOAT,
    `left_ocular` TINYINT,
    `right_ocular` TINYINT,
    `left_glaucoma` TINYINT,
    `right_glaucoma` TINYINT,
    `createdDate` DATETIME DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (`id`, `version`)
);

CREATE TABLE IF NOT EXISTS `DoctorTbl` (
	`id` INT NOT NULL AUTO_INCREMENT,
    `hash` VARCHAR(255),
    `username` VARCHAR(255),
    
	PRIMARY KEY (`id`)
);

