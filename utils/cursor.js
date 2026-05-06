/**
 * Cursor Utilities
 * 
 * Purpose: Handle encoding/decoding of cursors for cursor-based pagination.
 * 
 * Cursor-based pagination is efficient for:
 * - Large datasets
 * - Preventing offset issues
 * - Real-time data updates
 * 
 * Implementation uses base64 encoding for cursor values (usually ObjectIds)
 */

/**
 * Encode cursor value to base64 string
 * @param {string} value - The cursor value (usually a MongoDB ObjectId)
 * @returns {string} Base64 encoded cursor
 */
function encodeCursor(value) {
  return Buffer.from(value.toString()).toString('base64');
}

/**
 * Decode base64 cursor string back to original value
 * @param {string} cursor - Base64 encoded cursor
 * @returns {string} Decoded cursor value
 */
function decodeCursor(cursor) {
  return Buffer.from(cursor, 'base64').toString('utf-8');
}

module.exports = { encodeCursor, decodeCursor };