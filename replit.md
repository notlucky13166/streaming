# Lukie's Streams - Replit Project

## Overview
Lukie's Streams is a full-stack movie and live streaming web application. The app allows users to browse movies via the TMDB API, watch live streams, and includes an admin panel for stream management. All pages are now public - no authentication required.

**Current Status:** Successfully imported and running on Replit. Movies feature is fully functional with TMDB API integration. Streams feature requires MongoDB setup to function.

## Recent Changes (October 6, 2025)
- ✅ **Removed all authentication** - Made app completely public
  - Deleted Login and Register pages
  - Removed AuthContext and all auth dependencies
  - Cleaned up Navbar to remove login/register buttons
  - Updated Admin page to work without authentication
  - Removed server auth routes, middleware, and User model
- ✅ **Fixed rate limiter configuration** - Added `trust proxy` setting for Replit environment
- ✅ **Made MongoDB optional** - App now runs without crashing when MongoDB isn't configured
  - Streams feature gracefully handles missing database
  - Clear error messages returned when streams are unavailable
- ✅ **Configured TMDB API** - Movies feature fully operational with real movie data
- ✅ **Installed all dependencies** - Both client and server packages installed
- ✅ **Verified functionality** - Application tested and working correctly

## Previous Changes (October 5, 2025)
- ✅ Configured React dev server to run on port 5000 with proper host settings for Replit proxy
- ✅ Updated backend server to run on port 3001 (localhost)
- ✅ Fixed missing FilmIcon import in Movies.js component
- ✅ Added path module import to server/index.js for production mode
- ✅ Created startup script (start.sh) to run both frontend and backend concurrently
- ✅ Configured deployment settings for autoscale deployment
- ✅ Set up workflow "Development Server" running on port 5000
- ✅ **NEW: Integrated vidsrc.dev API for movie playback**
  - Added MoviePlayer component with vidsrc.dev iframe embed
  - Backend now fetches IMDb IDs from TMDB API (external_ids)
  - Movies page links to player at /movie/:id route
  - Player displays movie details and embedded vidsrc.dev stream

## Project Architecture

### Tech Stack
**Frontend:**
- React 18 with React Router DOM
- Tailwind CSS for styling
- Heroicons for icons
- HLS.js for video streaming
- Axios for API calls

**Backend:**
- Node.js & Express.js
- MongoDB with Mongoose ORM (optional)
- Helmet & CORS for security
- Rate limiting middleware with trust proxy enabled

**External APIs:**
- TMDB API (The Movie Database) - for movie data and IMDb IDs
- vidsrc.dev - for movie streaming/playback (no API key required)
- Streami API - for live streaming functionality

### Project Structure
```
lukies-streams/
├── client/                 # React frontend (runs on port 5000)
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable React components (Navbar)
│   │   ├── pages/         # Page components (Home, Movies, Live, Admin, etc.)
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── server/                # Node.js backend (runs on port 3001)
│   ├── models/           # MongoDB schemas (Stream)
│   ├── routes/           # API routes (movies, streams)
│   └── index.js          # Server entry point
├── start.sh              # Startup script for both servers
├── package.json          # Server dependencies
└── .env                  # Environment variables (not in git)
```

### Port Configuration
- **Frontend (React):** Port 5000 (0.0.0.0) - User-facing webview
- **Backend (Express):** Port 3001 (localhost) - Internal API server
- **Proxy:** Frontend proxies API requests to localhost:3001

### Environment Variables
The following environment variables are available (managed via Replit Secrets):

**Required:**
- `TMDB_API_KEY` - API key for The Movie Database (required for movies feature)

**Optional:**
- `MONGODB_URI` - MongoDB connection string (required only for streams feature)
- `STREAMI_API_KEY` - API key for Streami platform (required only for streams feature)
- `PORT` - Backend server port (default: 3001)
- `NODE_ENV` - Environment mode (development/production)

## API Endpoints

### Movies
- `GET /api/movies/popular` - Get popular movies from TMDB
- `GET /api/movies/search?query={query}` - Search movies
- `GET /api/movies/:id` - Get movie details by ID

### Streams
*Note: All stream endpoints require MongoDB to be configured. They return a 503 error with a clear message when MongoDB is not available.*

- `GET /api/streams` - Get all active streams
- `GET /api/streams/:id` - Get stream by ID
- `POST /api/streams` - Create new stream
- `PATCH /api/streams/:id/status` - Update stream status
- `DELETE /api/streams/:id` - Delete stream
- `POST /api/streams/:id/viewers` - Update viewer count

## Deployment
The project is configured for Replit autoscale deployment:
- **Build command:** `npm run build` - Builds the React frontend
- **Run command:** `node server/index.js` - Starts the production server
- Production mode serves the built React app from the Express server

## Development Notes

### Running Locally in Replit
The "Development Server" workflow automatically:
1. Starts the backend server on localhost:3001
2. Starts the React dev server on 0.0.0.0:5000
3. Both servers run concurrently via start.sh script

### Known Issues & Warnings
- React Router future flag warnings - non-critical, informational only
- React Hook dependency warnings in MoviePlayer.js and StreamViewer.js - non-critical
- **Streams feature requires MongoDB** - Set MONGODB_URI environment variable to enable
- **Live streaming requires Streami API** - Set STREAMI_API_KEY environment variable to enable stream creation

### Database Setup (Optional)
The streams feature requires MongoDB. If you want to enable streams:
1. Create a MongoDB database (MongoDB Atlas recommended for cloud hosting)
2. Add the connection string as MONGODB_URI in Replit Secrets
3. Restart the application

Without MongoDB, the movies feature will work perfectly, and stream endpoints will return helpful error messages.

## User Preferences
*No specific user preferences recorded yet*

## Future Enhancements
- Set up MongoDB cloud instance to enable streams feature
- Configure Streami API key for live stream creation
- Add user accounts and personalization (currently removed for public access)
- Implement real-time viewer count updates via WebSockets
- Add video upload functionality
- Improve error handling for edge cases
