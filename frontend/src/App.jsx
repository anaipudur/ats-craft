import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ResumeForm from './components/ResumeForm';
import ResumePreview from './components/ResumePreview';
import ATSChecker from './components/ATSChecker';
import AuthModal from './components/AuthModal';
import SEOContent from './components/SEOContent';
import AdSenseBanner from './components/AdSenseBanner';
import PolicyModal from './components/PolicyModal';
import { supabase, isSupabaseConfigured } from './lib/supabaseClient';
import html2pdf from 'html2pdf.js';

const INITIAL_RESUME_DATA = {
  personal_info: {
    fullName: "Alex Mercer",
    jobTitle: "Senior Full Stack Software Engineer",
    email: "alex.mercer@example.com",
    phone: "+1 (555) 382-9102",
    location: "Austin, TX",
    linkedin: "linkedin.com/in/alex-mercer",
    github: "github.com/alex-mercer",
    website: "alexmercer.dev"
  },
  summary: "Accomplished Full Stack Software Engineer with 6+ years of experience architecting high-performance web applications using React, Python (FastAPI/Django), and MySQL/PostgreSQL databases. Proven expertise in optimizing API query performance by 45% and implementing automated CI/CD pipelines.",
  work_experience: [
    {
      company: "Nexus Cloud Solutions",
      position: "Senior Full Stack Engineer",
      startDate: "Jan 2022",
      endDate: "Present",
      current: true,
      highlights: [
        "Architected scalable microservices using Python FastAPI and React, serving over 200,000 active monthly users.",
        "Optimized MySQL database query indexes, reducing mean page load response time from 1.2s to 320ms.",
        "Spearheaded Cloud authentication & Row Level Security (RLS) integration across 4 core client applications."
      ]
    },
    {
      company: "Apex Tech Labs",
      position: "Software Developer",
      startDate: "Jun 2019",
      endDate: "Dec 2021",
      current: false,
      highlights: [
        "Developed responsive frontend user interfaces using React, Tailwind CSS, and Redux Toolkit.",
        "Engineered RESTful APIs for real-time analytics data ingestion processing 1M+ daily payload events."
      ]
    }
  ],
  education: [
    {
      institution: "University of Texas at Austin",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science",
      startDate: "Sep 2015",
      endDate: "May 2019",
      gpa: "3.8/4.0"
    }
  ],
  skills: [
    {
      category: "Languages & Core",
      items: ["Python", "JavaScript (ES6+)", "TypeScript", "SQL", "HTML5", "CSS3"]
    },
    {
      category: "Frameworks & Libraries",
      items: ["React", "FastAPI", "Tailwind CSS", "Node.js", "Express", "Vite"]
    },
    {
      category: "Databases & Cloud",
      items: ["MySQL", "PostgreSQL", "Cloud Storage", "Docker", "Git", "REST APIs"]
    }
  ],
  projects: [
    {
      name: "ATS Craft Pro Platform",
      description: "Built an AI-driven resume optimization and ATS keyword matching web app with Cloud storage.",
      technologies: "React, Tailwind CSS, Python FastAPI, Cloud API",
      link: "https://github.com/alex-mercer/ats-craft"
    }
  ]
};

