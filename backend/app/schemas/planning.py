from typing import List, Optional
from pydantic import BaseModel, Field

class PhaseTask(BaseModel):
    task_id: str
    task_name: str
    phase: str = Field(..., description="Site Prep & Substructure, Superstructure, MEP & Services, Finishing, Handover")
    duration_days: int
    start_day: int
    end_day: int
    dependencies: List[str] = []
    critical_path: bool = False
    resources_required: List[str] = []
    deliverable: str

class Milestone(BaseModel):
    name: str
    day: int
    description: str

class PlanningRequest(BaseModel):
    project_name: str = "Commercial Complex Phase 1"
    built_up_area_sqft: float = 5000.0
    project_type: str = "Commercial"
    target_duration_months: int = 6
    start_date: Optional[str] = "2026-11-01"
    workforce_capacity: Optional[str] = "Normal (25-40 workers daily)"

class ProjectScheduleResponse(BaseModel):
    project_name: str
    total_duration_days: int
    total_phases: int
    phases: List[str]
    tasks: List[PhaseTask]
    milestones: List[Milestone]
    critical_path_summary: str
    risk_factors: List[str]
    mitigation_strategies: List[str]
    weather_buffer_days: int
    timestamp: str

