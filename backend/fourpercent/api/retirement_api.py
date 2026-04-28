from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

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
async def calculate_retirement_v4(input_data: RetirementInput):
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

    Returns detailed projection results including:
    - Annual portfolio balance projections
    - Income vs expenses timeline
    - Success metrics
    - Key statistics
    """
    try:
        result = calculate_retirement(input_data)
        return result
    except ValueError as e:
        # Provide more specific error details for validation issues
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
