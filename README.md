# thinkBoard (MERN)

thinkBoard is a small notes application (Create / Read / Update / Delete) built with the MERN stack:
- Backend: Node.js, Express, Mongoose (MongoDB)
- Frontend: React + Vite, TailwindCSS, DaisyUI
- Additional: Upstash Redis rate-limiter for basic request throttling

This repository contains two top-level folders:
- `backend` — API server and database connection
- `frontend` — React client (Vite)

---

## Features

- Create, read, update, and delete notes
- Notes include `title` and `content` and are timestamped
- Simple REST API under `/api/notes`
- Rate limiting (Upstash Redis) to prevent abuse
- CORS enabled for local development (frontend origin `http://localhost:5173`)
- Production mode serves the built frontend from the backend

---

## Quick start (Development)

1. Clone the repo
   git clone https://github.com/sujan2000/thinkBoard-mern.git
2. Install backend and frontend dependencies
   npm install --prefix backend
   npm install --prefix frontend
3. Create a `.env` file in `backend/` with at least:
   - `MONGO_URI` — your MongoDB connection string
   - (Optional) `PORT` — backend port (defaults to 5001)
   - (Optional) `NODE_ENV` — `development` or `production`
   - Upstash/Redis environment variables required by `@upstash/redis` (set according to your Upstash account; the backend loads Redis config from environment)
4. Run backend in dev mode
   npm run dev --prefix backend
5. Run frontend dev server
   npm run dev --prefix frontend
6. Frontend will typically be at `http://localhost:5173` and backend at `http://localhost:5001` (or the `PORT` you set)

Note: The repository root `package.json` includes helper scripts:
- `npm run build` at root: installs backend & frontend deps then builds frontend
- `npm run start` at root: starts the backend (serves static frontend build when `NODE_ENV=production`)

---

## Quick start (Production build)

1. Build frontend:
   npm run build
   (or from root: npm run build — installs deps and runs frontend build)
2. Ensure backend environment variables (especially `MONGO_URI` and Upstash/Redis creds) are set and `NODE_ENV=production`.
3. Start backend:
   npm run start --prefix backend
   or from root:
   npm run start

When running in production mode, the backend serves the frontend from `frontend/dist`.

---

## API

Base path: `/api/notes`

- GET /api/notes
  - Returns list of notes (sorted newest → oldest)
  - 200: Array of note objects

- GET /api/notes/:id
  - Returns a single note by ID
  - 200: Note object
  - 404: { message: "Note not found" }

- POST /api/notes
  - Create a new note
  - Body (JSON): { title: string, content: string }
  - 201: Created note object
  - 500: Error response

- PUT /api/notes/:id
  - Update an existing note
  - Body (JSON): { title: string, content: string }
  - 200: Updated note object
  - 404: { message: "Note not found" }

- DELETE /api/notes/:id
  - Delete a note by ID
  - 200: Deleted note object
  - 404: { message: "Note not found put valid ID" }

All routes are defined in `backend/src/routes/notesRoutes.js` and implemented in `backend/src/controllers/notesController.js`.

---

## Backend details

- Entry point: `backend/src/server.js`
  - Connects to MongoDB (via `backend/src/config/db.js`)
  - Attaches middleware:
    - `express.json()` for parsing JSON bodies
    - rate limiter middleware using Upstash (`backend/src/middleware/rateLimiter.js`)
    - CORS in development (allowing `http://localhost:5173`)
  - Registers routes at `/api/notes`
  - Serves frontend static files in production

- Note model: `backend/src/models/Note.js`
  - Fields:
    - `title` (String, required)
    - `content` (String, required)
  - Timestamps enabled (createdAt, updatedAt)

- Rate limiting
  - Implemented in `backend/src/config/upstash.js` and applied in `backend/src/middleware/rateLimiter.js`
  - Uses Upstash Redis and a sliding window limiter (configured in code)

---

## Frontend details

- Created with Vite + React (see `frontend/` folder)
- Uses:
  - React 19
  - Axios for HTTP requests
  - TailwindCSS + DaisyUI for styling
  - react-hot-toast for notifications
  - react-router for routing
- Dev script: `npm run dev --prefix frontend`
- Build script: `npm run build --prefix frontend` (root `build` script orchestrates installs and frontend build)

---

## Project structure (important files)

- backend/
  - src/server.js — Express app entry
  - src/routes/notesRoutes.js — API routes
  - src/controllers/notesController.js — request handlers
  - src/models/Note.js — Mongoose model
  - src/config/db.js — MongoDB connection
  - src/config/upstash.js — Upstash Redis / ratelimit config
  - src/middleware/rateLimiter.js — rate-limiter middleware
  - package.json — backend scripts & deps

- frontend/
  - src/ — React source (components, pages)
  - index.html
  - package.json — frontend scripts & deps
  - tailwind.config.js, postcss.config.js, vite.config.js

- package.json (root)
  - helper scripts to install & build both apps

---

## Environment variables (recommended)

Create `backend/.env` (or set environment variables in your host):

- MONGO_URI=<your-mongodb-connection-string>
- PORT=5001 (optional)
- NODE_ENV=development|production
- Upstash/Redis related variables (the project loads Redis credentials from environment when using `Redis.fromEnv()`) — configure according to your Upstash dashboard (e.g. REST URL + token or equivalent env keys Upstash expects).

---

## Troubleshooting

- MongoDB connection errors: verify `MONGO_URI` and network access to your database.
- Rate limiter errors: ensure Upstash Redis credentials are set and accessible; fallback behavior may cause requests to fail if Redis is unreachable.
- CORS errors during development: ensure frontend is served from `http://localhost:5173` or change allowed origin in `backend/src/server.js`.
- If frontend does not load in production: ensure `npm run build` produced `frontend/dist` and backend was started with `NODE_ENV=production`.

---

## Contributing

- Improve API validation and error handling
- Add authentication to make notes user-specific
- Add tests for backend routes and frontend components
- Optimize rate limiting/scaling strategy for production

---

## License & Contact

- License: ISC (see root `package.json`)
- Repo: https://github.com/sujan2000/thinkBoard-mern

If you want, I can create and open a PR that adds this README.md to the repository.