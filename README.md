# Beacon — Engineering Project Roadmap & Adaptive Learning Platform

Beacon is a modern, production-grade Learning Management System (LMS) engineered for 1st, 2nd, and 3rd year engineering students. The platform delivers structured project-based learning roadmaps, verified learning resources, real-time topic progress tracking, GitHub project submission pipelines, and an administrative command center for mentor reviews and cohort management.

---

## 1. System Architecture

```
┌────────────────────────────────────────────────────────┐
│            Frontend SPA (React 19 + Vite)              │
│  - Hosted on Vercel                                    │
│  - Tailwind CSS Theme (Yellow #F9C321 / Dark #111111)  │
│  - Role-gated Auth (Student Login/Signup & Admin Only) │
│  - Student Roadmap, Topics, Project Submission Portal  │
│  - Mentor Admin Review & Student Dossier Center        │
└───────────────────────────┬────────────────────────────┘
                            │ REST API (Bearer JWT)
                            │ https://<render-app>.onrender.com/api
┌───────────────────────────▼────────────────────────────┐
│            Backend API (Node.js + Express + TS)        │
│  - Hosted on Render (Web Service)                      │
│  - TypeScript Execution via `tsx`                      │
│  - JWT Auth & Session Verification Middleware          │
│  - Automated Topic & Curriculum Progress Engine        │
│  - Project Submission & Approval Pipeline              │
└───────────────────────────┬────────────────────────────┘
                            │ Mongoose Driver (TLS)
┌───────────────────────────▼────────────────────────────┐
│            MongoDB Atlas (Persistent Cloud NoSQL)      │
│  - Primary Cloud Store: `cluster0.blxmown.mongodb.net` │
│  - Collections: users, student_profiles, topics, etc.  │
│  - Offline / Local Dev Fallback: `data/db.json`        │
└────────────────────────────────────────────────────────┘
```

---

## 2. Core Features & Modules

### 🎓 Student Experience
- **Adaptive Curriculum Tracks**:
  - **1st Year (Common Foundation)**: Python, Java, JavaScript, Web architecture, HTML/CSS, Git/GitHub, REST APIs.
  - **2nd Year (Full-Stack & App Dev)**: Node.js, Express, React, MongoDB, SQL, Docker, CI/CD, Redis.
  - **2nd Year (AI Engineering)**: Python for AI, LLM APIs, Prompt Engineering, Embeddings, Vector DBs, RAG systems, Autonomous Agents.
  - **3rd Year (Advanced Capstone)**: System design, microservices, cloud deployment, capstone projects.
- **Resource Verification & Topic Completion**: Mark individual resources completed to calculate topic completion.
- **Project Submission Pipeline**: Submit live GitHub repository and preview URLs tied directly to curriculum topics. Automatic submission confirmation and review workflow.

### 🛡️ Admin & Mentor Command Center
- **Dedicated Super Admin Access**: Secure administrative portal restricted to verified administrator accounts.
- **Project Review Queue**: Review pending student submissions, approve or reject with mentor feedback notes, and award completion credit.
- **Student Dossier & Analytics**: Monitor student progress percentage, active topics, approved projects, and perform permanent account deletions.
- **Curriculum Content Management**: Add, modify, or archive topics and resources dynamically.

### 🔒 Hardened Authentication & Session Lifecycle
- **JWT Authentication**: Secure Bearer token issued on login.
- **Roster-Only Access (No Public Signup)**: Public registration is completely disabled for both students and administrators. Access is strictly granted to pre-authorized accounts.
- **Student ID & Password Authentication**: Students log in using their assigned Student ID (e.g. `ATC2602003`) or Full Name and password.
- **Active Session Validation**: Backend verifies user status on every authenticated request (`requireAuth`), returning `401 Unauthorized` if an account is invalidated.
- **Client Auto-Logout on 401**: Interceptors immediately clear session tokens from `localStorage` upon 401 status and display clear validation feedback.

---

## 3. Access Credentials & Authorized Roster

Public self-signup is disabled. Only pre-provisioned accounts can access the platform:

### A. Super Admin Access
| Field | Value |
|---|---|
| **Role** | Admin (Select the **Admin** tab on login) |
| **Name** | Super Admin |
| **Email** | `beacon.atc@gmail.om` *(or `beacon.atc@gmail.com`)* |
| **Password** | `test@beacon.com` |

> [!NOTE]
> Administrators must select the **Admin** tab and manually enter their authorized email and password.

### B. Authorized Student Roster
Students select the **Student** tab and authenticate with their **Student ID** (or Full Name) and password:

