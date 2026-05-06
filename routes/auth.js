/**
 * Authentication Routes
 * Handles user registration and login endpoints.
 * 
 * Endpoints:
 * - POST /api/auth/register - Register new user
 * - POST /api/auth/login - Login user and receive JWT token
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * POST /register
 * Register a new user account
 * Body: { username, email, password }
 */
router.post('/register', authController.registerUser);

/**
 * POST /login
 * Authenticate user and return JWT token
 * Body: { email, password }
 */
router.post('/login', authController.loginUser);

module.exports = router;