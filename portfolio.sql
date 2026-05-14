-- ============================================
-- Portfolio Database Schema
-- Author: Safiy Osuuban
-- ============================================

CREATE DATABASE IF NOT EXISTS portfolio_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE portfolio_db;

-- ============================================
-- Projects Table
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    tech_stack VARCHAR(255) NOT NULL,
    github_url VARCHAR(255),
    live_url VARCHAR(255),
    image_url VARCHAR(255),
    category ENUM('web', 'mobile', 'backend', 'other') DEFAULT 'web',
    featured TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- Messages Table (Contact Form)
-- ============================================
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    is_read TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Admin Users Table
-- ============================================
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Seed Data: Projects
-- ============================================
INSERT INTO projects (title, description, tech_stack, github_url, live_url, image_url, category, featured) VALUES
(
    'Full-Stack Portfolio Website',
    'A comprehensive personal portfolio built with HTML5, CSS3, JavaScript, PHP, and MySQL. Features an admin dashboard, contact management, AJAX-powered dynamic content, and responsive design.',
    'HTML5, CSS3, JavaScript, PHP, MySQL',
    'https://github.com/safiyosuuban/Internet-and-web-prigramming-project',
    '#',
    'img/project1.jpg',
    'web',
    1
),
(
    'Student Management System',
    'A web application to manage student records, grades, and attendance. Includes CRUD operations, search functionality, and PDF report generation.',
    'PHP, MySQL, Bootstrap, JavaScript',
    'https://github.com/safiyosuuban',
    '#',
    'img/project2.jpg',
    'backend',
    1
),
(
    'E-Commerce Product Catalog',
    'A dynamic product catalog with filtering, sorting, and a shopping cart powered by localStorage. Features a clean UI with smooth animations and responsive grid layout.',
    'HTML5, CSS3, JavaScript, LocalStorage',
    'https://github.com/safiyosuuban',
    '#',
    'img/project3.jpg',
    'web',
    1
),
(
    'REST API with Authentication',
    'A RESTful API built with PHP featuring JWT authentication, rate limiting, and CRUD endpoints for a blog platform. Includes Postman documentation.',
    'PHP, MySQL, JWT, REST API',
    'https://github.com/safiyosuuban',
    '#',
    'img/project4.jpg',
    'backend',
    0
);

-- ============================================
-- Seed Data: Admin User
-- Password: admin123 (bcrypt hashed)
-- ============================================
INSERT INTO admin_users (username, password_hash, email) VALUES
('admin', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMqJqhN8/LewdBpj2oLH0Kj3Hy', 'admin@portfolio.com');
