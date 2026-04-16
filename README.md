# AI Resume Analyzer & Job Matcher 🚀

A full-stack web application that analyzes resumes, matches them with job opportunities, and provides intelligent job recommendations using AI.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Running Locally](#running-locally)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [File Upload](#file-upload)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### Core Features
- **Google OAuth 2.0 Authentication** - Secure login with Google accounts
- **Resume Upload & Parsing** - Upload PDF resumes with automatic text extraction
- **AI-Powered Analysis** - Uses OpenAI to extract key information from resumes
- **Job Matching** - Matches resume skills with available job opportunities
- **Score Breakdown** - Detailed scoring with skill match analysis
- **Interactive Dashboard** - View resume analysis, job matches, and detailed reports
- **Skill Visualization** - Radar charts showing skill distribution
- **Match Distribution Charts** - Visual representation of job match scores

### User Dashboard
- Resume management and history
- Job opportunity browsing
- Detailed match analysis per job
- Skill gap identification
- Download/export capabilities

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 14.2.5** - React framework with Server-Side Rendering
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React Hot Toast** - Toast notifications
- **Axios** - HTTP client
- **Zustand** - State management
- **Chart.js & React-Chartjs-2** - Data visualization
- **Google GSI SDK** - Google Sign-In integration

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database (Atlas)
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **Google Auth Library** - OAuth verification
- **OpenAI API** - Resume analysis and AI features
- **Multer** - File upload handling
- **pdfparse** - PDF text extraction

### DevOps & Deployment
- **Vercel** - Frontend hosting
- **Render** - Backend hosting
- **MongoDB Atlas** - Cloud database
- **Environment Variables** - Secure configuration

---

## 📁 Project Structure

```
ai-resume-analyzer/
├── client/                           # Next.js Frontend
│   ├── app/
│   │   ├── api/
│   │   │   └── auth/
│   │   │       └── google/
│   │   │           └── route.ts      # Google Auth API route
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── signup/
│   │   │       └── page.tsx
│   │   ├── dashboard/
│   │   │   ├── page.tsx
│   │   │   ├── jobs/
│   │   │   │   └── page.tsx
│   │   │   └── resume/
│   │   │       ├── page.tsx
│   │   │       └── [id]/
│   │   │           └── page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── charts/
│   │   │   ├── MatchDistributionChart.tsx
│   │   │   ├── ScoreBreakdownChart.tsx
│   │   │   └── SkillsRadarChart.tsx
│   │   └── ui/
│   │       └── GoogleAuthButton.tsx
│   ├── lib/
│   │   ├── api.ts                    # Axios instance
│   │   ├── store.ts                  # Zustand store
│   │   └── utils.ts
│   ├── types/
│   │   └── index.ts
│   ├── .env.local                    # Environment variables
│   ├── next.config.js
│   ├── tailwind.config.ts
│   └── tsconfig.json
│
└── server/                           # Express Backend
    ├── config/
    │   └── database.js               # MongoDB connection
    ├── controllers/
    │   ├── auth.controller.js        # Authentication logic
    │   ├── job.controller.js         # Job endpoints
    │   └── resume.controller.js      # Resume processing
    ├── middlewares/
    │   ├── auth.middleware.js        # JWT verification
    │   ├── error.middleware.js       # Error handling
    │   ├── upload.middleware.js      # File upload config
    │   └── validation.middleware.js  # Request validation
    ├── models/
    │   ├── User.model.js             # User schema
    │   └── Resume.model.js           # Resume schema
    ├── routes/
    │   ├── auth.routes.js
    │   ├── job.routes.js
    │   └── resume.routes.js
    ├── utils/
    │   ├── jobMatcher.util.js        # Job matching algorithm
    │   ├── openai.util.js            # OpenAI API integration
    │   └── resumeParser.util.js      # PDF parsing
    ├── uploads/                      # Uploaded resume files
    ├── .env                          # Environment variables
    ├── index.js                      # Entry point
    └── package.json
```

---

## 📦 Prerequisites

Before you begin, ensure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB Atlas** account (free tier available)
- **Google Cloud Console** project with OAuth 2.0 credentials
- **OpenAI API** key
- **Git** for version control

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Ani200418/Ai-resume-analyzer.git
cd Ai-resume-analyzer
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../client
npm install
```

### 4. Return to Root

```bash
cd ..
```

---

## 🔐 Environment Configuration

### Backend Environment Variables (`.env`)

Create a `server/.env` file with:

```properties
# Server Configuration
PORT=5001
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-resume?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# OpenAI
OPENAI_API_KEY=sk-your-api-key

# CORS
CLIENT_URL=http://localhost:3000

# File Upload
MAX_FILE_SIZE=10485760
```

### Frontend Environment Variables (`.env.local`)

Create a `client/.env.local` file with:

```bash
# Backend API URL
BACKEND_URL=http://localhost:5001

# Public Frontend URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Google OAuth Client ID
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

### Getting Your API Keys

#### Google OAuth Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URIs:
   - `http://localhost:3000`
   - `http://localhost:3000/auth/login`
   - Your production URL

#### OpenAI API Key
1. Sign up at [OpenAI](https://platform.openai.com/)
2. Go to API keys section
3. Create a new secret key
4. Copy and paste into `.env`

#### MongoDB Atlas
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Add database user credentials
4. Get connection string
5. Update `MONGODB_URI` in `.env`

---

## 🏃 Running Locally

### Development Mode (Concurrently)

Run both frontend and backend with one command:

```bash
npm run dev
```

This starts:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5001

### Separate Terminals

**Terminal 1 - Backend:**
```bash
cd server
npm start
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

### Build for Production

```bash
# Build frontend
cd client
npm run build

# Build backend (Node.js doesn't need compilation)
cd ../server
npm install --production
```

---

## 📤 Deployment

### Frontend - Vercel

1. Push code to GitHub
2. Go to [Vercel](https://vercel.com/)
3. Click "New Project"
4. Import your GitHub repository
5. Set environment variables:
   ```
   BACKEND_URL=https://your-backend-url.com
   NEXT_PUBLIC_APP_URL=https://your-frontend-url.vercel.app
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id
   ```
6. Deploy

### Backend - Render

1. Push code to GitHub
2. Go to [Render](https://render.com/)
3. Click "New +"
4. Select "Web Service"
5. Connect GitHub repository
6. Configuration:
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
   - **Port**: `5001`
7. Add environment variables from `.env`
8. Deploy

### Production URLs

After deployment, update:

1. **Google Cloud Console**:
   - Add your Vercel URL to Authorized JavaScript Origins
   - Add your Vercel URL to Authorized Redirect URIs

2. **Vercel Environment Variables**:
   - Update `BACKEND_URL` to your Render URL
   - Update `NEXT_PUBLIC_APP_URL` to your Vercel URL

3. **Render Environment Variables**:
   - Update `CLIENT_URL` to your Vercel URL
   - Set `NODE_ENV=production`

---

## 📚 API Documentation

### Authentication Endpoints

#### Sign Up
```
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

#### Google OAuth
```
POST /api/auth/google
Content-Type: application/json

{
  "credential": "jwt-token-from-google"
}
```

### Resume Endpoints

#### Upload Resume
```
POST /api/resume/upload
Content-Type: multipart/form-data
Authorization: Bearer {token}

{
  "resume": [PDF file],
  "targetJobTitle": "Software Engineer" (optional)
}
```

#### Get Resumes
```
GET /api/resume
Authorization: Bearer {token}
```

#### Get Resume Details
```
GET /api/resume/:id
Authorization: Bearer {token}
```

### Job Endpoints

#### Get Job Matches
```
GET /api/jobs/matches/:resumeId
Authorization: Bearer {token}
```

#### Get Job Details
```
GET /api/jobs/:jobId
Authorization: Bearer {token}
```

---

## 🔐 Authentication

The application uses:

1. **Google OAuth 2.0** - For social login
2. **JWT Tokens** - For API authentication
3. **Secure Cookies** - For token storage
4. **Password Hashing** - Using bcrypt (if email signup used)

### Authentication Flow

```
1. User clicks "Sign in with Google"
2. Google OAuth popup opens
3. User authenticates with Google
4. Frontend receives JWT credential
5. Frontend sends credential to backend
6. Backend verifies with Google
7. Backend creates/updates user
8. Backend returns JWT token
9. Frontend stores token
10. User is authenticated
```

---

## 📄 File Upload

### Supported Formats
- PDF (`.pdf`)

### Size Limits
- Maximum file size: 10MB

### Upload Process
1. User selects PDF file
2. Frontend validates file type and size
3. File is sent to backend via `multipart/form-data`
4. Backend extracts text using pdfparse
5. OpenAI analyzes extracted text
6. Resume data is stored in MongoDB
7. User receives resume analysis

---

## 🐛 Troubleshooting

### Google OAuth Errors

**Error: "This site isn't authorized to use Google Sign-In"**
- Add your URL to Google Cloud Console authorized origins
- Wait 5-10 minutes for changes to propagate

**Error: "Redirect URI mismatch"**
- Ensure redirect URI exactly matches Google Cloud settings
- Check for trailing slashes or extra characters

### MongoDB Connection Errors

**Error: "tlsv1 alert internal error"**
- Update MongoDB connection string
- Ensure IP whitelist includes your server IP
- Check network connectivity

### Resume Upload Errors

**Error: "File too large"**
- Ensure PDF is under 10MB
- Compress PDF before uploading

**Error: "Failed to parse PDF"**
- Ensure file is valid PDF format
- Try re-exporting from original document

---

## 📝 Development Notes

### Adding New Features

1. Create feature branch: `git checkout -b feature/feature-name`
2. Make changes
3. Test locally
4. Commit: `git commit -m "Add feature"`
5. Push: `git push origin feature/feature-name`
6. Create Pull Request

### Code Style

- Use TypeScript for type safety
- Follow ESLint rules
- Use meaningful variable names
- Comment complex logic

### Testing

```bash
# Backend tests (if implemented)
npm test

# Frontend tests (if implemented)
npm run test
```

---

## 📦 Dependencies

### Key Backend Packages
- express: Web framework
- mongoose: MongoDB ODM
- google-auth-library: Google OAuth
- openai: AI capabilities
- multer: File uploads
- jsonwebtoken: JWT auth
- joi: Request validation

### Key Frontend Packages
- next: React framework
- typescript: Type safety
- tailwindcss: Styling
- axios: HTTP client
- zustand: State management
- react-hot-toast: Notifications
- chart.js: Data visualization

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👤 Author

**Aniket Singh**
- GitHub: [@Ani200418](https://github.com/Ani200418)
- Email: aniketsingh886909@gmail.com

---

## 🙏 Acknowledgments

- Google for OAuth 2.0 and APIs
- OpenAI for AI capabilities
- MongoDB for database
- Vercel for frontend hosting
- Render for backend hosting

---

## 📞 Support

For issues, questions, or suggestions:
1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Include error messages and screenshots if applicable

---

## 🎯 Roadmap

- [ ] Advanced resume matching algorithm
- [ ] Email notifications for job matches
- [ ] User profile customization
- [ ] Job application tracking
- [ ] Resume templates
- [ ] Collaborative features
- [ ] Mobile app
- [ ] Blockchain credentials verification

---

**Happy coding! 🚀**
