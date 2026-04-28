from pydantic import BaseModel
from typing import Optional, List


class MortgageData(BaseModel):
    """Mortgage debt information"""
    balance: Optional[float] = None
    interest_rate: Optional[float] = None
    monthly_payment: Optional[float] = None
    remaining_months: Optional[int] = None


class AutoLoanData(BaseModel):
    """Auto loan debt information"""
    balance: Optional[float] = None
    interest_rate: Optional[float] = None
    monthly_payment: Optional[float] = None
    remaining_months: Optional[int] = None


class CreditCardData(BaseModel):
    """Credit card debt information"""
    total_balance: Optional[float] = None
    avg_apr: Optional[float] = None
    min_payment_pct: Optional[float] = None


class StudentLoanData(BaseModel):
    """Student loan debt information"""
    balance: Optional[float] = None
    monthly_payment: Optional[float] = None
    income_driven_plan: Optional[bool] = None


class DebtInput(BaseModel):
    """Debt data for retirement calculation"""
    mortgage: Optional[MortgageData] = None
    auto_loans: Optional[List[AutoLoanData]] = None
    credit_cards: Optional[CreditCardData] = None
    student_loans: Optional[StudentLoanData] = None


class DebtOutput(BaseModel):
    """Debt-related outputs from retirement calculation"""
    total_debt: float = 0.0
    monthly_debt_service: float = 0.0
    debt_to_income_ratio: float = 0.0
    estimated_debt_free_year: Optional[int] = None