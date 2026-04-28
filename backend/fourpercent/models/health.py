from pydantic import BaseModel
from typing import Optional


class HealthDataInput(BaseModel):
    """Health status and longevity data for retirement calculation"""

    health_status: Optional[str] = None
    chronic_conditions: Optional[dict] = None
    expected_lifespan: Optional[int] = None
    healthcare_cost_escalation: Optional[str] = None


class HealthDataOutput(BaseModel):
    """Health-related outputs from retirement calculation"""

    longevity_multiplier: float = 1.0
    healthcare_cost_multiplier: float = 1.0
    adjusted_years_in_retirement: int = 0