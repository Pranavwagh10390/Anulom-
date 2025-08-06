Drop database if exists university;
CREATE DATABASE university;
USE university;

CREATE TABLE applicants (
    applicant_id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    phone_number VARCHAR(15),
    date_of_birth DATE,
    gender VARCHAR(10)
);

CREATE TABLE courses (
    course_id INT PRIMARY KEY AUTO_INCREMENT,
    course_name VARCHAR(100),
    department VARCHAR(50),
    total_seats INT
);

CREATE TABLE applications (
    application_id INT PRIMARY KEY AUTO_INCREMENT,
    applicant_id INT,
    course_id INT,
    application_date DATE,
    status ENUM('Pending', 'Accepted', 'Rejected'),
    FOREIGN KEY (applicant_id) REFERENCES applicants(applicant_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id)
);

CREATE TABLE admission_officers (
    officer_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    email VARCHAR(100),
    role VARCHAR(50)
);

CREATE TABLE documents (
    document_id INT PRIMARY KEY AUTO_INCREMENT,
    application_id INT,
    document_type VARCHAR(50),
    document_url VARCHAR(255),
    uploaded_on DATETIME,
    FOREIGN KEY (application_id) REFERENCES applications(application_id)
);