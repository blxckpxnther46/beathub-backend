/**
 * Album Model
 * Represents an album collection in the BeatHub system.
 * 
 * Features:
 * - References to the artist who created the album
 * - Release year tracking
 * - Automatic timestamps
 */

const mongoose = require("mongoose");

const albumSchema = new mongoose.Schema(
{
  title: {
    type: String,
    required: true,
    trim: true
  },

  releaseYear: {
    type: Number,
    required: true
  },

  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Artist",
    required: true
  }
},
{
  timestamps: true
}
);

module.exports = mongoose.model("Album", albumSchema);