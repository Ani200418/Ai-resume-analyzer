# 🤖 AI Resume Analyzer & Job Matcher

> A production-ready SaaS platform that analyzes resumes with GPT-4, provides ATS scores, identifies skill gaps, delivers AI feedback, and matches users to relevant jobs.

![Tech Stack](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=nextdotjs)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=nodedotjs)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-412991?style=flat-square&logo=openai)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)

---

## 📸 Screenshots

> _Upload your own screenshots after running the application._

| Landing Page | Dashboard | Resume Analysis |
|---|---|---|
| `[screenshot]` | `[screenshot]` | `[screenshot]` |

| ATS Score | Skill Gap | Job Matches |
|---|---|---|
| `[screenshot]` | `[screenshot]` | `[screenshot]` |

---

## ✨ Features

### 🔐 Authentication
- Email/password signup & login with JWT
- Google OAuth 2.0 one-click login
- Password hashing with bcrypt (12 salt rounds)
- Protected routes with middleware

### 📄 Resume Processing
- Drag-and-drop PDF upload (up to 10MB)
- Text extraction with `pdf-parse`
- Intelligent parsing: skills, experience, education, contact info
- Per-user resume history with status tracking

### 🤖 AI Analysis (GPT-4)
- **ATS Score** (0–100) with letter grade
- **Sub-scores**: Format, Content, Readability
- **Keyword Analysis**: found & missing keywords
- **Strengths & Weaknesses** list
- **Skill Gap Analysis** vs target role
- **Priority skill recommendations**
- **AI Feedback**: summary, suggestions, keyword optimization
- **Career level** detection (entry/mid/senior/executive)

### 📊 Dashboard & Charts
- ATS score ring with animated progress
- Score breakdown bar chart (Recharts)
- Skills radar chart by category
- Job match distribution chart

### 💼 Job Matching
- 15+ curated job listings across 10+ categories
- Skill overlap algorithm with match score %
- Match tier classification: Excellent / Strong / Moderate / Partial / Low
- Filter by category and match tier
- Expandable job detail cards

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| **State** | Zustand with `persist` middleware |
| **Charts** | Recharts |
| **Backend** | Node.js 18+, Express 4 |
| **Database** | MongoDB with Mongoose ODM |
| **Auth** | JWT + Google OAuth 2.0 |
| **AI** | OpenAI GPT-4o API |
| **File Upload** | Multer |
| **Validation** | Joi |
| **Security** | Helmet, express-rate-limit, bcryptjs |
| **Logging** | Morgan |

---

## 📂 Project Structure

```
ai-resume-analyzer/
├── client/                          # Next.js 14 frontend
│   ├── app/
│   │   ├── auth/
│   │   │   ├── login/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   └── layout.tsx
│   │   ├── dashboard/
│   │   │   ├── page.tsx             # Overview
│   │   │   ├── layout.tsx           # Sidebar layout
│   │   │   ├── resume/
│   │   │   │   ├── page.tsx         # Upload + list
│   │   │   │   └── [id]/page.tsx    # Detail analysis
│   │   │   └── jobs/page.tsx        # Job recommendations
│   │   ├── page.tsx                 # Landing page
│   │   ├── layout.tsx               # Root layout
│   │   └── globals.css
│   ├── components/
│   │   ├── charts/
│   │   │   ├── ScoreBreakdownChart.tsx
│   │   │   ├── SkillsRadarChart.tsx
│   │   │   └── MatchDistributionChart.tsx
│   │   └── ui/
│   │       └── GoogleAuthButton.tsx
│   ├── lib/
│   │   ├── api.ts                   # Axios client + all API calls
│   │   ├── store.ts                 # Zustand auth store
│   │   └── utils.ts                 # Helper utilities
│   └── types/index.ts               # TypeScript interfaces
│
└── server/                          # Express backend
    ├── config/
    │   └── database.js              # MongoDB connection
    ├── controllers/
    │   ├── auth.controller.js
    │   ├── resume.controller.js
    │   └── job.controller.js
    ├── middlewares/
    │   ├── auth.middleware.js        # JWT verification
    │   ├── error.middleware.js       # Global error handler
    │   ├── upload.middleware.js      # Multer config
    │   └── validation.middleware.js  # Joi schemas
    ├── models/
    │   ├── User.model.js
    │   └── Resume.model.js
    ├── routes/
    │   ├── auth.routes.js
    │   ├── resume.routes.js
    │   └── job.routes.js
    ├── utils/
    │   ├── openai.util.js            # GPT-4 integration
    │   ├── resumeParser.util.js      # Text parsing
    │   └── jobMatcher.util.js        # Job database + scoring
    ├── uploads/                      # Uploaded PDF files
    └── index.js                      # Server entry point
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (free tier works)
- OpenAI API key
- Google Cloud Console project (for OAuth)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/ai-resume-analyzer.git
cd ai-resume-analyzer
```

