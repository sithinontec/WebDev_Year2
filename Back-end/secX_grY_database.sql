-- ============================================
-- NaiRarm Bookshop Database Schema (normalized)
-- Generated: 2026-04-20
-- ============================================

-- Create database and select it
CREATE DATABASE IF NOT EXISTS nairarm_bookshop;
USE nairarm_bookshop;

-- ============================================
-- Table: admins (Administrator Information)
-- ============================================
CREATE TABLE IF NOT EXISTS admins (
  adminID INT PRIMARY KEY AUTO_INCREMENT,
  firstName VARCHAR(50) NOT NULL,
  lastName VARCHAR(50) NOT NULL,
  address VARCHAR(100),
  age INT,
  email VARCHAR(50) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- Table: admin_logins (Administrator login information)
-- ============================================
CREATE TABLE IF NOT EXISTS admin_logins (
  loginID INT PRIMARY KEY AUTO_INCREMENT,
  adminID INT NOT NULL,
  userName VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(50) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (adminID) REFERENCES admins(adminID) ON DELETE CASCADE
);

-- ============================================
-- Table: authors
-- ============================================
CREATE TABLE IF NOT EXISTS authors (
  authorID INT PRIMARY KEY AUTO_INCREMENT,
  authorName VARCHAR(100) NOT NULL,
  email VARCHAR(50),
  phoneNumber VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Table: books (Book Info)
-- ============================================
CREATE TABLE IF NOT EXISTS books (
  bookID INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  ISBN VARCHAR(20) UNIQUE NOT NULL,
  genre VARCHAR(50),
  publishedDate DATE,
  price DECIMAL(10,2) NOT NULL,
  publisher VARCHAR(100),
  synopsis TEXT,
  authorID INT,
  adminID INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (authorID) REFERENCES authors(authorID),
  FOREIGN KEY (adminID) REFERENCES admins(adminID)
);

-- ============================================
-- Table: login_logs (Login Log)
-- ============================================
CREATE TABLE IF NOT EXISTS login_logs (
  logID INT PRIMARY KEY AUTO_INCREMENT,
  adminID INT NOT NULL,
  loginTime DATETIME DEFAULT CURRENT_TIMESTAMP,
  loginStatus VARCHAR(10),
  FOREIGN KEY (adminID) REFERENCES admins(adminID) ON DELETE CASCADE
);

-- ============================================
-- Sample Data (admins, authors, logins, books)
-- Note: passwords here are plaintext for development only
-- ============================================

-- Admins
INSERT INTO admins (firstName, lastName, address, age, email) VALUES
('Ludwig', 'Handsome', '123 Admin Street, Bangkok', 25, 'ludwig@nairarm.com'),
('System', 'Administrator', '456 Server Road, Bangkok', 30, 'admin@nairarm.com')
ON DUPLICATE KEY UPDATE email = VALUES(email);

-- Authors (ordered to match book inserts)
INSERT INTO authors (authorName, email) VALUES
('Anne Frank', NULL),
('Stephen E. Ambrose', NULL),
('Bill Bryson', NULL),
('Erik Larson', NULL),
('David Grann', NULL),
('Madeline Miller', NULL),
('Casey McQuiston', NULL),
('Anne Rice', NULL),
('Alice Winn', NULL),
('Tomasz Jedrowski', NULL),
('James Baldwin', NULL),
('Jason Rekulak', NULL),
('Stephen King', NULL),
('J.R.R. Tolkien', NULL),
('Rick Riordan', NULL)
ON DUPLICATE KEY UPDATE authorName = VALUES(authorName);

-- Admin logins (link to adminID values)
-- For safety, insert only if admin exists; use subqueries to fetch adminID
INSERT INTO admin_logins (adminID, userName, password, role)
VALUES
((SELECT adminID FROM admins WHERE email='ludwig@nairarm.com'), 'Ludwighandsome', '12345678', 'admin'),
((SELECT adminID FROM admins WHERE email='admin@nairarm.com'), 'admin', 'admin123', 'admin')
ON DUPLICATE KEY UPDATE password = VALUES(password);

-- Books: reference authors by authorName via subqueries
INSERT INTO books (title, ISBN, genre, publishedDate, price, publisher, synopsis, authorID, adminID) VALUES
('The Diary of a Young Girl', '9780553577129', 'nonfiction', '1993-06-01', 250.00, 'Bantam', 'The compelling diary of a young Jewish girl who spent two years hiding from the Nazis during World War II.', (SELECT authorID FROM authors WHERE authorName='Anne Frank'), (SELECT adminID FROM admins WHERE email='ludwig@nairarm.com')),
('Band of Brothers', '9780743224376', 'nonfiction', '2001-10-01', 245.00, 'Simon & Schuster', 'The story of Easy Company, 506th Parachute Infantry Regiment, 101st Airborne Division.', (SELECT authorID FROM authors WHERE authorName='Stephen E. Ambrose'), (SELECT adminID FROM admins WHERE email='ludwig@nairarm.com')),
('A Short History of Nearly Everything', '9780767908184', 'nonfiction', '2004-09-14', 200.00, 'Broadway Books', 'A journey through science and the universe.', (SELECT authorID FROM authors WHERE authorName='Bill Bryson'), (SELECT adminID FROM admins WHERE email='ludwig@nairarm.com')),
('The Devil in the White City', '9780375725609', 'nonfiction', '2004-02-10', 250.00, 'Vintage', 'The true story of the 1893 World\'s Fair in Chicago and a serial killer.', (SELECT authorID FROM authors WHERE authorName='Erik Larson'), (SELECT adminID FROM admins WHERE email='ludwig@nairarm.com')),
('Killers of the Flower Moon', '9780385534246', 'nonfiction', '2017-04-18', 245.00, 'Doubleday', 'The story of the Osage murders in 1920s Oklahoma and the birth of the FBI.', (SELECT authorID FROM authors WHERE authorName='David Grann'), (SELECT adminID FROM admins WHERE email='ludwig@nairarm.com')),
('The Song of Achilles', '9780062060624', 'fiction', '2012-03-06', 300.00, 'Ecco', 'Achilles and Patroclus forge an inseparable bond in this retelling of the Iliad.', (SELECT authorID FROM authors WHERE authorName='Madeline Miller'), (SELECT adminID FROM admins WHERE email='ludwig@nairarm.com')),
('Red White & Royal Blue', '9781250316776', 'romance', '2019-05-14', 300.00, 'St. Martin\'s Griffin', 'First Son Alex Claremont-Diaz falls into a romance with Prince Henry of Wales.', (SELECT authorID FROM authors WHERE authorName='Casey McQuiston'), (SELECT adminID FROM admins WHERE email='ludwig@nairarm.com')),
('Interview with the Vampire', '9780345337665', 'horror', '1977-04-12', 275.00, 'Ballantine Books', 'Louis de Pointe du Lac tells his story of transformation into a vampire.', (SELECT authorID FROM authors WHERE authorName='Anne Rice'), (SELECT adminID FROM admins WHERE email='ludwig@nairarm.com')),
('In Memoriam', '9780593441275', 'fiction', '2023-03-07', 400.00, 'Knopf', 'A devastating World War I love story about two young men in the trenches.', (SELECT authorID FROM authors WHERE authorName='Alice Winn'), (SELECT adminID FROM admins WHERE email='ludwig@nairarm.com')),
('Swimming in the Dark', '9780062890573', 'fiction', '2020-06-02', 300.00, 'William Morrow', 'A story of forbidden love set in 1980s Poland.', (SELECT authorID FROM authors WHERE authorName='Tomasz Jedrowski'), (SELECT adminID FROM admins WHERE email='ludwig@nairarm.com')),
('Giovanni\'s Room', '9780345806567', 'fiction', '2013-08-06', 295.00, 'Vintage', 'David struggles with his identity and his love for Giovanni in Paris.', (SELECT authorID FROM authors WHERE authorName='James Baldwin'), (SELECT adminID FROM admins WHERE email='ludwig@nairarm.com')),
('Hidden Pictures', '9781250317070', 'mystery', '2022-05-10', 315.00, 'Flatiron Books', 'A babysitter becomes alarmed when a child draws disturbing pictures.', (SELECT authorID FROM authors WHERE authorName='Jason Rekulak'), (SELECT adminID FROM admins WHERE email='ludwig@nairarm.com')),
('The Outsider', '9781501180989', 'horror', '2018-05-22', 250.00, 'Scribner', 'A horrific crime tests investigators when an alibi confronts eyewitness evidence.', (SELECT authorID FROM authors WHERE authorName='Stephen King'), (SELECT adminID FROM admins WHERE email='ludwig@nairarm.com')),
('The Lord of the Rings', '9780618640157', 'scifi', '2005-10-12', 400.00, 'Houghton Mifflin', 'The epic tale of Frodo Baggins and the quest to destroy the One Ring.', (SELECT authorID FROM authors WHERE authorName='J.R.R. Tolkien'), (SELECT adminID FROM admins WHERE email='ludwig@nairarm.com')),
('Percy Jackson: The Lightning Thief', '9780786838653', 'scifi', '2005-06-28', 400.00, 'Disney Hyperion', 'Percy Jackson discovers he is the son of Poseidon.', (SELECT authorID FROM authors WHERE authorName='Rick Riordan'), (SELECT adminID FROM admins WHERE email='ludwig@nairarm.com'))
ON DUPLICATE KEY UPDATE title = VALUES(title);

-- ============================================
-- End of file
-- ============================================
