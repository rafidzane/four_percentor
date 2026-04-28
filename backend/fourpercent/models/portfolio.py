from pydantic import BaseModel, Field, field_validator, model_validator
from typing import Optional, Literal


class PortfolioAllocationInput(BaseModel):
    """Portfolio allocation and returns input section"""
    equity_pct: float = Field(70.0, ge=0, le=100, description="Percentage in equities")
    fixed_income_pct: Optional[float] = Field(None, ge=0, le=100, description="Percentage in fixed income (auto-calculated if not provided)")

    @model_validator(mode='after')
    def calculate_fixed_income(self):
        equity_pct = self.equity_pct
        if self.fixed_income_pct is None:
            object.__setattr__(self, 'fixed_income_pct', 100.0 - equity_pct)
        else:
            total = equity_pct + self.fixed_income_pct
            if abs(total - 100.0) > 0.01:
                raise ValueError('Equity and fixed income percentages must sum to 100%')
        return self

    fixed_income_rate_basis: Optional[Literal["1-yr", "10-yr"]] = Field(None, description="Fixed income rate basis")
    equity_return_pre_retirement_pct: float = Field(7.0, ge=0, le=100, description="Equity return pre-retirement percentage")
    equity_return_post_retirement_pct: float = Field(5.5, ge=0, le=100, description="Equity return post-retirement percentage")
    fixed_income_return_pct: float = Field(3.5, ge=0, le=100, description="Fixed income return percentage")
    inflation_rate_pct: float = Field(3.0, ge=0, le=100, description="Inflation rate percentage")
    simulation_mode: Literal["historical_all", "single_year", "manual"] = Field("historical_all", description="Simulation mode")


class HistoricalYearInput(BaseModel):
    """Historical year selection - only visible in single_year mode"""
    historical_year: int = Field(1929, ge=1871, le=2025, description="Historical year for simulation")
