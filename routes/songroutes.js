/**
 * Song Routes (CRUD)
 * Complete REST API for song management.
 * 
 * Endpoints:
 * - GET /api/songs - Get all songs (with CRUD controller)
 * - GET /api/songs/:id - Get single song
 * - POST /api/songs - Create new song
 * - PATCH /api/songs/:id - Update song
 * - DELETE /api/songs/:id - Delete song
 */

const express = require('express');
const router = express.Router();

const {
  getAllSongs,
  getSongById,
  createSong,
  updateSong,
  deleteSong
} = require('../controllers/songcontrollers.js');

// GET /api/songs - Retrieve all songs
router.get('/', getAllSongs);

// GET /api/songs/:id - Retrieve single song by ID
router.get('/:id', getSongById);

// POST /api/songs - Create new song
router.post('/', createSong);

// PATCH /api/songs/:id - Update existing song
router.patch('/:id', updateSong);

// DELETE /api/songs/:id - Delete song from database
router.delete('/:id', deleteSong);

module.exports = router;