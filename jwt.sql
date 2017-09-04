-- --------------------------------------------------------
-- Host:                         localhost
-- Server version:               5.7.17-log - MySQL Community Server (GPL)
-- Server OS:                    Win32
-- HeidiSQL Version:             9.4.0.5125
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Dumping database structure for jwt
CREATE DATABASE IF NOT EXISTS `jwt` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `jwt`;

-- Dumping structure for procedure jwt.findUserById
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `findUserById`(
	IN `id` INT
)
BEGIN
	SELECT * from user WHERE user.id = id;
END//
DELIMITER ;

-- Dumping structure for procedure jwt.GetUserAccount
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetUserAccount`(
	IN `username` VARCHAR(50),
	IN `password` VARCHAR(50)
)
BEGIN
	SELECT *
	  FROM user
	 WHERE user.user_name = username AND user.user_pass = password;
END//
DELIMITER ;

-- Dumping structure for procedure jwt.GetUserByUsername
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetUserByUsername`(
	IN `username` VARCHAR(255)
)
BEGIN
	SELECT * from user where user.user_name = username;
END//
DELIMITER ;

-- Dumping structure for procedure jwt.GetUserRoles
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetUserRoles`(
	IN `id` INT
)
BEGIN
	SELECT r.role_desc AS 'role'
	  FROM user_role ur
	  JOIN role r ON ur.role_id = r.id
	  JOIN user u ON ur.user_id = u.id
	 WHERE u.id = id;
END//
DELIMITER ;

-- Dumping structure for procedure jwt.GetUsers
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetUsers`()
BEGIN
	SELECT * from user;
END//
DELIMITER ;

-- Dumping structure for table jwt.oauth_client_details
CREATE TABLE IF NOT EXISTS `oauth_client_details` (
  `client_id` varchar(256) NOT NULL,
  `resource_ids` varchar(256) DEFAULT NULL,
  `client_secret` varchar(256) DEFAULT NULL,
  `scope` varchar(256) DEFAULT NULL,
  `authorized_grant_types` varchar(256) DEFAULT NULL,
  `web_server_redirect_uri` varchar(256) DEFAULT NULL,
  `authorities` varchar(256) DEFAULT NULL,
  `access_token_validity` int(11) DEFAULT NULL,
  `refresh_token_validity` int(11) DEFAULT NULL,
  `additional_information` varchar(4096) DEFAULT NULL,
  `autoapprove` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`client_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table jwt.oauth_client_details: ~1 rows (approximately)
/*!40000 ALTER TABLE `oauth_client_details` DISABLE KEYS */;
REPLACE INTO `oauth_client_details` (`client_id`, `resource_ids`, `client_secret`, `scope`, `authorized_grant_types`, `web_server_redirect_uri`, `authorities`, `access_token_validity`, `refresh_token_validity`, `additional_information`, `autoapprove`) VALUES
	('project40_clients', 'oauth2-resource', 'Ksw3+Bu8ip%K^8re;v<R', 'read,write,trust', 'client_credentials,password,authorization_code,refresh_token', NULL, 'ROLE_CLIENT,ROLE_TRUSTED_CLIENT', 36000, 36000, NULL, '1');
/*!40000 ALTER TABLE `oauth_client_details` ENABLE KEYS */;

-- Dumping structure for table jwt.role
CREATE TABLE IF NOT EXISTS `role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `role_desc` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- Dumping data for table jwt.role: ~2 rows (approximately)
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
REPLACE INTO `role` (`id`, `role_desc`) VALUES
	(1, 'Settings'),
	(2, 'DepartmentHead');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;

-- Dumping structure for table jwt.user
CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_name` varchar(30) NOT NULL,
  `user_pass` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_name` (`user_name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- Dumping data for table jwt.user: ~2 rows (approximately)
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
REPLACE INTO `user` (`id`, `user_name`, `user_pass`) VALUES
	(1, 'jerico', '$2a$10$91JVyrsSuZ0lvS/.pZGzouiV3x3vOCEFItlP.mV1GdjynC7h3QIju'),
	(2, 'eric', '$2a$10$jnyim0moFrTMgY/yJkHGAeG6VCkcM6.cn.1SeuWlCOH9U4RYh/ciW');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;

-- Dumping structure for table jwt.user_role
CREATE TABLE IF NOT EXISTS `user_role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `user_role_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `user_role_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- Dumping data for table jwt.user_role: ~3 rows (approximately)
/*!40000 ALTER TABLE `user_role` DISABLE KEYS */;
REPLACE INTO `user_role` (`id`, `user_id`, `role_id`) VALUES
	(1, 1, 1),
	(2, 1, 2),
	(3, 2, 2);
/*!40000 ALTER TABLE `user_role` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
