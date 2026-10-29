from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional

from ..schemas.safety import SafetyAnalysisResponse
from ..services.safety_service import safety_service

router = APIRouter(prefix="/safety", tags=["Safety Monitoring"])

@router.post("/analyze", response_model=SafetyAnalysisResponse)
async def analyze_safety(
    image: Optional[UploadFile] = File(None),
    notes: Optional[str] = Form(None),
    site_location: Optional[str] = Form("Zone 1 - Main Deck")
):
    image_bytes = None
    if image:
        try:
            image_bytes = await image.read()
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to read image upload: {str(e)}")

    result = await safety_service.analyze_site_safety(
        image_bytes=image_bytes,
        notes=notes,
        site_location=site_location
    )
    return result

