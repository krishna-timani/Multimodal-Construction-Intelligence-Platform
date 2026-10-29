from fastapi import APIRouter
from ..schemas.estimation import BOQResponse, EstimationRequest
from ..services.estimation_service import estimation_service

router = APIRouter(prefix="/estimation", tags=["Material Estimation & Costing"])

@router.post("/boq", response_model=BOQResponse)
async def generate_boq(req: EstimationRequest):
    return await estimation_service.generate_boq(req)

