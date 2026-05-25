/**
 * Authentication Controller
 * Handles user registration and login operations.
 * 
 * Features:
 * - User registration with password hashing
 * - User login with JWT token generation
 * - Login count tracking
 * - Password validation and comparison
 * - Error handling and security checks
 */

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * Helper function to generate JWT token
 */
const generateToken = (userId, username) => {
  return jwt.sign(
    { id: userId, username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * Register a new user
 * Validates email and username uniqueness, hashes password, and creates user account
 */
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        error: { message: 'Please provide username, email, and password' }
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: { message: 'User already exists' }
      });
    }

    // Create user (password is hashed by Mongoose pre('save') middleware)
    const newUser = new User({
      username,
      email,
      password
    });

    await newUser.save();

    // Generate JWT token
    const token = generateToken(newUser._id, newUser.username);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Registration failed', details: error.message }
    });
  }
};

/**
 * Login an existing user
 * Validates credentials, generates JWT token, and increments login count
 */
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: { message: 'Please provide email and password' }
      });
    }

    // Find user by email and explicitly select password field
    const user = await User.findOne({ email }).select('+password');

    // Check if user exists
    if (!user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid email or password' }
      });
    }

    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid email or password' }
      });
    }

    // Generate JWT
    const token = generateToken(user._id, user.username);

    // Update login count
    await User.findByIdAndUpdate(user._id, { $inc: { loginCount: 1 } });

    // Send response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Login failed', details: error.message }
    });
  }
};