### 2. Install Dependencies

```bash
# Install all dependencies (root + server + client)
npm run install:all
```

### 3. Configure Environment Variables

**Server** (`server/.env`):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/ai-resume-analyzer
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
OPENAI_API_KEY=sk-proj-your_openai_api_key
CLIENT_URL=http://localhost:3000
```

**Client** (`client/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

### 4. Run Development Servers

```bash
# Run both frontend and backend concurrently
npm run dev

# Or run separately:
npm run dev:server   # Backend on :5000
npm run dev:client   # Frontend on :3000
```

### 5. Open the App

Navigate to **http://localhost:3000**

---

## 🔌 API Reference

### Authentication

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/auth/signup` | Register with email/password | ❌ |
| `POST` | `/api/auth/login` | Login with email/password | ❌ |
| `POST` | `/api/auth/google` | Authenticate with Google | ❌ |
| `GET` | `/api/auth/me` | Get current user | ✅ |

### Resume

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/resume/upload` | Upload PDF resume | ✅ |
| `POST` | `/api/resume/analyze/:id` | Run AI analysis | ✅ |
| `GET` | `/api/resume` | Get user's resumes | ✅ |
| `GET` | `/api/resume/:id` | Get single resume | ✅ |
| `GET` | `/api/resume/:id/full` | Get complete analysis | ✅ |
| `DELETE` | `/api/resume/:id` | Delete resume | ✅ |

### Jobs

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/jobs/recommendations/:resumeId` | Get job matches | ✅ |
| `GET` | `/api/jobs/categories` | Get job categories | ✅ |

---

## ☁️ Deployment

### Frontend → Vercel

```bash
cd client
npx vercel --prod
```

Set these environment variables in Vercel dashboard:
```
NEXT_PUBLIC_API_URL=https://your-api.onrender.com/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

### Backend → Render

1. Create a new **Web Service** on [Render](https://render.com)
2. Connect your GitHub repository
3. Set **Root Directory** to `server`
4. Set **Build Command**: `npm install`
5. Set **Start Command**: `npm start`
6. Add all environment variables from `server/.env`

---

## 🔒 Security Features

- **Helmet.js** — Secure HTTP headers
- **CORS** — Restricted to known origins
- **Rate Limiting** — 100 req/15min globally, 10 req/15min for auth
- **bcrypt** — Password hashing (12 rounds)
- **JWT** — Stateless auth with expiry
- **Joi Validation** — All inputs sanitized
- **File Validation** — PDF only, 10MB max
- **Soft Deletes** — Data preserved, not destroyed

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- [OpenAI](https://openai.com) for GPT-4 API
- [Vercel](https://vercel.com) for Next.js and hosting
- [MongoDB Atlas](https://mongodb.com/atlas) for database
- [Recharts](https://recharts.org) for data visualization
- [Lucide](https://lucide.dev) for icons
