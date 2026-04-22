-- =============================================================================
-- NaiRarm - Online Book Browser
-- ITCS223 Introduction to Web Development
-- Section 3, Group 4
-- Members:
--   6788017  Pimkwan Chiraprawattrakun
--   6788088  Tanapon Pholboon
--   6788128  Sithinon Techkarnjanaruk
--   6788175  Saw Say Hae Khu
--
-- Database file: sec3_gr04_database.sql
-- Last updated:  April 2026
--
-- HOW TO IMPORT:
--   mysql -u <user> -p < sec3_gr04_database.sql
-- =============================================================================

-- Drop and recreate the database to ensure a clean slate
CREATE DATABASE nairarm
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE nairarm;

-- =============================================================================
-- TABLE: administrator_information
-- Stores personal details of each admin account.
-- PK: adminID (auto-increment integer)
-- =============================================================================
CREATE TABLE administrator_information (
    adminID    INT           NOT NULL AUTO_INCREMENT,
    firstName  VARCHAR(50)   NOT NULL,
    lastName   VARCHAR(50)   NOT NULL,
    address    VARCHAR(100)  NOT NULL,
    age        INT           NOT NULL,
    email      VARCHAR(50)   NOT NULL,

    CONSTRAINT pk_admin PRIMARY KEY (adminID)
);

-- =============================================================================
-- TABLE: administrator_login_information
-- Stores login credentials and role for each admin.
-- PK: userName  |  FK: adminID → administrator_information
-- =============================================================================
CREATE TABLE administrator_login_information (
    userName   VARCHAR(50)   NOT NULL,
    adminID    INT           NOT NULL,
    password   VARCHAR(255)  NOT NULL,   -- store hashed passwords in production
    role       VARCHAR(50)   NOT NULL,

    CONSTRAINT pk_admin_login  PRIMARY KEY (userName),
    CONSTRAINT fk_login_admin  FOREIGN KEY (adminID)
        REFERENCES administrator_information(adminID)
        ON UPDATE CASCADE ON DELETE CASCADE
);

-- =============================================================================
-- TABLE: login_log
-- Records every login attempt (success or failure) for auditing.
-- PK: logID  |  FK: adminID → administrator_information
-- =============================================================================
CREATE TABLE login_log (
    logID        INT           NOT NULL AUTO_INCREMENT,
    adminID      INT           NOT NULL,
    loginTime    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    loginStatus  VARCHAR(10)   NOT NULL,   -- 'success' | 'fail'

    CONSTRAINT pk_log        PRIMARY KEY (logID),
    CONSTRAINT fk_log_admin  FOREIGN KEY (adminID)
        REFERENCES administrator_information(adminID)
        ON UPDATE CASCADE ON DELETE CASCADE
);

-- =============================================================================
-- TABLE: author
-- Stores author profile data.
-- PK: authorID
-- email and phoneNumber are nullable (optional contact info)
-- =============================================================================
CREATE TABLE author (
    authorID     INT           NOT NULL AUTO_INCREMENT,
    authorName   VARCHAR(100)  NOT NULL,
    email        VARCHAR(50)       NULL,
    phoneNumber  VARCHAR(20)       NULL,   -- stored as VARCHAR to handle formats

    CONSTRAINT pk_author PRIMARY KEY (authorID)
);

-- =============================================================================
-- TABLE: genre
-- Lookup table for book genres — resolves the multivalued 'genre' attribute
-- shown with a double ellipse in the ERD.
-- PK: genreID (auto-increment)
-- =============================================================================
CREATE TABLE genre (
    genreID    INT          NOT NULL AUTO_INCREMENT,
    genreName  VARCHAR(50)  NOT NULL,

    CONSTRAINT pk_genre      PRIMARY KEY (genreID),
    CONSTRAINT uq_genre_name UNIQUE (genreName)
);

