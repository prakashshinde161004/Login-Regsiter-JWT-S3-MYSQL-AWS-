-- Run this once in MySQL to set up the database and table.
-- In your terminal: mysql -u root -p < schema.sql

CREATE DATABASE IF NOT EXISTS login_app;
USE login_app;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  profile_pic_url VARCHAR(500) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
