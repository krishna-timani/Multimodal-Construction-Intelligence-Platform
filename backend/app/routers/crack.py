from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional

from ..schemas.crack import CrackAnalysisResponse
from ..services.crack_service import crack_service

router = APIRouter(prefix="/crack", tags=["Crack Analysis"])

@router.post("/analyze", response_model=CrackAnalysisResponse)
async def analyze_crack(
    image: Optional[UploadFile] = File(None),
    notes: Optional[str] = Form(None),
    member_type: Optional[str] = Form("RCC Beam-Column Joint")
):
    image_bytes = None
    if image:
        try:
            image_bytes = await image.read()
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to read image upload: {str(e)}")

    result = await crack_service.analyze_crack_image(
        image_bytes=image_bytes,
        notes=notes,
        member_type=member_type
    )
    return result