-- =============================================================================
-- TABLE: books
-- Central product table for the bookstore.
-- PK: id  |  FK: authorID → author, adminID → administrator_information
-- genre column kept for backwards-compatible queries; normalised data lives in
-- book_genre below.
-- publisher is nullable (may be unknown).
-- cover_url stores a URL to an external image (keeps DB under 50 MB limit).
-- =============================================================================
CREATE TABLE books (
    id         INT            NOT NULL AUTO_INCREMENT,
    title          VARCHAR(255)   NOT NULL,
    isbn           VARCHAR(20)    NOT NULL UNIQUE,
    genre          VARCHAR(255)       NULL,   -- denormalised copy; see book_genre
    pub_date  DATETIME           NULL,
    price          INT            NOT NULL,   -- in Thai Baht
    publisher      VARCHAR(100)       NULL,
    cover_url          VARCHAR(255)       NULL,   -- URL to cover_url image
    synopsis       TEXT               NULL,
    authorID       INT            NOT NULL,
    adminID        INT            NOT NULL,   -- last admin who inserted the record

    CONSTRAINT pk_book          PRIMARY KEY (id),
    CONSTRAINT fk_book_author   FOREIGN KEY (authorID)
        REFERENCES author(authorID)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_book_admin    FOREIGN KEY (adminID)
        REFERENCES administrator_information(adminID)
        ON UPDATE CASCADE ON DELETE RESTRICT
);