| Student Name | Student ID | Password | Department & Track |
|---|---|---|---|
| Gonuguntla Nischal | `ATC2602003` | `ATCY26B1001` | CSE • 1st Year (Common Foundation) |
| Shaik Syeda Aneesa | `ATC2602004` | `ATCY26B1002` | CSE • 1st Year (Common Foundation) |
| Kocherla Steven Upadesh | `ATC2602005` | `ATCY26B1003` | CSE • 1st Year (Common Foundation) |
| P.Harshath | `ATC2602006` | `ATCY26B1004` | CSE • 1st Year (Common Foundation) |
| Sivaparvathi Narikella | `ATC2602007` | `ATCY26B1005` | CSE • 1st Year (Common Foundation) |
| Thirumalareddy Sharath Reddy | `ATC2602008` | `ATCY26B1006` | CSE • 1st Year (Common Foundation) |

> [!TIP]
> If an incorrect ID or password is submitted, the system prompts: *"Please recheck your password and id."*

---

## 4. Local Development Setup

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- Optional: MongoDB Atlas URI or local MongoDB instance (defaults to local file storage `data/db.json` if omitted).

### Step 1: Install Dependencies
```bash
npm install --legacy-peer-deps
```

### Step 2: Configure Environment (`.env`)
Create a `.env` file in the project root:
```env
PORT=5000
JWT_SECRET=beacon_development_jwt_secret_key_change_in_production
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.blxmown.mongodb.net/atc_lms?retryWrites=true&w=majority
VITE_API_BASE_URL=http://localhost:5000/api
```

### Step 3: Run Full Stack (Frontend + Backend)
```bash
npm run dev
```
- **Frontend SPA**: `http://localhost:3000`
- **Backend REST API**: `http://localhost:5000/api`

---

## 5. Production Deployment Guide

The platform is designed to be deployed as a separated decoupled architecture:

### A. Backend Deployment (Render)
1. Link your GitHub repository to **Render** as a **Web Service**.
2. Set configuration:
   - **Environment**: `Node`
   - **Build Command**: `npm install --legacy-peer-deps`
   - **Start Command**: `npm start` *(runs `tsx server.ts`)*
3. Add Environment Variables on Render:
   | Variable | Value |
   |---|---|
   | `PORT` | `10000` |
   | `NODE_ENV` | `production` |
   | `JWT_SECRET` | *(strong random secret string)* |
   | `MONGO_URI` | `mongodb+srv://<user>:<password>@cluster0.blxmown.mongodb.net/atc_lms?retryWrites=true&w=majority` |
   | `CORS_ORIGIN` | `https://<your-vercel-domain>.vercel.app` |

### B. Frontend Deployment (Vercel)
1. Import the same repository into **Vercel**.
2. Set configuration:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Add Environment Variables on Vercel:
   | Variable | Value |
   |---|---|
   | `VITE_API_BASE_URL` | `https://<your-render-service>.onrender.com/api` |

> [!IMPORTANT]
> Ensure `VITE_API_BASE_URL` includes the `/api` suffix (e.g., `https://beacon-o99p.onrender.com/api`). The frontend client auto-normalizes missing suffixes and handles trailing slashes gracefully.

---

## 6. API Reference Summary

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/` | Public | Healthcheck and server identity |
| `POST` | `/api/auth/login` | Public | Authenticate user & issue JWT token |
| `POST` | `/api/auth/register` | Public | Register new student profile |
| `GET` | `/api/auth/me` | Authenticated | Fetch current user session details |
| `GET` | `/api/curriculum/tracks` | Authenticated | List all curriculum tracks & years |
| `GET` | `/api/curriculum/topics` | Authenticated | List topics with completion status |
| `PATCH`| `/api/curriculum/topics/:id/progress` | Student | Update topic/resource progress |
| `GET` | `/api/projects` | Authenticated | List submitted projects (filtered by role) |
| `POST` | `/api/projects` | Student | Submit project with GitHub & live URLs |
| `PATCH`| `/api/projects/:id/review` | Admin | Approve or reject project with notes |
| `GET` | `/api/students` | Admin | Get cohort students with progress metrics |
| `DELETE`| `/api/students/:id` | Admin | Permanently delete student and records |

---

## 7. Scripts Reference

| Command | Action |
|---|---|
| `npm run dev` | Runs backend server and Vite frontend concurrently |
| `npm run server` | Starts Express backend in development mode with `tsx watch` |
| `npm run client` | Starts Vite development server for the React frontend |
| `npm run build` | Compiles TypeScript and builds production frontend bundle in `dist/` |
| `npm start` | Production backend launch command on Render (`tsx server.ts`) |

---

