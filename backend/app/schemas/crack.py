from typing import List, Optional
from pydantic import BaseModel, Field
from .safety import BoundingBox

class CrackDetection(BaseModel):
    crack_id: str
    crack_type: str = Field(..., description="HAIRLINE, STRUCTURAL_FLEXURAL, SHEAR_DIAGONAL, SETTLEMENT, THERMAL_SHRINKAGE, CRAZING")
    location: str = Field(..., description="e.g., Beam-Column Junction, Load-Bearing Wall, Slab Center, Foundation")
    estimated_width_mm: float = Field(..., description="Estimated width in millimeters")
    estimated_length_cm: float = Field(..., description="Estimated length in centimeters")
    severity: str = Field(..., description="MINOR, MODERATE, SEVERE, CRITICAL_FAILURE_RISK")
    probable_causes: List[str] = []
    structural_implication: str = Field(..., description="Structural load-bearing implications")
    immediate_stabilization: str = Field(..., description="First response action to arrest further propagation")
    long_term_remediation: List[str] = Field(..., description="Repair methodology (epoxy injection, stitch grouting, carbon fiber wrapping, etc.)")
    monitoring_frequency: str = Field(default="Weekly crack gauge monitoring")
    bounding_box: Optional[BoundingBox] = None

class CrackAnalysisResponse(BaseModel):
    image_quality_check: bool = Field(default=True, description="Indicates if image resolution/lighting was sufficient")
    surface_type: str = Field(..., description="Reinforced Concrete, Masonry Brick, Stucco, Drywall, Precast")
    total_cracks_detected: int = 0
    overall_structural_health_index: int = Field(..., ge=0, le=100, description="100 = Perfect Integrity, <40 = Structural Distress")
    risk_status: str = Field(..., description="NORMAL, WATCHLIST, STRUCTURAL_ATTENTION_REQUIRED, IMMEDIATE_DANGER")
    detected_cracks: List[CrackDetection] = []
    engineering_recommendations: List[str] = []
    requires_evacuation: bool = False
    timestamp: str

