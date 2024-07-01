DROP TABLE IF EXISTS `insurance_policy_coverage`;
DROP TABLE IF EXISTS `insurance_policy`;
DROP TABLE IF EXISTS `agent_token`;
DROP TABLE IF EXISTS `agent`;
DROP TABLE IF EXISTS `requester`;

CREATE TABLE `agent` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `phone_number` varchar(255) NOT NULL,
  `language_preference` varchar(255) NOT NULL,
  `theme_preference` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `agent_title` enum('AGENT','BROKER','UNDERWRITER','CONSULTANT','ACCOUNT_EXECUTIVE','RISK_MANAGER') NOT NULL,
  `user_role` enum('SALES_AGENT','ADMIN') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_email_agent` (`email`)
) ENGINE=InnoDB CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

CREATE TABLE `requester` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `phone_number` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_email_requester` (`email`)
) ENGINE=InnoDB CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

CREATE TABLE `agent_token` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `agent_id` bigint(20) DEFAULT NULL,
  `expiry_date` datetime(6) NOT NULL,
  `token` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_agent_id_agent_token` (`agent_id`),
  CONSTRAINT `FK_agent_token_agent_id` FOREIGN KEY (`agent_id`) REFERENCES agent (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

CREATE TABLE `insurance_policy` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `date_created` date NOT NULL,
  `estimated_price` double NOT NULL,
  `loss_price_range_max` double NOT NULL,
  `loss_price_range_min` double NOT NULL,
  `agent_id` bigint(20) DEFAULT NULL,
  `requester_id` bigint(20) DEFAULT NULL,
  `insurance_item` enum('CAR','HOUSE','HEALTH','JEWELRY','BUSINESS','TRAVEL') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_agent_id_policy` (`agent_id`),
  KEY `IDX_requester_id_policy` (`requester_id`),
  CONSTRAINT `FK_policy_agent_id` FOREIGN KEY (`agent_id`) REFERENCES `agent` (`id`),
  CONSTRAINT `FK_policy_requester_id` FOREIGN KEY (`requester_id`) REFERENCES `requester` (`id`)
) ENGINE=InnoDB CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

CREATE TABLE `insurance_policy_coverage` (
  `insurance_policy_id` bigint(20) NOT NULL,
  `coverages` enum('TRAFFIC_ACCIDENT','THEFT','FIRE','NATURAL_DISASTER','BUILDING_INSURANCE','LANDLORD_INSURANCE','BASIC','PRIVATE','PUBLIC','ADVANCED','SHIPPING','CYBER','CREDIT_RISK','BUSINESS_PROPERTY') DEFAULT NULL,
  KEY `IDX_policy_id_policy_coverage` (`insurance_policy_id`),
  CONSTRAINT `FK_policy_coverage_policy_id` FOREIGN KEY (`insurance_policy_id`) REFERENCES `insurance_policy` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;