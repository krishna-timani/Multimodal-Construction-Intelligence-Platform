from typing import List, Optional
from pydantic import BaseModel, Field

class ComparableProperty(BaseModel):
    title: str
    distance_km: float
    built_up_sqft: float
    sale_price: float
    price_per_sqft: float
    similarity_index: int

class ValuationRequest(BaseModel):
    property_title: str = "Modern 3BHK Urban Apartment"
    property_type: str = "Residential Apartment"
    location: str = "Financial District Metro Corridor"
    built_up_area_sqft: float = 1850.0
    age_years: int = 2
    construction_quality: str = "Grade A+ (RCC framed with imported fittings)"
    amenities: List[str] = ["Clubhouse", "24/7 Power Backup", "Covered Parking", "Solar Water Heating"]
    market_condition: str = "High Demand"

class PropertyValuationResponse(BaseModel):
    property_title: str
    location: str
    estimated_market_value: float
    valuation_range_low: float
    valuation_range_high: float
    price_per_sqft: float
    confidence_score: int = Field(..., ge=0, le=100)
    construction_quality_grade: str
    depreciation_percent: float
    key_value_drivers: List[str]
    risk_factors: List[str]
    projected_5yr_appreciation_percent: float
    comparable_sales: List[ComparableProperty] = []
    investment_recommendation: str
    timestamp: str

