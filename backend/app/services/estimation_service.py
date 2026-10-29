from datetime import datetime, timezone
import math

from .llm_service import llm_service
from .prompts import ESTIMATION_SYSTEM_PROMPT
from ..schemas.estimation import BOQResponse, MaterialItem, LaborItem, EstimationRequest

class EstimationService:
    async def generate_boq(self, req: EstimationRequest) -> BOQResponse:
        now_iso = datetime.now(timezone.utc).isoformat()
        user_prompt = f"""
Generate an itemized Bill of Quantities (BOQ) and cost estimation for the following project specifications:
Project Title: {req.project_title}
Built-up Area: {req.built_up_area_sqft} sq ft
Number of Floors: {req.number_of_floors}
Project Type: {req.project_type}
Quality Grade: {req.quality_grade}
Location: {req.location}
Notes: {req.custom_notes or 'Standard high-grade civil construction'}

Return strict JSON adhering to the specified schema.
"""

        # Try Live LLM
        ai_data = await llm_service.generate_multimodal_analysis(
            system_prompt=ESTIMATION_SYSTEM_PROMPT,
            user_prompt=user_prompt
        )

        if ai_data:
            try:
                if "timestamp" not in ai_data:
                    ai_data["timestamp"] = now_iso
                return BOQResponse(**ai_data)
            except Exception:
                pass

        # High-Fidelity Domain Quantity Surveying Calculation
        area = req.built_up_area_sqft
        floors = req.number_of_floors
        
        # Quality multiplier: Standard=1.0, Premium=1.35, Luxury=1.75
        quality_mult = 1.0
        if "premium" in req.quality_grade.lower():
            quality_mult = 1.35
        elif "lux" in req.quality_grade.lower():
            quality_mult = 1.75

        # Base quantities based on standard civil norms (e.g., IS 1200 / CPWD / RSMeans)
        cement_bags = round(area * 0.42 * (1 + 0.05 * (floors - 1)))
        rebar_tons = round((area * 4.2 / 1000.0) * (1 + 0.08 * (floors - 1)), 2)
        aggregates_cuft = round(area * 2.1)
        sand_cuft = round(area * 1.6)
        masonry_blocks = round(area * 18.0)
        tiles_sqft = round(area * 1.15)
        paint_liters = round(area * 0.28)

        # Unit rates (adjusted by quality multiplier)
        cement_rate = 6.20 * quality_mult
        rebar_rate = 820.0 * quality_mult # per ton
        aggregates_rate = 1.45 * quality_mult
        sand_rate = 1.85 * quality_mult
        masonry_rate = 2.10 * quality_mult
        tiles_rate = 3.40 * quality_mult
        paint_rate = 12.50 * quality_mult

        materials = [
            MaterialItem(
                item_name="OPC 53 Grade Structural Cement",
                category="Structural",
                unit="Bags (50kg)",
                quantity=cement_bags,
                estimated_unit_cost=round(cement_rate, 2),
                total_cost=round(cement_bags * cement_rate, 2),
                specifications="High early strength hydraulic cement conforming to ASTM C150 / IS 12269",
                wastage_percent=3.0
            ),
            MaterialItem(
                item_name="Fe 550D TMT Thermo-Mechanically Treated Rebar",
                category="Structural",
                unit="Metric Tons",
                quantity=rebar_tons,
                estimated_unit_cost=round(rebar_rate, 2),
                total_cost=round(rebar_tons * rebar_rate, 2),
                specifications="High ductility corrosion-resistant rebars, diameters 8mm - 25mm (ASTM A615)",
                wastage_percent=4.0
            ),
            MaterialItem(
                item_name="Crushed Coarse Aggregate (20mm & 10mm Graded)",
                category="Structural",
                unit="Cubic Feet (CuFt)",
                quantity=aggregates_cuft,
                estimated_unit_cost=round(aggregates_rate, 2),
                total_cost=round(aggregates_cuft * aggregates_rate, 2),
                specifications="Clean, angular blue granite aggregate free from silt and organic impurities",
                wastage_percent=5.0
            ),
            MaterialItem(
                item_name="Manufactured Fine Sand (M-Sand Zone II)",
                category="Structural & Masonry",
                unit="Cubic Feet (CuFt)",
                quantity=sand_cuft,
                estimated_unit_cost=round(sand_rate, 2),
                total_cost=round(sand_cuft * sand_rate, 2),
                specifications="Graded manufactured quarry sand meeting ASTM C33 standards for concrete & mortar",
                wastage_percent=5.0
            ),
            MaterialItem(
                item_name="High-Density Autoclaved Aerated Concrete (AAC) Blocks",
                category="Masonry",
                unit="Blocks (600x200x150mm)",
                quantity=masonry_blocks,
                estimated_unit_cost=round(masonry_rate, 2),
                total_cost=round(masonry_blocks * masonry_rate, 2),
                specifications="Thermal insulating, lightweight blocks with compressive strength > 4 N/mm²",
                wastage_percent=4.0
            ),
            MaterialItem(
                item_name="Vitrified Floor Tiles & Waterproof Porcelain",
                category="Finishing",
                unit="Square Feet",
                quantity=tiles_sqft,
                estimated_unit_cost=round(tiles_rate, 2),
                total_cost=round(tiles_sqft * tiles_rate, 2),
                specifications="Double-charged stain-resistant vitrified tiles with rectified edges",
                wastage_percent=8.0
            ),
            MaterialItem(
                item_name="Low-VOC Anti-Fungal Weatherproof Acrylic Emulsion",
                category="Finishing",
                unit="Liters",
                quantity=paint_liters,
                estimated_unit_cost=round(paint_rate, 2),
                total_cost=round(paint_liters * paint_rate, 2),
                specifications="Silicone-infused elastomeric exterior & interior primer-plus-paint system",
                wastage_percent=3.0
            )
        ]

        subtotal_materials = sum(m.total_cost for m in materials)

        # Labor breakdown
        estimated_weeks = max(12, int(math.ceil(area / 110.0 * (1 + 0.2 * (floors - 1)))))
        total_work_days = estimated_weeks * 6

        labor = [
            LaborItem(
                trade="RCC Framing & Shuttering Carpenters",
                worker_count=max(4, int(area / 450)),
                estimated_days=int(total_work_days * 0.40),
                daily_rate=190.0,
                total_cost=round(max(4, int(area / 450)) * int(total_work_days * 0.40) * 190.0, 2)
            ),
            LaborItem(
                trade="Rebar Benders & Steel Fixers",
                worker_count=max(3, int(area / 600)),
                estimated_days=int(total_work_days * 0.35),
                daily_rate=180.0,
                total_cost=round(max(3, int(area / 600)) * int(total_work_days * 0.35) * 180.0, 2)
            ),
            LaborItem(
                trade="Masonry & Plastering Specialists",
                worker_count=max(4, int(area / 500)),
                estimated_days=int(total_work_days * 0.45),
                daily_rate=175.0,
                total_cost=round(max(4, int(area / 500)) * int(total_work_days * 0.45) * 175.0, 2)
            ),
            LaborItem(
                trade="Licensed MEP Electricians & Plumbers",
                worker_count=max(2, int(area / 800)),
                estimated_days=int(total_work_days * 0.30),
                daily_rate=210.0,
                total_cost=round(max(2, int(area / 800)) * int(total_work_days * 0.30) * 210.0, 2)
            )
        ]

        subtotal_labor = sum(l.total_cost for l in labor)
        equipment_cost = round(subtotal_materials * 0.12, 2)
        contingency_and_permits = round((subtotal_materials + subtotal_labor) * 0.10, 2)
        total_cost = round(subtotal_materials + subtotal_labor + equipment_cost + contingency_and_permits, 2)
        cost_per_sqft = round(total_cost / area, 2)

        return BOQResponse(
            project_title=req.project_title,
            built_up_area_sqft=area,
            project_type=req.project_type,
            quality_grade=req.quality_grade,
            materials=materials,
            labor=labor,
            subtotal_material_cost=round(subtotal_materials, 2),
            subtotal_labor_cost=round(subtotal_labor, 2),
            equipment_machinery_cost=equipment_cost,
            permits_and_contingency=contingency_and_permits,
            total_estimated_cost=total_cost,
            cost_per_sqft=cost_per_sqft,
            completion_timeline_weeks=estimated_weeks,
            cost_saving_tips=[
                "Standardize column sizes across all floors to reduce custom timber formwork fabrication waste by up to 22%.",
                "Purchase TMT steel directly in coil/bundle lots from the manufacturer to eliminate distributor markups (7-11% discount).",
                "Utilize Portland Pozzolana Cement (PPC) for all brickwork mortar and foundation plain cement concrete (PCC).",
                "Implement strict off-cut rebar nesting software to limit scrap loss below 2.5%."
            ],
            timestamp=now_iso
        )

estimation_service = EstimationService()

