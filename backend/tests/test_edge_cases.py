import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
import io

@pytest.mark.asyncio
async def test_safety_with_image_upload():
    transport = ASGITransport(app=app)
    # Generate a tiny valid 1x1 PNG or dummy bytes
    fake_image = io.BytesIO(b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15c4\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82")
    files = {"image": ("test_site.png", fake_image, "image/png")}
    data = {"notes": "Inspecting crane hook safety", "site_location": "Gate 2"}

    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        res = await ac.post("/api/v1/safety/analyze", files=files, data=data)
    assert res.status_code == 200
    res_data = res.json()
    assert res_data["overall_safety_score"] >= 0

@pytest.mark.asyncio
async def test_crack_with_empty_notes():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        res = await ac.post("/api/v1/crack/analyze", data={})
    assert res.status_code == 200
    res_data = res.json()
    assert len(res_data["detected_cracks"]) > 0

@pytest.mark.asyncio
async def test_estimation_with_zero_or_negative_area():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # Invalid area (<=0) must trigger validation error 422
        res = await ac.post("/api/v1/estimation/boq", json={"built_up_area_sqft": -100})
    assert res.status_code == 422

@pytest.mark.asyncio
async def test_weather_advisory_edge_temperatures():
    transport = ASGITransport(app=app)
    # Sub-zero cold temperature edge-case
    payload = {
        "location": "High Altitude Sub-Zero Site",
        "temperature_c": -4.0,
        "humidity_percent": 30.0,
        "wind_speed_kmh": 45.0,
        "precipitation_probability": 80.0,
        "planned_activities": ["Concrete Pouring Deck 1", "Tower Crane Steel Lift"]
    }
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        res = await ac.post("/api/v1/weather/advisory", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "PROHIBITED" in data["crane_lifting_clearance"]
    assert "COLD WEATHER" in data["concrete_curing_advisory"]

@pytest.mark.asyncio
async def test_knowledge_unusual_query():
    transport = ASGITransport(app=app)
    payload = {
        "question": "!@#$%^&*() Random punctuation and special symbols test",
        "category": "Edge Testing"
    }
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        res = await ac.post("/api/v1/knowledge/query", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "answer" in data
    assert len(data["relevant_codes"]) > 0

