/**
 * Artist Model
 * Represents an artist/musician in the BeatHub system.
 * 
 * Features:
 * - Artist profile with name and genre
 * - Social media links (Twitter, Instagram)
 * - Followers tracking
 * - References to their albums and songs
 * - Automatic timestamps
 */

const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  genre: {
    type: String,
    required: true,
    // Restricts the value to only these specific strings
    enum: ['Pop', 'Rock', 'Hip Hop', 'Jazz', 'Electronic'] 
  },
  followers: {
    type: Number,
    default: 0
  },
  socialLinks: {
    twitter: String,
    instagram: String
  },
  // Relationships
  albums: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Album' }],
  songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }]
}, { timestamps: true });

module.exports = mongoose.model('Artist', artistSchema);