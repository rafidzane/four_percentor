"""
Deep Retirement Planning Data Models

This module defines Pydantic models for input validation and output serialization
for deep retirement planning calculations.
"""

from pydantic import BaseModel, Field, field_validator
from typing import Optional, List, Dict, Any
from datetime import date


class DeepRetirementInput(BaseModel):
    """Input parameters for deep retirement planning"""
    
    current_age: int = Field(..., ge=18, le=100, description="Current age of the user")
    retirement_age: int = Field(..., ge=50, le=100, description="Desired retirement age")
    liquid_assets: float = Field(..., ge=0, description="Liquid assets (savings, stocks, bonds)")
    illiquid_assets: Optional[float] = Field(default=0.0, ge=0, 
                                              description="Illiquid assets (real estate, private equity)")
    monthly_contribution: float = Field(..., ge=0, description="Monthly contribution to retirement")
    annual_return_rate: float = Field(..., ge=0, le=1, description="Expected annual return rate (0-1)")
    
    social_security_age: Optional[int] = Field(default=67, ge=62, le=70, 
                                               description="Age to start Social Security benefits")
    expected_lifespan: int = Field(default=90, ge=50, le=120, 
                                   description="Expected lifespan for projection")
    
    # Optional advanced parameters
    spouse_age: Optional[int] = Field(default=None, ge=18, le=100, 
                                      description="Spouse's current age (for joint planning)")
    inflation_rate: float = Field(default=0.03, ge=0, le=0.1, 
                                  description="Expected annual inflation rate")
    tax_rate: float = Field(default=0.22, ge=0, le=0.5, 
                            description="Estimated effective tax rate in retirement")


class DeepRetirementProjection(BaseModel):
    """Deep retirement projection output"""
    
    years_to_retirement: int
    total_liquid_savings_at_retirement: float
    total_net_worth_at_retirement: float
    monthly_income_at_retirement: float
    social_security_benefit: float
    withdrawal_rate: float
    projected_balance_at_age_90: float
    safe_withdrawal_amount: float
    recommended_withdrawal_strategy: str
    
    # Additional metrics
    inflation_adjusted_savings: Optional[float] = None
    years_to_depletion: Optional[float] = None
    Monte_carlo_success_rate: Optional[float] = None  # Probability savings last to age 90



