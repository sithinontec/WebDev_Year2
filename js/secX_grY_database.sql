-- ============================================
-- NaiRarm Bookshop Database Schema
-- ITCS223 Introduction to Web Development
-- Project Phase II - Task 2
-- ============================================

-- Create database
CREATE DATABASE IF NOT EXISTS nairarm_bookshop;
USE nairarm_bookshop;

-- ============================================
-- Table 1: admins
-- Stores administrator personal information
-- ============================================

CREATE TABLE IF NOT EXISTS admins (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    address VARCHAR(255),
    age INT,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- Table 2: admin_logins
-- Stores administrator login credentials
-- ============================================

CREATE TABLE IF NOT EXISTS admin_logins (
    id INT PRIMARY KEY AUTO_INCREMENT,
    admin_id INT NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,  -- Store bcrypt hashed password
    role ENUM('admin', 'editor', 'viewer') DEFAULT 'admin',
    login_log DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
);

-- ============================================
-- Table 3: books
-- Stores book/product information
-- ============================================

CREATE TABLE IF NOT EXISTS books (
    id INT PRIMARY KEY AUTO_INCREMENT,
    isbn VARCHAR(20) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    genre ENUM('fiction', 'nonfiction', 'mystery', 'romance', 'scifi', 'horror') DEFAULT 'fiction',
    publisher VARCHAR(100),
    pub_date DATE,
    synopsis TEXT,
    cover_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- Sample Data: Admins (10+ records)
-- ============================================

INSERT INTO admins (first_name, last_name, address, age, email) VALUES
('Ludwig', 'Handsome', '123 Admin Street, Bangkok', 25, 'ludwig@nairarm.com'),
('System', 'Administrator', '456 Server Road, Bangkok', 30, 'admin@nairarm.com'),
('Sithinon', 'Techasukviwat', '789 Developer Lane, Bangkok', 22, 'sithinon@nairarm.com'),
('Alice', 'Johnson', '101 Book Ave, Bangkok', 28, 'alice@nairarm.com'),
('Bob', 'Smith', '202 Library Blvd, Bangkok', 35, 'bob@nairarm.com'),
('Carol', 'Williams', '303 Reader St, Bangkok', 27, 'carol@nairarm.com'),
('David', 'Brown', '404 Novel Lane, Bangkok', 32, 'david@nairarm.com'),
('Emma', 'Davis', '505 Story Road, Bangkok', 24, 'emma@nairarm.com'),
('Frank', 'Miller', '606 Chapter Ave, Bangkok', 29, 'frank@nairarm.com'),
('Grace', 'Wilson', '707 Page Street, Bangkok', 26, 'grace@nairarm.com');

-- ============================================
-- Sample Data: Admin Logins
-- Note: Passwords should be bcrypt hashed in production
-- ============================================

INSERT INTO admin_logins (admin_id, username, password, role) VALUES
(1, 'Ludwighandsome', '$2b$10$hashedpassword1234567890', 'admin'),
(2, 'admin', '$2b$10$hashedpassword0987654321', 'admin'),
(3, 'sithinon', '$2b$10$hashedpassword1111111111', 'editor'),
(4, 'alice_j', '$2b$10$hashedpassword2222222222', 'editor'),
(5, 'bob_s', '$2b$10$hashedpassword3333333333', 'viewer'),
(6, 'carol_w', '$2b$10$hashedpassword4444444444', 'viewer'),
(7, 'david_b', '$2b$10$hashedpassword5555555555', 'editor'),
(8, 'emma_d', '$2b$10$hashedpassword6666666666', 'viewer'),
(9, 'frank_m', '$2b$10$hashedpassword7777777777', 'viewer'),
(10, 'grace_w', '$2b$10$hashedpassword8888888888', 'viewer');

-- ============================================
-- Sample Data: Books (15+ records)
-- ============================================

INSERT INTO books (isbn, title, author, price, genre, publisher, pub_date, synopsis, cover_url) VALUES
('9780553577129', 'The Diary of a Young Girl', 'Anne Frank', 250.00, 'nonfiction', 'Bantam', '1993-06-01', 'The compelling diary of a young Jewish girl who spent two years hiding from the Nazis during World War II.', 'https://covers.openlibrary.org/b/isbn/9780553577129-L.jpg'),
('9780743224376', 'Band of Brothers', 'Stephen E. Ambrose', 245.00, 'nonfiction', 'Simon & Schuster', '2001-10-01', 'The story of Easy Company, 506th Parachute Infantry Regiment, 101st Airborne Division.', 'https://covers.openlibrary.org/b/isbn/9780743224376-L.jpg'),
('9780767908184', 'A Short History of Nearly Everything', 'Bill Bryson', 200.00, 'nonfiction', 'Broadway Books', '2004-09-14', 'A journey through science and the universe.', 'https://covers.openlibrary.org/b/isbn/9780767908184-L.jpg'),
('9780375725609', 'The Devil in the White City', 'Erik Larson', 250.00, 'nonfiction', 'Vintage', '2004-02-10', 'The true story of the 1893 World\'s Fair in Chicago and a serial killer.', 'https://covers.openlibrary.org/b/isbn/9780375725609-L.jpg'),
('9780385534246', 'Killers of the Flower Moon', 'David Grann', 245.00, 'nonfiction', 'Doubleday', '2017-04-18', 'The story of the Osage murders in 1920s Oklahoma and the birth of the FBI.', 'https://covers.openlibrary.org/b/isbn/9780385534246-L.jpg'),
('9780062060624', 'The Song of Achilles', 'Madeline Miller', 300.00, 'fiction', 'Ecco', '2012-03-06', 'Achilles and Patroclus forge an inseparable bond in this retelling of the Iliad.', 'https://covers.openlibrary.org/b/isbn/9780062060624-L.jpg'),
('9781250316776', 'Red White & Royal Blue', 'Casey McQuiston', 300.00, 'romance', 'St. Martin\'s Griffin', '2019-05-14', 'First Son Alex Claremont-Diaz falls into a romance with Prince Henry of Wales.', 'https://covers.openlibrary.org/b/isbn/9781250316776-L.jpg'),
('9780345337665', 'Interview with the Vampire', 'Anne Rice', 275.00, 'horror', 'Ballantine Books', '1977-04-12', 'Louis de Pointe du Lac tells his story of transformation into a vampire.', 'https://covers.openlibrary.org/b/isbn/9780345337665-L.jpg'),
('9780593441275', 'In Memoriam', 'Alice Winn', 400.00, 'fiction', 'Knopf', '2023-03-07', 'A devastating World War I love story about two young men in the trenches.', 'https://covers.openlibrary.org/b/isbn/9780593441275-L.jpg'),
('9780062890573', 'Swimming in the Dark', 'Tomasz Jedrowski', 300.00, 'fiction', 'William Morrow', '2020-06-02', 'A story of forbidden love set in 1980s Poland.', 'https://covers.openlibrary.org/b/isbn/9780062890573-L.jpg'),
('9780345806567', 'Giovanni\'s Room', 'James Baldwin', 295.00, 'fiction', 'Vintage', '2013-08-06', 'David struggles with his identity and his love for Giovanni in Paris.', 'https://covers.openlibrary.org/b/isbn/9780345806567-L.jpg'),
('9781250317070', 'Hidden Pictures', 'Jason Rekulak', 315.00, 'mystery', 'Flatiron Books', '2022-05-10', 'A babysitter becomes alarmed when a child draws disturbing pictures.', 'https://covers.openlibrary.org/b/isbn/9781250317070-L.jpg'),
('9781501180989', 'The Outsider', 'Stephen King', 250.00, 'horror', 'Scribner', '2018-05-22', 'A horrific crime tests investigators when an alibi confronts eyewitness evidence.', 'https://covers.openlibrary.org/b/isbn/9781501180989-L.jpg'),
('9780618640157', 'The Lord of the Rings', 'J.R.R. Tolkien', 400.00, 'scifi', 'Houghton Mifflin', '2005-10-12', 'The epic tale of Frodo Baggins and the quest to destroy the One Ring.', 'https://covers.openlibrary.org/b/isbn/9780618640157-L.jpg'),
('9780786838653', 'Percy Jackson: The Lightning Thief', 'Rick Riordan', 400.00, 'scifi', 'Disney Hyperion', '2005-06-28', 'Percy Jackson discovers he is the son of Poseidon.', 'https://covers.openlibrary.org/b/isbn/9780786838653-L.jpg');

-- ============================================
-- Useful Queries for Testing
-- ============================================

-- Search books by title
-- SELECT * FROM books WHERE title LIKE '%Song%';

-- Search books by multiple criteria
-- SELECT * FROM books WHERE genre = 'fiction' AND author LIKE '%Miller%';

-- Get admin with login info
-- SELECT a.*, al.username, al.role FROM admins a JOIN admin_logins al ON a.id = al.admin_id;

-- Count books by genre
-- SELECT genre, COUNT(*) as count FROM books GROUP BY genre;
