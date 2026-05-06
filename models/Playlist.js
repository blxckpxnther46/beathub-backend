/**
 * Playlist Model
 * Represents a user-created playlist in the BeatHub system.
 * 
 * Features:
 * - References to the user who owns the playlist
 * - Dynamic collection of songs
 * - Playlist metadata (name)
 * - Automatic timestamps
 */

const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true,
    trim: true
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  songs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Song"
    }
  ]
},
{
  timestamps: true
}
);

module.exports = mongoose.model("Playlist", playlistSchema);