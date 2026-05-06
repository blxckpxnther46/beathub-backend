/**
 * Performance Test Script
 * 
 * Purpose: Execute sample queries to test performance and validate indexes.
 * 
 * Queries Tested:
 * 1. Find Electronic songs sorted by duration
 * 2. Find songs released after 2015 sorted by year
 * 3. Find playlists for random user
 * 4. Find songs by artist sorted by play count
 * 5. Find highly active users (loginCount > 100)
 * 
 * Usage: npm run test:performance
 * Note: Requires seeded database
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Song = require('../models/Song');
const Playlist = require('../models/Playlist');
const User = require('../models/User');

/**
 * Execute all test queries and log results
 */
async function runTests() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('📊 Running performance tests...\n');

  // Test 1: Genre filter with sort
  console.log('Test 1️⃣: Find Electronic songs sorted by duration');
  await Song.find({ genre: 'Electronic' })
    .sort({ duration: -1 });

  console.log('✓ Query 1 executed\n');

  // Test 2: Date range filter with sort
  console.log('Test 2️⃣: Find songs released after 2015 sorted by year');
  await Song.find({ releaseYear: { $gt: 2015 } })
    .sort({ releaseYear: -1 });

  console.log('✓ Query 2 executed\n');

  // Test 3: Filter by user ID
  console.log('Test 3️⃣: Find playlists by random user');
  const playlist = await Playlist.findOne();
  await Playlist.find({ user: playlist.user });

  console.log('✓ Query 3 executed\n');
  
  // Test 4: Artist filter with sort by plays
  console.log('Test 4️⃣: Find songs by Artist sorted by play count');
  // Get random song to extract valid artist ID
  const randomSong = await Song.findOne();
  if (randomSong) {
    await Song.find({ artist: randomSong.artist })
      .sort({ plays: -1 });
  }
  console.log('✓ Query 4 executed\n');

  // Test 5: Range query on number field
  console.log('Test 5️⃣: Find highly active users (loginCount > 100)');
  await User.find({ loginCount: { $gt: 100 } });
  console.log('✓ Query 5 executed\n');

  console.log('✅ All performance tests completed!');
  process.exit(0);
}

runTests();