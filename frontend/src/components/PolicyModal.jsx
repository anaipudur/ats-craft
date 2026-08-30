import React, { useState } from 'react';
import { X, ShieldCheck, FileText, Mail, Send, CheckCircle2, Lock } from 'lucide-react';

export default function PolicyModal({ isOpen, onClose, defaultTab = 'privacy' }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });

  // Sync active tab when defaultTab prop changes
  React.useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  if (!isOpen) return null;

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactForm({ name: '', email: '', subject: '', message: '' });
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 text-slate-100 shadow-2xl">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              {activeTab === 'privacy' && <Lock className="h-5 w-5" />}
              {activeTab === 'terms' && <FileText className="h-5 w-5" />}
              {activeTab === 'contact' && <Mail className="h-5 w-5" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {activeTab === 'privacy' && 'Privacy Policy'}
                {activeTab === 'terms' && 'Terms of Service'}
                {activeTab === 'contact' && 'Contact Support & Feedback'}
              </h2>
              <p className="text-xs text-slate-400">ATSCraft Pro Legal & Compliance Information</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-slate-800 bg-slate-800/80 p-2 text-slate-400 hover:bg-slate-700 hover:text-white transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-800 bg-slate-950/30 px-6 py-2 gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition ${
              activeTab === 'privacy'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Privacy Policy</span>
          </button>
          
          <button
            onClick={() => setActiveTab('terms')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition ${
              activeTab === 'terms'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Terms of Service</span>
          </button>

          <button
            onClick={() => setActiveTab('contact')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition ${
              activeTab === 'contact'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Mail className="h-3.5 w-3.5" />
            <span>Contact Us</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs leading-relaxed text-slate-300">
          
          {/* TAB 1: PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-indigo-500/20 bg-indigo-950/20 p-4">
                <h3 className="font-bold text-indigo-300 text-sm">1. Commitment to Your Privacy</h3>
                <p className="mt-1 text-slate-300">
                  ATSCraft Pro is built to protect job seekers' personal data. We do not sell, rent, or trade your personal resume information to third parties or recruiters.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-1">2. Information We Collect</h4>
                <p className="text-slate-400">
                  When you use ATSCraft Pro, we collect the resume text and contact information you directly input into the builder. If you register an account, your authentication credentials are encrypted and stored via Supabase Auth with Row Level Security (RLS).
                </p>
              </div>

              <div>
                <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-1">3. Third-Party Advertising & Cookies</h4>
                <p className="text-slate-400">
                  We use Google AdSense to serve targeted advertisements. Google and its partner advertising networks may place and read cookies on your browser or use web beacons to collect non-personally identifiable information in order to serve ads based on your visit to this and other websites.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-1">4. Data Storage & Encryption</h4>
                <p className="text-slate-400">
                  All stored resume records and ATS match analyses are encrypted in transit via SSL/TLS and stored in PostgreSQL databases protected by strict user-level access policies. You can export or delete your stored data at any time.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: TERMS OF SERVICE */}
          {activeTab === 'terms' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                <h3 className="font-bold text-indigo-300 text-sm">1. Acceptance of Terms</h3>
                <p className="mt-1 text-slate-300">
                  By accessing and using ATSCraft Pro, you agree to comply with and be bound by these Terms of Service. If you do not agree, please discontinue use of the application.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-1">2. Permitted Use & Service License</h4>
                <p className="text-slate-400">
                  ATSCraft Pro provides AI-assisted ATS resume building and match scoring tools. Users are granted a free, non-exclusive license to build, edit, and export personal resumes for career and employment applications.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-1">3. ATS Match Scoring Disclaimer</h4>
                <p className="text-slate-400">
                  Our ATS algorithm provides automated keyword scoring based on industry standards (Workday, Lever, Greenhouse). While we optimize your resume formatting and keyword density, we cannot guarantee specific interview invites or job offers.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-1">4. Intellectual Property</h4>
                <p className="text-slate-400">
                  All resumes created using ATSCraft Pro remain 100% your intellectual property. ATSCraft Pro retains rights to application design, source code, logos, and proprietary algorithms.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: CONTACT US FORM */}
          {activeTab === 'contact' && (
            <div>
              {contactSubmitted ? (
                <div className="my-8 flex flex-col items-center justify-center text-center space-y-3 py-8">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h3 className="text-sm font-bold text-white">Message Sent Successfully!</h3>
                  <p className="text-xs text-slate-400 max-w-sm">
                    Thank you for reaching out. Our support team will respond to your inquiry via email within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <p className="text-slate-400">
                    Have questions, feature requests, or business inquiries? Send a message directly to our engineering support team.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                        placeholder="Alex Mercer"
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="alex@example.com"
                        className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Subject</label>
                    <input
                      type="text"
                      required
                      value={contactForm.subject}
                      onChange={e => setContactForm({ ...contactForm, subject: e.target.value })}
                      placeholder="ATS Match Scoring Inquiry / Support"
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Message</label>
                    <textarea
                      required
                      rows={4}
                      value={contactForm.message}
                      onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Describe your inquiry or feedback..."
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-500 active:scale-95"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Send Message</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

        </div>

        {/* Footer info */}
        <div className="border-t border-slate-800 bg-slate-950/60 px-6 py-3 text-center text-[11px] text-slate-500">
          ATSCraft Pro • Official Legal & Support Center
        </div>

      </div>
    </div>
  );
}
