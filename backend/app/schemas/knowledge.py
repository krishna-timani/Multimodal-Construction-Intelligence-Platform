from typing import List, Optional
from pydantic import BaseModel, Field

class CodeReference(BaseModel):
    standard_name: str = Field(..., description="e.g. ACI 318-19, IBC 2024, OSHA 1926, IS 456:2000, Eurocode 2")
    section: str
    relevance: str

class KnowledgeQueryRequest(BaseModel):
    question: str
    category: Optional[str] = "Structural Engineering & Safety Regulations"
    context: Optional[str] = None

class KnowledgeQueryResponse(BaseModel):
    question: str
    answer: str
    relevant_codes: List[CodeReference] = []
    practical_checklist: List[str] = []
    compliance_risks: List[str] = []
    recommended_followup_topics: List[str] = []
    timestamp: str

