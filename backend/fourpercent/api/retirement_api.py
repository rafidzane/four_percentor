from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any

from fourpercent.models.root import RetirementInput, RetirementResponse
from fourpercent.calculation.retirement_v4 import calculate_retirement

router = APIRouter()


class HealthCheck(BaseModel):
    status: str


@router.get("/health", response_model=HealthCheck)
async def health_check():
    """Health check endpoint"""
    return {"status": "ok"}


@router.post("/retirement", response_model=RetirementResponse)
async def calculate_retirement_v4(input_data: Dict[str, Any]):
    """
    Calculate comprehensive retirement projection.

    This endpoint accepts a comprehensive input specification with:
    - Timeline information (current age, retirement age, years in retirement)
    - Current assets (portfolio balances, contributions)
    - Portfolio allocation and returns settings
    - Spending strategy (4% rule or manual withdrawal)
    - Optional income streams (Social Security, pensions, benefits)
    - Optional real estate equity
    - Optional education expenses

    This endpoint is more resilient to frontend data inconsistencies:
    - Handles None values in optional fields gracefully (net_annual_income, until_age)
    - Accepts incomplete optional sections from frontend forms
    - Provides sensible defaults for missing numeric fields
    - Automatically skips properties with missing or null values in calculations

    Returns detailed projection results including:
    - Annual portfolio balance projections
    - Income vs expenses timeline
    - Success metrics
    - Key statistics
    """
    try:
        # Log the raw input to help identify validation issues
        print(f"Raw input data received: {input_data}")
        
        # Try to validate and create the proper RetirementInput model
        retirement_input = RetirementInput(**input_data)
        print(f"Successfully parsed into RetirementInput model")
        
        result = calculate_retirement(retirement_input)
        return result
    except ValueError as e:
        # Provide more specific error details for validation issues
        print(f"Validation error caught: {str(e)}")
        raise HTTPException(status_code=422, detail=f"Validation error: {str(e)}")
    except Exception as e:
        # Log the full exception for debugging
        print(f"Calculation error: {e}")
        raise HTTPException(status_code=500, detail=f"Calculation error: {str(e)}")


@router.get("/retirement/schema")
async def get_retirement_schema():
    """
    Get the retirement input schema for documentation purposes.

    Returns Pydantic model schemas for all input and output types.
    """
    return {
        "input_schema": RetirementInput.schema(),
        "output_schema": RetirementResponse.schema()
    }


@router.post("/retirement/dashboard")
async def get_retirement_dashboard_data(input_data: RetirementInput):
    """
    Get retirement dashboard data for visualization purposes.
    
    This endpoint returns structured data suitable for the retirement dashboard charts:
    - Portfolio Value Over Time
    - Income vs Expenses
    
    Returns detailed projection results in a format optimized for charting libraries.
    """
    try:
        # Reuse the existing calculation function to get all retirement data
        result = calculate_retirement(input_data)
        
        # Extract and restructure data for dashboard charts
        # Based on the retirement calculation structure, we need to transform
        # the data into timeline-based arrays for charting
        
        # Portfolio value over time data (simplified structure)
        portfolio_data = []
        if hasattr(result, 'portfolio_projection') and result.portfolio_projection:
            for item in result.portfolio_projection:
                # Transform the data structure to be chart-friendly
                portfolio_data.append({
                    "year": item.year,
                    "portfolioValue": item.portfolio_value  # Using camelCase as per API conventions
                })
        
        # Income vs expenses data (simplified structure)
        income_expense_data = []
        if hasattr(result, 'income_expense_projection') and result.income_expense_projection:
            for item in result.income_expense_projection:
                # Transform the data structure to be chart-friendly
                income_expense_data.append({
                    "year": item.year,
                    "income": item.income,
                    "expenses": item.expenses
                })
        
        return {
            "portfolio": portfolio_data,
            "incomeVsExpenses": income_expense_data,
            "summary": {
                "successRate": result.success_rate,
                "finalPortfolioValue": result.final_portfolio_value,
                "yearsOfRetirement": result.years_in_retirement
            }
        }
    except ValueError as e:
        # Provide more specific error details for validation issues
        raise HTTPException(status_code=422, detail=f"Validation error: {str(e)}")
    except Exception as e:
        # Log the full exception for debugging
        print(f"Calculation error: {e}")
        raise HTTPException(status_code=500, detail=f"Calculation error: {str(e)}")
