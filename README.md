# 🎵 BeatHub Backend

A modern music streaming platform API built with **Express.js** and **MongoDB**. This project demonstrates best practices in API design, database optimization, pagination strategies, and aggregation pipelines.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Pagination](#pagination)
- [Performance Optimization](#performance-optimization)

## ✨ Features

- **User Authentication** - JWT-based authentication with role-based access control (RBAC)
- **Song Management** - Full CRUD operations for songs with multiple retrieval strategies
- **Playlist Creation** - Users can create and manage playlists
- **Analytics** - Aggregation pipelines for insights (top artists, active users)
- **Pagination** - Two pagination strategies: offset-based and cursor-based
- **Performance Optimized** - Indexing strategies and query optimization

## 🛠 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (with Mongoose ODM)
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **Environment:** dotenv

## 📁 Project Structure

```
beathub-backend/
├── models/              # Database schemas
│   ├── User.js
│   ├── Song.js
│   ├── Album.js
│   ├── Artists.js
│   └── Playlist.js
├── controllers/         # Business logic
│   ├── authcontroller.js
│   ├── songcontroller.js    # Pagination logic
│   └── songcontrollers.js   # CRUD operations
├── routes/              # API endpoints
│   ├── auth.js
│   ├── songs.js         # Paginated routes
│   ├── songroutes.js    # CRUD routes
│   └── analytics.js     # Analytics endpoints
├── middleware/          # Custom middleware
│   ├── authenticate.js  # JWT verification
│   └── authorize.js     # Role-based access control
├── aggregations/        # MongoDB pipelines
│   ├── top-artists.js
│   └── user-activity.js
├── utils/              # Helper functions
│   └── cursor.js       # Pagination utilities
├── scripts/            # Development scripts
│   ├── seed.js         # Database seeding
│   └── performance-test.js
├── docs/               # Documentation
│   └── Design.md
├── performance/        # Performance plans
│   ├── INDEX_PLAN.md
│   └── AGGREGATION_PLAN.md
├── index.js            # App entry point
└── package.json        # Dependencies
```

## 🚀 Setup & Installation

### Prerequisites

- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

```bash
# Clone repository
git clone https://github.com/blxckpxnther46/beathub-backend.git
cd beathub-backend

# Install dependencies
npm install

# Create .env file
echo "MONGO_URI=mongodb://127.0.0.1:27017/beathub_test" > .env
echo "JWT_SECRET=your_secret_key_here" >> .env
echo "PORT=3000" >> .env
```

### Running the Server

```bash
# Development mode
npm start

# Seed database with sample data
npm run seed

# Run performance tests
npm run test:performance
```

## 📡 API Endpoints

### Authentication

```
POST   /api/auth/register       # Register new user
POST   /api/auth/login          # Login and get JWT token
```

### Songs (CRUD)

```
GET    /api/songs               # Get all songs
GET    /api/songs/:id           # Get single song
POST   /api/songs               # Create new song
PATCH  /api/songs/:id           # Update song
DELETE /api/songs/:id           # Delete song
```

### Songs (Pagination)

```
GET    /api/song?page=1&limit=10        # Offset-based pagination
GET    /api/song/cursor?limit=10        # Cursor-based pagination
```

### Analytics

```
GET    /api/analytics/top-artists           # Top 5 artists (requires auth)
GET    /api/analytics/most-active-users     # Top 5 users (requires auth + admin)
```

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:

```bash
Authorization: Bearer <your_jwt_token>
```

### User Roles

- **user** - Regular user (default)
- **admin** - Administrative access to sensitive endpoints

## 📖 Pagination Strategies

### Offset-Based Pagination

Traditional page-based pagination:

```
GET /api/song?page=1&limit=10
```

Response includes:
- `currentPage` - Current page number
- `totalPages` - Total pages available
- `totalDocuments` - Total items in collection
- `hasNext` - Whether more pages exist
- `hasPrev` - Whether previous pages exist

### Cursor-Based Pagination

More efficient for large datasets:

```
GET /api/song/cursor?limit=10&cursor=<encoded_cursor>
```

Benefits:
- Prevents offset issues with real-time data
- Better performance on large collections
- No need to scan skipped documents

## ⚡ Performance Optimization

### Indexing Strategy

See [INDEX_PLAN.md](./performance/INDEX_PLAN.md) for detailed index design and justification.

**Critical Indexes:**
- `genre: 1, duration: -1` - Electronic songs by duration
- `releaseYear: -1` - Recent songs query
- `user: 1` - User playlists
- `artist: 1, plays: -1` - Songs by artist popularity
- `loginCount: 1` - Active users analytics

### Aggregation Pipelines

See [AGGREGATION_PLAN.md](./performance/AGGREGATION_PLAN.md) for aggregation patterns.

## 📊 Database Schema

For detailed schema design decisions and relationships, see [Design.md](./docs/Design.md).

## 🧪 Testing

Performance tests are included to validate query optimization:

```bash
npm run test:performance
```

This executes:
1. Genre filtering with sorting
2. Date range queries
3. User relationship queries
4. Artist popularity queries
5. Range queries on numeric fields

## 📝 License

MIT

## 👨‍💻 Author

**BeatHub Development Team**
