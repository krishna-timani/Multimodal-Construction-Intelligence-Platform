from typing import List, Optional
from pydantic import BaseModel, Field

class WorkCompleted(BaseModel):
    trade: str
    description: str
    percentage_completed: int
    delays_encountered: Optional[str] = "None"

class MaterialDelivery(BaseModel):
    material: str
    quantity: str
    supplier: str
    quality_status: str

class DailyLogRequest(BaseModel):
    date: str
    shift: str = "Day Shift (08:00 - 17:00)"
    weather_summary: str = "Clear skies, 28°C"
    active_worker_count: int = 34
    notes_raw_text: str = ""

class DailySiteLogResponse(BaseModel):
    date: str
    shift: str
    weather_summary: str
    active_worker_count: int
    machinery_operational: List[str]
    works_completed: List[WorkCompleted]
    material_deliveries: List[MaterialDelivery]
    safety_incidents_count: int
    critical_issues_and_delays: List[str]
    action_items_for_tomorrow: List[str]
    supervisor_signoff_notes: str
    timestamp: str

