import React from 'react';
import { FileText, Download, Sparkles, User, CheckCircle2, Shield, RefreshCw } from 'lucide-react';

export default function Navbar({ 
  onExportPdf, 
  onToggleAts, 
  atsScore, 
  user, 
  onOpenAuth, 
  activeTemplate, 
  setActiveTemplate,
  onLoadSampleData 
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-emerald-400 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-900">
              <FileText className="h-5 w-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white">
                ATS<span className="text-indigo-400">Craft</span> Pro
              </h1>
              <span className="hidden rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 ring-1 ring-emerald-500/30 sm:inline-block">
                Supabase Connected
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">AI ATS Resume Builder & Career Suite</p>
          </div>
        </div>

        {/* Center Template Picker */}
        <div className="hidden lg:flex items-center gap-1 rounded-xl bg-slate-800/80 p-1 border border-slate-700/60">
          <button
            onClick={() => setActiveTemplate('classic-ats')}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              activeTemplate === 'classic-ats'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Classic ATS
          </button>
          <button
            onClick={() => setActiveTemplate('modern-pro')}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              activeTemplate === 'modern-pro'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Modern Executive
          </button>
          <button
            onClick={() => setActiveTemplate('minimalist')}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              activeTemplate === 'minimalist'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Minimalist Clean
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Sample Data Loader Button */}
          <button
            onClick={onLoadSampleData}
            title="Load Sample Software Engineer Resume Data"
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-slate-700 hover:text-white"
          >
            <RefreshCw className="h-3.5 w-3.5 text-slate-400" />
            <span className="hidden md:inline">Load Sample</span>
          </button>

          {/* ATS Analyzer Trigger */}
          <button
            onClick={onToggleAts}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-emerald-600/20 transition hover:brightness-110 active:scale-95"
          >
            <Sparkles className="h-4 w-4 animate-pulse text-amber-300" />
            <span>ATS Score:</span>
            <span className="rounded-md bg-emerald-950/60 px-1.5 py-0.5 font-mono text-emerald-200">
              {atsScore}%
            </span>
          </button>

          {/* PDF Download Button */}
          <button
            onClick={onExportPdf}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-500 active:scale-95"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export PDF</span>
          </button>

          {/* Supabase User Account Button */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs font-medium text-slate-200 transition hover:bg-slate-700"
          >
            <User className="h-4 w-4 text-indigo-400" />
            <span className="hidden md:inline">
              {user ? (user.email ? user.email.split('@')[0] : 'Account') : 'Supabase Login'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
