/**
 * NaiRarm Bookshop - Backend Server
 * ITCS223 Introduction to Web Development - Project Phase II
 * 
 * This server provides REST API endpoints for:
 * - Authentication (admin login)
 * - Book CRUD operations (search, get, insert, update, delete)
 */

const express = require('express');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');

const app = express();
const PORT = 3000;

// ============================================
// Middleware Configuration
// ============================================

// Enable CORS for front-end server (running on different port)
// IMPORTANT: Update origin to match your front-end server URL
app.use(cors({
  origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Parse JSON request bodies
app.use(express.json());

// ============================================
// API Routes
// ============================================

// Authentication routes: POST /api/auth/login
app.use('/api/auth', authRoutes);

// Book routes: GET, POST, PUT, DELETE /api/books
app.use('/api/books', bookRoutes);

// Root endpoint - API info
app.get('/', (req, res) => {
  res.json({
    message: 'NaiRarm Bookshop API',
    version: '1.0.0',
    endpoints: {
      auth: 'POST /api/auth/login',
      books: {
        search: 'GET /api/books?title=&author=&genre=',
        getOne: 'GET /api/books/:id',
        insert: 'POST /api/books',
        update: 'PUT /api/books/:id',
        delete: 'DELETE /api/books/:id'
      }
    }
  });
});

// ============================================
// Error Handling
// ============================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ============================================
// Start Server
// ============================================

app.listen(PORT, () => {
  console.log(`✓ NaiRarm Backend Server running on http://localhost:${PORT}`);
  console.log(`✓ API documentation available at http://localhost:${PORT}/`);
});
