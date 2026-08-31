import React, { useState } from 'react';
import { HelpCircle, ChevronDown, CheckCircle2, ShieldCheck, Cpu, Zap, Search } from 'lucide-react';
import AdSenseBanner from './AdSenseBanner';

export default function SEOContent() {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: "What is an ATS (Applicant Tracking System) Resume Scanner?",
      a: "An Applicant Tracking System (ATS) is software used by over 98% of Fortune 500 companies to parse, organize, and filter job applications. It converts your resume into plain text, scans for specific job keywords, hard skills, and experience metrics, and ranks candidates before human recruiters review them."
    },
    {
      q: "How does ATSCraft Pro calculate the ATS Match Percentage?",
      a: "Our ATS Engine parses your resume's experience, skills, and summary using Natural Language Processing (NLP) against your target Job Description. It measures keyword frequency, density overlap, action verb strength, and formatting compliance to give an accurate percentage score."
    },
    {
      q: "Why are single-column ATS templates recommended?",
      a: "Complex multi-column layouts, graphics, text boxes, and tables can confuse ATS parsing engines like Workday or Lever. Clean single-column or standard double-column layouts ensure text is extracted linearly in the correct sequence."
    },
    {
      q: "Can I save my resume directly to the cloud?",
      a: "Yes! By signing in, your resumes, custom ATS scores, and target job descriptions are securely synced across devices using encrypted database storage."
    }
  ];

  return (
    <section className="mt-16 border-t border-slate-800 bg-slate-950/80 px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-5xl space-y-12">
        
        {/* AdSense In-Article Content Placement */}
        <AdSenseBanner type="infeed" slot="9876543210" className="my-6" />

        {/* Section 1: Guide */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-indigo-400">
            <Cpu className="h-5 w-5" />
            <h2 className="text-xl font-bold tracking-tight text-white">
              Understanding Automated ATS Resume Algorithms
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-slate-300">
            When you submit a resume to a corporate career portal, it rarely reaches a human hiring manager immediately. Instead, systems like **Greenhouse**, **Lever**, **Taleo**, and **Workday** extract text fields into a candidate database. 
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 pt-2">
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-2">
              <Search className="h-5 w-5 text-emerald-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">1. Text Parsing</h3>
              <p className="text-xs text-slate-400">
                Resumes are stripped of styling and converted to standardized text data objects.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-2">
              <Zap className="h-5 w-5 text-indigo-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">2. Keyword Weighting</h3>
              <p className="text-xs text-slate-400">
                Skills, job titles, and tools are matched against requirements listed in the employer's Job Description.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-2">
              <ShieldCheck className="h-5 w-5 text-amber-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">3. Candidate Ranking</h3>
              <p className="text-xs text-slate-400">
                Applications meeting the keyword match threshold (typically 75%+) pass to executive review.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: FAQ Accordion */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2 text-indigo-400">
            <HelpCircle className="h-5 w-5" />
            <h2 className="text-xl font-bold tracking-tight text-white">
              Frequently Asked Questions (FAQ)
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="flex w-full items-center justify-between p-4 text-left text-sm font-semibold text-slate-200 hover:text-white"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`h-4 w-4 text-indigo-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="border-t border-slate-800/60 bg-slate-950/60 p-4 text-xs leading-relaxed text-slate-300">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* AdSense Bottom Leaderboard */}
        <AdSenseBanner type="leaderboard" slot="1122334455" className="mt-8" />

      </div>
    </section>
  );
}
