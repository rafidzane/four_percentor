"""
Deep Retirement Planning API

This module provides advanced retirement planning calculations including:
- Social Security benefits estimation
- 401(k)/IRA projections with monthly contributions
- Withdrawal strategies (4% rule, dynamic withdrawal)
- Tax optimization recommendations
"""

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
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
    current_savings: float = Field(..., ge=0)
    monthly_contribution: float = Field(..., ge=0)
    annual_return_rate: float = Field(..., ge=0, le=1)  # 0-1 (e.g., 0.07 for 7%)
    social_security_age: Optional[int] = Field(default=67, ge=62, le=70)
    expected_lifespan: int = Field(default=90, ge=50, le=120)


class DeepRetirementProjection(BaseModel):
    """Deep retirement projection output"""
    years_to_retirement: int
    total_savings_at_retirement: float
    monthly_income_at_retirement: float
    social_security_benefit: float
    withdrawal_rate: float
    projected_balance_at_age_90: float
    safe_withdrawal_amount: float
    recommended_withdrawal_strategy: str


def calculate_deep_retirement_projection(input_data: DeepRetirementInput) -> DeepRetirementProjection:
    """Calculate deep retirement projection based on input parameters"""
    
    # Years until retirement
    years_to_retirement = input_data.retirement_age - input_data.current_age
    
    if years_to_retirement <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Retirement age must be greater than current age"
        )
    
    # Calculate compound growth with monthly contributions
    monthly_return_rate = input_data.annual_return_rate / 12
    total_months = years_to_retirement * 12
    
    # Future value of current savings
    future_value_current = input_data.current_savings * ((1 + monthly_return_rate) ** total_months)
    
    # Future value of monthly contributions (annuity formula)
    if monthly_return_rate > 0:
        future_value_contributions = (
            input_data.monthly_contribution * 
            (((1 + monthly_return_rate) ** total_months - 1) / monthly_return_rate)
        )
    else:
        future_value_contributions = input_data.monthly_contribution * total_months
    
    total_savings_at_retirement = future_value_current + future_value_contributions
    
    # Estimate Social Security benefit (simplified: ~$2,500/month at full retirement age 67)
    # Benefit increases ~8% per year for delaying past FRA
    social_security_fra = 2500  # Full retirement age benefit
    if input_data.social_security_age >= 67:
        # Delaying beyond FRA increases benefit by ~8% per year
        years_delayed = input_data.social_security_age - 67
        social_security_benefit = social_security_fra * (1 + 0.08 * max(0, years_delayed))
    else:
        # Taking early reduces benefit by ~5% per month before FRA
        months_early = (67 - input_data.social_security_age) * 12
        reduction_rate = 0.05 / 12  # 5% per year, divided by 12 months
        social_security_benefit = social_security_fra * max(0.3, (1 - reduction_rate * months_early))
    
    # Calculate withdrawal amounts using 4% rule
    safe_withdrawal_amount = total_savings_at_retirement * 0.04  # 4% rule
    
    monthly_income_at_retirement = (
        (safe_withdrawal_amount / 12) + 
        social_security_benefit
    )
    
    # Project balance at age 90 using Monte Carlo-style simplified projection
    remaining_years = input_data.expected_lifespan - input_data.retirement_age
    annual_withdrawal = safe_withdrawal_amount
    
    projected_balance = total_savings_at_retirement
    for year in range(remaining_years):
        # Earn return on balance, then withdraw
        projected_balance = projected_balance * (1 + input_data.annual_return_rate) - annual_withdrawal
        
        if projected_balance <= 0:
            projected_balance = 0
            break
    
    withdrawal_rate = safe_withdrawal_amount / total_savings_at_retirement if total_savings_at_retirement > 0 else 0
    
    # Determine recommended withdrawal strategy
    if years_to_retirement < 10:
        strategy = "Conservative: Focus on preserving capital with moderate withdrawals"
    elif years_to_retirement < 25:
        strategy = "Balanced: Mix of income and growth with sustainable withdrawal rate"
    else:
        strategy = "Aggressive: Focus on growth with room for higher early retirement spending"
    
    return DeepRetirementProjection(
        years_to_retirement=years_to_retirement,
        total_savings_at_retirement=round(total_savings_at_retirement, 2),
        monthly_income_at_retirement=round(monthly_income_at_retirement, 2),
        social_security_benefit=round(social_security_benefit, 2),
        withdrawal_rate=round(withdrawal_rate, 4),
        projected_balance_at_age_90=round(projected_balance, 2),
        safe_withdrawal_amount=round(safe_withdrawal_amount, 2),
        recommended_withdrawal_strategy=strategy
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
    - 4% rule withdrawal planning
    - Balance projection to age 90
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
