/**
 * Authentication Routes
 * Handles admin login functionality
 * 
 * Endpoints:
 * - POST /api/auth/login - Authenticate admin user
 */

const express = require('express');
const router = express.Router();
const db = require('../config/db');

// ============================================
// POST /api/auth/login
// Authenticate admin user
// ============================================

/**
 * Test Case 1: Successful login
 * Method: POST
 * URL: http://localhost:3000/api/auth/login
 * Body: raw JSON
 * {
 *   "username": "Ludwighandsome",
 *   "password": "12345678"
 * }
 * Expected: { "success": true, "message": "Login successful", "admin": {...} }
 */

/**
 * Test Case 2: Invalid credentials
 * Method: POST
 * URL: http://localhost:3000/api/auth/login
 * Body: raw JSON
 * {
 *   "username": "wronguser",
 *   "password": "wrongpass"
 * }
 * Expected: { "success": false, "message": "Invalid username or password" }
 */

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    // Find admin by username
    const admin = db.getAdmin(username);

    // Check if admin exists and password matches
    // NOTE: In production, use bcrypt.compare() for hashed passwords
    if (!admin || admin.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // Login successful - return admin info (without password)
    const { password: _, ...adminData } = admin;
    
    res.json({
      success: true,
      message: 'Login successful',
      admin: adminData
    });

    /* 
    // REAL DATABASE VERSION (uncomment when using MySQL):
    
    const [rows] = await db.query(
      'SELECT * FROM admin_logins al JOIN admins a ON al.admin_id = a.id WHERE al.username = ?',
      [username]
    );
    
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    const admin = rows[0];
    const passwordMatch = await bcrypt.compare(password, admin.password);
    
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    // Log the login
    await db.query(
      'UPDATE admin_logins SET login_log = NOW() WHERE id = ?',
      [admin.login_id]
    );
    
    res.json({ success: true, admin: { id: admin.id, username: admin.username } });
    */

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during authentication'
    });
  }
});

module.exports = router;
