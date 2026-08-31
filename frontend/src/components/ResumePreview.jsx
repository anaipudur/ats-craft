import React from 'react';
import { Mail, Phone, MapPin, Globe, ExternalLink } from 'lucide-react';

export default function ResumePreview({ resumeData, templateId = 'classic-ats' }) {
  const { personal_info = {}, summary = '', work_experience = [], education = [], skills = [], projects = [] } = resumeData;

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950 p-2 sm:p-4 shadow-2xl print:border-none print:bg-transparent print:p-0 print:shadow-none print:overflow-visible">
      <div className="mx-auto w-[800px] shadow-xl rounded-sm">
        <div 
          id="resume-preview-container"
          className={`bg-white text-slate-900 transition-all duration-300 min-h-[900px] print:min-h-0 print:p-0 print:shadow-none print:border-none print:w-full print:m-0 w-full p-8 sm:p-10 font-sans ${
            templateId === 'classic-ats' ? 'font-serif text-slate-950' : ''
          }`}
          style={{ boxSizing: 'border-box' }}
        >
        
        {/* Header Section */}
        <div className={`pb-3 border-b ${templateId === 'modern-pro' ? 'border-indigo-600' : 'border-slate-300'}`}>
          <h1 className={`text-2xl font-bold uppercase tracking-tight ${
            templateId === 'modern-pro' ? 'text-indigo-900' : 'text-slate-900'
          }`}>
            {personal_info.fullName || 'Your Full Name'}
          </h1>
          <p className="text-sm font-semibold text-indigo-700 uppercase tracking-wider mt-0.5">
            {personal_info.jobTitle || 'Target Position'}
          </p>

          {/* Contact Bar */}
          <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
            {personal_info.email && (
              <span className="flex items-center gap-1">
                <Mail className="h-3 w-3 no-print text-slate-400" />
                <span>{personal_info.email}</span>
              </span>
            )}
            {personal_info.phone && (
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3 no-print text-slate-400" />
                <span>{personal_info.phone}</span>
              </span>
            )}
            {personal_info.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3 no-print text-slate-400" />
                <span>{personal_info.location}</span>
              </span>
            )}
            {personal_info.linkedin && (
              <span className="flex items-center gap-1">
                <Globe className="h-3 w-3 no-print text-slate-400" />
                <span>{personal_info.linkedin}</span>
              </span>
            )}
          </div>
        </div>

        {/* Professional Summary */}
        {summary && summary.trim() && (
          <div className="mt-3.5">
            <h2 className={`text-xs font-bold uppercase tracking-wider border-b pb-1 mb-1.5 ${
              templateId === 'modern-pro' ? 'text-indigo-900 border-indigo-200' : 'text-slate-900 border-slate-300'
            }`}>
              Professional Summary
            </h2>
            <p className="text-xs leading-relaxed text-slate-800">
              {summary}
            </p>
          </div>
        )}

        {/* Work Experience */}
        {work_experience && work_experience.length > 0 && (
          <div className="mt-3.5">
            <h2 className={`text-xs font-bold uppercase tracking-wider border-b pb-1 mb-2.5 ${
              templateId === 'modern-pro' ? 'text-indigo-900 border-indigo-200' : 'text-slate-900 border-slate-300'
            }`}>
              Work Experience
            </h2>
            <div className="space-y-3">
              {work_experience.map((exp, idx) => (
                <div key={idx}>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-bold text-slate-900">{exp.position}</span>
                    <span className="text-[11px] font-medium text-slate-500">{exp.startDate} – {exp.endDate || 'Present'}</span>
                  </div>
                  <div className="text-xs font-semibold text-indigo-800">{exp.company}</div>
                  
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="mt-1 list-disc list-inside space-y-0.5 text-xs text-slate-700">
                      {exp.highlights.filter(h => h && h.trim()).map((hl, hIdx) => (
                        <li key={hIdx} className="leading-snug">
                          {hl}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills Section */}
        {skills && skills.length > 0 && (
          <div className="mt-3.5">
            <h2 className={`text-xs font-bold uppercase tracking-wider border-b pb-1 mb-1.5 ${
              templateId === 'modern-pro' ? 'text-indigo-900 border-indigo-200' : 'text-slate-900 border-slate-300'
            }`}>
              Technical & Core Skills
            </h2>
            <div className="space-y-1 text-xs">
              {skills.map((group, idx) => (
                <div key={idx} className="flex items-start">
                  <span className="font-bold text-slate-900 w-36 shrink-0">{group.category}:</span>
                  <span className="text-slate-700">{(group.items || []).join(', ')}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education Section */}
        {education && education.length > 0 && (
          <div className="mt-3.5">
            <h2 className={`text-xs font-bold uppercase tracking-wider border-b pb-1 mb-1.5 ${
              templateId === 'modern-pro' ? 'text-indigo-900 border-indigo-200' : 'text-slate-900 border-slate-300'
            }`}>
              Education
            </h2>
            <div className="space-y-1.5">
              {education.map((edu, idx) => (
                <div key={idx} className="flex items-baseline justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{edu.degree} in {edu.fieldOfStudy}</span>
                    <div className="text-slate-600">{edu.institution}</div>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">{edu.endDate}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Featured Projects */}
        {projects && projects.length > 0 && (
          <div className="mt-3.5">
            <h2 className={`text-xs font-bold uppercase tracking-wider border-b pb-1 mb-1.5 ${
              templateId === 'modern-pro' ? 'text-indigo-900 border-indigo-200' : 'text-slate-900 border-slate-300'
            }`}>
              Projects & Achievements
            </h2>
            <div className="space-y-1.5">
              {projects.map((proj, idx) => (
                <div key={idx} className="text-xs">
                  <div className="flex items-baseline justify-between font-bold text-slate-900">
                    <span>{proj.name}</span>
                    {proj.technologies && <span className="text-[10px] font-normal text-indigo-700">[{proj.technologies}]</span>}
                  </div>
                  <p className="text-slate-700 mt-0.5">{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  </div>
);
}
