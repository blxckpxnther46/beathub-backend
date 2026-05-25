/**
 * Song Controller (CRUD Operations)
 * Handles complete CRUD operations for songs.
 * 
 * Features:
 * - Get all songs
 * - Get single song by ID
 * - Create new song
 * - Update existing song
 * - Delete song
 * - Full validation and error handling
 */

const Song = require('../models/Song');
const mongoose = require('mongoose');
const { encodeCursor, decodeCursor } = require('../utils/cursor');

/**
 * GET - Retrieve all songs from the database
 * Supports cursor-based pagination when limit or cursor parameters are provided
 */
const getAllSongs = async (req, res) => {
  try {
    // Check if pagination parameters are provided
    const limit = req.query.limit ? Math.min(parseInt(req.query.limit), 100) : null;
    const encodedCursor = req.query.cursor;

    // If pagination is requested, use cursor-based pagination
    if (limit || encodedCursor) {
      let cursor = null;

      if (encodedCursor) {
        cursor = decodeCursor(encodedCursor);
      }

      const query = cursor ? { _id: { $lt: cursor } } : {};

      const songs = await Song.find(query)
        .sort({ _id: -1 })
        .limit(limit ? limit + 1 : 11)
        .lean();

      const actualLimit = limit || 10;
      const hasMore = songs.length > actualLimit;

      if (hasMore) {
        songs.pop();
      }

      const nextCursor =
        hasMore && songs.length > 0
          ? encodeCursor(songs[songs.length - 1]._id)
          : null;

      return res.status(200).json({
        success: true,
        data: songs,
        pagination: {
          nextCursor,
          hasMore,
          limit: actualLimit,
          count: songs.length
        }
      });
    }

    // Default: return all songs without pagination
    const songs = await Song.find();
    return res.status(200).json(songs);
  } catch (error) {
    return res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * GET - Retrieve a single song by its ID
 * Validates ObjectId format before querying
 */
const getSongById = async (req, res) => {
  const { id } = req.params;

  // Validate ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid song ID format' });
  }

  try {
    const song = await Song.findById(id);

    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }

    return res.status(200).json(song);

  } catch (error) {
    return res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * POST - Create a new song in the database
 * Validates all required fields and enforces schema constraints
 */
const createSong = async (req, res) => {
  try {
    const { title, duration, artist, album, genre, releaseYear } = req.body;

    const newSong = new Song({
      title,
      duration,
      artist,
      album,
      genre,
      releaseYear
    });

    const savedSong = await newSong.save();
    return res.status(201).json({ success: true, data: savedSong });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Server Error' });
  }
};
/**
 * PATCH - Update an existing song
 * Validates ID, enforces schema constraints, returns updated document
 */
const updateSong = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Song ID" });
  }

  try {
    const updatedSong = await Song.findByIdAndUpdate(
      id,
      updates,
      {
        new: true,          // return updated doc
        runValidators: true // enforce schema rules
      }
    );

    if (!updatedSong) {
      return res.status(404).json({ message: "Song not found" });
    }

    return res.status(200).json({
      success: true,
      data: updatedSong
    });

  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: "Server Error" });
  }
};

/**
 * DELETE - Remove a song from the database
 * Returns 204 No Content on successful deletion
 */
const deleteSong = async (req, res) => {
  const { id } = req.params;

  // Validate ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Song ID" });
  }

  try {
    const deletedSong = await Song.findByIdAndDelete(id);

    if (!deletedSong) {
      return res.status(404).json({ message: "Song not found" });
    }

    return res.status(204).send();

  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getAllSongs,
  getSongById,
  createSong,
  updateSong,
  deleteSong
};