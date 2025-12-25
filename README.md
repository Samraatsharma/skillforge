# SkillForge: AI-Powered Career Roadmap Platform

SkillForge is an advanced career development application that uses Generative AI (Google Gemini) to create personalized, interactive skill roadmaps. It features a gamified learning experience with XP, Ranks, and a Neural Network-style visualization.

## 🚀 Key Features

*   **Custom AI Roadmaps**: Enter ANY career role (e.g., "Quantum Computing Researcher") and get a tailored 20-step learning path.
*   **Resume Analysis**: Upload your resume to get an AI-driven career match score and gap analysis.
*   **Gamification**: Earn XP, maintain streaks, and rank up from "Apprentice" to "Master Forger".
*   **Operative Dashboard**: Track your "Neural Activity" (Heatmap), Career Readiness Score, and access tools.
*   **AI Mentor**: Instant context and learning resources for any skill node.
*   **Tools**:
    *   **Portfolio Generator**: Get project ideas for your role.
    *   **ATS Analyzer**: Check your resume's optimization.
    *   **Achievement Cards**: Share your stats.

## 🛠️ Tech Stack

*   **Framework**: Next.js 15 (App Router)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS
*   **AI**: Google Gemini API (`@google/generative-ai`)
*   **Icons**: Lucide React
*   **State**: LocalStorage (Offline capabilities)

## 📦 Deployment Guide (Vercel)

This project is optimized for deployment on [Vercel](https://vercel.com).

### Prerequisites
1.  A GitHub account.
2.  A Vercel account.
3.  A Google Cloud API Key for **Gemini API**.

### Steps to Deploy

1.  **Push to GitHub**:
    *   Initialize a git repo (if not done) & push this code.
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    git branch -M main
    # git remote add origin <your-repo-url>
    # git push -u origin main
    ```

2.  **Import to Vercel**:
    *   Go to Vercel Dashboard > **Add New Project**.
    *   Select your `skillforge-app` repository.

3.  **Configure Environment Variables** (CRITICAL):
    *   In the Vercel Project "Configure" step, find **Environment Variables**.
    *   Add the following key:
        *   **Key**: `GEMINI_API_KEY`
        *   **Value**: `AIzaSy...` (Your actual Google Gemini API Key)

4.  **Deploy**:
    *   Click **Deploy**.
    *   Vercel will build and launch your site.

### 🐛 Troubleshooting
*   **404 on Analysis/Roadmap**: Ensure `GEMINI_API_KEY` is set in Vercel settings.
*   **Build Errors**: The project is checked strictly. If you modified code, run `npm run build` locally to verify before pushing.

## 🏃‍♂️ Running Locally

1.  Clone the repo.
2.  Install dependencies: `npm install`
3.  Set up `.env.local`:
    ```
    GEMINI_API_KEY=your_key_here
    ```
4.  Run dev server: `npm run dev`