export default function App() {
  const [resumeData, setResumeData] = useState(INITIAL_RESUME_DATA);
  const [activeTemplate, setActiveTemplate] = useState('classic-ats');
  const [isAtsOpen, setIsAtsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);
  const [policyTab, setPolicyTab] = useState('privacy');

  const openPolicyModal = (tab) => {
    setPolicyTab(tab);
    setIsPolicyOpen(true);
  };
  const [user, setUser] = useState(null);
  const [atsResults, setAtsResults] = useState({
    match_score: 85,
    matched_keywords: ['Python', 'React', 'MySQL', 'FastAPI', 'REST APIs', 'Cloud Storage', 'Docker', 'Git'],
    missing_keywords: ['AWS Cloud', 'Kubernetes', 'GraphQL'],
    suggestions: [
      "Include quantifiable performance metrics in your latest Nexus Cloud job highlights.",
      "Your resume formatting strictly complies with standard single-column ATS parsers."
    ]
  });

  // Listen for Supabase Auth state changes
  useEffect(() => {
    if (isSupabaseConfigured()) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  const [isExporting, setIsExporting] = useState(false);

  // Convert any unsupported Tailwind CSS v4 oklch(...) colors to rgb(...) for html2canvas compatibility
  const replaceOklchInCss = (cssText) => {
    if (!cssText || !cssText.includes('oklch')) return cssText;

    const dummy = document.createElement('div');
    dummy.style.display = 'none';
    document.body.appendChild(dummy);

    const colorCache = new Map();

    const sanitized = cssText.replace(/oklch\([^)]+\)/g, (match) => {
      if (colorCache.has(match)) return colorCache.get(match);

      try {
        dummy.style.color = match;
        const computed = window.getComputedStyle(dummy).color;
        const rgbColor = (computed && computed !== '' && !computed.includes('oklch')) 
          ? computed 
          : 'rgb(0, 0, 0)';
        colorCache.set(match, rgbColor);
        return rgbColor;
      } catch {
        return 'rgb(0, 0, 0)';
      }
    });

    document.body.removeChild(dummy);
    return sanitized;
  };

  // Direct Vector ATS PDF export download (no browser print dialog)
  const handleExportPdf = async () => {
    const element = document.getElementById('resume-preview-container');
    if (!element) return;

    setIsExporting(true);

    const name = resumeData?.personal_info?.fullName?.trim();
    const fileName = name ? `${name.replace(/\s+/g, '_')}_Resume.pdf` : 'Resume.pdf';

    const opt = {
      margin: [0.25, 0.25, 0.25, 0.25],
      filename: fileName,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        scrollY: 0,
        onclone: (clonedDoc) => {
          const newStyleElements = [];

          Array.from(document.styleSheets).forEach((sheet) => {
            try {
              let cssText = '';
              if (sheet.cssRules) {
                cssText = Array.from(sheet.cssRules).map(r => r.cssText).join('\n');
              }
              if (cssText) {
                const sanitizedCss = replaceOklchInCss(cssText);
                const styleEl = clonedDoc.createElement('style');
                styleEl.textContent = sanitizedCss;
                newStyleElements.push(styleEl);
              }
            } catch (e) {
              console.warn('Could not process stylesheet for html2canvas:', e);
            }
          });

          if (newStyleElements.length > 0) {
            clonedDoc.querySelectorAll('link[rel="stylesheet"], style').forEach(el => el.remove());
            newStyleElements.forEach(styleEl => clonedDoc.head.appendChild(styleEl));
          } else {
            clonedDoc.querySelectorAll('style').forEach((styleEl) => {
              if (styleEl.textContent && styleEl.textContent.includes('oklch')) {
                styleEl.textContent = replaceOklchInCss(styleEl.textContent);
              }
            });
          }

          clonedDoc.querySelectorAll('*').forEach((el) => {
            const inlineStyle = el.getAttribute('style');
            if (inlineStyle && inlineStyle.includes('oklch')) {
              el.setAttribute('style', replaceOklchInCss(inlineStyle));
            }
          });
        }
      },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    try {
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('PDF Export Error, falling back to print:', error);
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  const handleLoadSampleData = () => {
    setResumeData(INITIAL_RESUME_DATA);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      
      {/* Top Header Leaderboard AdSense Slot */}
      <AdSenseBanner type="leaderboard" slot="5566778899" className="no-print my-0" />

      {/* Navbar Header */}
      <div className="no-print">
        <Navbar
          onExportPdf={handleExportPdf}
          isExporting={isExporting}
          onToggleAts={() => setIsAtsOpen(true)}
          atsScore={atsResults.match_score}
          user={user}
          onOpenAuth={() => setIsAuthOpen(true)}
          activeTemplate={activeTemplate}
          setActiveTemplate={setActiveTemplate}
          onLoadSampleData={handleLoadSampleData}
        />
      </div>

      {/* Main Workspace Layout */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Hero Banner */}
        <div className="no-print flex flex-col md:flex-row items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900 p-6 border border-indigo-500/20 shadow-xl">
          <div>
            <h2 className="text-xl font-bold text-white sm:text-2xl">
              Build an ATS-Optimized Resume That Wins Interviews
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-300">
              Live automated keyword match scoring against top recruiters (Workday, Lever, Greenhouse). Built with Python & React.
            </p>
          </div>
          <button
            onClick={() => setIsAtsOpen(true)}
            className="shrink-0 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 active:scale-95"
          >
            ⚡ Scan Against Job Description
          </button>
        </div>

        {/* Editor & Live Preview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Multi-step Resume Editor (5 cols) */}
          <div className="no-print lg:col-span-5 space-y-6">
            <ResumeForm
              resumeData={resumeData}
              setResumeData={setResumeData}
            />
          </div>

          {/* Right Column: Live Paper Preview & Ad Banner (7 cols) */}
          <div className="lg:col-span-7 space-y-6 lg:sticky lg:top-20">
            <ResumePreview
              resumeData={resumeData}
              templateId={activeTemplate}
            />

            {/* Sidebar Sticky AdSense Slot */}
            <div className="no-print">
              <AdSenseBanner type="sidebar" slot="3344556677" />
            </div>
          </div>

        </div>

      </main>

      {/* Drawer: ATS Keyword Analysis */}
      <ATSChecker
        isOpen={isAtsOpen}
        onClose={() => setIsAtsOpen(false)}
        resumeData={resumeData}
        atsResults={atsResults}
        setAtsResults={setAtsResults}
      />

      {/* Modal: Supabase Auth */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        user={user}
        setUser={setUser}
      />

      {/* Bottom Section: SEO Content & AdSense Footers */}
      <div className="no-print">
        <SEOContent />
      </div>

      {/* Footer */}
      <footer className="no-print border-t border-slate-800 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 ATSCraft Pro. Powered by Python, React & Tailwind CSS.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <button onClick={() => openPolicyModal('privacy')} className="hover:text-indigo-400 transition">Privacy Policy</button>
            <button onClick={() => openPolicyModal('terms')} className="hover:text-indigo-400 transition">Terms of Service</button>
            <button onClick={() => openPolicyModal('contact')} className="hover:text-indigo-400 transition">Contact Us</button>
          </div>
        </div>
      </footer>

      {/* Modal: Legal Policies & Contact Form */}
      <PolicyModal
        isOpen={isPolicyOpen}
        onClose={() => setIsPolicyOpen(false)}
        defaultTab={policyTab}
      />

    </div>
  );
}
