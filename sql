CREATE DATABASE online_learning;
USE online_learning;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100)
);

INSERT INTO users (name, email) VALUES 
('Alice Nguyen', 'alice@example.com'),
('Bob Tran', 'bob@example.com'),
('Charlie Le', 'charlie@example.com'),
('Diana Pham', 'diana@example.com'),
('Ethan Hoang', 'ethan@example.com');

USE online_learning
CREATE TABLE courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

INSERT INTO courses (name) VALUES ('JavaScript Basics'), ('Node.js Advanced'), ('React for Beginners');
#1046 - No database selected