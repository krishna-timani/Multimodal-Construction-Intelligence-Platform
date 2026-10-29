from typing import List, Optional
from pydantic import BaseModel, Field

class ActivityImpact(BaseModel):
    activity_name: str
    status: str = Field(..., description="OPTIMAL, CAUTION, PROHIBITED")
    guidance: str

class WeatherAdvisoryRequest(BaseModel):
    location: str = "Central Construction Yard"
    temperature_c: Optional[float] = 32.5
    humidity_percent: Optional[float] = 68.0
    wind_speed_kmh: Optional[float] = 24.0
    precipitation_probability: Optional[float] = 15.0
    planned_activities: List[str] = [
        "Concrete Pouring Slab Level 3",
        "Tower Crane Heavy Steel Lifting",
        "Exterior Stucco & Facade Plastering",
        "Deep Trenching and Earthwork"
    ]

class WeatherAdvisoryResponse(BaseModel):
    location: str
    temperature_c: float
    humidity_percent: float
    wind_speed_kmh: float
    precipitation_probability_percent: float
    weather_condition: str
    heat_index_or_stress: str
    concrete_curing_advisory: str
    crane_lifting_clearance: str
    activity_impacts: List[ActivityImpact] = []
    protective_measures: List[str] = []
    safe_window_summary: str
    timestamp: str

