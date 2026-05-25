/**
 * BeatHub Backend - Main Application
 * 
 * A music streaming platform API built with Express.js and MongoDB.
 * 
 * Features:
 * - User authentication and authorization
 * - Song management (CRUD operations)
 * - Playlist creation and management
 * - Analytics and insights
 * - Pagination (offset-based and cursor-based)
 * 
 * API Routes:
 * - /api/auth - Authentication (register, login)
 * - /api/songs - Song CRUD operations
 * - /api/song - Paginated songs (offset)
 * - /api/song/cursor - Paginated songs (cursor-based)
 * - /api/analytics - Analytics and aggregations
 */

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const songRoutes = require('./routes/songroutes.js');
const analyticsRouter = require('./routes/analytics');
const authRoutes = require('./routes/auth');
const paginatedSongRoutes = require('./routes/songs.js');

const app = express();

// Middleware
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/beathub_test', {})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Connection Error:', err));

// Mount Routes
app.use('/api/songs', songRoutes);        // CRUD song operations
app.use('/api/auth', authRoutes);          // Authentication routes
app.use('/api/analytics', analyticsRouter); // Analytics and aggregations
app.use('/api', paginatedSongRoutes);      // Paginated song routes

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🎵 BeatHub Server running on port ${PORT}`);
});