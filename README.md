# 🚀 ATSCraft Pro - AI ATS Resume Builder & Career Insights Platform

An end-to-end, high-converting, ATS-compliant Resume Builder & Career Insights Web Application built with **React, Tailwind CSS, Python (FastAPI), MySQL / Supabase (PostgreSQL, Auth & Storage)**, optimized for high **Google AdSense revenue generation**.

---

## 🌟 Key Features

1. **Multi-Step Live Resume Editor**:
   - Tabbed interface for Personal Details, Professional Summary, Work Experience, Education, Skills, and Projects.
   - Real-time side-by-side paper rendering (Classic ATS, Modern Executive, Minimalist templates).
2. **AI ATS Keyword Match Engine (Python FastAPI)**:
   - Natural Language keyword extraction against target Job Descriptions.
   - Calculates **Match Score %**, lists **Matched Keywords**, highlights **Missing Hard Skills**, and provides keyword density suggestions.
3. **Supabase Cloud Integration**:
   - User authentication (Email/Password & Google OAuth).
   - PostgreSQL storage with Row Level Security (RLS).
   - File storage bucket for vector PDF exports.
4. **Google AdSense Monetization Optimization**:
   - Header Leaderboard (728x90), Sidebar Sticky (300x600), and In-Feed Native Ad units.
   - 1000+ words of rich educational SEO content, ATS guides, and interactive FAQ to prevent "Thin Content" AdSense rejection.
5. **Vector ATS PDF Export**:
   - High-resolution, vector-parsable PDF output built with `html2pdf.js` and CSS `@media print` rules for automated ATS screeners (Workday, Greenhouse, Lever).

---

## 📁 Repository Structure

```
crud/
├── backend/
│   ├── main.py               # FastAPI API endpoints (/api/ats-score)
│   ├── requirements.txt      # Python dependencies
│   ├── .env.example          # Environment settings template
│   └── services/
│       └── ats_engine.py     # NLP keyword matching & scoring logic
├── frontend/
│   ├── index.html            # Entry HTML with AdSense script & SEO metadata
│   ├── package.json          # Frontend packages (React, Vite, Tailwind CSS, Supabase)
│   ├── vite.config.js        # Vite + Tailwind CSS configuration
│   ├── src/
│   │   ├── App.jsx           # Main master layout
│   │   ├── index.css         # Tailwind styles & ATS vector print rules
│   │   ├── lib/
│   │   │   └── supabaseClient.js # Supabase auth & client setup
│   │   └── components/
│   │       ├── Navbar.jsx        # Top bar with templates & PDF export
│   │       ├── ResumeForm.jsx    # Tabbed resume section editor
│   │       ├── ResumePreview.jsx # ATS paper layout renderer
│   │       ├── ATSChecker.jsx    # Job description scan drawer
│   │       ├── AuthModal.jsx     # Supabase login/signup modal
│   │       ├── AdSenseBanner.jsx # Responsive AdSense container
│   │       └── SEOContent.jsx    # SEO articles & FAQ section
└── supabase/
    └── schema.sql            # Supabase database table definitions & RLS
```

---

## ⚙️ Quick Start Guide

### 1. Database & Supabase Setup
1. Sign up/log in at [supabase.com](https://supabase.com) and create a new project.
2. Go to the **SQL Editor** in your Supabase Dashboard.
3. Copy the contents of [`supabase/schema.sql`](file:///c:/xampp/htdocs/crud/supabase/schema.sql) and click **Run**.
4. Copy your **Project URL** and **anon / public key** from `Settings -> API`.

### 2. Frontend Setup (React + Vite + Tailwind CSS)
```bash
cd frontend
npm install
# Create a .env file based on .env.example
# Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm run dev
```

### 3. Backend Setup (Python FastAPI ATS Engine)
```bash
cd backend
pip install -r requirements.txt
python main.py
```
The FastAPI backend will start at `http://127.0.0.1:8000`.

---

## 💰 Google AdSense Configuration

To connect live AdSense ads:
1. Open [`frontend/index.html`](file:///c:/xampp/htdocs/crud/frontend/index.html) and update `ca-pub-XXXXXXXXXXXXXXXX` with your Publisher ID.
2. Open [`frontend/src/components/AdSenseBanner.jsx`](file:///c:/xampp/htdocs/crud/frontend/src/components/AdSenseBanner.jsx) and input your created Ad Slot IDs.