-- =============================================================================
-- TABLE: book_genre
-- Junction table — resolves the many-to-many relationship between books and
-- genres (one book can have several genres; one genre belongs to many books).
-- PK: composite (id, genreID)
-- FK: id → books, genreID → genre
-- =============================================================================
CREATE TABLE book_genre (
    id   INT  NOT NULL,
    genreID  INT  NOT NULL,

    CONSTRAINT pk_book_genre  PRIMARY KEY (id, genreID),
    CONSTRAINT fk_bg_book     FOREIGN KEY (id)
        REFERENCES books(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_bg_genre    FOREIGN KEY (genreID)
        REFERENCES genre(genreID)
        ON UPDATE CASCADE ON DELETE CASCADE
);

-- =============================================================================
-- TABLE: administrate  (relationship entity in the ERD)
-- Logs every CRUD operation an admin performs on a book record.
-- PK: administrateID  |  FK: id → books, adminID → administrator_information
-- =============================================================================
CREATE TABLE administrate (
    administrateID  INT           NOT NULL AUTO_INCREMENT,
    operation       VARCHAR(20)   NOT NULL,   -- 'INSERT' | 'UPDATE' | 'DELETE'
    date            DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id          INT           NOT NULL,
    adminID         INT           NOT NULL,

    CONSTRAINT pk_administrate        PRIMARY KEY (administrateID),
    CONSTRAINT fk_administrate_book   FOREIGN KEY (id)
        REFERENCES books(id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_administrate_admin  FOREIGN KEY (adminID)
        REFERENCES administrator_information(adminID)
        ON UPDATE CASCADE ON DELETE CASCADE
);


-- =============================================================================
-- SEED DATA
-- At least 10 rows per main table as required by Task 2.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- administrator_information  (10 admins)
-- -----------------------------------------------------------------------------
INSERT INTO administrator_information (firstName, lastName, address, age, email) VALUES
('Pimkwan',  'Chiraprawattrakun', '123 Sukhumvit Rd, Bangkok',      21, 'pimkwan@nairarm.com'),
('Tanapon',  'Pholboon',          '45 Rama IV Rd, Bangkok',         22, 'tanapon@nairarm.com'),
('Sithinon', 'Techkarnjanaruk',   '78 Silom Rd, Bangkok',           21, 'sithinon@nairarm.com'),
('Saw',      'SayHaeKhu',         '99 Charoen Krung Rd, Bangkok',   23, 'saw@nairarm.com'),
('Narin',    'Maneekan',          '10 Phaholyothin Rd, Bangkok',    30, 'narin@nairarm.com'),
('Somchai',  'Rattana',           '55 Ladprao Rd, Bangkok',         35, 'somchai@nairarm.com'),
('Wanlaya',  'Suksiri',           '20 Vibhavadi Rd, Bangkok',       28, 'wanlaya@nairarm.com'),
('Priya',    'Thongdee',          '7 Ngam Wong Wan Rd, Nonthaburi', 26, 'priya@nairarm.com'),
('Krit',     'Jaikaew',           '3 Bang Na Rd, Samut Prakan',     29, 'krit@nairarm.com'),
('Lalita',   'Boonsuk',           '88 Ratchadaphisek Rd, Bangkok',  27, 'lalita@nairarm.com');

-- -----------------------------------------------------------------------------
-- administrator_login_information
-- Passwords shown as plain text for clarity; hash them (bcrypt) in production.
-- -----------------------------------------------------------------------------
INSERT INTO administrator_login_information (userName, adminID, password, role) VALUES
('pimkwan_admin',  1, '1234', 'superadmin'),
('tanapon_admin',  2, 'hashed_pw_002', 'admin'),
('sithinon_admin', 3, 'hashed_pw_003', 'admin'),
('saw_admin',      4, 'hashed_pw_004', 'admin'),
('narin_admin',    5, 'hashed_pw_005', 'editor'),
('somchai_admin',  6, 'hashed_pw_006', 'editor'),
('wanlaya_admin',  7, 'hashed_pw_007', 'editor'),
('priya_admin',    8, 'hashed_pw_008', 'viewer'),
('krit_admin',     9, 'hashed_pw_009', 'viewer'),
('lalita_admin',  10, 'hashed_pw_010', 'viewer');

-- -----------------------------------------------------------------------------
-- login_log  (10 sample login events)
-- -----------------------------------------------------------------------------
INSERT INTO login_log (adminID, loginTime, loginStatus) VALUES
(1, '2026-03-01 08:00:00', 'success'),
(2, '2026-03-01 08:15:00', 'success'),
(3, '2026-03-02 09:00:00', 'success'),
(4, '2026-03-02 09:30:00', 'fail'),
(4, '2026-03-02 09:31:00', 'success'),
(5, '2026-03-03 10:00:00', 'success'),
(1, '2026-03-04 11:00:00', 'success'),
(6, '2026-03-05 13:00:00', 'fail'),
(2, '2026-03-06 14:00:00', 'success'),
(7, '2026-03-07 15:00:00', 'success');

-- -----------------------------------------------------------------------------
-- author  (15 authors matching the books below)
-- -----------------------------------------------------------------------------
INSERT INTO author (authorName, email, phoneNumber) VALUES
('Madeline Miller',    'madeline@example.com',  NULL),
('J.R.R. Tolkien',     NULL,                    NULL),
('Rick Riordan',       'rick@example.com',       '+1-555-0101'),
('J. Sheridan Le Fanu',NULL,                    NULL),
('Jason Rekulak',      'jason@example.com',      NULL),
('Stephen King',       'stephen@example.com',    '+1-555-0202'),
('Frank Herbert',      NULL,                    NULL),
('George R.R. Martin', 'grrm@example.com',       NULL),
('Rachel Reid',        'rachel@example.com',     NULL),
('George Orwell',      NULL,                    NULL),
('Suzanne Collins',    'suzanne@example.com',    NULL),
('Casey McQuiston',    'casey@example.com',      '+1-555-0303'),
('Anne Rice',          NULL,                    NULL),
('Tomasz Jedro',       'tomasz@example.com',     NULL),
('James Baldwin',      NULL,                    NULL);

-- -----------------------------------------------------------------------------
-- genre  (24 unique genres extracted from the books below)
-- -----------------------------------------------------------------------------
INSERT INTO genre (genreName) VALUES
('Fantasy'),            -- 1
('Historical Fiction'), -- 2
('Romance'),            -- 3
('Mythology'),          -- 4
('LGBT'),               -- 5
('Adventure'),          -- 6
('Epic'),               -- 7
('Young Adult'),        -- 8
('Horror'),             -- 9
('Gothic'),             -- 10
('Classic'),            -- 11
('Mystery'),            -- 12
('Thriller'),           -- 13
('Crime'),              -- 14
('Science Fiction'),    -- 15
('Dystopian'),          -- 16
('Action'),             -- 17
('Political'),          -- 18
('Satire'),             -- 19
('Sports'),             -- 20
('Literary Fiction'),   -- 21
('Historical'),         -- 22
('Comedy'),             -- 23
('Contemporary');       -- 24

-- -----------------------------------------------------------------------------
-- books  (15 books — well above the 10-row minimum)
-- adminID = 1 (Pimkwan) inserted all initial records
-- -----------------------------------------------------------------------------
INSERT INTO books (title, isbn, genre, pub_date, price, publisher, cover_url, synopsis, authorID, adminID) VALUES
(
  'The Song of Achilles',
  '9780062060624',
  'Fantasy,Historical Fiction,Romance,Mythology,LGBT',
  '2012-03-06 00:00:00',
  300,
  'Ecco Press',
  'https://cover_urls.openlibrary.org/b/isbn/9780062060624-L.jpg',
  'Greece in the age of heroes. Patroclus, an awkward young prince, has been exiled to the court of King Peleus and is surprised to be befriended by the king''s golden son, Achilles.',
  1, 1
),
(
  'The Lord of the Rings',
  '9780618640157',
  'Fantasy,Adventure,Epic',
  '1954-07-29 00:00:00',
  400,
  'Allen & Unwin',
  'https://cover_urls.openlibrary.org/b/isbn/9780618640157-L.jpg',
  'One Ring to rule them all — the definitive epic fantasy novel following the hobbit Frodo''s quest to destroy the One Ring.',
  2, 1
),
(
  'Percy Jackson and the Olympians: The Lightning Thief',
  '9780786838653',
  'Fantasy,Adventure,Mythology,Young Adult',
  '2005-06-28 00:00:00',
  400,
  'Hyperion Books',
  'https://cover_urls.openlibrary.org/b/isbn/9780786838653-L.jpg',
  'Percy Jackson discover_urls he is the son of a Greek god and must embark on a quest to prevent a war among the Olympians.',
  3, 1
),
(
  'Carmilla',
  '9780486432816',
  'Horror,Gothic,Classic',
  '1872-01-01 00:00:00',
  345,
  'Dover Publications',
  'https://cover_urls.openlibrary.org/b/isbn/9780486432816-L.jpg',
  'A Gothic novella following a young woman whose peaceful existence is disrupted by a strange girl named Carmilla — predating Dracula by 26 years.',
  4, 1
),
(
  'Hidden Pictures',
  '9781250820228',
  'Horror,Mystery,Thriller',
  '2022-05-10 00:00:00',
  315,
  'Flatiron Books',
  'https://cover_urls.openlibrary.org/b/isbn/9781250820228-L.jpg',
  'A babysitter discover_urls that her young charge is drawing pictures of things he couldn''t possibly know about — and they may reveal a dark secret.',
  5, 1
),
(
  'The Outsider',
  '9781501180989',
  'Horror,Crime,Mystery',
  '2018-05-22 00:00:00',
  250,
  'Scribner',
  'https://cover_urls.openlibrary.org/b/isbn/9781501180989-L.jpg',
  'When a young boy is found murdered in a small town, the evidence points overwhelmingly to a respected local man — yet an airtight alibi says otherwise.',
  6, 1
),
(
  'Dune',
  '9780441013593',
  'Science Fiction,Adventure,Epic',
  '1965-08-01 00:00:00',
  395,
  'Chilton Books',
  'https://cover_urls.openlibrary.org/b/isbn/9780441013593-L.jpg',
  'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world.',
  7, 1
),
(
  'A Game of Thrones',
  '9780553573404',
  'Fantasy,Epic,Political',
  '1996-08-01 00:00:00',
  250,
  'Bantam Books',
  'https://cover_urls.openlibrary.org/b/isbn/9780553573404-L.jpg',
  'Seven noble families fight for control of the mythical land of Westeros in this sprawling political epic.',
  8, 1
),
(
  'Heated Rivalry',
  '9781250228239',
  'Romance,Sports,LGBT',
  '2019-11-26 00:00:00',
  300,
  'Flatiron Books',
  'https://cover_urls.openlibrary.org/b/isbn/9781250228239-L.jpg',
  'Two rival hockey players share an intense on-ice feud and an equally intense off-ice secret.',
  9, 1
),
(
  'Animal Farm',
  '9780451526342',
  'Satire,Classic,Political',
  '1945-08-17 00:00:00',
  200,
  'Secker & Warburg',
  'https://cover_urls.openlibrary.org/b/isbn/9780451526342-L.jpg',
  'A satirical allegory of Soviet totalitarianism, told through a farm whose animals rebel against their human farmer.',
  10, 1
),
(
  'The Hunger Games',
  '9780439023481',
  'Science Fiction,Dystopian,Young Adult,Action',
  '2008-09-14 00:00:00',
  245,
  'Scholastic Press',
  'https://cover_urls.openlibrary.org/b/isbn/9780439023481-L.jpg',
  'In a dystopian future, twelve-year-old Primrose Everdeen is chosen for a televised death match; her older sister Katniss volunteers in her place.',
  11, 1
),
(
  'Red, White & Royal Blue',
  '9781250316776',
  'Romance,Comedy,LGBT,Contemporary',
  '2019-05-14 00:00:00',
  300,
  'St. Martin''s Griffin',
  'https://cover_urls.openlibrary.org/b/isbn/9781250316776-L.jpg',
  'America''s First Son falls in love with the Prince of Wales in this charming and funny enemies-to-lovers romance.',
  12, 1
),
(
  'Interview with the Vampire',
  '9780345337665',
  'Horror,Gothic,Fantasy',
  '1976-05-05 00:00:00',
  275,
  'Alfred A. Knopf',
  'https://cover_urls.openlibrary.org/b/isbn/9780345337665-L.jpg',
  'Vampire Louis de Pointe du Lac tells his tale to a reporter — a centuries-long story of beauty, loss, and monstrousness.',
  13, 1
),
(
  'Swimming in the Dark',
  '9780525559337',
  'Literary Fiction,Historical,LGBT',
  '2020-05-05 00:00:00',
  300,
  'Riverhead Books',
  'https://cover_urls.openlibrary.org/b/isbn/9780525559337-L.jpg',
  'Set in 1980s communist Poland, two young men form an intense and forbidden bond against a backdrop of political upheaval.',
  14, 1
),
(
  'Giovanni''s Room',
  '9780385333191',
  'Literary Fiction,Classic,LGBT',
  '1956-10-01 00:00:00',
  295,
  'Dial Press',
  'https://cover_urls.openlibrary.org/b/isbn/9780385333191-L.jpg',
  'An American in Paris struggles with his identity while his fiancée is away — falling into a passionate and destructive affair with an Italian bartender.',
  15, 1
);

-- -----------------------------------------------------------------------------
-- book_genre  (maps each book to its genres via the genre lookup table)
-- -----------------------------------------------------------------------------
INSERT INTO book_genre (id, genreID) VALUES
-- 1 · The Song of Achilles → Fantasy, Historical Fiction, Romance, Mythology, LGBT
(1,  1), (1,  2), (1,  3), (1,  4), (1,  5),
-- 2 · The Lord of the Rings → Fantasy, Adventure, Epic
(2,  1), (2,  6), (2,  7),
-- 3 · Percy Jackson → Fantasy, Adventure, Mythology, Young Adult
(3,  1), (3,  6), (3,  4), (3,  8),
-- 4 · Carmilla → Horror, Gothic, Classic
(4,  9), (4, 10), (4, 11),
-- 5 · Hidden Pictures → Horror, Mystery, Thriller
(5,  9), (5, 12), (5, 13),
-- 6 · The Outsider → Horror, Crime, Mystery
(6,  9), (6, 14), (6, 12),
-- 7 · Dune → Science Fiction, Adventure, Epic
(7, 15), (7,  6), (7,  7),
-- 8 · A Game of Thrones → Fantasy, Epic, Political
(8,  1), (8,  7), (8, 18),
-- 9 · Heated Rivalry → Romance, Sports, LGBT
(9,  3), (9, 20), (9,  5),
-- 10 · Animal Farm → Satire, Classic, Political
(10, 19), (10, 11), (10, 18),
-- 11 · The Hunger Games → Science Fiction, Dystopian, Young Adult, Action
(11, 15), (11, 16), (11,  8), (11, 17),
-- 12 · Red, White & Royal Blue → Romance, Comedy, LGBT, Contemporary
(12,  3), (12, 23), (12,  5), (12, 24),
-- 13 · Interview with the Vampire → Horror, Gothic, Fantasy
(13,  9), (13, 10), (13,  1),
-- 14 · Swimming in the Dark → Literary Fiction, Historical, LGBT
(14, 21), (14, 22), (14,  5),
-- 15 · Giovanni's Room → Literary Fiction, Classic, LGBT
(15, 21), (15, 11), (15,  5);

-- -----------------------------------------------------------------------------
-- administrate  (one INSERT log entry per book — 15 rows)
-- adminID = 1 performed the initial bulk insert
-- -----------------------------------------------------------------------------
INSERT INTO administrate (operation, date, id, adminID) VALUES
('INSERT', '2026-03-01 09:00:00', 1,  1),
('INSERT', '2026-03-01 09:01:00', 2,  1),
('INSERT', '2026-03-01 09:02:00', 3,  1),
('INSERT', '2026-03-01 09:03:00', 4,  1),
('INSERT', '2026-03-01 09:04:00', 5,  1),
('INSERT', '2026-03-01 09:05:00', 6,  1),
('INSERT', '2026-03-01 09:06:00', 7,  1),
('INSERT', '2026-03-01 09:07:00', 8,  1),
('INSERT', '2026-03-01 09:08:00', 9,  1),
('INSERT', '2026-03-01 09:09:00', 10, 1),
('INSERT', '2026-03-01 09:10:00', 11, 1),
('INSERT', '2026-03-01 09:11:00', 12, 1),
('INSERT', '2026-03-01 09:12:00', 13, 1),
('INSERT', '2026-03-01 09:13:00', 14, 1),
('INSERT', '2026-03-01 09:14:00', 15, 1),
-- Two sample UPDATE operations by other admins
('UPDATE', '2026-03-10 14:00:00', 3,  2),
('UPDATE', '2026-03-12 10:30:00', 7,  3),
-- One sample DELETE log (book was re-inserted, so record still exists)
('DELETE', '2026-03-15 16:00:00', 10, 2);

-- =============================================================================
-- VIEWS
-- =============================================================================

-- v_book_full: joins books with author name — used by the Search web service
CREATE OR REPLACE VIEW v_book_full AS
SELECT
    b.id,
    b.title,
    b.isbn,
    b.genre,
    b.pub_date,
    b.price,
    b.publisher,
    b.cover_url,
    b.synopsis,
    a.authorID,
    a.authorName,
    b.adminID
FROM books b
JOIN author a ON b.authorID = a.authorID;

-- v_admin_full: joins login info with personal info — used by auth service
CREATE OR REPLACE VIEW v_admin_full AS
SELECT
    ali.userName,
    ali.password,
    ali.role,
    ai.adminID,
    ai.firstName,
    ai.lastName,
    ai.email
FROM administrator_login_information ali
JOIN administrator_information ai ON ali.adminID = ai.adminID;

-- v_book_genres_list: rebuilds the comma-separated genre string from the
-- normalised tables — useful for migrating web-service queries gradually
CREATE OR REPLACE VIEW v_book_genres_list AS
SELECT
    bg.id,
    GROUP_CONCAT(g.genreName ORDER BY g.genreName SEPARATOR ',') AS genreList
FROM book_genre bg
JOIN genre g ON bg.genreID = g.genreID
GROUP BY bg.id;

-- =============================================================================
-- END OF FILE
-- =============================================================================
