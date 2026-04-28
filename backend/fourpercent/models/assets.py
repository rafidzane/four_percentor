from pydantic import BaseModel, Field, validator
from typing import Optional


class CurrentAssetsInput(BaseModel):
    """Current assets input section - required fields"""
    investment_portfolio: float = Field(ge=0, default=0.0, description="Investment portfolio (taxable brokerage, ETFs, funds)")
    your_401k_ira: float = Field(default=0.0, ge=0, description="Your 401(k) / IRA balance")
    spouse_401k_ira: float = Field(default=0.0, ge=0, description="Spouse 401(k) / IRA balance")
    yearly_contribution: float = Field(default=0.0, ge=0, description="Yearly contribution amount")
    yearly_contribution_increase_pct: float = Field(default=0.0, ge=0, le=100, description="Yearly contribution increase percentage")
    catch_up_eligible: bool = Field(default=False, description="Catch-up eligible (age 50+)")
