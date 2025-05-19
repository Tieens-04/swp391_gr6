CREATE TABLE verification_tokens (
    email VARCHAR(255),
    otp_code CHAR(6),
    expires_at TIMESTAMP,
	PRIMARY KEY(email)
);

CREATE TABLE `users` (
	`user_id` VARCHAR(15) NOT NULL UNIQUE,
	`full_name` VARCHAR(127),
	`email` VARCHAR(127) UNIQUE,
	`password_hash` VARCHAR(255),
	`role` ENUM('applicant', 'organization', 'admin'),
	`created_at` TIMESTAMP,
	`updated_at` TIMESTAMP,
	PRIMARY KEY(`user_id`)
);


CREATE TABLE `applicants` (
	`applicant_id` VARCHAR(15) NOT NULL UNIQUE,
	`date_of_birth` DATE,
	`nationality` VARCHAR(255),
	`education_level` VARCHAR(255),
	`major` VARCHAR(255),
	`gpa` DOUBLE,
	`cv_url` TEXT(65535),
	PRIMARY KEY(`applicant_id`)
);


CREATE TABLE `organizations` (
	`organization_id` VARCHAR(15) NOT NULL UNIQUE,
	`name` VARCHAR(255),
	`type` VARCHAR(255),
	`description` TEXT(65535),
	`website` VARCHAR(255),
	`contact_info` VARCHAR(255),
	PRIMARY KEY(`organization_id`)
);


CREATE TABLE `application` (
	`application_id` VARCHAR(15) NOT NULL UNIQUE,
	`applicant_id` VARCHAR(15) UNIQUE,
	`scholarship_id` VARCHAR(15) UNIQUE,
	`application_date` DATETIME,
	`status` VARCHAR(255),
	`motivation_letter_url` VARCHAR(255),
	`documents_url` VARCHAR(255),
	`updated_at` TIMESTAMP,
	PRIMARY KEY(`application_id`)
);


CREATE TABLE `scholarship` (
	`scholarship_id` VARCHAR(15) NOT NULL UNIQUE,
	`organization_id` VARCHAR(15),
	`title` VARCHAR(255),
	`description` TEXT(65535),
	`eligibility_requirements` VARCHAR(255),
	`application_deadline` DATETIME,
	`benefits` TEXT(65535),
	`field_of_study` VARCHAR(255),
	`education_level_required` VARCHAR(255),
	`location` VARCHAR(255),
	`is_active` BOOLEAN,
	`created_at` TIMESTAMP,
	PRIMARY KEY(`scholarship_id`)
);


CREATE TABLE `saved_scholarship` (
	`id` VARCHAR(255) NOT NULL UNIQUE,
	`applicant_id` VARCHAR(15),
	`scholarship_id` VARCHAR(15),
	`saved_at` TIMESTAMP,
	PRIMARY KEY(`id`)
);


CREATE TABLE `messages` (
	`message_id` INTEGER NOT NULL AUTO_INCREMENT UNIQUE,
	`sender_id` VARCHAR(15),
	`receiver_id` VARCHAR(15),
	`content` VARCHAR(255),
	`sent_at` TIMESTAMP,
	`is_read` BOOLEAN,
	PRIMARY KEY(`message_id`)
);


CREATE TABLE `reviews` (
	`review_id` VARCHAR(15) NOT NULL UNIQUE,
	`applicant_id` VARCHAR(15),
	`organization_id` VARCHAR(15),
	`rating` DOUBLE,
	`comment` TEXT(65535),
	`review_date` TIMESTAMP,
	PRIMARY KEY(`review_id`)
);


CREATE TABLE `notification` (
	`notification_id` VARCHAR(15) NOT NULL UNIQUE,
	`user_id` VARCHAR(15),
	`message` TEXT(65535),
	`created_at` TIMESTAMP,
	`is_read` BOOLEAN,
	PRIMARY KEY(`notification_id`)
);


ALTER TABLE `applicants`
ADD FOREIGN KEY(`applicant_id`) REFERENCES `users`(`user_id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `organizations`
ADD FOREIGN KEY(`organization_id`) REFERENCES `users`(`user_id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `application`
ADD FOREIGN KEY(`applicant_id`) REFERENCES `applicants`(`applicant_id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `application`
ADD FOREIGN KEY(`scholarship_id`) REFERENCES `scholarship`(`scholarship_id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `scholarship`
ADD FOREIGN KEY(`organization_id`) REFERENCES `organizations`(`organization_id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `saved_scholarship`
ADD FOREIGN KEY(`applicant_id`) REFERENCES `applicants`(`applicant_id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `saved_scholarship`
ADD FOREIGN KEY(`scholarship_id`) REFERENCES `scholarship`(`scholarship_id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `messages`
ADD FOREIGN KEY(`sender_id`) REFERENCES `users`(`user_id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `messages`
ADD FOREIGN KEY(`receiver_id`) REFERENCES `users`(`user_id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `reviews`
ADD FOREIGN KEY(`applicant_id`) REFERENCES `applicants`(`applicant_id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `reviews`
ADD FOREIGN KEY(`organization_id`) REFERENCES `organizations`(`organization_id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE `notification`
ADD FOREIGN KEY(`user_id`) REFERENCES `users`(`user_id`)
ON UPDATE NO ACTION ON DELETE NO ACTION;