/**
 * Song Routes (Pagination)
 * Handles paginated song retrieval with two pagination strategies.
 * 
 * Endpoints:
 * - GET /api/song - Get songs with offset-based pagination
 * - GET /api/song/cursor - Get songs with cursor-based pagination
 * 
 * Query Parameters for /song:
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 10)
 * 
 * Query Parameters for /song/cursor:
 * - cursor: Encoded cursor for next page
 * - limit: Items per page (default: 10, max: 100)
 */

const express = require('express');
const router = express.Router();

const { getSongs, getSongsCursor } = require('../controllers/songcontroller.js');

// GET - Offset-based pagination (page and limit)
router.get('/song', getSongs);

// GET - Cursor-based pagination (more efficient for large datasets)
router.get('/song/cursor', getSongsCursor);

module.exports = router;