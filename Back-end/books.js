/**
 * Book Routes
 * Handles all book-related CRUD operations
 * 
 * Endpoints:
 * - GET /api/books - Search books with optional filters
 * - GET /api/books/:id - Get single book by ID
 * - POST /api/books - Insert new book (admin only)
 * - PUT /api/books/:id - Update book (admin only)
 * - DELETE /api/books/:id - Delete book (admin only)
 */

const express = require('express');
const router = express.Router();
const db = require('../config/db');

// ============================================
// GET /api/books
// Search books with optional filters
// Supports: ?title=&author=&genre= (3 criteria)
// ============================================

/**
 * Test Case 1: Search all books (no criteria)
 * Method: GET
 * URL: http://localhost:3000/api/books
 * Expected: Array of all books
 */

/**
 * Test Case 2: Search with multiple criteria
 * Method: GET
 * URL: http://localhost:3000/api/books?genre=nonfiction&author=Anne
 * Expected: Array of nonfiction books by authors containing "Anne"
 */

router.get('/', async (req, res) => {
  try {
    const { title, author, genre } = req.query;
    
    // Build filter object
    const filters = {};
    if (title) filters.title = title;
    if (author) filters.author = author;
    if (genre) filters.genre = genre;

    // Get filtered books
    const books = db.getBooks(filters);

    res.json({
      success: true,
      count: books.length,
      data: books
    });

    /*
    // REAL DATABASE VERSION:
    let sql = 'SELECT * FROM books WHERE 1=1';
    const params = [];
    
    if (title) {
      sql += ' AND title LIKE ?';
      params.push(`%${title}%`);
    }
    if (author) {
      sql += ' AND author LIKE ?';
      params.push(`%${author}%`);
    }
    if (genre) {
      sql += ' AND genre = ?';
      params.push(genre);
    }
    
    const [rows] = await db.query(sql, params);
    res.json({ success: true, count: rows.length, data: rows });
    */

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching books'
    });
  }
});

// ============================================
// GET /api/books/:id
// Get single book by ID
// ============================================

/**
 * Test Case 1: Get existing book
 * Method: GET
 * URL: http://localhost:3000/api/books/6
 * Expected: Book object for "The Song of Achilles"
 */

/**
 * Test Case 2: Get non-existent book
 * Method: GET
 * URL: http://localhost:3000/api/books/999
 * Expected: { "success": false, "message": "Book not found" }
 */

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get book by ID
    const book = db.getBookById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    res.json({
      success: true,
      data: book
    });

    /*
    // REAL DATABASE VERSION:
    const [rows] = await db.query('SELECT * FROM books WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    
    res.json({ success: true, data: rows[0] });
    */

  } catch (error) {
    console.error('Get book error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving book'
    });
  }
});

// ============================================
// GET /api/books/isbn/:isbn
// Get single book by ISBN
// ============================================

/**
 * Test Case 1: Get book by ISBN
 * Method: GET
 * URL: http://localhost:3000/api/books/isbn/9780062060624
 * Expected: Book object for "The Song of Achilles"
 */

/**
 * Test Case 2: Get non-existent ISBN
 * Method: GET
 * URL: http://localhost:3000/api/books/isbn/0000000000
 * Expected: { "success": false, "message": "Book not found" }
 */

router.get('/isbn/:isbn', async (req, res) => {
  try {
    const { isbn } = req.params;
    
    // Get book by ISBN
    const book = db.getBookByIsbn(isbn);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    res.json({
      success: true,
      data: book
    });

  } catch (error) {
    console.error('Get book by ISBN error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving book'
    });
  }
});

// ============================================
// POST /api/books
// Insert new book (admin only)
// ============================================

/**
 * Test Case 1: Insert valid book
 * Method: POST
 * URL: http://localhost:3000/api/books
 * Body: raw JSON
 * {
 *   "isbn": "9781234567890",
 *   "title": "New Book Title",
 *   "author": "Author Name",
 *   "price": 350,
 *   "genre": "fiction",
 *   "publisher": "Publisher Name",
 *   "pub_date": "2024-01-15",
 *   "synopsis": "This is the book synopsis...",
 *   "cover_url": "https://example.com/cover.jpg"
 * }
 * Expected: { "success": true, "message": "Book added successfully", "data": {...} }
 */

