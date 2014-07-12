CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_name` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `user_password_hash` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `user_email` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_name` (`user_name`),
  UNIQUE KEY `user_email` (`user_email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE login_attempts (
  user_id int(11) NOT NULL,
  time varchar(30) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);
