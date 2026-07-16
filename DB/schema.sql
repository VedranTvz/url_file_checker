CREATE DATABASE IF NOT EXISTS file_checker;
USE file_checker;

CREATE TABLE users (
  uuid VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  phone_number VARCHAR(20) UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE scan_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_uuid VARCHAR(36) NOT NULL,
  type ENUM('url', 'file') NOT NULL,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  status VARCHAR(100) NOT NULL,
  summary TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_uuid) REFERENCES users(uuid) ON DELETE CASCADE
);