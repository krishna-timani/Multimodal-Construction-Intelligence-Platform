from typing import List, Optional
from pydantic import BaseModel, Field

class MaterialItem(BaseModel):
    item_name: str
    category: str = Field(..., description="Structural, Masonry, Finishing, Plumbing, Electrical, Hardware")
    unit: str = Field(..., description="Bags, Tons, SqFt, CuFt, Liters, Units")
    quantity: float
    estimated_unit_cost: float
    total_cost: float
    specifications: str = Field(..., description="Grade/Grade standard e.g. OPC 53 Grade Cement, Fe500D TMT Rebar")
    wastage_percent: float = 5.0

class LaborItem(BaseModel):
    trade: str = Field(..., description="Masons, Carpenters, Steel Benders, Electricians, General Labor")
    worker_count: int
    estimated_days: int
    daily_rate: float
    total_cost: float

class EstimationRequest(BaseModel):
    project_title: str = "Standard Residential Project"
    built_up_area_sqft: float = Field(..., gt=0, description="Total built-up floor area in square feet")
    number_of_floors: int = Field(default=1, ge=1)
    project_type: str = Field(default="Residential Villa", description="Residential Villa, Multi-family Apartment, Commercial Office, Industrial Warehouse")
    quality_grade: str = Field(default="Premium", description="Standard, Premium, Luxury")
    location: str = Field(default="Urban Metro")
    custom_notes: Optional[str] = None

class BOQResponse(BaseModel):
    project_title: str
    built_up_area_sqft: float
    project_type: str
    quality_grade: str
    materials: List[MaterialItem] = []
    labor: List[LaborItem] = []
    subtotal_material_cost: float
    subtotal_labor_cost: float
    equipment_machinery_cost: float
    permits_and_contingency: float
    total_estimated_cost: float
    cost_per_sqft: float
    completion_timeline_weeks: int
    cost_saving_tips: List[str] = []
    timestamp: str

