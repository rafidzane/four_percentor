from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional
import uvicorn

# Create a new app instance for retirement API
app = FastAPI(
    title="Four Percentor Retirement API",
    version="1.0.0"
)

# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request and response
class IncomeAssets(BaseModel):
    social_security: bool = Field(default=False)
    spouse_social_security: bool = Field(default=False)
    real_estate_primary: bool = Field(default=False)
    real_estate_investment: bool = Field(default=False)

class RetirementCalculationRequest(BaseModel):
    current_age: int = Field(..., ge=0, le=150)
    retirement_age: int = Field(..., ge=0, le=150)
    current_savings: float = Field(..., ge=0)
    annual_contribution: float = Field(..., ge=0)
    annual_return: float = Field(..., ge=0, le=20)
    inflation_rate: float = Field(..., ge=0, le=10)
    monthly_withdrawal: float = Field(..., ge=0)

class RetirementCalculationResponse(BaseModel):
    final_savings: float
    annual_withdrawal: float
    withdrawal_with_inflation: float
    years_to_depletion: Optional[float]

# API endpoint for retirement calculation
@app.post("/fourpercentor/calculate", response_model=RetirementCalculationResponse)
async def calculate_retirement_plan(request: RetirementCalculationRequest):
    """
    Calculate retirement plan based on user inputs
    """
    try:
        # Validate age relationships
        if request.current_age > request.retirement_age:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Current age cannot be greater than retirement age"
            )
        
        # Simple retirement calculation logic
        years_to_retirement = max(0, request.retirement_age - request.current_age)
        
        if years_to_retirement <= 0:
            # If already retired or age is invalid, return basic values
            final_savings = request.current_savings
            annual_withdrawal = request.monthly_withdrawal * 12
            withdrawal_with_inflation = annual_withdrawal
            years_to_depletion = None
        else:
            # Future value of current savings with compound interest
            future_value_savings = request.current_savings * (1 + request.annual_return / 100) ** years_to_retirement
            
            # Future value of annuity (annual contributions)
            if request.annual_return > 0:
                future_value_contributions = request.annual_contribution * \
                    ((1 + request.annual_return / 100) ** years_to_retirement - 1) / (request.annual_return / 100)
            else:
                # If no return, just add contributions
                future_value_contributions = request.annual_contribution * years_to_retirement
            
            final_savings = future_value_savings + future_value_contributions
            
            # Calculate annual withdrawal amount
            annual_withdrawal = request.monthly_withdrawal * 12
            
            # Adjust for inflation
            withdrawal_with_inflation = annual_withdrawal * (1 + request.inflation_rate / 100) ** years_to_retirement
            
            # Simple calculation for years to depletion (simplified)
            years_to_depletion = None
            if final_savings > 0 and annual_withdrawal > 0:
                # Simplified calculation - in reality this would be more complex
                years_to_depletion = max(0, final_savings / annual_withdrawal)

        result = {
            "final_savings": final_savings,
            "annual_withdrawal": annual_withdrawal,
            "withdrawal_with_inflation": withdrawal_with_inflation,
            "years_to_depletion": years_to_depletion
        }
        
        return result
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing retirement calculation: {str(e)}"
        )

@app.get("/")
async def root():
    return {"message": "Four Percentor Retirement API is running"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)