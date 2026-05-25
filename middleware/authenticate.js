/**
 * Authentication Middleware
 * Validates JWT tokens and attaches authenticated user to request.
 * 
 * Features:
 * - Extracts JWT from Authorization header
 * - Verifies token validity and expiration
 * - Fetches user data and attaches to req.user
 * - Returns detailed error messages for different JWT errors
 * 
 * Usage: Use as middleware on protected routes
 * Example: router.get('/protected', authenticate, controller)
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authenticate user by verifying JWT token
 */
const authenticate = async (req, res, next) => {
  try {
    let token;

    // 1. Extract token from Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // 2. Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'You are not logged in. Please log in to get access.'
      });
    }

    // 3. Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      // Handle specific JWT errors
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Your token has expired. Please log in again.'
        });
      } else if (jwtError.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token. Please log in again.'
        });
      }
      throw jwtError;
    }

    // 4. Fetch user from database
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.'
      });
    }

    // 5. Attach user to request
    req.user = currentUser;
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token. Please log in again.'
    });
  }
};

module.exports = authenticate;