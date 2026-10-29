from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
from datetime import date

from ..schemas.daily_log import DailySiteLogResponse, DailyLogRequest
from ..services.site_service import site_service

router = APIRouter(prefix="/site", tags=["Daily Site Assistant"])

@router.post("/daily-log", response_model=DailySiteLogResponse)
async def create_daily_log(
    image: Optional[UploadFile] = File(None),
    log_date: Optional[str] = Form(None),
    shift: str = Form("Day Shift (08:00 - 17:00)"),
    weather_summary: str = Form("Clear skies, 28°C"),
    active_worker_count: int = Form(34),
    notes_raw_text: str = Form("")
):
    image_bytes = None
    if image:
        try:
            image_bytes = await image.read()
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to read image upload: {str(e)}")

    req = DailyLogRequest(
        date=log_date or date.today().isoformat(),
        shift=shift,
        weather_summary=weather_summary,
        active_worker_count=active_worker_count,
        notes_raw_text=notes_raw_text
    )
    return await site_service.process_daily_log(req, image_bytes=image_bytes)

