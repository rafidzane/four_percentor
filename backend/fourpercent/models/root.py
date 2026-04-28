from pydantic import BaseModel, Field
from typing import Optional

from fourpercent.models.timeline import TimelineInput
from fourpercent.models.assets import CurrentAssetsInput
from fourpercent.models.portfolio import PortfolioAllocationInput
from fourpercent.models.spending import SpendingStrategyInput
from fourpercent.models.income_streams import IncomeStreamsInput
from fourpercent.models.real_estate import RealEstateInput
from fourpercent.models.education import EducationInput
from fourpercent.models.output import OutputPreferencesInput
from fourpercent.models.health import HealthDataInput
from fourpercent.models.debt import DebtInput


class RetirementInput(BaseModel):
    """Root retirement input model with all sections"""

    # Required sections (always enabled)
    timeline: TimelineInput = Field(default_factory=TimelineInput, description="Timeline information")
    current_assets: CurrentAssetsInput = Field(default_factory=CurrentAssetsInput, description="Current assets")
    portfolio_allocation: PortfolioAllocationInput = Field(default_factory=lambda: PortfolioAllocationInput(), description="Portfolio allocation and returns")
    retirement_spending: SpendingStrategyInput = Field(default_factory=lambda: SpendingStrategyInput(age_range_start=62, age_range_end=92), description="Retirement spending strategy")

    # Optional sections (checkbox-gated)
    income_streams: Optional[IncomeStreamsInput] = Field(None, description="Income streams (optional)")
    real_estate: Optional[RealEstateInput] = Field(None, description="Real estate equity (optional)")
    education: Optional[EducationInput] = Field(None, description="Education expenses (optional)")
    output_preferences: Optional[OutputPreferencesInput] = Field(None, description="Output preferences (optional)")
    health_data: Optional[HealthDataInput] = Field(None, description="Health status and longevity data (optional)")
    debt: Optional[DebtInput] = Field(None, description="Debt obligations (optional)")


class RetirementResponse(BaseModel):
    """Response model for retirement projection"""
    age: list[int]
    portfolio_balance: list[float]
    income: list[float]
    expenses: list[float]
    net_income: list[float]
    success: bool
    success_probability: Optional[float] = None
    year_of_depletion: Optional[int] = None
    final_balance: float
    avg_balance: float
    max_balance: float
    min_balance: float
    total_debt: Optional[float] = None
    monthly_debt_service: Optional[float] = None
    debt_to_income_ratio: Optional[float] = None
