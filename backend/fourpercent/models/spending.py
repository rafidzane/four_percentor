from pydantic import BaseModel, Field
from typing import Optional, Literal


class SpendingStrategyInput(BaseModel):
    """Retirement spending input section"""
    spending_mode: Literal["four_pct_rule", "manual_withdrawal"] = Field("four_pct_rule", description="Spending mode")
    first_year_expenses: float = Field(default=0.0, ge=0, description="First year expenses (today's dollars)")
    withdrawal_pct: float = Field(4.0, ge=0, le=100, description="Withdrawal percentage")
    age_range_start: int = Field(description="Age range start")
    age_range_end: int = Field(description="Age range end")
    adjust_for_inflation: bool = Field(True, description="Adjust for inflation")
    two_period_mode: bool = Field(False, description="Two-period spending mode")

    # Two-period fields (only used when two_period_mode is True)
    period_1_start_age: Optional[int] = Field(None, description="Period 1 start age")
    period_1_end_age: Optional[int] = Field(None, description="Period 1 end age")
    period_1_withdrawal_pct: Optional[float] = Field(None, ge=0, le=100, description="Period 1 withdrawal percentage")
    period_2_start_age: Optional[int] = Field(None, description="Period 2 start age")
    period_2_end_age: Optional[int] = Field(None, description="Period 2 end age")
    period_2_withdrawal_pct: Optional[float] = Field(None, ge=0, le=100, description="Period 2 withdrawal percentage")
