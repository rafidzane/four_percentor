"""
Flexible Deep Retirement Planning API

This module provides advanced retirement planning calculations with flexible response handling.
"""

from fastapi import FastAPI, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator
from typing import Optional, Dict, Any
import math


# Create a new app instance for deep retirement API
app = FastAPI(
    title="Four Percentor Deep Retirement API",
    version="2.0.0"
)

# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class DeepRetirementInput(BaseModel):
    """Input parameters for deep retirement planning"""
    current_age: int = Field(..., ge=18, le=100)
    retirement_age: int = Field(..., ge=50, le=100)
    liquid_assets: float = Field(..., ge=0)
    illiquid_assets: Optional[float] = Field(default=0.0, ge=0)
    monthly_contribution: float = Field(..., ge=0)
    annual_return_rate: float = Field(..., ge=0, le=1)  # 0-1 (e.g., 0.07 for 7%)
    social_security_age: Optional[int] = Field(default=67, ge=62, le=70)
    expected_lifespan: int = Field(default=90, ge=50, le=120)

    @field_validator('current_age', 'retirement_age', 'social_security_age', 'expected_lifespan')
    @classmethod
    def validate_int_fields(cls, v):
        if isinstance(v, str):
            return int(float(v))
        return int(v)

    @field_validator('liquid_assets', 'illiquid_assets', 'monthly_contribution', 'annual_return_rate')
    @classmethod
    def validate_float_fields(cls, v):
        if isinstance(v, str):
            return float(v)
        return float(v)


class DeepRetirementProjection(BaseModel):
    """Flexible deep retirement projection output with optional fields"""

    # Required fields
    years_to_retirement: int
    total_liquid_savings_at_retirement: float
    total_net_worth_at_retirement: float
    monthly_income_at_retirement: float
    social_security_benefit: float
    withdrawal_rate: float
    safe_withdrawal_amount: float
    recommended_withdrawal_strategy: str

    # Optional fields with defaults
    projected_balance_at_age_90: Optional[float] = Field(default=0.0, description="Projected balance at age 90")
    inflation_adjusted_savings: Optional[float] = Field(default=0.0, description="Inflation-adjusted savings")
    years_to_depletion: Optional[float] = Field(default=0.0, description="Years until savings depletion")
    monte_carlo_success_rate: Optional[float] = Field(default=0.0, description="Monte Carlo success rate")


def calculate_compound_growth(
    principal: float,
    monthly_contribution: float,
    annual_return_rate: float,
    years: int
) -> float:
    """Calculate compound growth with monthly contributions"""
    if years <= 0:
        return principal

    monthly_return_rate = annual_return_rate / 12
    total_months = years * 12

    # Future value of current savings
    future_value_current = principal * ((1 + monthly_return_rate) ** total_months)

    # Future value of monthly contributions
    if monthly_return_rate > 0:
        future_value_contributions = (
            monthly_contribution *
            (((1 + monthly_return_rate) ** total_months - 1) / monthly_return_rate)
        )
    else:
        future_value_contributions = monthly_contribution * total_months

    return future_value_current + future_value_contributions


def calculate_withdrawal_projection(
    total_savings: float,
    annual_withdrawal: float,
    annual_return_rate: float,
    years: int
) -> float:
    """Calculate projected balance over time"""
    if total_savings <= 0:
        return 0.0

    balance = total_savings
    for year in range(years):
        balance = balance * (1 + annual_return_rate) - annual_withdrawal
        if balance <= 0:
            balance = 0
            break

    return balance


def estimate_social_security_benefit(
    full_retirement_age_benefit: float,
    claimed_age: int,
    full_retirement_age: int = 67
) -> float:
    """Estimate Social Security benefit based on claiming age"""
    if claimed_age >= full_retirement_age:
        years_delayed = claimed_age - full_retirement_age
        benefit = full_retirement_age_benefit * (1 + 0.08 * max(0, years_delayed))
    else:
        months_early = (full_retirement_age - claimed_age) * 12
        reduction_rate = 0.05 / 12  # 5% per year, divided by 12 months
        benefit = full_retirement_age_benefit * max(0.3, (1 - reduction_rate * months_early))

    return benefit


