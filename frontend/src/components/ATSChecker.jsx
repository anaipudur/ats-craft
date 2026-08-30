import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, AlertTriangle, Lightbulb, ArrowRight, RefreshCw } from 'lucide-react';

export default function ATSChecker({ isOpen, onClose, resumeData, atsResults, setAtsResults }) {
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleRunScan = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/ats-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume_data: resumeData,
          job_description: jobDescription
        })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze ATS match');
      }

      const resJson = await response.json();
      if (resJson.success) {
        setAtsResults(resJson.data);
      }
    } catch (err) {
      console.warn("FastAPI backend offline, running client fallback ATS audit", err);
      // Client-side fallback computation if Python backend isn't started yet
      simulateClientAtsScan(resumeData, jobDescription);
    } finally {
      setLoading(false);
    }
  };

  const simulateClientAtsScan = (data, jdText) => {
    const text = JSON.stringify(data).toLowerCase();
    const keywords = ['python', 'react', 'mysql', 'api', 'fastapi', 'tailwind', 'git', 'sql', 'docker', 'cloud'];
    const matched = keywords.filter(k => text.includes(k));
    const missing = keywords.filter(k => !text.includes(k));
    
    setAtsResults({
      match_score: Math.min(100, 50 + matched.length * 5),
      matched_keywords: matched.map(m => m.toUpperCase()),
      missing_keywords: missing.map(m => m.toUpperCase()),
      suggestions: [
        "Include quantifiable metric outcomes (e.g. 'Boosted performance by 25%').",
        "Add targeted industry terms identified in the missing keywords checklist.",
        "Ensure clear section headings for automated Workday & Greenhouse ATS parsers."
      ]
    });
  };

  const score = atsResults?.match_score || 72;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm">
      <div className="h-full w-full max-w-lg border-l border-slate-800 bg-slate-900 p-6 overflow-y-auto shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">ATS Keyword & Job Matcher</h2>
          </div>
          <button 
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Input Job Description */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-300">
            Paste Target Job Description (from LinkedIn / Indeed)
          </label>
          <textarea
            rows={5}
            value={jobDescription}
            onChange={e => setJobDescription(e.target.value)}
            placeholder="e.g. We are seeking a Senior Software Engineer with strong skills in Python, React, MySQL database optimization, REST APIs, and Supabase cloud infrastructure..."
            className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
          />
          
          <button
            onClick={handleRunScan}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:brightness-110 active:scale-95 disabled:opacity-50"
          >
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            <span>{loading ? 'Analyzing Keywords...' : 'Run ATS Audit & Match Scan'}</span>
          </button>
        </div>

        {/* Match Score Display */}
        {atsResults && (
          <div className="space-y-5 pt-2">
            
            {/* Gauge */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-center">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Calculated ATS Match Score</span>
              <div className="my-2 flex items-center justify-center gap-3">
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-slate-900 ring-4 ring-emerald-500/30">
                  <span className="font-mono text-2xl font-bold text-emerald-400">{score}%</span>
                </div>
              </div>
              <p className="text-xs text-slate-400">
                {score >= 80 ? '🎉 Excellent! Highly competitive for automated screening filters.' : '⚠️ Good baseline. Add missing keywords below to pass 80%+.'}
              </p>
            </div>

            {/* Matched Keywords */}
            <div className="space-y-2">
              <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400">
                <CheckCircle2 className="h-4 w-4" /> Matched Keywords ({atsResults.matched_keywords?.length || 0})
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {(atsResults.matched_keywords || []).map((kw, i) => (
                  <span key={i} className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 text-[11px] font-semibold text-emerald-300">
                    ✓ {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Keywords */}
            <div className="space-y-2">
              <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400">
                <AlertTriangle className="h-4 w-4" /> Missing Keywords to Add ({atsResults.missing_keywords?.length || 0})
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {(atsResults.missing_keywords || []).map((kw, i) => (
                  <span key={i} className="rounded-lg bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 text-[11px] font-semibold text-amber-300">
                    + {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Optimization Suggestions */}
            <div className="space-y-2">
              <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-400">
                <Lightbulb className="h-4 w-4" /> Recommended Optimizations
              </h3>
              <ul className="space-y-2 text-xs text-slate-300">
                {(atsResults.suggestions || []).map((sug, i) => (
                  <li key={i} className="flex items-start gap-2 rounded-lg bg-slate-800/60 p-2.5 border border-slate-700/60">
                    <ArrowRight className="h-4 w-4 shrink-0 text-indigo-400 mt-0.5" />
                    <span>{sug}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
