import React, { useState, useEffect } from 'react';
import { 
  X, Sparkles, CheckCircle2, AlertTriangle, Lightbulb, 
  ArrowRight, RefreshCw, History, Clock, CloudCheck, FileText, ChevronRight
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export default function ATSChecker({ 
  isOpen, 
  onClose, 
  resumeData, 
  atsResults, 
  setAtsResults,
  user,
  currentResumeId,
  setCurrentResumeId,
  onSaveResume,
  activeTemplate
}) {
  const [activeTab, setActiveTab] = useState('scanner'); // 'scanner' | 'history'
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pastScans, setPastScans] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [saveStatusMsg, setSaveStatusMsg] = useState(null);

  // Fetch past ATS analyses when user or drawer is open
  useEffect(() => {
    if (isOpen && user?.id && isSupabaseConfigured() && user.id !== 'mock-user-123') {
      fetchPastScans();
    }
  }, [isOpen, user]);

  const fetchPastScans = async () => {
    if (!user || !isSupabaseConfigured() || user.id === 'mock-user-123') return;
    setIsLoadingHistory(true);
    try {
      const { data, error: fetchErr } = await supabase
        .from('ats_analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (!fetchErr && data) {
        setPastScans(data);
      }
    } catch (err) {
      console.warn('Failed to load past scans:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  if (!isOpen) return null;

  const handleRunScan = async () => {
    setLoading(true);
    setError(null);
    setSaveStatusMsg(null);

    let auditData = null;

    try {
      const apiBase = (import.meta.env.VITE_API_BASE_URL || 'https://ats-craft-api.vercel.app').replace(/\/+$/, '');
      const response = await fetch(`${apiBase}/api/ats-score`, {
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
        auditData = resJson.data;
        setAtsResults(auditData);
      }
    } catch (err) {
      console.warn("FastAPI backend offline, running client fallback ATS audit", err);
      auditData = simulateClientAtsScan(resumeData, jobDescription);
      setAtsResults(auditData);
    } finally {
      setLoading(false);
    }

    // Persist to Supabase if authenticated
    if (auditData && user && isSupabaseConfigured() && user.id !== 'mock-user-123') {
      try {
        let resumeId = currentResumeId;
        // If resume isn't saved yet, save it to satisfy foreign key relation
        if (!resumeId && onSaveResume) {
          resumeId = await onSaveResume();
        }

        const jobTitle = (jobDescription.trim().split('\n')[0] || 'Target Job Position')
          .replace(/^#+\s*/, '')
          .slice(0, 80);

        const { data: savedScan, error: scanError } = await supabase
          .from('ats_analyses')
          .insert({
            user_id: user.id,
            resume_id: resumeId || null,
            job_title: jobTitle,
            job_description: jobDescription,
            match_score: auditData.match_score,
            matched_keywords: auditData.matched_keywords || [],
            missing_keywords: auditData.missing_keywords || [],
            suggestions: auditData.suggestions || []
          })
          .select()
          .single();

        if (scanError) {
          console.warn('Could not persist ATS scan to Supabase:', scanError.message);
        } else if (savedScan) {
          setPastScans(prev => [savedScan, ...prev]);
          setSaveStatusMsg('Scan saved to cloud history!');
          setTimeout(() => setSaveStatusMsg(null), 3500);
        }
      } catch (err) {
        console.warn('Error saving ATS scan:', err);
      }
    }
  };

  const simulateClientAtsScan = (data, jdText) => {
    const text = JSON.stringify(data).toLowerCase();
    const keywords = ['python', 'react', 'mysql', 'api', 'fastapi', 'tailwind', 'git', 'sql', 'docker', 'cloud'];
    const matched = keywords.filter(k => text.includes(k));
    const missing = keywords.filter(k => !text.includes(k));
    
    return {
      match_score: Math.min(100, 50 + matched.length * 5),
      matched_keywords: matched.map(m => m.toUpperCase()),
      missing_keywords: missing.map(m => m.toUpperCase()),
      suggestions: [
        "Include quantifiable metric outcomes (e.g. 'Boosted performance by 25%').",
        "Add targeted industry terms identified in the missing keywords checklist.",
        "Ensure clear section headings for automated Workday & Greenhouse ATS parsers."
      ]
    };
  };

  const restorePastScan = (scan) => {
    setAtsResults({
      match_score: scan.match_score,
      matched_keywords: scan.matched_keywords || [],
      missing_keywords: scan.missing_keywords || [],
      suggestions: scan.suggestions || []
    });
    if (scan.job_description) {
      setJobDescription(scan.job_description);
    }
    setActiveTab('scanner');
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

        {/* Navigation Tabs */}
        <div className="flex rounded-xl bg-slate-800/80 p-1 border border-slate-700/60">
          <button
            onClick={() => setActiveTab('scanner')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
              activeTab === 'scanner'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Scanner & Audit
          </button>
          <button
            onClick={() => {
              setActiveTab('history');
              fetchPastScans();
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg transition ${
              activeTab === 'history'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="h-3.5 w-3.5" />
            <span>Scan History</span>
            {pastScans.length > 0 && (
              <span className="ml-1 rounded-full bg-indigo-900/60 px-1.5 py-0.2 text-[10px] text-indigo-300">
                {pastScans.length}
              </span>
            )}
          </button>
        </div>

        {/* Tab 1: Live Scanner */}
        {activeTab === 'scanner' && (
          <div className="space-y-6">
            
            {/* Cloud save notification banner */}
            {saveStatusMsg && (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-2.5 text-xs font-medium text-emerald-300">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>{saveStatusMsg}</span>
              </div>
            )}

            {/* Input Job Description */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                Paste Target Job Description (from LinkedIn / Indeed)
              </label>
              <textarea
                rows={5}
                value={jobDescription}
                onChange={e => setJobDescription(e.target.value)}
                placeholder="e.g. We are seeking a Senior Software Engineer with strong skills in Python, React, MySQL database optimization, REST APIs, and cloud infrastructure..."
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
        )}

        {/* Tab 2: Scan History */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            {!user ? (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-center space-y-2">
                <Clock className="mx-auto h-8 w-8 text-amber-400" />
                <p className="text-xs font-semibold text-amber-200">Cloud Sync Required</p>
                <p className="text-xs text-slate-400">
                  Sign in to automatically store and track your historical ATS match audits in Supabase.
                </p>
              </div>
            ) : isLoadingHistory ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <RefreshCw className="mx-auto h-6 w-6 animate-spin text-indigo-400" />
                <p className="text-xs">Fetching past ATS scans from cloud...</p>
              </div>
            ) : pastScans.length === 0 ? (
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-6 text-center space-y-2">
                <FileText className="mx-auto h-8 w-8 text-slate-600" />
                <p className="text-xs font-semibold text-slate-300">No scans recorded yet</p>
                <p className="text-xs text-slate-500">
                  Run a scan against any job description to record your match history to Supabase.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-slate-400">
                  Showing {pastScans.length} recent scan{pastScans.length > 1 ? 's' : ''} stored in Supabase:
                </p>
                {pastScans.map(scan => (
                  <div
                    key={scan.id}
                    className="group rounded-xl border border-slate-800 bg-slate-950/70 p-3.5 transition hover:border-indigo-500/40 hover:bg-slate-850"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1 flex-1">
                        <h4 className="text-xs font-bold text-white line-clamp-1">
                          {scan.job_title || 'Target Job Position'}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                          <Clock className="h-3 w-3 text-slate-500" />
                          <span>
                            {scan.created_at ? new Date(scan.created_at).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            }) : 'Recent'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded-md ${
                          scan.match_score >= 80 
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {scan.match_score}%
                        </span>
                      </div>
                    </div>

                    {/* Keywords preview */}
                    {scan.matched_keywords && scan.matched_keywords.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap gap-1">
                        {scan.matched_keywords.slice(0, 5).map((kw, i) => (
                          <span key={i} className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700/60">
                            {kw}
                          </span>
                        ))}
                        {scan.matched_keywords.length > 5 && (
                          <span className="text-[10px] text-slate-500 self-center">
                            +{scan.matched_keywords.length - 5} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Action button */}
                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={() => restorePastScan(scan)}
                        className="flex items-center gap-1 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 transition"
                      >
                        <span>Load This Audit</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
