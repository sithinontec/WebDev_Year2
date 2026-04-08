/**
 * Database Configuration
 * 
 * This file contains:
 * 1. MySQL connection pool setup (commented out for simulation)
 * 2. Simulated database with sample book and admin data
 * 
 * To enable real MySQL connection:
 * 1. Uncomment the mysql2 require and pool creation
 * 2. Update credentials in .env file
 * 3. Run the SQL schema in database.sql
 */

// ============================================
// REAL DATABASE CONNECTION (Uncomment for production)
// ============================================

/*
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'nairarm_bookshop',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
*/

// ============================================
// SIMULATED DATABASE (For development/testing)
// ============================================

// Simulated admin accounts
const admins = [
  {
    id: 1,
    username: 'Ludwighandsome',
    password: '12345678', // In production, use bcrypt hashed passwords
    first_name: 'Ludwig',
    last_name: 'Admin',
    email: 'ludwig@nairarm.com',
    role: 'admin'
  },
  {
    id: 2,
    username: 'admin',
    password: 'admin123',
    first_name: 'System',
    last_name: 'Administrator',
    email: 'admin@nairarm.com',
    role: 'admin'
  }
];

// Simulated books database with 15+ entries
const books = [
  // NonFiction books
  {
    id: 1,
    isbn: '9780553577129',
    title: 'The Diary of a Young Girl',
    author: 'Anne Frank',
    price: 250,
    genre: 'nonfiction',
    publisher: 'Bantam',
    pub_date: '1993-06-01',
    synopsis: 'The compelling diary of a young Jewish girl who spent two years hiding from the Nazis during World War II. Anne Frank\'s extraordinary diary has become a timeless testament to the human spirit.',
    cover_url: 'https://covers.openlibrary.org/b/isbn/9780553577129-L.jpg'
  },
  {
    id: 2,
    isbn: '9780743224376',
    title: 'Band of Brothers',
    author: 'Stephen E. Ambrose',
    price: 245,
    genre: 'nonfiction',
    publisher: 'Simon & Schuster',
    pub_date: '2001-10-01',
    synopsis: 'The story of Easy Company, 506th Parachute Infantry Regiment, 101st Airborne Division, from their training in Georgia to D-Day and beyond.',
    cover_url: 'https://covers.openlibrary.org/b/isbn/9780743224376-L.jpg'
  },
  {
    id: 3,
    isbn: '9780767908184',
    title: 'A Short History of Nearly Everything',
    author: 'Bill Bryson',
    price: 200,
    genre: 'nonfiction',
    publisher: 'Broadway Books',
    pub_date: '2004-09-14',
    synopsis: 'A journey through science and the universe, exploring how we got from there being nothing at all to there being something.',
    cover_url: 'https://covers.openlibrary.org/b/isbn/9780767908184-L.jpg'
  },
  {
    id: 4,
    isbn: '9780375725609',
    title: 'The Devil in the White City',
    author: 'Erik Larson',
    price: 250,
    genre: 'nonfiction',
    publisher: 'Vintage',
    pub_date: '2004-02-10',
    synopsis: 'The true story of the 1893 World\'s Fair in Chicago and the serial killer who used it as a backdrop for his crimes.',
    cover_url: 'https://covers.openlibrary.org/b/isbn/9780375725609-L.jpg'
  },
  {
    id: 5,
    isbn: '9780385534246',
    title: 'Killers of the Flower Moon',
    author: 'David Grann',
    price: 245,
    genre: 'nonfiction',
    publisher: 'Doubleday',
    pub_date: '2017-04-18',
    synopsis: 'The story of the Osage murders in 1920s Oklahoma and the birth of the FBI.',
    cover_url: 'https://covers.openlibrary.org/b/isbn/9780385534246-L.jpg'
  },
  // Fiction books
  {
    id: 6,
    isbn: '9780062060624',
    title: 'The Song of Achilles',
    author: 'Madeline Miller',
    price: 300,
    genre: 'fiction',
    publisher: 'Ecco',
    pub_date: '2012-03-06',
    synopsis: 'Achilles, "the best of all the Greeks," son of the cruel sea goddess Thetis and the legendary king Peleus, is strong, swift, and beautiful. Patroclus is an awkward young prince, exiled from his homeland. Brought together by chance, they forge an inseparable bond.',
    cover_url: 'https://covers.openlibrary.org/b/isbn/9780062060624-L.jpg'
  },
  {
    id: 7,
    isbn: '9780250800100',
    title: 'Red White & Royal Blue',
    author: 'Casey McQuiston',
    price: 300,
    genre: 'romance',
    publisher: 'St. Martin\'s Griffin',
    pub_date: '2019-05-14',
    synopsis: 'First Son Alex Claremont-Diaz falls into a tabloid scandal with Prince Henry of Wales. Their fake friendship turns into something more in this romantic comedy.',
    cover_url: 'https://covers.openlibrary.org/b/isbn/9781250316776-L.jpg'
  },
  {
    id: 8,
    isbn: '9780345337665',
    title: 'Interview with the Vampire',
    author: 'Anne Rice',
    price: 275,
    genre: 'horror',
    publisher: 'Ballantine Books',
    pub_date: '1977-04-12',
    synopsis: 'Louis de Pointe du Lac tells his story to a young reporter, recounting his transformation into a vampire by the seductive Lestat.',
    cover_url: 'https://covers.openlibrary.org/b/isbn/9780345337665-L.jpg'
  },
  {
    id: 9,
    isbn: '9780593441275',
    title: 'In Memoriam',
    author: 'Alice Winn',
    price: 400,
    genre: 'fiction',
    publisher: 'Knopf',
    pub_date: '2023-03-07',
    synopsis: 'A devastating World War I love story about two young men who find each other amidst the horror of the trenches.',
    cover_url: 'https://covers.openlibrary.org/b/isbn/9780593441275-L.jpg'
  },
  {
    id: 10,
    isbn: '9780062890573',
    title: 'Swimming in the Dark',
    author: 'Tomasz Jedrowski',
    price: 300,
    genre: 'fiction',
    publisher: 'William Morrow',
    pub_date: '2020-06-02',
    synopsis: 'A story of forbidden love set in 1980s Poland between two young men who meet at a summer agricultural camp.',
    cover_url: 'https://covers.openlibrary.org/b/isbn/9780062890573-L.jpg'
  },
  {
    id: 11,
    isbn: '9780345806567',
    title: "Giovanni's Room",
    author: 'James Baldwin',
    price: 295,
    genre: 'fiction',
    publisher: 'Vintage',
    pub_date: '2013-08-06',
    synopsis: 'David, a young American in Paris, struggles with his identity and his love for Giovanni, an Italian bartender.',
    cover_url: 'https://covers.openlibrary.org/b/isbn/9780345806567-L.jpg'
  },
  // Mystery/Thriller
  {
    id: 12,
    isbn: '9781250317070',
    title: 'Hidden Pictures',
    author: 'Jason Rekulak',
    price: 315,
    genre: 'mystery',
    publisher: 'Flatiron Books',
    pub_date: '2022-05-10',
    synopsis: 'A babysitter becomes alarmed when the child she cares for starts drawing disturbing pictures that seem to be messages from a spirit.',
    cover_url: 'https://covers.openlibrary.org/b/isbn/9781250317070-L.jpg'
  },
  {
    id: 13,
    isbn: '9781501180989',
    title: 'The Outsider',
    author: 'Stephen King',
    price: 250,
    genre: 'horror',
    publisher: 'Scribner',
    pub_date: '2018-05-22',
    synopsis: 'A horrific crime tests the sanity of investigators when an ironclad alibi confronts eyewitness evidence of murder.',
    cover_url: 'https://covers.openlibrary.org/b/isbn/9781501180989-L.jpg'
  },
  // Sci-Fi/Fantasy
  {
    id: 14,
    isbn: '9780618640157',
    title: 'The Lord of the Rings',
    author: 'J.R.R. Tolkien',
    price: 400,
    genre: 'scifi',
    publisher: 'Houghton Mifflin',
    pub_date: '2005-10-12',
    synopsis: 'The epic tale of Frodo Baggins and the Fellowship as they journey to destroy the One Ring in the fires of Mount Doom.',
    cover_url: 'https://covers.openlibrary.org/b/isbn/9780618640157-L.jpg'
  },
  {
    id: 15,
    isbn: '9780786838653',
    title: 'Percy Jackson and the Olympians',
    author: 'Rick Riordan',
    price: 400,
    genre: 'scifi',
    publisher: 'Disney Hyperion',
    pub_date: '2005-06-28',
    synopsis: 'Percy Jackson discovers he is the son of Poseidon and must prevent a war among the Greek gods.',
    cover_url: 'https://covers.openlibrary.org/b/isbn/9780786838653-L.jpg'
  }
];

