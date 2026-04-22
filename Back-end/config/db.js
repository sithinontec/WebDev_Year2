/**
 * Database configuration - supports two modes:
 * - Real MySQL pool when `USE_REAL_DB=true` in .env
 * - In-memory simulated DB (default) for development/testing
 */

require('dotenv').config();

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: parseInt(process.env.DB_CONN_LIMIT, 10) || 10,
  queueLimit: 0
});

// Helper to truncate string values to DB column limits
function sanitizeForColumn(col, val) {
  if (val === null || val === undefined) return val;
  if (typeof val !== 'string') return val;
  const limits = {
    ISBN: 20,
    title: 255,
    genre: 50,
    publisher: 100,
    authorName: 100
  };
  const max = limits[col] || limits[col] === 0 ? limits[col] : (limits[col] ?? 0);
  // if no explicit limit, just trim whitespace
  if (!max || max <= 0) return val.trim();
  const s = val.trim();
  return s.length > max ? s.slice(0, max) : s;
}

const db = {
  query: (...args) => pool.query(...args),

  getAdmin: async (username) => {
    const [rows] = await pool.query(
      'SELECT al.*, a.firstName, a.lastName, a.email FROM admin_logins al JOIN admins a ON al.adminID = a.adminID WHERE al.userName = ?',
      [username]
    );
    return rows.length ? rows[0] : null;
  },

  getBooks: async (filters = {}) => {
    // Join authors to get the authorName and use schema column names
    let sql = `SELECT b.*, a.authorName as authorName FROM books b LEFT JOIN authors a ON b.authorID = a.authorID WHERE 1=1`;
    const params = [];
    if (filters.title) {
      sql += ' AND b.title LIKE ?';
      params.push(`%${filters.title}%`);
    }
    if (filters.author) {
      sql += ' AND a.authorName LIKE ?';
      params.push(`%${filters.author}%`);
    }
    if (filters.genre) {
      sql += ' AND b.genre = ?';
      params.push(filters.genre);
    }

    const [rows] = await pool.query(sql, params);

    // Normalize rows for frontend: provide `id`, `author`, and `cover_url` fields
    return rows.map(r => ({
      id: r.bookID,
      title: r.title,
      author: r.authorName || null,
      price: r.price,
      genre: r.genre,
      publisher: r.publisher,
      synopsis: r.synopsis,
      ISBN: r.ISBN,
      isbn: r.ISBN,
      publishedDate: r.publishedDate,
      pub_date: r.publishedDate,
      authorID: r.authorID,
      adminID: r.adminID,
      created_at: r.created_at,
      updated_at: r.updated_at,
      cover_url: r.ISBN ? `https://covers.openlibrary.org/b/isbn/${r.ISBN}-L.jpg` : null
    }));
  },

  getBookById: async (id) => {
    const [rows] = await pool.query(
      'SELECT b.*, a.authorName as authorName FROM books b LEFT JOIN authors a ON b.authorID = a.authorID WHERE b.bookID = ?',
      [id]
    );
    if (!rows.length) return null;
    const r = rows[0];
    return {
      id: r.bookID,
      title: r.title,
      author: r.authorName || null,
      price: r.price,
      genre: r.genre,
      publisher: r.publisher,
      synopsis: r.synopsis,
      ISBN: r.ISBN,
      isbn: r.ISBN,
      publishedDate: r.publishedDate,
      pub_date: r.publishedDate,
      authorID: r.authorID,
      adminID: r.adminID,
      created_at: r.created_at,
      updated_at: r.updated_at,
      cover_url: r.ISBN ? `https://covers.openlibrary.org/b/isbn/${r.ISBN}-L.jpg` : null
    };
  },

  getBookByIsbn: async (isbn) => {
    const [rows] = await pool.query(
      'SELECT b.*, a.authorName as authorName FROM books b LEFT JOIN authors a ON b.authorID = a.authorID WHERE b.ISBN = ?',
      [isbn]
    );
    if (!rows.length) return null;
    const r = rows[0];
    return {
      id: r.bookID,
      title: r.title,
      author: r.authorName || null,
      price: r.price,
      genre: r.genre,
      publisher: r.publisher,
      synopsis: r.synopsis,
      ISBN: r.ISBN,
      isbn: r.ISBN,
      publishedDate: r.publishedDate,
      pub_date: r.publishedDate,
      authorID: r.authorID,
      adminID: r.adminID,
      created_at: r.created_at,
      updated_at: r.updated_at,
      cover_url: r.ISBN ? `https://covers.openlibrary.org/b/isbn/${r.ISBN}-L.jpg` : null
    };
  },

  insertBook: async (bookData) => {
    // Resolve author name to authorID if necessary
    let authorID = bookData.authorID || null;
    if (!authorID && bookData.author) {
      const [existing] = await pool.query('SELECT authorID FROM authors WHERE authorName = ?', [bookData.author]);
      if (existing.length) {
        authorID = existing[0].authorID;
      } else {
        const [res] = await pool.query('INSERT INTO authors (authorName) VALUES (?)', [bookData.author]);
        authorID = res.insertId;
      }
    }

    const sql = `INSERT INTO books (ISBN, title, genre, publishedDate, price, publisher, synopsis, authorID, adminID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const rawIsbn = bookData.ISBN || bookData.isbn || null;
    const rawTitle = bookData.title || null;
    const rawGenre = bookData.genre || null;
    const rawPubDate = bookData.publishedDate || bookData.pub_date || null;
    const rawPrice = bookData.price || null;
    const rawPublisher = bookData.publisher || null;
    const rawSynopsis = bookData.synopsis || null;

    const params = [
      sanitizeForColumn('ISBN', rawIsbn),
      sanitizeForColumn('title', rawTitle),
      sanitizeForColumn('genre', rawGenre),
      rawPubDate,
      rawPrice,
      sanitizeForColumn('publisher', rawPublisher),
      rawSynopsis,
      authorID,
      bookData.adminID || null
    ];
    const [result] = await pool.query(sql, params);
    return { id: result.insertId, ...bookData };
  },

  updateBook: async (id, bookData) => {
    // If author name provided, resolve to authorID and remove 'author' field
    if (bookData.author) {
      const [existing] = await pool.query('SELECT authorID FROM authors WHERE authorName = ?', [bookData.author]);
      if (existing.length) {
        bookData.authorID = existing[0].authorID;
      } else {
        const [res] = await pool.query('INSERT INTO authors (authorName) VALUES (?)', [bookData.author]);
        bookData.authorID = res.insertId;
      }
      delete bookData.author;
    }

    const fields = Object.keys(bookData);
    if (fields.length === 0) return null;

    // Map frontend keys to actual DB column names when necessary
    const columnMap = {
      isbn: 'ISBN',
      pub_date: 'publishedDate',
      publishedDate: 'publishedDate'
    };

    const dbCols = [];
    const values = [];
    for (const f of fields) {
      const col = columnMap[f] || f;
      dbCols.push(col);
      // sanitize known string columns
      values.push(sanitizeForColumn(col, bookData[f]));
    }

    const setClause = dbCols.map(c => `${c} = ?`).join(', ');
    await pool.query(`UPDATE books SET ${setClause} WHERE bookID = ?`, [...values, id]);

    // Return normalized book object (join with authors)
    const [rows] = await pool.query(
      'SELECT b.*, a.authorName as authorName FROM books b LEFT JOIN authors a ON b.authorID = a.authorID WHERE b.bookID = ?',
      [id]
    );
    if (!rows.length) return null;
    const r = rows[0];
    return {
      id: r.bookID,
      title: r.title,
      author: r.authorName || null,
      price: r.price,
      genre: r.genre,
      publisher: r.publisher,
      synopsis: r.synopsis,
      ISBN: r.ISBN,
      isbn: r.ISBN,
      publishedDate: r.publishedDate,
      pub_date: r.publishedDate,
      authorID: r.authorID,
      adminID: r.adminID,
      created_at: r.created_at,
      updated_at: r.updated_at,
      cover_url: r.ISBN ? `https://covers.openlibrary.org/b/isbn/${r.ISBN}-L.jpg` : null
    };
  },

  deleteBook: async (id) => {
    const [result] = await pool.query('DELETE FROM books WHERE bookID = ?', [id]);
    return result.affectedRows > 0;
  }
};

module.exports = db;
