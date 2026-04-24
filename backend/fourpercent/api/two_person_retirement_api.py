"""
Two-Person Retirement Planning API

This module provides retirement planning calculations for couples/households.
"""

from fastapi import FastAPI, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator
from typing import Optional, Dict, Any, List
import math


app = FastAPI(
    title="Four Percentor Two-Person Retirement API",
    version="3.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PersonInput(BaseModel):
    current_age: int = Field(..., ge=18, le=100)
    retirement_age: int = Field(..., ge=50, le=100)
    liquid_assets: float = Field(..., ge=0)
    illiquid_assets: Optional[float] = Field(default=0.0, ge=0)
    monthly_contribution: float = Field(..., ge=0)
    annual_return_rate: float = Field(..., ge=0, le=1)
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


class TwoPersonRetirementInput(BaseModel):
    husband: PersonInput
    spouse: PersonInput


class IndividualProjection(BaseModel):
    years_to_retirement: int
    retirement_age: int
    total_liquid_savings_at_retirement: float
    social_security_benefit: float


class YearlyProjection(BaseModel):
    age: int
    person1_liquid_savings: float
    person2_liquid_savings: float
    household_total_liquid_savings: float


class HouseholdProjection(BaseModel):
    years_to_retirement: int
    total_liquid_savings_at_retirement: float
    total_net_worth_at_retirement: float
    monthly_income_at_retirement: float
    combined_social_security_benefit: float
    safe_withdrawal_amount: float
    recommended_withdrawal_strategy: str
    projected_balance_at_age_90: Optional[float] = Field(default=0.0)
    inflation_adjusted_savings: Optional[float] = Field(default=0.0)
    years_to_depletion: Optional[float] = Field(default=0.0)
    monte_carlo_success_rate: Optional[float] = Field(default=0.0)
    yearly_projections: List[YearlyProjection]


def calculate_compound_growth(
    principal: float,
    monthly_contribution: float,
    annual_return_rate: float,
    years: int
) -> float:
    if years <= 0:
        return principal

    monthly_return_rate = annual_return_rate / 12
    total_months = years * 12

    future_value_current = principal * ((1 + monthly_return_rate) ** total_months)

    if monthly_return_rate > 0:
        future_value_contributions = (
            monthly_contribution *
            (((1 + monthly_return_rate) ** total_months - 1) / monthly_return_rate)
        )
    else:
        future_value_contributions = monthly_contribution * total_months

    return future_value_current + future_value_contributions


def calculate_yearly_projections(
    current_age: int,
    retirement_age: int,
    liquid_assets: float,
    monthly_contribution: float,
    annual_return_rate: float,
    end_age: int = 90
) -> List[YearlyProjection]:
    projections = []
    
    current_savings = liquid_assets
    current_year_age = current_age
    
    while current_year_age <= end_age:
        projections.append(YearlyProjection(
            age=current_year_age,
            person1_liquid_savings=round(current_savings, 2),
            person2_liquid_savings=0.0,
            household_total_liquid_savings=round(current_savings, 2)
        ))
        
        years_since_retirement = current_year_age - retirement_age
        if years_since_retirement > 0:
            monthly_return_rate = annual_return_rate / 12
            total_months = years_since_retirement * 12
            
            current_savings = (
                liquid_assets * ((1 + monthly_return_rate) ** total_months)
            )
            
            projected_balance = calculate_withdrawal_projection(
                total_savings=current_savings,
                annual_withdrawal=current_savings * 0.04,
                annual_return_rate=annual_return_rate,
                years=years_since_retirement
            )
            current_savings = projected_balance
        else:
            months_since_start = current_year_age - current_age
            monthly_return_rate = annual_return_rate / 12
            
            if monthly_return_rate > 0:
                future_value_contributions = (
                    monthly_contribution * 
                    (((1 + monthly_return_rate) ** (months_since_start * 12) - 1) / monthly_return_rate)
                )
            else:
                future_value_contributions = monthly_contribution * (months_since_start * 12)
            
            current_savings = liquid_assets * ((1 + monthly_return_rate) ** (months_since_start * 12)) + future_value_contributions
        
        current_year_age += 1
    
    return projections


def calculate_withdrawal_projection(
    total_savings: float,
    annual_withdrawal: float,
    annual_return_rate: float,
    years: int
) -> float:
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
    if claimed_age >= full_retirement_age:
        years_delayed = claimed_age - full_retirement_age
        benefit = full_retirement_age_benefit * (1 + 0.08 * max(0, years_delayed))
    else:
        months_early = (full_retirement_age - claimed_age) * 12
        reduction_rate = 0.05 / 12
        benefit = full_retirement_age_benefit * max(0.3, (1 - reduction_rate * months_early))

    return benefit


def calculate_individual_projection(person_data: PersonInput) -> IndividualProjection:
    years_to_retirement = person_data.retirement_age - person_data.current_age

    if years_to_retirement <= 0:
        raise ValueError("Retirement age must be greater than current age")

    total_liquid_savings_at_retirement = calculate_compound_growth(
        principal=person_data.liquid_assets,
        monthly_contribution=person_data.monthly_contribution,
        annual_return_rate=person_data.annual_return_rate,
        years=years_to_retirement
    )

    social_security_fra = 2500
    social_security_benefit = estimate_social_security_benefit(
        full_retirement_age_benefit=social_security_fra,
        claimed_age=person_data.social_security_age
    )

    return IndividualProjection(
        years_to_retirement=years_to_retirement,
        retirement_age=person_data.retirement_age,
        total_liquid_savings_at_retirement=round(total_liquid_savings_at_retirement, 2),
        social_security_benefit=round(social_security_benefit, 2)
    )


def calculate_yearly_projections_for_person(
    current_age: int,
    retirement_age: int,
    liquid_assets: float,
    monthly_contribution: float,
    annual_return_rate: float,
    end_age: int = 90
) -> List[Dict[str, Any]]:
    projections = []
    
    current_savings = liquid_assets
    
    for age in range(current_age, end_age + 1):
        if age < retirement_age:
            years_since_start = age - current_age
            monthly_return_rate = annual_return_rate / 12
            
            if monthly_return_rate > 0:
                future_value_contributions = (
                    monthly_contribution * 
                    (((1 + monthly_return_rate) ** (years_since_start * 12) - 1) / monthly_return_rate)
                )
            else:
                future_value_contributions = monthly_contribution * (years_since_start * 12)
            
            current_savings = (
                liquid_assets * ((1 + monthly_return_rate) ** (years_since_start * 12)) 
                + future_value_contributions
            )
        else:
            years_since_retirement = age - retirement_age
            
            projected_balance = calculate_withdrawal_projection(
                total_savings=liquid_assets,
                annual_withdrawal=liquid_assets * 0.04,
                annual_return_rate=annual_return_rate,
                years=years_since_retirement
            )
            current_savings = projected_balance
        
        projections.append({
            "age": age,
            "person_liquid_savings": round(current_savings, 2)
        })
    
    return projections


def merge_person_projections(
    person1_projections: List[Dict[str, Any]],
    person2_projections: List[Dict[str, Any]]
) -> List[YearlyProjection]:
    merged = []
    
    for i in range(len(person1_projections)):
        p1 = person1_projections[i]
        p2 = person2_projections[i] if i < len(person2_projections) else {"age": p1["age"], "person_liquid_savings": 0.0}
        
        merged.append(YearlyProjection(
            age=p1["age"],
            person1_liquid_savings=p1["person_liquid_savings"],
            person2_liquid_savings=p2["person_liquid_savings"],
            household_total_liquid_savings=round(p1["person_liquid_savings"] + p2["person_liquid_savings"], 2)
        ))
    
    return merged


def calculate_two_person_projection(input_data: TwoPersonRetirementInput) -> dict:
    try:
        husband_projection = calculate_individual_projection(input_data.husband)
        spouse_projection = calculate_individual_projection(input_data.spouse)

        total_liquid_savings = (
            husband_projection.total_liquid_savings_at_retirement +
            spouse_projection.total_liquid_savings_at_retirement
        )

        total_net_worth = total_liquid_savings + (
            (input_data.husband.illiquid_assets or 0) +
            (input_data.spouse.illiquid_assets or 0)
        )

        combined_social_security = (
            husband_projection.social_security_benefit +
            spouse_projection.social_security_benefit
        )

        safe_withdrawal_amount = total_liquid_savings * 0.04

        monthly_income_at_retirement = (
            (safe_withdrawal_amount / 12) +
            combined_social_security
        )

        years_to_retirement = max(
            husband_projection.years_to_retirement,
            spouse_projection.years_to_retirement
        )

        person1_projections = calculate_yearly_projections_for_person(
            current_age=input_data.husband.current_age,
            retirement_age=input_data.husband.retirement_age,
            liquid_assets=input_data.husband.liquid_assets,
            monthly_contribution=input_data.husband.monthly_contribution,
            annual_return_rate=input_data.husband.annual_return_rate
        )

        person2_projections = calculate_yearly_projections_for_person(
            current_age=input_data.spouse.current_age,
            retirement_age=input_data.spouse.retirement_age,
            liquid_assets=input_data.spouse.liquid_assets,
            monthly_contribution=input_data.spouse.monthly_contribution,
            annual_return_rate=input_data.spouse.annual_return_rate
        )

        yearly_projections = merge_person_projections(person1_projections, person2_projections)

        remaining_years = 90 - years_to_retirement - input_data.husband.current_age
        if remaining_years < 0:
            remaining_years = 90 - max(input_data.husband.retirement_age, input_data.spouse.retirement_age)

        projected_balance = calculate_withdrawal_projection(
            total_savings=total_liquid_savings,
            annual_withdrawal=safe_withdrawal_amount,
            annual_return_rate=input_data.husband.annual_return_rate,
            years=remaining_years
        )

        withdrawal_rate = safe_withdrawal_amount / total_liquid_savings if total_liquid_savings > 0 else 0

        if years_to_retirement < 10:
            strategy = "Conservative: Focus on preserving capital with moderate withdrawals"
        elif years_to_retirement < 25:
            strategy = "Balanced: Mix of income and growth with sustainable withdrawal rate"
        else:
            strategy = "Aggressive: Focus on growth with room for higher early retirement spending"

        inflation_rate = 0.03
        inflation_adjusted_savings = total_liquid_savings / ((1 + inflation_rate) ** years_to_retirement)

        years_to_depletion = None
        if total_liquid_savings > 0 and safe_withdrawal_amount > 0:
            years_to_depletion = max(0, total_liquid_savings / safe_withdrawal_amount)

        monte_carlo_success_rate = 0.0

        household_projection = HouseholdProjection(
            years_to_retirement=years_to_retirement,
            total_liquid_savings_at_retirement=round(total_liquid_savings, 2),
            total_net_worth_at_retirement=round(total_net_worth, 2),
            monthly_income_at_retirement=round(monthly_income_at_retirement, 2),
            combined_social_security_benefit=round(combined_social_security, 2),
            safe_withdrawal_amount=round(safe_withdrawal_amount, 2),
            recommended_withdrawal_strategy=strategy,
            projected_balance_at_age_90=round(projected_balance, 2),
            inflation_adjusted_savings=round(inflation_adjusted_savings, 2),
            years_to_depletion=years_to_depletion,
            monte_carlo_success_rate=monte_carlo_success_rate,
            yearly_projections=yearly_projections
        )

        return {
            "husband_projection": husband_projection.model_dump(),
            "spouse_projection": spouse_projection.model_dump(),
            "household_projection": household_projection.model_dump()
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing two-person retirement calculation: {str(e)}"
        )


@app.post("/calculate", response_model=dict)
async def calculate_two_person_retirement_plan(request: TwoPersonRetirementInput):
    """
    Calculate comprehensive two-person retirement plan with combined household metrics.

    Features:
    - Individual projections for both husband and spouse
    - Combined household financial summary
    - Social Security benefits integration for both persons
    - 4% rule withdrawal planning
    - Balance projection to age 90
    - Personalized withdrawal strategy recommendation
    """
    try:
        return calculate_two_person_projection(request)

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing retirement calculation: {str(e)}"
        )


@app.get("/health")
async def two_person_retirement_health():
    return {"status": "healthy", "service": "two-person-retirement-api"}


@app.get("/")
async def root():
    return {
        "message": "Four Percentor Two-Person Retirement API is running",
        "version": "3.0.0",
        "endpoints": [
            "/retirement/calculate - Calculate two-person retirement projections",
            "/health - Health check"
        ]
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
