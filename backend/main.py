import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, List, Any, Optional

from services.ats_engine import analyze_resume

app = FastAPI(
    title="ATS Resume Builder & Career Insights API",
    description="Backend microservice for ATS keyword scoring, job description analysis, and keyword optimizations.",
    version="1.0.0"
)

# Configure CORS for local development and production frontends
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ATSAnalysisRequest(BaseModel):
    resume_data: Dict[str, Any]
    job_description: Optional[str] = ""

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "ATS Resume Builder API",
        "version": "1.0.0"
    }

@app.post("/api/ats-score")
def calculate_ats_score(payload: ATSAnalysisRequest):
    """
    Receives resume JSON and optional Job Description text.
    Computes ATS match percentage, keyword gaps, and optimization suggestions.
    """
    try:
        results = analyze_resume(payload.resume_data, payload.job_description or "")
        return {
            "success": True,
            "data": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