/**
 * Test Case 2: Insert with missing required fields
 * Method: POST
 * URL: http://localhost:3000/api/books
 * Body: raw JSON
 * {
 *   "title": "Incomplete Book"
 * }
 * Expected: { "success": false, "message": "Missing required fields: isbn, author, price" }
 */

router.post('/', async (req, res) => {
  try {
    const { isbn, title, author, price, genre, publisher, pub_date, synopsis, cover_url } = req.body;

    // Validate required fields
    const missingFields = [];
    if (!isbn) missingFields.push('isbn');
    if (!title) missingFields.push('title');
    if (!author) missingFields.push('author');
    if (!price) missingFields.push('price');

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Check if ISBN already exists
    const existingBook = db.getBookByIsbn(isbn);
    if (existingBook) {
      return res.status(409).json({
        success: false,
        message: 'A book with this ISBN already exists'
      });
    }

    // Insert new book
    const newBook = db.insertBook({
      isbn,
      title,
      author,
      price: parseFloat(price),
      genre: genre || 'fiction',
      publisher: publisher || '',
      pub_date: pub_date || null,
      synopsis: synopsis || '',
      cover_url: cover_url || ''
    });

    res.status(201).json({
      success: true,
      message: 'Book added successfully',
      data: newBook
    });

    /*
    // REAL DATABASE VERSION:
    const [result] = await db.query(
      'INSERT INTO books (isbn, title, author, price, genre, publisher, pub_date, synopsis, cover_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [isbn, title, author, price, genre, publisher, pub_date, synopsis, cover_url]
    );
    
    res.status(201).json({
      success: true,
      message: 'Book added successfully',
      data: { id: result.insertId, ...req.body }
    });
    */

  } catch (error) {
    console.error('Insert error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding book'
    });
  }
});

// ============================================
// PUT /api/books/:id
// Update existing book (admin only)
// ============================================

/**
 * Test Case 1: Update existing book
 * Method: PUT
 * URL: http://localhost:3000/api/books/6
 * Body: raw JSON
 * {
 *   "price": 350,
 *   "synopsis": "Updated synopsis text..."
 * }
 * Expected: { "success": true, "message": "Book updated successfully", "data": {...} }
 */

/**
 * Test Case 2: Update non-existent book
 * Method: PUT
 * URL: http://localhost:3000/api/books/999
 * Body: raw JSON
 * {
 *   "price": 500
 * }
 * Expected: { "success": false, "message": "Book not found" }
 */

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if book exists
    const existingBook = db.getBookById(id);
    if (!existingBook) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    // Update book
    const updatedBook = db.updateBook(id, updateData);

    res.json({
      success: true,
      message: 'Book updated successfully',
      data: updatedBook
    });

    /*
    // REAL DATABASE VERSION:
    const fields = Object.keys(updateData);
    const values = Object.values(updateData);
    
    const setClause = fields.map(f => `${f} = ?`).join(', ');
    
    await db.query(
      `UPDATE books SET ${setClause} WHERE id = ?`,
      [...values, id]
    );
    
    const [rows] = await db.query('SELECT * FROM books WHERE id = ?', [id]);
    res.json({ success: true, message: 'Book updated', data: rows[0] });
    */

  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating book'
    });
  }
});

// ============================================
// DELETE /api/books/:id
// Delete book (admin only)
// ============================================

/**
 * Test Case 1: Delete existing book
 * Method: DELETE
 * URL: http://localhost:3000/api/books/15
 * Expected: { "success": true, "message": "Book deleted successfully" }
 */

/**
 * Test Case 2: Delete non-existent book
 * Method: DELETE
 * URL: http://localhost:3000/api/books/999
 * Expected: { "success": false, "message": "Book not found" }
 */

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if book exists
    const existingBook = db.getBookById(id);
    if (!existingBook) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    // Delete book
    db.deleteBook(id);

    res.json({
      success: true,
      message: 'Book deleted successfully'
    });

    /*
    // REAL DATABASE VERSION:
    const [result] = await db.query('DELETE FROM books WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    
    res.json({ success: true, message: 'Book deleted successfully' });
    */

  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting book'
    });
  }
});

module.exports = router;