// Simulated database query functions
const simulatedDB = {
  // Get all admins or find by username
  getAdmin: (username) => {
    return admins.find(a => a.username === username) || null;
  },

  // Get all books with optional filters
  getBooks: (filters = {}) => {
    let result = [...books];
    
    if (filters.title) {
      result = result.filter(b => 
        b.title.toLowerCase().includes(filters.title.toLowerCase())
      );
    }
    if (filters.author) {
      result = result.filter(b => 
        b.author.toLowerCase().includes(filters.author.toLowerCase())
      );
    }
    if (filters.genre) {
      result = result.filter(b => 
        b.genre.toLowerCase() === filters.genre.toLowerCase()
      );
    }
    
    return result;
  },

  // Get single book by ID
  getBookById: (id) => {
    return books.find(b => b.id === parseInt(id)) || null;
  },

  // Get book by ISBN
  getBookByIsbn: (isbn) => {
    return books.find(b => b.isbn === isbn) || null;
  },

  // Insert new book
  insertBook: (bookData) => {
    const newBook = {
      id: books.length + 1,
      ...bookData
    };
    books.push(newBook);
    return newBook;
  },

  // Update existing book
  updateBook: (id, bookData) => {
    const index = books.findIndex(b => b.id === parseInt(id));
    if (index === -1) return null;
    
    books[index] = { ...books[index], ...bookData };
    return books[index];
  },

  // Delete book
  deleteBook: (id) => {
    const index = books.findIndex(b => b.id === parseInt(id));
    if (index === -1) return false;
    
    books.splice(index, 1);
    return true;
  }
};

module.exports = simulatedDB;
