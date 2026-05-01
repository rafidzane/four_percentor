from pydantic import BaseModel, Field
from typing import Optional, Literal


class SocialSecurityInput(BaseModel):
    """Social Security input for a single person"""
    claim_age: int = Field(62, ge=62, le=70, description="Age to claim benefits")
    yearly_amount_today_dollars: float = Field(ge=0, description="Yearly amount in today's dollars")
    cola_adjustment: Literal["inflation", "fixed"] = Field("inflation", description="COLA adjustment method")


class PensionInput(BaseModel):
    """Pension input"""
    starting_age: int = Field(description="Age when pension starts")
    yearly_amount: float = Field(ge=0, description="Yearly pension amount")
    annual_cola_pct: float = Field(default=0.0, ge=0, le=100, description="Annual COLA percentage")


class OneTimeBenefitInput(BaseModel):
    """One-time cash benefit"""
    age_received: int = Field(description="Age when benefit is received")
    amount: float = Field(ge=0, description="Benefit amount")


class RentalPropertyInput(BaseModel):
    """Rental property income stream"""
    property_name: str = Field(description="Property name/label")
    net_annual_income: Optional[float] = Field(default=None, ge=0, description="Net annual income after expenses")
    annual_growth_pct: float = Field(default=0.0, ge=0, le=100, description="Annual growth percentage")
    until_age: Optional[int] = Field(default=None, description="Age at which rental income stops")
    # Note: These fields default to None to handle frontend behavior where optional fields are sent as null


class IncomeStreamsInput(BaseModel):
    """Income streams input section - optional"""
    social_security_you: Optional[SocialSecurityInput] = Field(None, description="Your Social Security")
    social_security_spouse: Optional[SocialSecurityInput] = Field(None, description="Spouse Social Security")
    pension_1: Optional[PensionInput] = Field(None, description="Pension 1")
    pension_2: Optional[PensionInput] = Field(None, description="Pension 2")
    one_time_benefits: list[OneTimeBenefitInput] = Field(default_factory=list, description="List of one-time benefits")
    rental_properties: list[RentalPropertyInput] = Field(default_factory=list, description="Rental properties (min 3)")
