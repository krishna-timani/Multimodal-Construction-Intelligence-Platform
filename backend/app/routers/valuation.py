from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional, List
import json

from ..schemas.valuation import PropertyValuationResponse, ValuationRequest
from ..services.valuation_service import valuation_service

router = APIRouter(prefix="/valuation", tags=["Real Estate Valuation"])

@router.post("/evaluate", response_model=PropertyValuationResponse)
async def evaluate_property(
    image: Optional[UploadFile] = File(None),
    property_title: str = Form("Modern 3BHK Urban Apartment"),
    property_type: str = Form("Residential Apartment"),
    location: str = Form("Financial District Metro Corridor"),
    built_up_area_sqft: float = Form(1850.0),
    age_years: int = Form(2),
    construction_quality: str = Form("Grade A+ (RCC framed with imported fittings)"),
    amenities: Optional[str] = Form("Clubhouse, 24/7 Power Backup, Covered Parking, Solar Water Heating"),
    market_condition: str = Form("High Demand")
):
    image_bytes = None
    if image:
        try:
            image_bytes = await image.read()
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to read image upload: {str(e)}")

    amenity_list = [a.strip() for a in amenities.split(",") if a.strip()] if amenities else []
    
    req = ValuationRequest(
        property_title=property_title,
        property_type=property_type,
        location=location,
        built_up_area_sqft=built_up_area_sqft,
        age_years=age_years,
        construction_quality=construction_quality,
        amenities=amenity_list,
        market_condition=market_condition
    )
    return await valuation_service.evaluate_property(req, image_bytes=image_bytes)