def calculate_deep_retirement_projection(input_data: DeepRetirementInput) -> DeepRetirementProjection:
    """Calculate deep retirement projection with flexible error handling"""

    try:
        # Years until retirement
        years_to_retirement = input_data.retirement_age - input_data.current_age

        if years_to_retirement <= 0:
            raise ValueError("Retirement age must be greater than current age")

        # Calculate liquid savings at retirement
        total_liquid_savings_at_retirement = calculate_compound_growth(
            principal=input_data.liquid_assets,
            monthly_contribution=input_data.monthly_contribution,
            annual_return_rate=input_data.annual_return_rate,
            years=years_to_retirement
        )

        # Total net worth includes illiquid assets
        total_net_worth_at_retirement = total_liquid_savings_at_retirement + (input_data.illiquid_assets or 0)

        # Estimate Social Security benefit
        social_security_fra = 2500  # Full retirement age benefit
        social_security_benefit = estimate_social_security_benefit(
            full_retirement_age_benefit=social_security_fra,
            claimed_age=input_data.social_security_age
        )

        # Calculate withdrawal amounts using 4% rule
        safe_withdrawal_amount = total_liquid_savings_at_retirement * 0.04

        # Monthly income at retirement
        monthly_income_at_retirement = (
            (safe_withdrawal_amount / 12) +
            social_security_benefit
        )

        # Project balance at age 90
        remaining_years = input_data.expected_lifespan - input_data.retirement_age
        annual_withdrawal = safe_withdrawal_amount

        projected_balance = calculate_withdrawal_projection(
            total_savings=total_liquid_savings_at_retirement,
            annual_withdrawal=annual_withdrawal,
            annual_return_rate=input_data.annual_return_rate,
            years=remaining_years
        )

        # Calculate withdrawal rate
        withdrawal_rate = safe_withdrawal_amount / total_liquid_savings_at_retirement if total_liquid_savings_at_retirement > 0 else 0

        # Determine recommended strategy
        if years_to_retirement < 10:
            strategy = "Conservative: Focus on preserving capital with moderate withdrawals"
        elif years_to_retirement < 25:
            strategy = "Balanced: Mix of income and growth with sustainable withdrawal rate"
        else:
            strategy = "Aggressive: Focus on growth with room for higher early retirement spending"

        # Calculate inflation-adjusted savings
        inflation_rate = 0.03  # Default inflation rate
        inflation_adjusted_savings = total_liquid_savings_at_retirement / ((1 + inflation_rate) ** years_to_retirement)

        # Calculate years to depletion
        years_to_depletion = None
        if total_liquid_savings_at_retirement > 0 and safe_withdrawal_amount > 0:
            years_to_depletion = max(0, total_liquid_savings_at_retirement / safe_withdrawal_amount)

        # Monte Carlo success rate (simplified)
        monte_carlo_success_rate = 0.0

        return DeepRetirementProjection(
            years_to_retirement=years_to_retirement,
            total_liquid_savings_at_retirement=round(total_liquid_savings_at_retirement, 2),
            total_net_worth_at_retirement=round(total_net_worth_at_retirement, 2),
            monthly_income_at_retirement=round(monthly_income_at_retirement, 2),
            social_security_benefit=round(social_security_benefit, 2),
            withdrawal_rate=round(withdrawal_rate, 4),
            safe_withdrawal_amount=round(safe_withdrawal_amount, 2),
            recommended_withdrawal_strategy=strategy,
            projected_balance_at_age_90=round(projected_balance, 2),
            inflation_adjusted_savings=round(inflation_adjusted_savings, 2),
            years_to_depletion=years_to_depletion,
            monte_carlo_success_rate=monte_carlo_success_rate
        )

    except Exception as e:
        # Return a minimal valid response with error information
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing retirement calculation: {str(e)}"
        )


# API endpoint for deep retirement calculation
@app.post("/deep_retirement/calculate", response_model=DeepRetirementProjection)
async def calculate_deep_retirement_plan(request: DeepRetirementInput):
    """
    Calculate comprehensive retirement plan with Social Security integration
    and withdrawal strategy recommendations.

    Features:
    - Monthly contribution projections
    - Social Security benefit estimation
    - 4% rule withdrawal planning (on liquid assets)
    - Balance projection to age 90
    - Total net worth calculation (liquid + illiquid)
    - Personalized withdrawal strategy recommendation
    """
    try:
        return calculate_deep_retirement_projection(request)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing retirement calculation: {str(e)}"
        )


@app.get("/deep_retirement/health")
async def deep_retirement_health():
    """Health check endpoint for deep retirement API"""
    return {"status": "healthy", "service": "deep-retirement-api"}


@app.get("/")
async def root():
    return {
        "message": "Four Percentor Deep Retirement API is running",
        "version": "2.0.0",
        "endpoints": [
            "/deep_retirement/calculate - Calculate retirement projections",
            "/deep_retirement/health - Health check"
        ]
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)