import re
import math
from typing import Dict, List, Any

# Common high-value action verbs for ATS resumes
ACTION_VERBS = {
    "achieved", "architected", "built", "spearheaded", "developed", "designed",
    "engineered", "implemented", "increased", "optimized", "reduced", "led",
    "managed", "created", "transformed", "automated", "launched", "streamlined"
}

# Standard technology and domain skill dictionary for matching
SKILL_DICTIONARY = {
    "python", "react", "javascript", "typescript", "node.js", "express", "fastapi",
    "flask", "django", "mysql", "postgresql", "mongodb", "aws", "docker", "kubernetes",
    "git", "github", "ci/cd", "rest api", "graphql", "tailwind css", "html", "css",
    "agile", "scrum", "project management", "data analysis", "sql", "machine learning",
    "devops", "cloud computing", "microservices", "unit testing", "system design"
}

def extract_tokens(text: str) -> List[str]:
    """Tokenize and normalize text into lowercase alphanumeric words."""
    words = re.findall(r'\b[a-zA-Z0-9\+\#\.\-]+\b', text.lower())
    return words

def build_resume_full_text(resume_data: Dict[str, Any]) -> str:
    """Concatenate all sections of the resume into a single raw text block."""
    parts = []
    
    # Personal Info
    personal = resume_data.get("personal_info", {})
    if isinstance(personal, dict):
        parts.append(personal.get("fullName", ""))
        parts.append(personal.get("jobTitle", ""))
    
    # Summary
    parts.append(resume_data.get("summary", ""))
    
    # Work Experience
    exp = resume_data.get("work_experience", [])
    if isinstance(exp, list):
        for item in exp:
            if isinstance(item, dict):
                parts.append(item.get("position", ""))
                parts.append(item.get("company", ""))
                highlights = item.get("highlights", [])
                if isinstance(highlights, list):
                    parts.extend(highlights)
                elif isinstance(highlights, str):
                    parts.append(highlights)
                    
    # Education
    edu = resume_data.get("education", [])
    if isinstance(edu, list):
        for item in edu:
            if isinstance(item, dict):
                parts.append(item.get("degree", ""))
                parts.append(item.get("institution", ""))
                parts.append(item.get("fieldOfStudy", ""))

    # Skills
    skills = resume_data.get("skills", [])
    if isinstance(skills, list):
        for item in skills:
            if isinstance(item, dict):
                items = item.get("items", [])
                if isinstance(items, list):
                    parts.extend(items)
                elif isinstance(items, str):
                    parts.append(items)
            elif isinstance(item, str):
                parts.append(item)

    # Projects
    projects = resume_data.get("projects", [])
    if isinstance(projects, list):
        for item in projects:
            if isinstance(item, dict):
                parts.append(item.get("name", ""))
                parts.append(item.get("description", ""))
                parts.append(item.get("technologies", ""))

    return " ".join([str(p) for p in parts if p])

def analyze_resume(resume_data: Dict[str, Any], job_description: str) -> Dict[str, Any]:
    """
    Analyzes resume content against a job description.
    Returns score, matched keywords, missing keywords, and improvement tips.
    """
    resume_text = build_resume_full_text(resume_data)
    
    if not job_description or not job_description.strip():
        # Baseline scan without job description
        resume_tokens = set(extract_tokens(resume_text))
        used_action_verbs = [v.capitalize() for v in ACTION_VERBS if v in resume_tokens]
        found_skills = [s.title() for s in SKILL_DICTIONARY if s in resume_tokens]
        
        # Calculate baseline ATS health score
        word_count = len(extract_tokens(resume_text))
        base_score = 50
        if word_count > 150: base_score += 15
        if len(found_skills) >= 5: base_score += 20
        if len(used_action_verbs) >= 3: base_score += 15
        base_score = min(100, base_score)
        
        return {
            "match_score": base_score,
            "matched_keywords": found_skills,
            "missing_keywords": ["Paste a job description for specific keyword matching"],
            "suggestions": [
                "Include quantifiable achievements (e.g., 'Increased efficiency by 35%').",
                f"Found {len(used_action_verbs)} strong action verbs ({', '.join(used_action_verbs[:4])}).",
                "Ensure your target job title matches the position you are applying for."
            ],
            "word_count": word_count
        }

    # Tokenize both texts
    jd_tokens = extract_tokens(job_description)
    resume_tokens = extract_tokens(resume_text)
    
    resume_token_set = set(resume_tokens)
    
    # Identify key terms in JD (Skills & Domain Words)
    jd_unique_words = set(jd_tokens)
    
    # Extract recognized skills from JD
    jd_skills = {s for s in SKILL_DICTIONARY if s in job_description.lower()}
    
    # Extract frequent non-stop words (>= 4 chars) from JD
    stop_words = {"with", "that", "this", "from", "have", "will", "your", "they", "been", "must", "work", "team", "role", "looking", "ability", "experience", "candidate"}
    important_jd_words = {w for w in jd_unique_words if len(w) >= 4 and w not in stop_words}
    
    # Combine skills and important words
    target_keywords = jd_skills.union(important_jd_words)
    
    if not target_keywords:
        target_keywords = set(jd_tokens)
        
    matched = [kw for kw in target_keywords if kw in resume_token_set]
    missing = [kw for kw in target_keywords if kw not in resume_token_set]
    
    # Calculate Keyword Match Percentage
    match_ratio = len(matched) / len(target_keywords) if target_keywords else 0.5
    raw_score = int(match_ratio * 100)
    
    # Boost score slightly if strong action verbs are present
    used_action_verbs = [v for v in ACTION_VERBS if v in resume_token_set]
    bonus = min(15, len(used_action_verbs) * 3)
    
    final_score = min(100, max(20, raw_score + bonus))
    
    # Format suggestions
    suggestions = []
    if missing:
        suggestions.append(f"Consider adding critical missing keywords: {', '.join([m.title() for m in missing[:5]])}.")
    if len(used_action_verbs) < 3:
        suggestions.append("Add more strong action verbs (e.g., 'Spearheaded', 'Optimized', 'Architected').")
    if len(resume_tokens) < 200:
        suggestions.append("Your resume appears brief. Expand on key responsibilities and measurable outcomes.")
    else:
        suggestions.append("Good length and keyword density for automated ATS screeners.")

    return {
        "match_score": final_score,
        "matched_keywords": [m.title() for m in matched[:12]],
        "missing_keywords": [m.title() for m in missing[:12]],
        "suggestions": suggestions,
        "word_count": len(resume_tokens)
    }
