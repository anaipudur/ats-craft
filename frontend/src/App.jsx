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
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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
  const [currentResumeId, setCurrentResumeId] = useState(null);
  const [isSavingResume, setIsSavingResume] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle');
  const [saveNotification, setSaveNotification] = useState(null);

  const [atsResults, setAtsResults] = useState({
    match_score: 85,
    matched_keywords: ['Python', 'React', 'MySQL', 'FastAPI', 'REST APIs', 'Cloud Storage', 'Docker', 'Git'],
    missing_keywords: ['AWS Cloud', 'Kubernetes', 'GraphQL'],
    suggestions: [
      "Include quantifiable performance metrics in your latest Nexus Cloud job highlights.",
      "Your resume formatting strictly complies with standard single-column ATS parsers."
    ]
  });

  const loadUserResume = async (userId) => {
    if (!isSupabaseConfigured() || !userId || userId === 'mock-user-123') return;
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(1);

      if (error) {
        console.warn('Error fetching resume from Supabase:', error.message);
        return;
      }

      if (data && data.length > 0) {
        const remote = data[0];
        setCurrentResumeId(remote.id);
        if (remote.template_id) {
          setActiveTemplate(remote.template_id);
        }
        setResumeData({
          personal_info: remote.personal_info || INITIAL_RESUME_DATA.personal_info,
          summary: remote.summary ?? '',
          work_experience: Array.isArray(remote.work_experience) ? remote.work_experience : [],
          education: Array.isArray(remote.education) ? remote.education : [],
          skills: Array.isArray(remote.skills) ? remote.skills : [],
          projects: Array.isArray(remote.projects) ? remote.projects : [],
          certifications: Array.isArray(remote.certifications) ? remote.certifications : []
        });
        setSaveNotification({
          type: 'success',
          message: `Synced latest saved resume from Cloud ("${remote.title || 'My ATS Resume'}")`
        });
        setTimeout(() => setSaveNotification(null), 3500);
      }
    } catch (err) {
      console.error('Error in loadUserResume:', err);
    }
  };

  // Listen for Supabase Auth state changes
  useEffect(() => {
    if (isSupabaseConfigured()) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser?.id) {
          loadUserResume(currentUser.id);
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser?.id) {
          loadUserResume(currentUser.id);
        } else {
          setCurrentResumeId(null);
        }
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  const handleSaveResume = async () => {
    if (!user) {
      setIsAuthOpen(true);
      return null;
    }

    setIsSavingResume(true);
    setSaveStatus('saving');

    if (!isSupabaseConfigured() || user.id === 'mock-user-123') {
      try {
        localStorage.setItem('ats_craft_resume_demo', JSON.stringify(resumeData));
        await new Promise(r => setTimeout(r, 400));
        setSaveStatus('saved');
        setSaveNotification({ type: 'success', message: 'Resume draft saved locally (Demo mode).' });
        setTimeout(() => {
          setSaveStatus('idle');
          setSaveNotification(null);
        }, 3000);
        return 'mock-resume-123';
      } catch (e) {
        setSaveStatus('error');
        return null;
      } finally {
        setIsSavingResume(false);
      }
    }

    try {
      const payload = {
        user_id: user.id,
        title: resumeData.personal_info?.fullName 
          ? `${resumeData.personal_info.fullName.trim()}'s ATS Resume` 
          : 'My ATS Resume',
        target_role: resumeData.personal_info?.jobTitle || '',
        template_id: activeTemplate,
        personal_info: resumeData.personal_info || {},
        summary: resumeData.summary || '',
        work_experience: resumeData.work_experience || [],
        education: resumeData.education || [],
        skills: resumeData.skills || [],
        projects: resumeData.projects || [],
        certifications: resumeData.certifications || [],
        updated_at: new Date().toISOString()
      };

      let activeId = currentResumeId;
      if (currentResumeId) {
        const { data, error } = await supabase
          .from('resumes')
          .update(payload)
          .eq('id', currentResumeId)
          .select()
          .single();

        if (error) throw error;
        if (data?.id) activeId = data.id;
      } else {
        const { data, error } = await supabase
          .from('resumes')
          .insert(payload)
          .select()
          .single();

        if (error) throw error;
        if (data?.id) {
          activeId = data.id;
          setCurrentResumeId(data.id);
        }
      }

      setSaveStatus('saved');
      setSaveNotification({ type: 'success', message: 'Resume successfully saved to Supabase Cloud!' });
      setTimeout(() => {
        setSaveStatus('idle');
        setSaveNotification(null);
      }, 3000);
      return activeId;
    } catch (err) {
      console.error('Error saving resume to Supabase:', err);
      setSaveStatus('error');
      setSaveNotification({ type: 'error', message: `Save error: ${err.message || 'Failed to persist'}` });
      setTimeout(() => {
        setSaveStatus('idle');
        setSaveNotification(null);
      }, 4000);
      return null;
    } finally {
      setIsSavingResume(false);
    }
  };

  const [isExporting, setIsExporting] = useState(false);

  /**
   * Converts ANY CSS color string (including oklch, lab, lch, color()) to a
   * plain rgb() string by drawing a single pixel on a 2D canvas.
   * The browser handles all color-space conversion natively.
   */
  const colorToRgb = (() => {
    const cache = new Map();
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    return (cssColor, fallback = 'rgb(0,0,0)') => {
      if (!cssColor || cssColor === 'none' || cssColor === 'transparent' ||
          cssColor === 'rgba(0, 0, 0, 0)' || cssColor === 'initial') return cssColor || fallback;

      if (cache.has(cssColor)) return cache.get(cssColor);

      try {
        ctx.clearRect(0, 0, 1, 1);
        ctx.fillStyle = cssColor;          // browser resolves oklch → sRGB here
        ctx.fillRect(0, 0, 1, 1);
        const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
        const result = a < 255 ? `rgba(${r},${g},${b},${(a / 255).toFixed(3)})` : `rgb(${r},${g},${b})`;
        cache.set(cssColor, result);
        return result;
      } catch {
        cache.set(cssColor, fallback);
        return fallback;
      }
    };
  })();

  /**
   * Builds a fully self-contained, class-free DOM element with every computed
   * style inlined as a style="" attribute. All colors are converted to plain
   * rgb() so html2canvas never encounters oklch() anywhere.
   */
  const buildInlineStyledClone = (sourceEl) => {
    const clone = sourceEl.cloneNode(true);
    clone.removeAttribute('class');

    const sourceNodes = [sourceEl, ...sourceEl.querySelectorAll('*')];
    const cloneNodes  = [clone,    ...clone.querySelectorAll('*')];

    sourceNodes.forEach((src, i) => {
      const dst = cloneNodes[i];
      if (!dst) return;

      dst.removeAttribute('class');

      const cs  = window.getComputedStyle(src);
      const tag = src.tagName.toLowerCase();

      // Convert any CSS color (incl. oklch) to a safe rgb() string
      const c = (val, fallback) => colorToRgb(val, fallback);

      if (tag === 'svg') {
        // IMPORTANT: Lucide SVGs have hardcoded width="24" height="24" HTML attributes,
        // but CSS classes like w-3/h-3 override them to 12px at render time.
        // Always prefer the CSS computed size — it reflects class overrides.
        const wPx = (parseFloat(cs.width)  > 0 ? parseFloat(cs.width)  : null)
                 ?? parseFloat(src.getAttribute('width'))
                 ?? 12;
        const hPx = (parseFloat(cs.height) > 0 ? parseFloat(cs.height) : null)
                 ?? parseFloat(src.getAttribute('height'))
                 ?? 12;
        dst.setAttribute('width',   wPx);
        dst.setAttribute('height',  hPx);
        dst.setAttribute('viewBox', src.getAttribute('viewBox') || '0 0 24 24');
        // Copy all SVG presentation attributes (stroke-width, linecap, etc.)
        ['stroke-width','stroke-linecap','stroke-linejoin','stroke-miterlimit',
         'fill-rule','clip-rule','stroke-dasharray','stroke-dashoffset'
        ].forEach(attr => { const v = src.getAttribute(attr); if (v) dst.setAttribute(attr, v); });
        const stroke = c(cs.stroke !== 'none' ? cs.stroke : cs.color, 'rgb(100,116,139)');
        const fill   = cs.fill !== 'none' ? c(cs.fill, 'none') : 'none';
        dst.setAttribute('stroke', stroke);
        dst.setAttribute('fill',   fill);
        // html2canvas doesn't reliably apply flex align-items:center to SVG children.
        // Manually compute margin-top to center the icon within its parent's line height.
        const parentEl = src.parentElement;
        const parentCs = parentEl ? window.getComputedStyle(parentEl) : null;
        let svgMarginTop = 0;
        if (parentCs) {
          // lineHeight can be "normal" → fall back to fontSize × 1.2
          const lineH = parseFloat(parentCs.lineHeight) || (parseFloat(parentCs.fontSize) * 1.2);
          if (lineH > hPx) {
            svgMarginTop = Math.round((lineH - hPx) / 2);
          }
        }
        dst.style.cssText = `display:block;width:${wPx}px;height:${hPx}px;flex-shrink:0;margin-top:${svgMarginTop}px;stroke:${stroke};fill:${fill};overflow:visible;`;

      } else if (tag === 'path' || tag === 'g' || tag === 'circle' || tag === 'rect' || tag === 'line' || tag === 'polyline' || tag === 'polygon') {
        // SVG children — copy presentation attributes from source
        ['fill','stroke','stroke-width','stroke-linecap','stroke-linejoin',
         'fill-rule','clip-rule','d','cx','cy','r','rx','ry','x','y','x1','y1','x2','y2','points'
        ].forEach(attr => { const v = src.getAttribute(attr); if (v !== null) dst.setAttribute(attr, v); });
        dst.style.cssText = '';

      } else {
        // Regular HTML elements
        const color   = c(cs.color,           'rgb(15,23,42)');
        const bgColor = c(cs.backgroundColor, 'transparent');
        const bdrTopC = c(cs.borderTopColor,    'transparent');
        const bdrBotC = c(cs.borderBottomColor, 'transparent');
        const bdrLftC = c(cs.borderLeftColor,   'transparent');
        const bdrRgtC = c(cs.borderRightColor,  'transparent');

        const isFlex   = cs.display === 'flex' || cs.display === 'inline-flex';
        const isInline = cs.display === 'inline' || cs.display === 'inline-block' || cs.display === 'inline-flex';

        // Flex containers must NOT have a fixed height — they size naturally
        // around their children. Fixed height prevents align-items:center from
        // working correctly when font metrics differ slightly in the iframe.
        const heightVal   = isFlex ? 'auto' : cs.height;
        const minHeightVal = (cs.minHeight === 'none' || cs.minHeight === '0px') ? '0' : cs.minHeight;

        // Inline elements should not have a fixed width — let content flow naturally
        const widthVal = isInline ? 'auto' : cs.width;

        dst.style.cssText = [
          `color:${color}`,
          `background-color:${bgColor}`,
          `font-family:${cs.fontFamily}`,
          `font-size:${cs.fontSize}`,
          `font-weight:${cs.fontWeight}`,
          `font-style:${cs.fontStyle}`,
          `line-height:${cs.lineHeight}`,
          `text-transform:${cs.textTransform}`,
          `letter-spacing:${cs.letterSpacing}`,
          `text-align:${cs.textAlign}`,
          `vertical-align:${cs.verticalAlign}`,
          `white-space:${cs.whiteSpace}`,
          `word-break:${cs.wordBreak}`,
          `display:${cs.display}`,
          `flex-direction:${cs.flexDirection}`,
          `flex-wrap:${cs.flexWrap}`,
          `flex-grow:${cs.flexGrow}`,
          `flex-shrink:${cs.flexShrink}`,
          `align-items:${cs.alignItems}`,
          `align-self:${cs.alignSelf}`,
          `justify-content:${cs.justifyContent}`,
          `justify-self:${cs.justifySelf}`,
          `gap:${cs.gap}`,
          `column-gap:${cs.columnGap}`,
          `row-gap:${cs.rowGap}`,
          `width:${widthVal}`,
          `max-width:${cs.maxWidth}`,
          `min-width:${cs.minWidth}`,
          `height:${heightVal}`,
          `min-height:${minHeightVal}`,
          `padding:${cs.padding}`,
          `margin:${cs.margin}`,
          `border-top:${cs.borderTopWidth} ${cs.borderTopStyle} ${bdrTopC}`,
          `border-bottom:${cs.borderBottomWidth} ${cs.borderBottomStyle} ${bdrBotC}`,
          `border-left:${cs.borderLeftWidth} ${cs.borderLeftStyle} ${bdrLftC}`,
          `border-right:${cs.borderRightWidth} ${cs.borderRightStyle} ${bdrRgtC}`,
          `border-radius:${cs.borderRadius}`,
          `box-sizing:border-box`,
          `overflow:visible`,
          `list-style:${cs.listStyle}`,
          `opacity:${cs.opacity}`,
          `position:${(cs.position === 'fixed' || cs.position === 'sticky') ? 'static' : cs.position}`,
        ].join(';');
      }
    });

    // Force root container
    clone.style.width      = '800px';
    clone.style.maxWidth   = '800px';
    clone.style.minHeight  = 'auto';
    clone.style.background = '#ffffff';
    clone.style.color      = '#0f172a';
    clone.style.padding    = '40px';
    clone.style.boxSizing  = 'border-box';
    clone.style.boxShadow  = 'none';

    // ── SECOND PASS: SVG → <img data-url> ───────────────────────────────────
    // html2canvas silently ignores flex align-items:center for SVG children —
    // they always land at the top edge. No CSS trick fixes this.
    // Solution: serialize each SVG to a data:image/svg+xml URL and replace it
    // with an <img>. Images with vertical-align:middle work perfectly in
    // html2canvas because the inline layout path is well-tested.
    const xmls = new XMLSerializer();
    clone.querySelectorAll('svg').forEach(svg => {
      try {
        const wPx = parseFloat(svg.style.width)  || parseFloat(svg.getAttribute('width'))  || 12;
        const hPx = parseFloat(svg.style.height) || parseFloat(svg.getAttribute('height')) || 12;

        const svgStr  = xmls.serializeToString(svg);
        const dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgStr);

        const img = document.createElement('img');
        img.src = dataUrl;
        img.setAttribute('width',  wPx);
        img.setAttribute('height', hPx);
        img.style.cssText = `display:inline-block;vertical-align:middle;width:${wPx}px;height:${hPx}px;flex-shrink:0;`;

        svg.parentNode.replaceChild(img, svg);

        // Also patch the direct parent so inline-block children flow correctly
        const parent = img.parentElement;
        if (parent) {
          parent.style.display       = 'inline-block';
          parent.style.whiteSpace    = 'nowrap';
          parent.style.height        = 'auto';
          parent.style.verticalAlign = 'middle';
          Array.from(parent.children).forEach(child => {
            if (child !== img) {
              child.style.display       = 'inline';
              child.style.verticalAlign = 'middle';
            }
          });
        }
      } catch (_) {
        svg.style.display = 'none'; // fallback: hide broken icon
      }
    });

    // ── THIRD PASS: fix list bullet overflow ─────────────────────────────────
    // html2canvas renders native `list-item` bullets (::marker) with a negative
    // offset outside the element's bounding box, spilling into the page margin.
    // We force list-style: none on all ul, ol, and li elements so html2canvas
    // never renders its buggy native markers.
    clone.querySelectorAll('ul, ol').forEach(list => {
      list.style.listStyle         = 'none';
      list.style.listStyleType     = 'none';
      list.style.listStylePosition = 'inside';
      list.style.paddingLeft       = '0';
      list.style.marginLeft        = '0';
    });
    clone.querySelectorAll('li').forEach(li => {
      li.style.listStyle           = 'none';
      li.style.listStyleType       = 'none';
      li.style.listStylePosition   = 'inside';
      li.style.paddingLeft         = '0';
      li.style.marginLeft          = '0';
      if (li.style.display === 'list-item') {
        li.style.display = 'block';
      }
    });

    return clone;
  };

  // Direct Vector ATS PDF export download (no browser print dialog)
  const handleExportPdf = async () => {
    const sourceEl = document.getElementById('resume-preview-container');
    if (!sourceEl) return;

    setIsExporting(true);

    const name = resumeData?.personal_info?.fullName?.trim();
    const fileName = name ? `${name.replace(/\s+/g, '_')}_Resume.pdf` : 'Resume.pdf';

    // Build a class-free, fully inline-styled clone
    const inlineClone = buildInlineStyledClone(sourceEl);

    // Scrub any oklch values that leaked through getComputedStyle
    const rawHtml =
      '<!DOCTYPE html><html style="background:#ffffff;margin:0;padding:0"><head><meta charset="UTF-8">'
      + '<style>*{box-sizing:border-box}html,body{background:#ffffff!important;margin:0;padding:0;color:#0f172a}</style>'
      + '</head><body style="background:#ffffff;margin:0;padding:0">'
      + inlineClone.outerHTML + '</body></html>';
    const standaloneHtml = rawHtml.replace(/oklch\([^)]*\)/gi, 'rgb(15,23,42)');

    // Hidden iframe whose document has ZERO Tailwind stylesheets
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'position:fixed;visibility:hidden;pointer-events:none;left:0;top:0;width:800px;height:2000px;border:none;';
    document.body.appendChild(iframe);

    try {
      iframe.contentDocument.open();
      iframe.contentDocument.write(standaloneHtml);
      iframe.contentDocument.close();

      await new Promise(r => setTimeout(r, 300));

      const iframeDoc = iframe.contentDocument;
      iframeDoc.documentElement.style.backgroundColor = '#ffffff';
      iframeDoc.body.style.backgroundColor = '#ffffff';

      const iframeEl = iframeDoc.getElementById('resume-preview-container');
      if (!iframeEl) throw new Error('Resume element not found in iframe.');

      // ── Call html2canvas DIRECTLY (bypasses html2pdf.js toContainer() which
      //    re-injects the element into the main document where Tailwind lives) ──
      // html2canvas uses iframeEl.ownerDocument (the clean iframe doc) for ALL
      // CSS lookups — no oklch anywhere in that document.
      const canvas = await html2canvas(iframeEl, {
        scale: 2,
        useCORS: true,
        logging: false,
        width: 800,
        windowWidth: 800,
        backgroundColor: '#ffffff',
      });

      // ── Build PDF directly with jsPDF ──────────────────────────────────────
      const pdf = new jsPDF({ unit: 'in', format: 'letter', orientation: 'portrait' });
      const margin    = 0.2;
      const pageW     = pdf.internal.pageSize.getWidth();
      const pageH     = pdf.internal.pageSize.getHeight();
      const printW    = pageW - 2 * margin;
      const printH    = pageH - 2 * margin;
      const imgData   = canvas.toDataURL('image/jpeg', 0.98);
      const imgAspect = canvas.height / canvas.width;
      const imgH      = printW * imgAspect;

      if (imgH <= printH) {
        // Single page
        pdf.addImage(imgData, 'JPEG', margin, margin, printW, imgH);
      } else {
        // Multi-page: slice canvas into letter-height segments
        const pageCanvas  = document.createElement('canvas');
        const pxPerInch   = canvas.width / printW;
        const pageHeightPx = Math.floor(printH * pxPerInch);
        pageCanvas.width  = canvas.width;
        pageCanvas.height = pageHeightPx;
        const ctx = pageCanvas.getContext('2d');
        let offsetY = 0;
        let firstPage = true;
        while (offsetY < canvas.height) {
          if (!firstPage) pdf.addPage();
          firstPage = false;
          ctx.clearRect(0, 0, pageCanvas.width, pageCanvas.height);
          ctx.drawImage(canvas, 0, -offsetY);
          const sliceData = pageCanvas.toDataURL('image/jpeg', 0.98);
          const sliceH    = Math.min(printH, (canvas.height - offsetY) / pxPerInch);
          pdf.addImage(sliceData, 'JPEG', margin, margin, printW, sliceH);
          offsetY += pageHeightPx;
        }
      }

      pdf.save(fileName);
    } catch (error) {
      console.error('PDF Export Error:', error);
      alert('PDF export failed. Please try again.');
    } finally {
      try { document.body.removeChild(iframe); } catch (_) {}
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

      {/* Save / Cloud Notification Banner */}
      {saveNotification && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-2xl border border-indigo-500/30 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-md animate-fade-in">
          <span className={`h-2.5 w-2.5 rounded-full ${saveNotification.type === 'success' ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
          <p className="text-xs font-semibold text-slate-200">{saveNotification.message}</p>
        </div>
      )}

      {/* Navbar Header */}
      <div className="no-print">
        <Navbar
          onExportPdf={handleExportPdf}
          isExporting={isExporting}
          onSaveResume={handleSaveResume}
          isSaving={isSavingResume}
          saveStatus={saveStatus}
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
        user={user}
        currentResumeId={currentResumeId}
        setCurrentResumeId={setCurrentResumeId}
        onSaveResume={handleSaveResume}
        activeTemplate={activeTemplate}
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
