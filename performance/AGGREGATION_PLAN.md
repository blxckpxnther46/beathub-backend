# 📈 BeatHub Aggregation Pipeline Strategy

## Overview

This document details the aggregation pipelines used in BeatHub for analytics and insights. Aggregation pipelines provide efficient data processing and transformation directly in the database.

## 1. Top Artists Pipeline

### Purpose
Identify the 5 most prolific artists by total number of songs on the platform.

### Use Cases
- "Trending Artists" section on home page
- Analytics dashboard
- Artist rankings

### Pipeline Stages

```javascript
db.songs.aggregate([
  // Stage 1: Group by artist, count songs
  { $group: { _id: "$artist", totalSongs: { $sum: 1 } } },
  
  // Stage 2: Sort descending by song count
  { $sort: { totalSongs: -1 } },
  
  // Stage 3: Limit to top 5
  { $limit: 5 },
  
  // Stage 4: Join with artists collection for details
  { $lookup: {
      from: "artists",
      localField: "_id",
      foreignField: "_id",
      as: "artistDetails"
    }
  },
  
  // Stage 5: Project clean output
  { $project: {
      _id: 0,
      artistId: "$_id",
      totalSongs: 1,
      artistName: { $arrayElemAt: ["$artistDetails.name", 0] },
      genre: { $arrayElemAt: ["$artistDetails.genre", 0] }
    }
  }
])
```

### Performance Considerations
- ✅ $group reduces to 30 documents (number of artists)
- ✅ $limit at stage 3 prevents unnecessary $lookup
- ✅ $lookup only processes 5 documents
- ⚠️ Optimal: **Early filtering with $limit saves expensive joins**

### Output Example
```json
[
  {
    "artistId": ObjectId("..."),
    "totalSongs": 127,
    "artistName": "The Beatles",
    "genre": "Rock"
  },
  {
    "artistId": ObjectId("..."),
    "totalSongs": 98,
    "artistName": "Elvis Presley",
    "genre": "Rock"
  }
]
```

---

## 2. Most Active Users Pipeline

### Purpose
Identify the 5 most active users based on playlist creation activity.

### Use Cases
- Admin dashboard for user engagement metrics
- Gamification (user rankings)
- Community highlights
- Platform health monitoring

### Pipeline Stages

```javascript
db.playlists.aggregate([
  // Stage 1: Group by user, count playlists
  { $group: { _id: "$user", playlistCount: { $sum: 1 } } },
  
  // Stage 2: Sort descending by playlist count
  { $sort: { playlistCount: -1 } },
  
  // Stage 3: Limit to top 5
  { $limit: 5 },
  
  // Stage 4: Join with users collection for details
  { $lookup: {
      from: "users",
      localField: "_id",
      foreignField: "_id",
      as: "userDetails"
    }
  },
  
  // Stage 5: Project clean output
  { $project: {
      _id: 0,
      userId: "$_id",
      playlistCount: 1,
      username: { $arrayElemAt: ["$userDetails.username", 0] },
      email: { $arrayElemAt: ["$userDetails.email", 0] }
    }
  }
])
```

### Performance Considerations
- ✅ $group reduces from 400 playlists to 200 users
- ✅ $limit prevents joining with all users
- ✅ Efficient for analytics queries
- ⚠️ **Typically admin-only endpoint (low volume)**

### Output Example
```json
[
  {
    "userId": ObjectId("..."),
    "playlistCount": 42,
    "username": "john_doe",
    "email": "john@example.com"
  },
  {
    "userId": ObjectId("..."),
    "playlistCount": 38,
    "username": "jane_smith",
    "email": "jane@example.com"
  }
]
```

---

## 3. Aggregation Best Practices Applied

### ✅ Implemented Practices

1. **Early Filtering** - $match stages at beginning (none needed here, but would use before $group)
2. **Minimizing Documents** - $limit after grouping to reduce $lookup overhead
3. **Projection** - Field selection to reduce network transfer
4. **Proper Ordering** - ESR rule: Equality → Sort → Range
5. **$arrayElemAt** - Safe array element extraction

### 🔍 Query Optimization

| Stage | Documents | Purpose |
|-------|-----------|---------|
| After $group | ~30 | Reduce from 2000 songs |
| After $sort | ~30 | Prepare for ordering |
| After $limit | **5** | Minimize $lookup cost |
| After $lookup | **5** | Join with minimal data |
| After $project | **5** | Final output |

### 🎯 Performance Impact

- **Without $limit before $lookup:** Join 30 artists = 30 index lookups
- **With $limit before $lookup:** Join only 5 artists = 5 index lookups
- **Efficiency Gain:** ~83% reduction in join operations

---

## 4. Future Aggregation Patterns

### Potential Pipelines to Add

1. **Most Liked Songs**
   - Group Song collection by _id
   - Count references in User.likedSongs
   - Show top songs by popularity

2. **User Listening Patterns**
   - Analyze song plays over time
   - Track genre preferences per user
   - Detect trending genres

3. **Album Performance**
   - Group songs by album
   - Aggregate play counts
   - Rank albums by engagement

4. **Genre Analytics**
   - Statistics by genre
   - Growth trends
   - User preferences

---

## 5. Monitoring & Maintenance

### Performance Metrics to Track

```javascript
// Run aggregation with explain to monitor performance
db.songs.aggregate(topArtistsPipeline).explain("executionStats")

// Key metrics:
// - executionStages.stage (should use $group, not $collscan)
// - executionStages.nReturned (should be 5)
// - executionStats.executionStages.works (lower is better)
```

### Maintenance Tasks

- ✅ Monitor query execution time in production
- ✅ Update pipelines if data volume changes dramatically
- ✅ Add caching layer if endpoints hit 100+ req/sec
- ✅ Consider materialized views for frequent analytics

---

## Conclusion

These aggregation pipelines are optimized for the current data volume and query patterns. As BeatHub scales, consider:
- Adding indexes on grouping fields
- Implementing caching with Redis
- Creating pre-computed analytics collections
- Using MongoDB Atlas Analytics features
