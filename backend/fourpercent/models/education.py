from pydantic import BaseModel, Field
from typing import Optional


class EducationExpenseInput(BaseModel):
    """Education expense input for a single child"""
    age_start_payments: int = Field(description="Age when payments start")
    annual_tuition_payment: float = Field(ge=0, description="Annual tuition payment")
    number_of_years: int = Field(default=4, ge=1, le=10, description="Number of years (default 4)")


class EducationInput(BaseModel):
    """Education expenses input section"""
    child_1: Optional[EducationExpenseInput] = Field(None, description="Child 1 education")
    child_2: Optional[EducationExpenseInput] = Field(None, description="Child 2 education")
