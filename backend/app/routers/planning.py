from fastapi import APIRouter
from ..schemas.planning import ProjectScheduleResponse, PlanningRequest
from ..services.planning_service import planning_service

router = APIRouter(prefix="/planning", tags=["Project Planning & Scheduling"])

@router.post("/schedule", response_model=ProjectScheduleResponse)
async def generate_schedule(req: PlanningRequest):
    return await planning_service.generate_project_schedule(req)

