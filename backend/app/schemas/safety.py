from typing import List, Optional
from pydantic import BaseModel, Field

class BoundingBox(BaseModel):
    ymin: float = Field(..., description="Top coordinate between 0.0 and 1.0")
    xmin: float = Field(..., description="Left coordinate between 0.0 and 1.0")
    ymax: float = Field(..., description="Bottom coordinate between 0.0 and 1.0")
    xmax: float = Field(..., description="Right coordinate between 0.0 and 1.0")
    label: str = Field(..., description="Object or hazard label")

class SafetyHazard(BaseModel):
    id: str = Field(..., description="Unique hazard identifier")
    title: str = Field(..., description="Brief hazard title")
    category: str = Field(..., description="e.g. FALL_PROTECTION, PPE_VIOLATION, SCAFFOLDING, ELECTRICAL, HEAVY_MACHINERY, HOUSEKEEPING")
    severity: str = Field(..., description="LOW, MEDIUM, HIGH, CRITICAL")
    description: str = Field(..., description="Detailed description of the observed hazard")
    bounding_box: Optional[BoundingBox] = None
    recommendation: str = Field(..., description="Specific corrective measure")
    osha_reference: Optional[str] = Field(default="OSHA 1926 General Safety Standards", description="OSHA regulation code")

class PpeCompliance(BaseModel):
    worker_id: str = Field(..., description="Worker identifier or label")
    helmet_detected: bool = True
    vest_detected: bool = True
    harness_detected: Optional[bool] = None
    boots_detected: bool = True
    gloves_detected: Optional[bool] = None
    is_compliant: bool = True
    violations: List[str] = []

class SafetyAnalysisResponse(BaseModel):
    overall_safety_score: int = Field(..., ge=0, le=100, description="Score from 0 (very hazardous) to 100 (fully safe)")
    risk_level: str = Field(..., description="SAFE, MODERATE, HIGH_RISK, CRITICAL")
    total_workers_detected: int = Field(default=0)
    compliant_workers_count: int = Field(default=0)
    hazards: List[SafetyHazard] = []
    ppe_evaluations: List[PpeCompliance] = []
    immediate_actions: List[str] = []
    osha_citations: List[str] = []
    summary: str = Field(..., description="Multimodal executive summary of site conditions")
    timestamp: str

