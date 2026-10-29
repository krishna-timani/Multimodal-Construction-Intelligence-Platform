from fastapi import APIRouter
from ..schemas.weather import WeatherAdvisoryResponse, WeatherAdvisoryRequest
from ..services.weather_service import weather_service

router = APIRouter(prefix="/weather", tags=["Weather-Aware Advisory"])

@router.post("/advisory", response_model=WeatherAdvisoryResponse)
async def get_weather_advisory(req: WeatherAdvisoryRequest):
    return await weather_service.evaluate_weather_risks(req)

