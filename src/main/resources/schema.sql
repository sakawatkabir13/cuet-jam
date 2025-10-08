
CREATE DATABASE IF NOT EXISTS cuet_jam;
USE cuet_jam;

CREATE TABLE departments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(10) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE users (
    user_id VARCHAR(50) PRIMARY KEY,
    created_at DATETIME(6),
    email VARCHAR(160) UNIQUE NOT NULL,
    is_verified BIT(1) DEFAULT 0,
    name VARCHAR(120) NOT NULL,
    password VARCHAR(255) NOT NULL,
    updated_at DATETIME(6),
    user_type ENUM('STUDENT', 'FACULTY', 'ALUMNI') NOT NULL,
    verification_code VARCHAR(255),
    department_id BIGINT NOT NULL,
    
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

CREATE TABLE students (
    user_id VARCHAR(50) PRIMARY KEY,
    batch INT NOT NULL,
    is_admin BIT(1) DEFAULT 0,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE faculty (
    user_id VARCHAR(50) PRIMARY KEY,
    designation VARCHAR(120),
    research_areas TEXT,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE alumni (
    user_id VARCHAR(50) PRIMARY KEY,
    approved_at DATETIME(6),
    approved_by VARCHAR(50),
    current_working_place VARCHAR(200),
    is_approved BIT(1) DEFAULT 0,
    proof_url VARCHAR(500),
    research_areas TEXT,
    short_description TEXT,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES users(user_id)
);

CREATE TABLE posts (
    post_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    author_id VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    time_of_post DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    title VARCHAR(200) NOT NULL,
    updated_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    
    FOREIGN KEY (author_id) REFERENCES users(user_id)
);

CREATE TABLE lost_found (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    author_id VARCHAR(50) NOT NULL,
    category ENUM('LOST', 'FOUND') NOT NULL,
    description TEXT NOT NULL,
    time_of_post DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    title VARCHAR(200) NOT NULL,
    updated_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    url VARCHAR(500),
    
    FOREIGN KEY (author_id) REFERENCES users(user_id)
);

CREATE TABLE collab (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    author_id VARCHAR(50) NOT NULL,
    contact_info VARCHAR(200),
    created_time DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    description TEXT NOT NULL,
    section ENUM('RESEARCH', 'COMPETITION_PARTNER', 'ACADEMICS', 'OTHERS') NOT NULL,
    status ENUM('OPEN', 'CLOSED') DEFAULT 'OPEN',
    title VARCHAR(200) NOT NULL,
    updated_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    
    FOREIGN KEY (author_id) REFERENCES users(user_id)
);

CREATE TABLE resources (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    author_id VARCHAR(50) NOT NULL,
    category ENUM('ACADEMICS', 'HIGHER_STUDY', 'CHOTHA', 'OTHERS') NOT NULL,
    created_time DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    description TEXT NOT NULL,
    title VARCHAR(200) NOT NULL,
    updated_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    url VARCHAR(500) NOT NULL,
    
    FOREIGN KEY (author_id) REFERENCES users(user_id)
);