# Development Rabbit

Hands-on courses that teach creators to prompt, direct, and edit AI-generated video — built around **Prompt to Profit: The AI Video Creator Blueprint** and **The Prompt Vault**.

A two-part project: a React frontend and a Node/Express API, each in their own folder with their own `package.json`.

## Project structure

```
development_rabbit/
├── backend/    Express API — auth, courses, content, purchases, progress
├── frontend/   React (Vite) — the course platform UI
└── claude refrences/   Design system & page reference images
```

## Tech stack

**Frontend** — React 19, Vite, React Router, Tailwind CSS v4, hls.js + Plyr (video playback).

**Backend** — Express 5, MongoDB (Mongoose), JWT auth with Google/GitHub OAuth, Razorpay (payments), Bunny Stream (video hosting), Bunny Storage (thumbnails/attachments).

## Getting started

### Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in real values — see comments in the file
npm run dev
```

Runs on `http://localhost:3000` by default (`PORT` in `.env`).

### Frontend

```bash
cd frontend
npm install
cp .env.example .env   # fill in real values — see comments in the file
npm run dev
```

Runs on `http://localhost:5173` by default. Other scripts: `npm run build`, `npm run lint`, `npm run preview`.

### Required third-party accounts

Setting up `.env` in either app will need credentials from:

- **MongoDB** — a connection string (Atlas or self-hosted).
- **Bunny.net** — a Stream library (video hosting) and a Storage Zone + Pull Zone (thumbnails/attachments).
- **Razorpay** — API keys for checkout.
- **Google** and **GitHub** OAuth apps — for social sign-in (optional; the app works without them, just without those login buttons).

## Deploying

See [DEPLOYMENT.md](./DEPLOYMENT.md) — backend on Oracle Cloud, frontend on Vercel.

## Notes

- See `backend/.env.example` for every variable the API expects, with notes on where to get each one.
- `frontend/.env.example` covers the three `VITE_*` variables the frontend needs, and its Google/GitHub client IDs must match the backend's.
