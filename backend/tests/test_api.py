import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.mark.asyncio
async def test_root_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        res = await ac.get("/")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "online"
    assert "platform" in data

@pytest.mark.asyncio
async def test_health_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        res = await ac.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert len(data["active_modules"]) >= 8

@pytest.mark.asyncio
async def test_safety_analyze_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        res = await ac.post("/api/v1/safety/analyze", data={"notes": "Scaffolding work on floor 4", "site_location": "Tower A"})
    assert res.status_code == 200
    data = res.json()
    assert "overall_safety_score" in data
    assert "risk_level" in data
    assert isinstance(data["hazards"], list)

@pytest.mark.asyncio
async def test_crack_analyze_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        res = await ac.post("/api/v1/crack/analyze", data={"notes": "Diagonal fissure near beam end", "member_type": "RCC Beam"})
    assert res.status_code == 200
    data = res.json()
    assert "overall_structural_health_index" in data
    assert "detected_cracks" in data

@pytest.mark.asyncio
async def test_estimation_boq_endpoint():
    transport = ASGITransport(app=app)
    payload = {
        "project_title": "Greenfield Villa",
        "built_up_area_sqft": 3000.0,
        "number_of_floors": 2,
        "project_type": "Residential Villa",
        "quality_grade": "Premium",
        "location": "North Suburb"
    }
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        res = await ac.post("/api/v1/estimation/boq", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["total_estimated_cost"] > 0
    assert len(data["materials"]) > 0

@pytest.mark.asyncio
async def test_planning_schedule_endpoint():
    transport = ASGITransport(app=app)
    payload = {
        "project_name": "Commercial Complex Phase 1",
        "built_up_area_sqft": 8000.0,
        "project_type": "Commercial",
        "target_duration_months": 8
    }
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        res = await ac.post("/api/v1/planning/schedule", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["total_duration_days"] >= 180
    assert len(data["tasks"]) > 0

@pytest.mark.asyncio
async def test_valuation_endpoint():
    transport = ASGITransport(app=app)
    form_data = {
        "property_title": "Grand Horizon Penthouse",
        "property_type": "Luxury Penthouse",
        "location": "Central Metro Boulevard",
        "built_up_area_sqft": "2400",
        "age_years": "1",
        "construction_quality": "Grade A+ (RCC framed with imported fittings)",
        "amenities": "Infinity Pool, Valet, Private Terrace, Smart Automation",
        "market_condition": "High Demand"
    }
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        res = await ac.post("/api/v1/valuation/evaluate", data=form_data)
    assert res.status_code == 200
    data = res.json()
    assert data["estimated_market_value"] > 0
    assert len(data["comparable_sales"]) > 0

@pytest.mark.asyncio
async def test_weather_advisory_endpoint():
    transport = ASGITransport(app=app)
    payload = {
        "location": "Coastal Yard #4",
        "temperature_c": 36.5,
        "humidity_percent": 80.0,
        "wind_speed_kmh": 32.0,
        "precipitation_probability": 30.0,
        "planned_activities": ["Concrete Pouring Deck 4", "Tower Crane Steel Lift"]
    }
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        res = await ac.post("/api/v1/weather/advisory", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "concrete_curing_advisory" in data
    assert len(data["activity_impacts"]) == 2

@pytest.mark.asyncio
async def test_knowledge_query_endpoint():
    transport = ASGITransport(app=app)
    payload = {
        "question": "What is the minimum curing time for OPC concrete according to building codes?",
        "category": "Structural Engineering"
    }
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        res = await ac.post("/api/v1/knowledge/query", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert len(data["relevant_codes"]) > 0
    assert len(data["practical_checklist"]) > 0

