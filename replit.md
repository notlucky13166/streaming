# Lukie's Streams - Replit Project

## Overview
Lukie's Streams is a full-stack movie and live streaming web application. The app allows users to browse movies via the TMDB API, watch live streams via the Streami platform, and includes user authentication with JWT and an admin panel for stream management.

**Current Status:** Successfully configured for Replit environment. The application is running with both frontend and backend operational.

## Recent Changes (October 5, 2025)
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
- MongoDB with Mongoose ORM
- JWT for authentication
- bcryptjs for password hashing
- Helmet & CORS for security
- Rate limiting middleware

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
│   │   ├── components/    # Reusable React components
│   │   ├── contexts/      # React Context (AuthContext)
│   │   ├── pages/         # Page components (Home, Movies, Live, etc.)
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── server/                # Node.js backend (runs on port 3001)
│   ├── models/           # MongoDB schemas (User, Stream)
│   ├── routes/           # API routes (auth, movies, streams)
│   ├── middleware/       # Express middleware (auth)
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
The following environment variables are required (managed via Replit Secrets):

- `PORT` - Backend server port (default: 3001)
- `NODE_ENV` - Environment mode (development/production)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT token signing
- `TMDB_API_KEY` - API key for The Movie Database (optional for basic testing)
- `STREAMI_API_KEY` - API key for Streami platform (optional for basic testing)

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current authenticated user

### Movies
- `GET /api/movies/popular` - Get popular movies from TMDB
- `GET /api/movies/search?query={query}` - Search movies
- `GET /api/movies/:id` - Get movie details by ID

### Streams
- `GET /api/streams` - Get all active streams
- `GET /api/streams/:id` - Get stream by ID
- `POST /api/streams` - Create new stream (Admin only)
- `PATCH /api/streams/:id/status` - Update stream status (Admin only)
- `DELETE /api/streams/:id` - Delete stream (Admin only)
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
- ESLint warnings about unused imports (PencilIcon in Admin.js) - non-critical
- React Hook dependency warnings in StreamViewer.js - non-critical
- MongoDB connection required for authentication features to work
- TMDB and Streami API keys required for full functionality

### Database Setup
- The app expects MongoDB connection
- Default connection: `mongodb://localhost:27017/lukies-streams`
- For production, set MONGODB_URI environment variable to cloud MongoDB instance (e.g., MongoDB Atlas)

## User Preferences
*No specific user preferences recorded yet*

## Future Enhancements
- Set up MongoDB cloud instance for production
- Configure API keys for TMDB and Streami
- Add more comprehensive error handling
- Implement real-time viewer count updates via WebSockets
- Add video upload functionality
