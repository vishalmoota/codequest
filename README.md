# 🎮 CodeQuest – Gamified Coding Learning Platform

A full-stack web application for learning JavaScript through gamified coding challenges, inspired by Codédex.

![Tech Stack](https://img.shields.io/badge/React-Vite-blue) ![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green) ![Tailwind](https://img.shields.io/badge/Tailwind-CSS-cyan)

## ✨ Features

- 🔐 **JWT Authentication** – Signup/Login with bcrypt password hashing
- 📚 **JavaScript Course** – 5 structured levels (Basics → Arrays & Objects)
- 💻 **Monaco Editor** – VS Code-quality editor in the browser
- ⚡ **XP System** – Earn XP per challenge + 50 XP level completion bonus
- 🏆 **Badge Rewards** – 8 achievement badges with animated popups
- 🔓 **Auto Level Unlock** – Levels unlock automatically on completion
- 📊 **Leaderboard** – Top 20 users ranked by XP
- 👤 **Profile Page** – Detailed stats, level progress, badge collection
- 🌑 **Dark Gamified UI** – Animated XP bar, glassmorphism cards

---

## 🗂️ Project Structure

```
CODEQUEST1/
├── server/         # Node.js + Express + MongoDB API
│   ├── config/     # DB connection
│   ├── controllers/# Route controllers
│   ├── middleware/ # JWT auth middleware
│   ├── models/     # Mongoose schemas
│   ├── routes/     # Express routers
│   ├── scripts/    # DB seed script
│   ├── .env        # Environment variables
│   └── index.js    # App entry point
│
└── client/         # React + Vite + Tailwind frontend
    └── src/
        ├── api/        # Axios instance
        ├── components/ # Navbar, XPBar, BadgePopup, ProtectedRoute
        ├── context/    # AuthContext (JWT state)
        └── pages/      # Login, Signup, Dashboard, Level, Challenge, Leaderboard, Profile
```

---

## 🚀 Setup & Installation

### Prerequisites
- **Node.js** v18+
- **MongoDB** running locally on port 27017 (or edit MONGO_URI in server/.env)

---

### 1. Clone / Navigate to the project

```bash
cd c:\CODEQUEST1
```

### 2. Start the Backend

```bash
cd server
npm install
```

**Configure environment** (already set up in `server/.env`):
```
MONGO_URI=mongodb://127.0.0.1:27017/codequest
JWT_SECRET=codequest_super_secret_jwt_key_2024
PORT=5000
```

**Seed the database** (creates the JS course + 15 challenges):
```bash
npm run seed
```

**Start the server:**
```bash
npm run dev
```
> Server runs on http://localhost:5000

---

### 3. Start the Frontend

Open a **new terminal**:
```bash
cd client
npm install
npm run dev
```
> Client runs on http://localhost:5173

---

## 🎯 How to Use

1. **Sign up** at `/signup`
2. Go to **Dashboard** → see all 5 levels (Level 1 unlocked)
3. Click **Level 1** → read theory, see challenge list
4. Click a **challenge** → solve it in Monaco Editor
5. Click **Submit** → tests run, XP awarded, badge popup if milestone reached
6. Complete all 3 Level 1 challenges → **Level 2 unlocks automatically**
7. Check **Leaderboard** to compare with others
8. Visit **Profile** to see your badges and progress

---

## 🛣️ API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/courses` | List all courses |
| GET | `/api/courses/:id` | Get course with levels |
| GET | `/api/challenges?courseId=&levelNum=` | Get challenges for a level |
| GET | `/api/challenges/:id` | Get a single challenge |
| POST | `/api/challenges/:id/submit` | Submit solution code |
| GET | `/api/leaderboard` | Top 20 users by XP |
| GET | `/api/profile` | Authenticated user's profile |

---

## 🏅 Badge System

| Badge | Requirement |
|-------|-------------|
| 🩸 First Blood | Solve first challenge |
| 🔓 Level 2–5 Unlock | Complete each level |
| ⚡ 100 XP Club | Earn 100+ XP |
| 🚀 500 XP Legend | Earn 500+ XP |
| 🏆 JS Master | Complete all 15 challenges |

---

## 📜 Course Curriculum

| Level | Topic | Challenges |
|-------|-------|-----------|
| 1 | Basics | Sum of Two Numbers, String Greeting, Celsius→Fahrenheit |
| 2 | Conditionals | Even or Odd, Grade Calculator, FizzBuzz |
| 3 | Loops | Sum of Array, Count Vowels, Fibonacci |
| 4 | Functions | Factorial, isPalindrome, Array Doubler |
| 5 | Arrays & Objects | Find Maximum, Object Properties, Flatten Array |
