## FitBuddy AI – AI Personal Trainer & Skin Recovery Coach (MVP)

This repository contains a minimal, end-to-end MVP for FitBuddy AI:

- React Native (Expo) mobile app for photo upload, habits, and viewing reports
- Node.js Express API for orchestrating uploads, plans, and reports
- Python FastAPI AI service (OpenCV + TensorFlow-ready) for basic analysis
- Docker Compose for local development

### Architecture (MVP)

- `apps/mobile` (Expo):
  - Photo upload (front/back), basic form for goals
  - Displays a mock Skin Recovery Score (SRS) and analysis
- `services/api` (Node/Express):
  - Endpoints: `/upload`, `/report/:userId/latest`, `/plan`
  - Calls `services/ai` for analysis
- `services/ai` (FastAPI):
  - Endpoint: `/analyze` accepts front/back images
  - Returns simple rule-based analysis with placeholders for ML

### Quick Start

Requirements:
- Node.js 18+
- Python 3.10+
- Docker + Docker Compose (optional but recommended)

Local with Docker:

```bash
cd /workspace
docker compose up --build
```

Services:
- API: http://localhost:4000/health
- AI: http://localhost:8000/health

Mobile app:
- See `apps/mobile/README.md` for running the Expo app.

### Environment

Copy environment examples and adjust values:

```bash
cp services/api/.env.example services/api/.env
cp services/ai/.env.example services/ai/.env
```

### Security & Privacy (MVP)

- Images are processed locally when running via Docker
- For production, use secure storage (e.g., Firebase Storage), signed URLs, and encryption at rest
- Do not log PII or image bytes; only log trace IDs

### Roadmap

- Replace rule-based CV with actual model
- Add authentication (Firebase Auth)
- Persist user data to Firestore or Supabase
- Weekly progress overlays and habit tracker

# 💫 About Me:
Frontend architect turned on-chain engineer. Solidity? Nah. It’s Solana time.


## 🌐 Socials:
[![LinkedIn](https://img.shields.io/badge/LinkedIn-%230077B5.svg?logo=linkedin&logoColor=white)](https://www.linkedin.com/in/abhi-codaholic/) [![email](https://img.shields.io/badge/Email-D14836?logo=gmail&logoColor=white)](mailto:www.abhi930@gmail.com) 

# 💻 Tech Stack:
![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Next JS](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
![NPM](https://img.shields.io/badge/NPM-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![Solana](https://img.shields.io/badge/Solana-3d1fe2?style=for-the-badge&logo=solana&logoColor=00ffa3)
![Rust](https://img.shields.io/badge/Rust-000000?style=for-the-badge&logo=rust&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-0ea5e9?style=for-the-badge&logo=tailwind-css&logoColor=white)

# 📊 GitHub Stats:
![](https://github-readme-stats.vercel.app/api?username=CodeDemon-Abhi&theme=dark&hide_border=false&include_all_commits=false&count_private=false)<br/>
![](https://nirzak-streak-stats.vercel.app/?user=CodeDemon-Abhi&theme=dark&hide_border=false)<br/>
![](https://github-readme-stats.vercel.app/api/top-langs/?username=CodeDemon-Abhi&theme=dark&hide_border=false&include_all_commits=false&count_private=false&layout=compact)

## 🏆 GitHub Trophies
![](https://github-profile-trophy.vercel.app/?username=CodeDemon-Abhi&theme=radical&no-frame=false&no-bg=true&margin-w=4)

### ✍️ Random Dev Quote
![](https://quotes-github-readme.vercel.app/api?type=horizontal&theme=radical)

---
[![](https://visitcount.itsvg.in/api?id=CodeDemon-Abhi&icon=0&color=0)](https://visitcount.itsvg.in)
