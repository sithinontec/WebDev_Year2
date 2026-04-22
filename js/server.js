require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let db;

// ==============================
// CONNECT TO DATABASE
// ==============================
(async () => {
  try {
    db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    console.log("MySQL connected");
  } catch (err) {
    console.error("DB connection failed:", err);
  }
})();


// ==============================
// GET ALL BOOKS (SEARCH INCLUDED)
// ==============================
app.get('/api/books', async (req, res) => {
  const { title, author, genre, isbn } = req.query;

  try {
    let query = `
      SELECT 
        b.id AS id,
        b.title,
        a.authorName AS author,
        b.price,
        b.genre,
        b.cover_url AS cover_url,
        b.pub_date AS pub_date,
        b.synopsis,
        b.ISBN AS isbn,
        b.publisher
      FROM books b
      JOIN author a ON b.authorID = a.authorID
      WHERE 1=1
    `;

    const params = [];

    if (title) {
      query += " AND LOWER(b.title) LIKE LOWER(?)";
      params.push(`%${title}%`);
    }

    if (author) {
      query += " AND LOWER(a.authorName) LIKE LOWER(?)";
      params.push(`%${author}%`);
    }

    if (genre) {
      query += " AND LOWER(b.genre) LIKE LOWER(?)";
      params.push(`%${genre}%`);
    }
    if (isbn) {
    query += " AND b.isbn = ?";
    params.push(isbn);
      }

    const [results] = await db.execute(query, params);

    res.json({
      success: true,
      data: results,
      count: results.length
    });

  } catch (err) {
    console.error(err);
    res.json({ success: false, message: err.message });
  }
});


// ==============================
// GET SINGLE BOOK
// ==============================
app.get('/api/books/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const [results] = await db.execute(`
      SELECT 
        b.id AS id,
        b.title,
        a.authorName AS author,
        b.price,
        b.genre,
        b.cover_url AS cover_url,
        b.pub_date AS pub_date,
        b.synopsis,
        b.ISBN AS isbn,
        b.publisher
      FROM books b
      JOIN author a ON b.authorID = a.authorID
      WHERE b.id = ?
    `, [id]);

    res.json({
      success: true,
      data: results[0]
    });

  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});


// ==============================
// INSERT BOOK
// ==============================
app.post('/api/books', async (req, res) => {
  const b = req.body;

  try {
    // 1. Get or create author
    const [rows] = await db.execute(
      "SELECT authorID FROM author WHERE authorName = ?",
      [b.author]
    );

    let authorID;

    if (rows.length > 0) {
      authorID = rows[0].authorID;
    } else {
      const [result] = await db.execute(
        "INSERT INTO author (authorName) VALUES (?)",
        [b.author]
      );
      authorID = result.insertId;
    }

    // 2. Insert book
    await db.execute(`
      INSERT INTO books 
      (title, isbn, genre, pub_date, price, publisher, cover_url, synopsis, authorID, adminID)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
    `, [
      b.title,
      b.isbn,
      b.genre,
      b.pub_date,
      b.price,
      b.publisher,
      b.cover_url,
      b.synopsis,
      authorID
    ]);

    res.json({ success: true, message: "Book added" });

  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});


// ==============================
// UPDATE BOOK
// ==============================
app.put('/api/books/:id', async (req, res) => {
  const id = req.params.id;
  const b = req.body;

  try {
    const [rows] = await db.execute(
      "SELECT authorID FROM author WHERE authorName = ?",
      [b.author]
    );

    let authorID;

    if (rows.length > 0) {
      authorID = rows[0].authorID;
    } else {
      const [result] = await db.execute(
        "INSERT INTO author (authorName) VALUES (?)",
        [b.author]
      );
      authorID = result.insertId;
    }

    await db.execute(`
      UPDATE books SET
        title = ?,
        isbn = ?,
        genre = ?,
        pub_date = ?,
        price = ?,
        publisher = ?,
        cover_url = ?,
        synopsis = ?,
        authorID = ?
      WHERE id = ?
    `, [
      b.title,
      b.isbn,
      b.genre,
      b.pub_date,
      b.price,
      b.publisher,
      b.cover_url,
      b.synopsis,
      authorID,
      id
    ]);

    res.json({ success: true, message: "Book updated" });

  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});


// ==============================
// DELETE BOOK
// ==============================
app.delete('/api/books/:id', async (req, res) => {
  try {
    await db.execute("DELETE FROM books WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});


// ==============================
// LOGIN
// ==============================
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.execute(`
      SELECT *
      FROM v_admin_full
      WHERE userName = ?
    `, [username]);

    if (rows.length === 0) {
      return res.json({ success: false, message: "User not found" });
    }

    const admin = rows[0];

    if (password !== admin.password) {
      return res.json({ success: false, message: "Wrong password" });
    }

    res.json({
      success: true,
      admin: admin
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// ==============================
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});