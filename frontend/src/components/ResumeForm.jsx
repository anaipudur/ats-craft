import React, { useState } from 'react';
import { User, Briefcase, GraduationCap, Code, FolderGit2, Plus, Trash2, ChevronDown, ChevronUp, Sparkles, HelpCircle } from 'lucide-react';

export default function ResumeForm({ resumeData, setResumeData }) {
  const [activeTab, setActiveTab] = useState('personal');

  // Helper updater for top-level fields
  const updatePersonal = (field, val) => {
    setResumeData(prev => ({
      ...prev,
      personal_info: {
        ...prev.personal_info,
        [field]: val
      }
    }));
  };

  // Work Experience Handlers
  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      work_experience: [
        ...prev.work_experience,
        { company: '', position: '', startDate: '', endDate: '', current: false, highlights: [''] }
      ]
    }));
  };

  const updateExperience = (index, field, val) => {
    setResumeData(prev => {
      const updated = [...prev.work_experience];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, work_experience: updated };
    });
  };

  const removeExperience = (index) => {
    setResumeData(prev => ({
      ...prev,
      work_experience: prev.work_experience.filter((_, i) => i !== index)
    }));
  };

  const addHighlight = (expIndex) => {
    setResumeData(prev => {
      const updated = [...prev.work_experience];
      updated[expIndex].highlights = [...(updated[expIndex].highlights || []), ''];
      return { ...prev, work_experience: updated };
    });
  };

  const updateHighlight = (expIndex, hlIndex, val) => {
    setResumeData(prev => {
      const updated = [...prev.work_experience];
      const hls = [...updated[expIndex].highlights];
      hls[hlIndex] = val;
      updated[expIndex].highlights = hls;
      return { ...prev, work_experience: updated };
    });
  };

  const removeHighlight = (expIndex, hlIndex) => {
    setResumeData(prev => {
      const updated = [...prev.work_experience];
      updated[expIndex].highlights = updated[expIndex].highlights.filter((_, i) => i !== hlIndex);
      return { ...prev, work_experience: updated };
    });
  };

  // Education Handlers
  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        { institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', gpa: '' }
      ]
    }));
  };

  const updateEducation = (index, field, val) => {
    setResumeData(prev => {
      const updated = [...prev.education];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, education: updated };
    });
  };

  const removeEducation = (index) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  // Skills Handlers
  const addSkillCategory = () => {
    setResumeData(prev => ({
      ...prev,
      skills: [
        ...prev.skills,
        { category: '', items: [], rawText: '' }
      ]
    }));
  };

  const updateSkillCategory = (index, category, itemsString) => {
    const rawText = typeof itemsString === 'string' ? itemsString : '';
    const itemsArray = rawText.split(',').map(s => s.trim()).filter(Boolean);
    setResumeData(prev => {
      const updated = [...prev.skills];
      updated[index] = { category, items: itemsArray, rawText };
      return { ...prev, skills: updated };
    });
  };

  const removeSkillCategory = (index) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  // Projects Handlers
  const addProject = () => {
    setResumeData(prev => ({
      ...prev,
      projects: [
        ...prev.projects,
        { name: '', description: '', technologies: '', link: '' }
      ]
    }));
  };

  const updateProject = (index, field, val) => {
    setResumeData(prev => {
      const updated = [...prev.projects];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, projects: updated };
    });
  };

  const removeProject = (index) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-xl backdrop-blur-md sm:p-6">
      
      {/* Form Section Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-4">
        {[
          { id: 'personal', label: 'Personal', icon: User },
          { id: 'experience', label: 'Experience', icon: Briefcase },
          { id: 'education', label: 'Education', icon: GraduationCap },
          { id: 'skills', label: 'Skills', icon: Code },
          { id: 'projects', label: 'Projects', icon: FolderGit2 }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Personal Info & Summary */}
      {activeTab === 'personal' && (
        <div className="mt-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400">Personal Details</h3>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-slate-300">Full Name</label>
              <input
                type="text"
                value={resumeData.personal_info?.fullName || ''}
                onChange={e => updatePersonal('fullName', e.target.value)}
                placeholder="e.g. Jane Doe"
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-slate-300">Target Job Title</label>
              <input
                type="text"
                value={resumeData.personal_info?.jobTitle || ''}
                onChange={e => updatePersonal('jobTitle', e.target.value)}
                placeholder="e.g. Senior Full Stack Engineer"
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300">Email Address</label>
              <input
                type="email"
                value={resumeData.personal_info?.email || ''}
                onChange={e => updatePersonal('email', e.target.value)}
                placeholder="janedoe@example.com"
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300">Phone Number</label>
              <input
                type="text"
                value={resumeData.personal_info?.phone || ''}
                onChange={e => updatePersonal('phone', e.target.value)}
                placeholder="+1 (555) 019-2834"
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300">Location (City, Country)</label>
              <input
                type="text"
                value={resumeData.personal_info?.location || ''}
                onChange={e => updatePersonal('location', e.target.value)}
                placeholder="San Francisco, CA"
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300">LinkedIn URL</label>
              <input
                type="text"
                value={resumeData.personal_info?.linkedin || ''}
                onChange={e => updatePersonal('linkedin', e.target.value)}
                placeholder="linkedin.in/janedoe"
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-medium text-slate-300">Professional Summary</label>
              <span className="text-[10px] text-amber-400">ATS Tip: Include target role keywords</span>
            </div>
            <textarea
              rows={4}
              value={resumeData.summary || ''}
              onChange={e => setResumeData(prev => ({ ...prev, summary: e.target.value }))}
              placeholder="Results-driven Software Engineer with 5+ years of experience designing scalable microservices in Python, Node.js, and React. Proven track record of optimizing database query speeds by 40%..."
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* Tab 2: Work Experience */}
      {activeTab === 'experience' && (
        <div className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400">Work Experience</h3>
            <button
              onClick={addExperience}
              className="flex items-center gap-1 rounded-lg bg-indigo-600/20 px-3 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-600 hover:text-white"
            >
              <Plus className="h-3.5 w-3.5" /> Add Position
            </button>
          </div>

          {resumeData.work_experience.map((exp, idx) => (
            <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span className="text-xs font-bold text-slate-300">Job #{idx + 1}</span>
                <button
                  onClick={() => removeExperience(idx)}
                  className="text-slate-500 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-slate-400">Job Title</label>
                  <input
                    type="text"
                    value={exp.position}
                    onChange={e => updateExperience(idx, 'position', e.target.value)}
                    placeholder="Senior Full Stack Engineer"
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400">Company Name</label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={e => updateExperience(idx, 'company', e.target.value)}
                    placeholder="Acme Corp"
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400">Start Date</label>
                  <input
                    type="text"
                    value={exp.startDate}
                    onChange={e => updateExperience(idx, 'startDate', e.target.value)}
                    placeholder="Jan 2022"
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400">End Date</label>
                  <input
                    type="text"
                    value={exp.endDate}
                    onChange={e => updateExperience(idx, 'endDate', e.target.value)}
                    placeholder="Present"
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-100"
                  />
                </div>
              </div>

              {/* Bullet point highlights */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-indigo-300">Key Achievements (Bullet Points)</label>
                  <button
                    onClick={() => addHighlight(idx)}
                    className="text-[10px] text-indigo-400 hover:underline"
                  >
                    + Add Bullet
                  </button>
                </div>

                {(exp.highlights || []).map((hl, hIdx) => (
                  <div key={hIdx} className="flex items-center gap-2">
                    <span className="text-xs text-indigo-500">•</span>
                    <input
                      type="text"
                      value={hl}
                      onChange={e => updateHighlight(idx, hIdx, e.target.value)}
                      placeholder="e.g. Engineered RESTful APIs in Python FastAPI, cutting response latency by 30%."
                      className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-200"
                    />
                    <button
                      onClick={() => removeHighlight(idx, hIdx)}
                      className="text-slate-600 hover:text-red-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Education */}
      {activeTab === 'education' && (
        <div className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400">Education & Degrees</h3>
            <button
              onClick={addEducation}
              className="flex items-center gap-1 rounded-lg bg-indigo-600/20 px-3 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-600 hover:text-white"
            >
              <Plus className="h-3.5 w-3.5" /> Add Education
            </button>
          </div>

          {resumeData.education.map((edu, idx) => (
            <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span className="text-xs font-bold text-slate-300">Degree #{idx + 1}</span>
                <button
                  onClick={() => removeEducation(idx)}
                  className="text-slate-500 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-slate-400">University / Institution</label>
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={e => updateEducation(idx, 'institution', e.target.value)}
                    placeholder="Stanford University"
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400">Degree Type</label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={e => updateEducation(idx, 'degree', e.target.value)}
                    placeholder="Bachelor of Science"
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400">Field of Study</label>
                  <input
                    type="text"
                    value={edu.fieldOfStudy}
                    onChange={e => updateEducation(idx, 'fieldOfStudy', e.target.value)}
                    placeholder="Computer Science"
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400">Graduation Date</label>
                  <input
                    type="text"
                    value={edu.endDate}
                    onChange={e => updateEducation(idx, 'endDate', e.target.value)}
                    placeholder="May 2021"
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-100"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Skills */}
      {activeTab === 'skills' && (
        <div className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400">Skills & Competencies</h3>
            <button
              onClick={addSkillCategory}
              className="flex items-center gap-1 rounded-lg bg-indigo-600/20 px-3 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-600 hover:text-white"
            >
              <Plus className="h-3.5 w-3.5" /> Add Category
            </button>
          </div>

          {resumeData.skills.map((skillGroup, idx) => (
            <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={skillGroup.category}
                  onChange={e => updateSkillCategory(idx, e.target.value, skillGroup.rawText !== undefined ? skillGroup.rawText : (skillGroup.items || []).join(', '))}
                  placeholder="Category (e.g. Languages & Frameworks)"
                  className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-bold text-indigo-300"
                />
                <button
                  onClick={() => removeSkillCategory(idx)}
                  className="text-slate-500 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400">Skills (Comma-separated)</label>
                <input
                  type="text"
                  value={skillGroup.rawText !== undefined ? skillGroup.rawText : (skillGroup.items || []).join(', ')}
                  onChange={e => updateSkillCategory(idx, skillGroup.category, e.target.value)}
                  placeholder="Python, React, MySQL, FastAPI, Tailwind CSS, Docker"
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-100"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 5: Projects */}
      {activeTab === 'projects' && (
        <div className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400">Featured Projects</h3>
            <button
              onClick={addProject}
              className="flex items-center gap-1 rounded-lg bg-indigo-600/20 px-3 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-600 hover:text-white"
            >
              <Plus className="h-3.5 w-3.5" /> Add Project
            </button>
          </div>

          {resumeData.projects.map((proj, idx) => (
            <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span className="text-xs font-bold text-slate-300">Project #{idx + 1}</span>
                <button
                  onClick={() => removeProject(idx)}
                  className="text-slate-500 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-slate-400">Project Name</label>
                  <input
                    type="text"
                    value={proj.name}
                    onChange={e => updateProject(idx, 'name', e.target.value)}
                    placeholder="ATS Resume Generator"
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400">Technologies Used</label>
                  <input
                    type="text"
                    value={proj.technologies}
                    onChange={e => updateProject(idx, 'technologies', e.target.value)}
                    placeholder="React, FastAPI, PostgreSQL, Tailwind CSS"
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400">Project Description</label>
                <textarea
                  rows={2}
                  value={proj.description}
                  onChange={e => updateProject(idx, 'description', e.target.value)}
                  placeholder="Developed an automated resume optimization platform using NLP and Cloud Auth."
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-100"
                />
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
