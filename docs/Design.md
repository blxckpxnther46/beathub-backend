# 🎼 BeatHub Design Document

## Overview

This document outlines the data model architecture for the BeatHub music streaming platform, including schema design, relationship decisions, and justification for design choices.

## 1. Data Model & Relationships

### Entity Relationship Diagram

```
Artist
  ├─── Album (many-to-one) 
  │     ├─── Song (many-to-one)
  │     │     ├─── User (liked songs array)
  │     │     └─── Playlist (songs array)
  │
  └─── Song (direct reference)

User
  └─── Playlist (one-to-many)
        └─── Songs (array of references)
```

### Collection Overview

| Collection | Description | Key References |
|-----------|-------------|--------------------|
| **Artists** | Musician/band profiles | albums[], songs[] |
| **Albums** | Album collections | artist |
| **Songs** | Individual tracks | artist, album, plays count |
| **Users** | User accounts | likedSongs[], role-based |
| **Playlists** | User-created collections | user, songs[] |

## 2. Design Decisions (Detailed Justification)

### Decision 1: Songs as References in Playlists

**Question:** Why reference Songs in Playlists instead of embedding them?

**Answer:** Songs are referenced rather than embedded because they are **shared resources** used across many playlists.

#### Problems with Embedding:
- **Data Inconsistency:** If song data were embedded, updating a song (title, duration, metadata) would require updating every playlist containing it
- **Memory Waste:** Song data duplicated across hundreds or thousands of playlists
- **Complexity:** Maintenance nightmare with stale data issues

#### Benefits of Referencing:

✅ **Data Consistency** - Changes to a song automatically reflect everywhere it's used  
✅ **Storage Efficiency** - Song exists only once in the database  
✅ **Scalability** - Playlists remain lightweight regardless of song count  
✅ **Performance** - Efficient updates without touching other documents  

#### Tradeoff Analysis:
- **Cost:** One additional `$lookup` operation during queries
- **Benefit:** Eliminates entire class of consistency issues
- **Best Practice:** MongoDB recommends referencing for shared data

**Decision: REFERENCE (using ObjectId)**

---

### Decision 2: Direct Artist Reference in Songs

**Question:** Why reference Artist directly in the Song model?

**Answer:** The Artist is referenced directly to **optimize query performance** for the most common song queries.

#### Problem with Alternative (Song → Album → Artist):
```javascript
// Without direct artist reference (slow)
Song.findOne({/* query */})
  .populate({ path: 'album', populate: { path: 'artist' } })
  // Requires nested populates or aggregation stages
```

#### Solution (Direct Reference):
```javascript
// With direct artist reference (fast)
Song.find({ artist: artistId })
  .sort({ plays: -1 })
  // Single collection scan with efficient index
```

#### Query Patterns Optimized:
- ✅ "Find all songs by a specific artist"  
- ✅ "Show top songs by artist popularity"  
- ✅ "Filter songs by artist genre"  
- ✅ "Get artist's latest songs"  

#### Technical Justification:
- Music platforms have **high frequency artist-based queries**
- Direct reference eliminates nested population
- Enables efficient composite indexing (`artist: 1, plays: -1`)
- Reduces query complexity and latency

#### Data Redundancy Analysis:
- **Redundant Data:** Artist appears in both Album and Song
- **Justification:** Artist ID (small ObjectId) has minimal storage cost
- **Benefit:** Massive query performance improvement
- **Approach:** Controlled denormalization for read-heavy workloads

**Decision: REFERENCE (controlled denormalization)**

## 3. Schema Constraints

### Data Validation

| Collection | Field | Constraint | Reason |
|-----------|-------|-----------|--------|
| User | email | Unique, Required | Authentication identifier |
| User | username | Unique, Required | Public identifier |
| User | role | enum: [user, admin] | Authorization control |
| Song | genre | enum: [Pop, Rock...] | Consistent filtering |
| Song | releaseYear | Required | Historical accuracy |
| Artist | genre | enum: [Pop, Rock...] | Category consistency |

## 4. Design Trade-offs Summary

| Aspect | Choice | Reason |
|--------|--------|--------|
| **Songs in Playlists** | Reference | Shared resources, consistency |
| **Artist in Songs** | Direct Reference | Query performance optimization |
| **User Role** | Enum Field | RBAC without separate collection |
| **Song Genre** | Enum Constraint | Prevents invalid values |
| **Timestamps** | Auto-enabled | Change tracking |
| **Password Hashing** | bcryptjs Pre-hook | Security best practice |

## 5. Scalability Considerations

### Current Capacity
- **2,000 songs** with efficient querying
- **200 users** with role-based access
- **400 playlists** with average 15 songs each

### Future Growth Strategy
- Implement sharding on `artist` or `user` fields
- Add caching layer (Redis) for popular artists/songs
- Consider materialized views for analytics
- Archive old playlists to separate collections

### Performance Bottlenecks to Monitor
- ⚠️ Large aggregation pipelines on analytics queries
- ⚠️ $lookup operations on high-traffic endpoints
- ⚠️ Write performance during index creation
