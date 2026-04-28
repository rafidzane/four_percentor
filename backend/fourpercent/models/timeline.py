from pydantic import BaseModel, Field
from typing import Optional


class TimelineInput(BaseModel):
    """Timeline input section - required fields"""
    current_age: int = Field(48, ge=18, le=100, description="Current age")
    retirement_age: int = Field(62, ge=18, le=100, description="Retirement age")
    years_in_retirement: int = Field(30, ge=1, le=50, description="Years in retirement")
    spouse_age: Optional[int] = Field(None, ge=18, le=100, description="Spouse age (optional)")
