# ATC LMS — Production Deployment Guide

> **Architecture**:
> - **Backend**: Node.js / Express API hosted on **Render**
> - **Frontend**: React + Vite SPA hosted on **Vercel**
> - **Database**: **MongoDB Atlas** (Free M0 Cluster — 100% persistent)

---

## 1. MongoDB Atlas Setup (One-time)

Your connection string format:
```
mongodb+srv://dintyalaradhakalyani_db_user:<password>@cluster0.jg0yj9a.mongodb.net/atc_lms?retryWrites=true&w=majority
```

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com).
2. Under **Security → Network Access**, ensure `0.0.0.0/0` (allow access from anywhere) is active so Render can connect.
3. Under **Security → Database Access**, ensure user `dintyalaradhakalyani_db_user` is active and you know the password.

---

## 2. Deploy Backend on Render

1. Push your repository to GitHub.
2. Log in to [render.com](https://render.com) → click **New +** → **Web Service**.
3. Connect your repository.
4. Configure service settings:
   - **Name**: `atc-lms-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install --legacy-peer-deps`
   - **Start Command**: `npm start`
5. Under **Environment Variables**, add:

| Key | Value | Notes |
|---|---|---|
| `NODE_ENV` | `production` | Enables production API mode |
| `NODE_VERSION` | `20` | LTS Node version |
| `JWT_SECRET` | *(generate a 32+ char secret)* | Signs session tokens |
| `MONGO_URI` | `mongodb+srv://dintyalaradhakalyani_db_user:<password>@cluster0.jg0yj9a.mongodb.net/atc_lms?retryWrites=true&w=majority` | Your MongoDB Atlas connection |
| `FRONTEND_URL` | `https://your-app.vercel.app` | *(Add this after deploying Vercel in step 3)* |

6. Click **Deploy Web Service**.
7. Once deployed, copy your Render service URL (e.g., `https://atc-lms-api.onrender.com`).

---

## 3. Deploy Frontend on Vercel

1. Log in to [vercel.com](https://vercel.com) → click **Add New...** → **Project**.
2. Import the same GitHub repository.
3. Vercel automatically detects the [`vercel.json`](file:///c:/Users/Radha/OneDrive/Desktop/ATC/atc_lms/vercel.json) config:
   - **Framework Preset**: Vite / Other
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Under **Environment Variables**, add:

| Key | Value | Notes |
|---|---|---|
| `VITE_API_BASE_URL` | `https://atc-lms-api.onrender.com/api` | The Render backend URL + `/api` |

5. Click **Deploy**.
6. Once deployed, copy your Vercel URL (e.g., `https://atc-lms.vercel.app`).

---

## 4. Final Handshake (CORS Connection)

Go back to your **Render Dashboard** → `atc-lms-api` → **Environment**:
- Update `FRONTEND_URL` to your live Vercel URL: `https://atc-lms.vercel.app`
- Click **Save Changes** (Render will automatically re-deploy in ~30 seconds).

---

## How Persistence Works

```
Vercel (React Frontend)
       │
       │ HTTP /api requests with Bearer JWT
       ▼
Render (Express Backend)
       │
       │ MongoDB Atlas Driver (Mongoose)
       ▼
MongoDB Atlas Cloud (atc_lms database)
  ├── lms_data          (atomic state cache for instant cold starts)
  ├── users             (active student & admin accounts)
  ├── profiles          (student roll numbers, tracks, years)
  ├── projects          (project submissions, GitHub links, mentor reviews)
  └── topic_progress    (100% persistent student topic completion)
```

- When Render restarts or wakes up, it loads the database state from MongoDB Atlas.
- Every student signup, topic progress update, and project review immediately persists to MongoDB Atlas.
- If no `MONGO_URI` is provided (e.g. offline testing), it gracefully falls back to local `data/db.json`.
