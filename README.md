# ApexLMS — Engineering Project Roadmap & Curriculum Management System (MongoDB Edition)

ApexLMS is a production-grade Learning Management System (LMS) designed specifically for 1st, 2nd, and 3rd year engineering students, backed by **MongoDB**. The platform guides students through structured project-based learning roadmaps, provides verified learning resources, tracks progress at resource/topic/curriculum levels, and empowers administrators to review project submissions, monitor cohort mastery, and export audit reports.

---

## 1. Architectural Overview

```
┌────────────────────────────────────────────────────────┐
│               React Frontend (Vite + JSX)             │
│  - Tailwind CSS Light Theme (Navy / Yellow / Cyan)     │
│  - Recharts Visual Analytics                           │
│  - Student Dashboard, Learning Path & Project Module   │
│  - Mentor Admin Command Center & Resource Library      │
└───────────────────────────┬────────────────────────────┘
                            │ REST API (Bearer JWT)
┌───────────────────────────▼────────────────────────────┐
│               Backend Service Layer                    │
│  - Python 3.10 + FastAPI (High-throughput Async API)   │
│  - Motor (AsyncIO Driver) & PyMongo                    │
│  - Argon2 / Bcrypt Password Hashing                    │
│  - Real-time Progress Recalculation Engine             │
└───────────────────────────┬────────────────────────────┘
                            │ mongodb://localhost:27017
┌───────────────────────────▼────────────────────────────┐
│               MongoDB Document Database                │
│  - NoSQL Collections with Unique & Compound Indexes    │
│  - users, student_profiles, topics, resources, etc.   │
│  - Historical project submission and review audits     │
└────────────────────────────────────────────────────────┘
```

---

## 2. Engineering Curriculum Tracks

- **1st Year (Common Foundation)**: 8 categories (Python, Java, JavaScript, Web architecture, HTML/CSS/DOM, Git/GitHub, DevTools, Prompt Engineering, REST APIs, Project workflows).
- **2nd Year (Track 1: Full-Stack & App Dev)**: 10 categories (FastAPI, Django, Spring Boot, Node.js, React, Mobile with Flutter/React Native, MongoDB & SQL, Docker, CI/CD, Redis, Distributed systems).
- **2nd Year (Track 2: AI Engineering)**: 11 categories (Python for AI, LLM APIs, Prompt Engineering, Embeddings & Vector DBs, RAG systems, Autonomous Agents with ReAct loops, AI Evaluation, Linux tools, Cloud IAM, Security guardrails, Production observability).
- **3rd Year (Advanced Capstone)**: Enterprise architecture, system design, microservices, LoRA fine-tuning, high-throughput vLLM serving, and capstone portfolio projects.

---

## 3. MongoDB Database Collections & Indexing

The application organizes data into collections with schema validation and indexing:

| Collection Name | Document Contents | Indexes & Unique Constraints |
|---|---|---|
| `users` | Accounts, hashed credentials, roles | `{"email": 1}` (Unique) |
| `student_profiles` | Student enrollment, year, track, roll number | `{"roll_number": 1}` (Unique), `{"user_id": 1}` (Unique) |
| `curriculum_tracks` | Specialization track definitions | `{"_id": 1}` |
| `curriculum_years` | Academic year levels | `{"_id": 1}` |
| `categories` | Curriculum modules | `{"year_id": 1}`, `{"track_id": 1}` |
| `topics` | Topic descriptions, objectives, duration, level | `{"slug": 1}` (Unique), `{"year_id": 1, "track_id": 1}` |
| `resources` | External guides, tutorials, documentation | `{"topic_id": 1, "display_order": 1}` |
| `student_topic_progress` | Progress status (`not_started`, `in_progress`, `completed`) | `{"student_id": 1, "topic_id": 1}` (Compound Unique) |
| `student_resource_progress` | Resource completion records | `{"student_id": 1, "resource_id": 1}` (Compound Unique) |
| `projects` | Submissions, GitHub/live URLs, reviewer notes | `{"student_id": 1, "status": 1}` |
| `activity_logs` | Audit trail of actions | `{"student_id": 1, "timestamp": -1}` |

---

## 4. Progress Tracking Engine

Progress is tracked across three levels:
1. **Resource Level**: Not Started / In Progress / Completed. (Opening links does NOT auto-complete; explicit verification is required).
2. **Topic Level**: Not Started / In Progress / Completed.
3. **Curriculum Level**: Calculated authoritatively on the backend using the formula:

$$\text{Completion Percentage} = \left( \frac{\text{Completed Required Topics}}{\text{Total Required Topics}} \right) \times 100$$

- Excludes unpublished topics and optional electives.
- Recalculates immediately upon status changes.
- Automatically flags inactive students with no progress updates in **14+ days**.

---

## 5. Development & Running with Docker Compose

Orchestrates **MongoDB 7.0**, the **FastAPI Python backend**, and the **React frontend**:

```bash
# 1. Clone repository
git clone <repo-url>
cd apexlms

# 2. Configure environment
cp .env.example .env

# 3. Spin up full stack with MongoDB
docker compose up --build -d

# 4. Seed MongoDB with curriculum and sample accounts
docker compose exec backend python -m app.db.seed_mongo

# 5. View running services
docker compose ps
```

- **Frontend Application**: `http://localhost:3000`
- **FastAPI Backend & Swagger Docs**: `http://localhost:8000/docs`
- **MongoDB Database**: `mongodb://localhost:27017/apexlms_db`

---

## 6. Pre-seeded Demo Accounts

Use these pre-configured accounts for testing:

| Role | Name | Email | Password | Track / Year |
|---|---|---|---|---|
| **Chief Mentor** | Dr. Sarah Chen | `mentor.admin@apex.edu` | `Password@123` | Administrator (Full Platform Access) |
| **Student** | Alex Rivers | `alex.rivers@apex.edu` | `Password@123` | 1st Year • Common Foundation |
| **Student** | Priya Patel | `priya.patel@apex.edu` | `Password@123` | 2nd Year • Full-Stack Track |
| **Student** | Marcus Vance | `marcus.vance@apex.edu` | `Password@123` | 2nd Year • AI Engineering Track |
| **Student** | Elena Rostova | `elena.rostova@apex.edu` | `Password@123` | 3rd Year • Advanced Capstone |
| **Student** | Devon Lane | `devon.lane@apex.edu` | `Password@123` | 2nd Year • Inactive Flagged (25d) |

> A **1-Click Demo Account Switcher** is built into the top navigation bar to test all user roles and tracks effortlessly.

---

## 7. Automated Tests

```bash
cd backend
pytest -v
```
