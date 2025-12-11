# Fullstack Notes App (React + Vite + Node + Express + TypeScript)

This is a small demo fullstack notes app skeleton. The backend is an Express server written in TypeScript that stores notes in a simple JSON file. The frontend is a Vite + React + TypeScript app that talks to the backend REST API.

## Structure

- backend/  — Node + Express (TypeScript)
- frontend/ — Vite + React (TypeScript)

## Run locally (dev)

Open two terminals.

1) Backend

```bash
cd "./fullstack-notes-app/backend"
npm install
npm run dev
```

This starts the backend on http://localhost:4000 by default.

2) Frontend

```bash
cd "./fullstack-notes-app/frontend"
npm install
npm run dev
```

This starts the frontend on http://localhost:5173. The frontend expects the backend at `http://localhost:4000/api` by default.

## API

- GET /api/notes — list notes
- GET /api/notes/:id — get a single note
- POST /api/notes — create { title, content }
- PUT /api/notes/:id — update
- DELETE /api/notes/:id — delete

## Notes & Next steps

- This uses a JSON file as storage for simplicity. For production use, swap to a real DB (Postgres, SQLite, Mongo).
- Add validation, tests, and user authentication as desired.
