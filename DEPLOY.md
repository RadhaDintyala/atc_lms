# ATC LMS — Deployment Guide

> **Stack**: Node.js + Express (server) · React + Vite (client) · JSON file store (`data/db.json`)  
Deploy with plain `npm` on any Node 18+ host.

---

## Prerequisites

| Requirement | Version |
|---|---|
| Node.js | **18 LTS or newer** (20 LTS recommended) |
| npm | 9+ (ships with Node) |

---

## Quick Deploy (3 steps)

```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Build the frontend
npm run build

# 3. Start the production server
npm start
```

The server starts at **http://localhost:3000** (or your configured `PORT`).

---

## Environment Variables

Copy `.env.example` to `.env` and fill in your values before starting:

```bash
cp .env.example .env
```

| Variable | Default | Required | Description |
|---|---|---|---|
| `PORT` | `3000` | No | HTTP port the server listens on |
| `NODE_ENV` | `production` (set by `npm start`) | — | Switches server to production mode |
| `JWT_SECRET` | *(fallback hardcoded — change this!)* | **Yes** | Secret for signing JWT tokens |
| `GEMINI_API_KEY` | — | No | Enables AI-powered features |

> **⚠️ Important**: Always set `JWT_SECRET` to a long random string in production.  
> Generate one: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`

---

## npm Scripts

| Script | Command | Purpose |
|---|---|---|
| `npm run dev` | `tsx server.ts` | Local development with Vite HMR |
| `npm run build` | `vite build` | Compile frontend to `dist/` |
| `npm start` | `NODE_ENV=production tsx server.ts` | Production server |
| `npm run deploy` | `build` then `start` | Full build + start in one command |
| `npm run lint` | `tsc --noEmit` | TypeScript type check |
| `npm run clean` | `rimraf dist` | Delete compiled frontend |

---

## How It Works

```
Browser → http://host:3000
              │
              └── Express server (server.ts)
                    ├── /api/*   → REST API routes
                    └── /*       → serves dist/index.html (React SPA)
```

- In **production** (`NODE_ENV=production`), the server statically serves the pre-built `dist/` folder and falls back to `index.html` for all non-API routes (SPA routing).
- In **development** (`npm run dev`), the server proxies Vite's dev server for hot module reload.

---

## Database

The app uses a **flat JSON file database** stored at `data/db.json`.

- Created automatically on first startup — no setup needed.
- Seeded with default curriculum data on first run.
- **Back this file up** regularly in production (it contains all user and course data).
- `data/db.json` is excluded from `.gitignore` and will not be committed.

---

## Deploying to a Cloud VPS (e.g. Ubuntu on DigitalOcean / AWS EC2)

```bash
# On the server:
git clone <your-repo-url> atc_lms
cd atc_lms
cp .env.example .env
nano .env                            # Set JWT_SECRET and PORT
npm install --legacy-peer-deps
npm run build

# Start with PM2 for process management:
npm install -g pm2
pm2 start "npm start" --name atc-lms
pm2 save
pm2 startup                          # Auto-restart on reboot
```

Then point your domain / Nginx reverse proxy at `localhost:3000`.

---

## Deploying to Railway / Render / Fly.io

These platforms detect Node.js projects automatically.

1. Set environment variables (`JWT_SECRET`, `PORT`) in the platform dashboard.
2. Set **Build Command**: `npm install --legacy-peer-deps && npm run build`
3. Set **Start Command**: `npm start`
4. Deploy — the platform handles the rest.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `Cannot find module 'dist/index.html'` | Run `npm run build` before `npm start` |
| Port already in use | Set `PORT=3001` in your `.env` |
| JWT errors on login | Make sure `JWT_SECRET` in `.env` matches what was used to sign existing tokens |
| Database reset accidentally | Restore `data/db.json` from your backup |

