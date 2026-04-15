# CodeQuest

CodeQuest is a full-stack gamified coding platform that teaches programming through structured courses, hands-on coding challenges, project-based learning, and social community engagement. The platform combines progression mechanics (XP, levels, streaks, badges), interactive coding workflows, and real-time communication.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-Realtime-010101?logo=socket.io&logoColor=white)

## Table of Contents

- [1. Product Overview](#1-product-overview)
- [2. Core Features](#2-core-features)
- [3. Tech Stack](#3-tech-stack)
- [4. Architecture](#4-architecture)
- [5. Repository Structure](#5-repository-structure)
- [6. Prerequisites](#6-prerequisites)
- [7. Environment Configuration](#7-environment-configuration)
- [8. Local Development Setup](#8-local-development-setup)
- [9. Available Scripts](#9-available-scripts)
- [10. API Reference](#10-api-reference)
- [11. Real-Time Chat (Socket.IO)](#11-real-time-chat-socketio)
- [12. Data Model Overview](#12-data-model-overview)
- [13. Project Learning Flows](#13-project-learning-flows)
- [14. Security and Auth Notes](#14-security-and-auth-notes)
- [15. Troubleshooting](#15-troubleshooting)
- [16. Deployment Notes](#16-deployment-notes)
- [17. Supplemental Documentation](#17-supplemental-documentation)

## 1. Product Overview

CodeQuest is built for learners who want a guided but interactive coding journey.

The platform includes:

- Course progression with theory and quizzes.
- Coding challenges with in-browser execution and validation.
- Guided project tutorials with step-level progress and XP rewards.
- A custom project builder with save/run history.
- Community feed with likes/comments and automated achievement posts.
- Real-time chat rooms powered by Socket.IO.
- Gamification systems: XP, ranks, streaks, avatars, leaderboard, and milestones.

## 2. Core Features

### Learning and Progression

- Multi-course level progression with unlock logic.
- Theory blocks, quizzes, and chapter narratives.
- Final completion certificate level for course closure.
- Daily challenge support.
- "30 Nites of Coding" challenge path.

### Coding Experience

- Monaco-based editor integration.
- Challenge submission and evaluation workflow.
- JavaScript, Python, and HTML run support through backend execution routes.
- Dedicated output console and run tracking for build workflows.

### Projects

- Curated tutorial projects with step-by-step progression.
- Per-step draft saving and completion tracking.
- XP rewards for steps and completed project workflows.
- Downloadable project artifacts for tutorial outcomes.
- Personal custom projects (create, update, delete, run, save).

### Community and Social

- Community channels and searchable posts.
- Likes and comments for engagement.
- Automated post generation when:
  - A tutorial project is completed.
  - A user builds/runs and saves a custom project (deduplicated by source metadata).

### Gamification

- XP bars, level/rank milestones, and animated progression feedback.
- Daily streak and activity tracking.
- Avatar retrieval/update.
- Leaderboard ranking by XP.

## 3. Tech Stack

### Frontend

- React 19
- Vite 7
- React Router
- Axios
- Tailwind CSS v4
- Framer Motion
- GSAP + ScrollTrigger
- Lenis (smooth scrolling)
- Monaco Editor (@monaco-editor/react)
- tsParticles
- Socket.IO Client

### Backend

- Node.js
- Express
- MongoDB + Mongoose
- JWT authentication
- bcryptjs
- Morgan logging
- CORS middleware
- Socket.IO

## 4. Architecture

```text
Client (React + Vite)
  -> REST API (Express)
      -> Controllers
      -> MongoDB (Mongoose models)
  -> Socket.IO (real-time chat)

Cross-cutting concerns:
- JWT auth middleware
- Gamification progression updates
- Community auto-post utilities
- Seed scripts for course/challenge/project content
```

## 5. Repository Structure

```text
codequest-main/
|- client/
|  |- src/
|  |  |- api/                 # Axios setup and request handling
|  |  |- components/          # Reusable UI components
|  |  |- context/             # Auth context and shared app state
|  |  |- data/                # Static client-side data
|  |  `- pages/               # Route-level pages
|  |- public/
|  |- package.json
|  `- vite.config.js
|- server/
|  |- config/                 # DB connection
|  |- controllers/            # Business logic for route handlers
|  |- data/                   # Static backend challenge data
|  |- middleware/             # JWT auth middleware
|  |- models/                 # Mongoose schemas/models
|  |- routes/                 # Express route modules
|  |- scripts/                # Seed and maintenance scripts
|  |- utils/                  # Utility modules (community posts, executors)
|  |- index.js                # Express + Socket.IO server bootstrap
|  `- package.json
`- README.md
```

## 6. Prerequisites

- Node.js 18+
- npm 9+
- MongoDB local instance or MongoDB Atlas URI
- Windows/macOS/Linux shell

## 7. Environment Configuration

Create `server/.env`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/codequest
JWT_SECRET=replace_with_a_strong_secret
PORT=5000
```

Important behavior from the current codebase:

- Backend CORS origin is set to `http://localhost:5173`.
- Frontend Axios base URL is set to `http://localhost:5000/api`.
- Auth token is expected in `Authorization: Bearer <token>`.

## 8. Local Development Setup

### 1) Start backend

```bash
cd server
npm install
npm run seed
npm run dev
```

### 2) Start frontend

```bash
cd client
npm install
npm run dev
```

### 3) Access app

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api`
- Health endpoint: `GET /api/health`

## 9. Available Scripts

### Backend (`server/package.json`)

| Script | Command | Purpose |
|---|---|---|
| `npm run dev` | `nodemon index.js` | Start API server in watch mode |
| `npm start` | `node index.js` | Start API server (production style) |
| `npm run seed` | `node scripts/seed.js` | Seed base course/challenge/narrative data |

Additional scripts in `server/scripts/`:

- `seedHTML.js`
- `seedJavaScript.js`
- `seedPython.js`
- `seedProjects.js`
- `fixChallengeLanguages.js`
- `fixPythonFunctionNames.js`
- `fixPythonLanguage.js`
- `fixPythonStarterCode.js`

### Frontend (`client/package.json`)

| Script | Command | Purpose |
|---|---|---|
| `npm run dev` | `vite` | Start development server |
| `npm run build` | `vite build` | Create production build |
| `npm run preview` | `vite preview` | Preview production build |
| `npm run lint` | `eslint .` | Run ESLint |

## 10. API Reference

Base URL: `http://localhost:5000/api`

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/signup` | No | Register user |
| POST | `/auth/login` | No | Authenticate and return JWT |

### Courses

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/courses` | Yes | List available courses |
| GET | `/courses/:id` | Yes | Get full course details |
| GET | `/courses/:id/user-progress` | Yes | Get user progress for course |

### Challenges

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/challenges` | Yes | List challenges (supports course/level query usage) |
| GET | `/challenges/:id` | Yes | Get challenge details |
| POST | `/challenges/:id/submit` | Yes | Submit challenge code |
| POST | `/challenges/:id/run-python` | Yes | Run Python-specific challenge checks |

### Gamification

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/gamification/streak` | Yes | Get current streak |
| GET | `/gamification/daily-challenge` | Yes | Get daily challenge |
| POST | `/gamification/daily-challenge/complete` | Yes | Mark daily challenge complete |
| POST | `/gamification/battle-complete` | Yes | Mark battle completion |
| POST | `/gamification/update-streak` | Yes | Update streak state |
| GET | `/gamification/avatar` | Yes | Get avatar |
| PUT | `/gamification/avatar` | Yes | Update avatar |
| POST | `/gamification/enroll` | Yes | Enroll in a course |
| GET | `/gamification/enrolled-courses` | Yes | Get enrolled course list |
| GET | `/gamification/course-progress/:courseId` | Yes | Get course progress |
| PUT | `/gamification/course-progress/:courseId` | Yes | Update course progress |
| GET | `/gamification/activity-days` | Yes | Get activity day data |

### Narrative

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/narrative/course/:courseId` | Yes | Get narrative for course |
| GET | `/narrative/course/:courseId/chapter/:chapterNum` | Yes | Get chapter content |
| POST | `/narrative/progress` | Yes | Update narrative progress |
| GET | `/narrative/user-progress` | Yes | Get narrative progress |

### Leaderboard and Profile

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/leaderboard` | Yes | XP leaderboard |
| GET | `/profile` | Yes | Current user profile |

### Projects (Catalog/Tutorial)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/projects` | No | List projects with filters |
| GET | `/projects/:id` | No | Get project details |
| GET | `/projects/slug/:slug` | No | Get project by slug |
| POST | `/projects/:id/like` | Yes | Toggle like on project |
| POST | `/projects/:id/complete` | Yes | Mark project complete and award XP |

### User Projects (Custom Builder)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/user-projects` | Yes | List user projects |
| GET | `/user-projects/:id` | Yes | Get one user project |
| POST | `/user-projects` | Yes | Create user project |
| PUT | `/user-projects/:id` | Yes | Update code/output and run metadata |
| DELETE | `/user-projects/:id` | Yes | Delete user project |

### Project Progress (Tutorial Tracking)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/project-progress/:projectId` | Yes | Get progress for one project |
| GET | `/project-progress` | Yes | Get all project progress records |
| POST | `/project-progress/:projectId/step` | Yes | Complete step and award XP |
| POST | `/project-progress/:projectId/draft` | Yes | Save draft progress without XP |
| GET | `/project-progress/:projectId/download` | Yes | Download generated project zip |

### 30 Nites of Coding

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/nites-of-coding` | Yes | Get challenge overview |
| GET | `/nites-of-coding/:day` | Yes | Get challenge by day |
| POST | `/nites-of-coding/:day/submit` | Yes | Submit day solution |

### Code Execution

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/run-code` | Yes | Run JavaScript/Python/HTML code payload |

### Comments (Project Comment Route Group)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/comments/:projectId` | No | Get comments for project |
| POST | `/comments/:projectId` | Yes | Add project comment |
| DELETE | `/comments/:id` | Yes | Delete comment |
| POST | `/comments/:id/like` | Yes | Like/unlike comment |

### Community Feed

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/community/posts` | No | List posts by channel/page |
| POST | `/community/posts` | Yes | Create post |
| GET | `/community/posts/:id` | No | Get post detail |
| POST | `/community/posts/:id/like` | Yes | Toggle like |
| GET | `/community/posts/:id/comments` | No | List post comments |
| POST | `/community/posts/:id/comment` | Yes | Add post comment |
| DELETE | `/community/posts/:postId/comments/:commentId` | Yes | Delete comment |
| DELETE | `/community/posts/:id` | Yes | Delete post |
| GET | `/community/search` | No | Search posts |

### Chat REST Support

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/chat/messages` | No | Get paginated messages by room |
| GET | `/chat/messages/:id` | No | Get single message |
| GET | `/chat/rooms` | No | Get available chat rooms |
| GET | `/chat/rooms/:room/stats` | No | Get room statistics |
| DELETE | `/chat/messages/:id` | Yes | Delete message (owner/admin) |
| GET | `/chat/search/:room` | No | Search messages in room |

### Health

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/health` | No | Service health check |

## 11. Real-Time Chat (Socket.IO)

Socket.IO server is initialized in `server/index.js` with CORS support for local frontend origin.

### Client-to-Server events

- `chat:join` (join/leave room context)
- `chat:send` (send message)
- `chat:typing` (typing indicator)

### Server-to-Client events

- `chat:history` (recent room history)
- `chat:message` (broadcasted message/system event)
- `chat:online` (online members in room)
- `chat:typing` (typing relay)

## 12. Data Model Overview

Primary Mongoose models include:

- `User`
- `Course`
- `Challenge`
- `Progress`
- `CourseProgress`
- `DailyChallenge`
- `Narrative`
- `Project`
- `ProjectProgress`
- `UserProject`
- `Post`
- `PostComment`
- `Comment`
- `ChatMessage`
- `NitesOfCodingProgress`

These models support progression tracking, social interactions, challenge states, and project lifecycle storage.

## 13. Project Learning Flows

### Core learner flow

1. Register or login.
2. Access dashboard and course track.
3. Read theory and attempt level challenges.
4. Submit solutions, gain XP, unlock additional content.
5. Complete course to reach certificate level.

### Tutorial project flow

1. Open tutorial project.
2. Complete steps and save draft/work output.
3. Earn XP for newly completed steps.
4. Complete all steps to mark tutorial complete.
5. Automatic community post can be generated for completion.

### Custom project builder flow

1. Create custom project with language choice.
2. Edit and run code through run endpoint.
3. Save project updates and output history.
4. First successful run can award XP.
5. Automatic community post can be generated for project-built event.

## 14. Security and Auth Notes

- Protected API routes require JWT bearer token.
- Auth middleware validates token and loads current user.
- Frontend Axios interceptor clears local auth state and redirects on `401`.
- Password handling is done with bcrypt-based hashing in backend auth flow.

## 15. Troubleshooting

### Backend fails to connect to DB

- Verify `server/.env` exists.
- Ensure `MONGO_URI` is valid and reachable.
- Confirm network/firewall allows DB access.

### Frontend cannot hit API

- Confirm backend is running on port `5000`.
- Confirm frontend runs on `5173`.
- Ensure CORS origin matches frontend URL.
- Confirm Axios base URL points to backend API.

### Frequent unauthorized responses

- Verify JWT secret consistency and token freshness.
- Re-login to refresh stored token.
- Check request includes `Authorization: Bearer <token>`.

### Seed data issues

- Run `npm run seed` inside `server/` after ensuring DB is reachable.
- Use additional scripts from `server/scripts/` for language/content fixes if needed.

## 16. Deployment Notes

Before production deployment, update and validate:

- CORS origin configuration in backend.
- API base URL in frontend Axios config.
- Secure environment variable management.
- HTTPS termination and reverse proxy settings.
- MongoDB production cluster and backup policy.
- Logging/monitoring strategy.

## 17. Repository Notes

This repository keeps the main project documentation in this README so the app stays easy to navigate without extra Markdown files.

## 18. Publish to GitHub

To push the project to GitHub:

```bash
git status
git add .
git commit -m "Update CodeQuest"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

If `origin` already exists, use `git remote set-url origin <your-github-repo-url>` instead of `git remote add`.