/**
 * Song Controller (Pagination Version)
 * Handles song retrieval with pagination and cursor-based pagination.
 * 
 * Features:
 * - Offset-based pagination (page and limit parameters)
 * - Cursor-based pagination for efficient large datasets
 * - Metadata about pagination state (hasNext, hasPrev)
 * - Efficient database queries with lean() optimization
 */

const Song = require('../models/Song');
const { encodeCursor, decodeCursor } = require('../utils/cursor');

/**
 * Get songs with offset-based pagination
 * Returns page of songs with metadata (currentPage, totalPages, etc.)
 */
const getSongs = async (req, res) => {
  try {
    // 1. Get client instructions from query parameters, with safe defaults
    // If the client doesn't provide them, default to page 1, 10 items per page.
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // 2. Calculate the 'skip' value using our magic formula
    const skip = (page - 1) * limit;

    // 3. Get total document count for metadata calculation
    // This is very fast because it doesn't actually fetch the song data.
    const totalDocuments = await Song.countDocuments();
    
    // 4. Fetch the requested "page" of data from the database
    const songs = await Song.find()
      .sort({ createdAt: -1 }) // Optional but recommended: sort newest first
      .skip(skip)
      .limit(limit);

    // 5. Send the final response containing both metadata and data
    res.status(200).json({
      metadata: {
        currentPage: page,
        totalPages: Math.ceil(totalDocuments / limit),
        totalDocuments: totalDocuments,
        hasNext: page < Math.ceil(totalDocuments / limit), // true if not on the last page
        hasPrev: page > 1, // true if not on the first page
      },
      data: songs,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server Error fetching songs', 
      error: error.message 
    });
  }
};


/**
 * Get songs with cursor-based pagination
 * More efficient for large datasets, prevents offset issues
 */
const getSongsCursor = async (req, res) => {

  try {

    const limit = Math.min(parseInt(req.query.limit) || 10, 100);
    const encodedCursor = req.query.cursor;

    let cursor = null;

    if (encodedCursor) {
      cursor = decodeCursor(encodedCursor);
    }

    const query = cursor ? { _id: { $lt: cursor } } : {};

    const songs = await Song.find(query)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .lean();

    const hasMore = songs.length > limit;

    if (hasMore) {
      songs.pop();
    }

    const nextCursor =
      hasMore && songs.length > 0
        ? encodeCursor(songs[songs.length - 1]._id)
        : null;

    res.status(200).json({
      success: true,
      data: songs,
      pagination: {
        nextCursor,
        hasMore,
        limit,
        count: songs.length
      }
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server error"
    });

  }

};


module.exports = { getSongs, getSongsCursor };