/**
 * NaiRarm Bookshop - API Module
 * Handles all communication with backend web services
 */

const API_BASE = 'http://localhost:3000/api';

const api = {
  /**
   * Authentication - Login
   * @param {string} username 
   * @param {string} password 
   */
  async login(username, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return res.json();
  },

  /**
   * Search books with optional filters
   * Supports: title, author, genre (3 criteria as required)
   * @param {Object} filters - { title?, author?, genre? }
   */
  async searchBooks(filters = {}) {
    const params = new URLSearchParams();
    if (filters.title) params.append('title', filters.title);
    if (filters.author) params.append('author', filters.author);
    if (filters.genre) params.append('genre', filters.genre);
    
    const res = await fetch(`${API_BASE}/books?${params}`);
    return res.json();
  },

  /**
   * Get all books (no criteria search)
   */
  async getAllBooks() {
    const res = await fetch(`${API_BASE}/books`);
    return res.json();
  },

  /**
   * Get single book by ID
   * @param {number} id 
   */
  async getBook(id) {
    const res = await fetch(`${API_BASE}/books/${id}`);
    return res.json();
  },

  /**
   * Insert new book (admin only)
   * @param {Object} bookData 
   */
  async insertBook(bookData) {
    const res = await fetch(`${API_BASE}/books`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookData)
    });
    return res.json();
  },

  /**
   * Update existing book (admin only)
   * @param {number} id 
   * @param {Object} bookData 
   */
  async updateBook(id, bookData) {
    const res = await fetch(`${API_BASE}/books/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookData)
    });
    return res.json();
  },

  /**
   * Delete book (admin only)
   * @param {number} id 
   */
  async deleteBook(id) {
    const res = await fetch(`${API_BASE}/books/${id}`, {
      method: 'DELETE'
    });
    return res.json();
  }
};
