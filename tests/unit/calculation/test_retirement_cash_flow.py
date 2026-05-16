"""
Unit tests for retirement cash flow calculations.
Tests _calculate_yearly_income function behavior.
"""

import pytest

from fourpercent.models.root import RetirementInput
from fourpercent.calculation.retirement_v4 import RetirementCalculator


class TestPreRetirementCashFlow:
    """Test cash flow calculations during pre-retirement years."""

    def test_pre_retirement_cash_flow_returns_plus_contributions(self):
        """Verify cash flow = portfolio returns + contributions."""
        # Setup: Create input with known values
        input_data = {
            "timeline": {
                "current_age": 35,
                "retirement_age": 65,
                "years_in_retirement": 30
            },
            "current_assets": {
                "investment_portfolio": 100000,
                "your_401k_ira": 50000,
                "spouse_401k_ira": 0,
                "yearly_contribution": 10000,
                "yearly_contribution_increase_pct": 0.0,
                "catch_up_eligible": False
            },
            "portfolio_allocation": {
                "equity_pct": 70.0,
                "fixed_income_pct": 30.0,
                "equity_return_pre_retirement_pct": 8.0,
                "fixed_income_return_pct": 3.0,
                "equity_return_post_retirement_pct": 5.0,
                "inflation_rate_pct": 2.5
            },
            "retirement_spending": {
                "spending_mode": "four_pct_rule",
                "first_year_expenses": 0.0,
                "withdrawal_pct": 4.0,
                "age_range_start": 65,
                "age_range_end": 95,
                "adjust_for_inflation": True,
                "two_period_mode": False
            }
        }

        # Calculate expected returns: (100k * 70% * 8%) + (100k * 30% * 3%) = 5600 + 900 = 6500
        expected_return = 6500.0
        expected_contribution = 10000.0
        expected_cash_flow = expected_return + expected_contribution

        # Create input model (convert dict to model)
        retirement_input = RetirementInput(**input_data)

        # Call _calculate_yearly_income and verify result
        calculator = RetirementCalculator(retirement_input)
        cash_flow = calculator._calculate_yearly_income(35, 100000.0, is_retired=False)

        assert abs(cash_flow - expected_cash_flow) < 0.01


class TestPostRetirementCashFlow:
    """Test cash flow calculations during post-retirement years."""

    def test_post_retirement_cash_flow_returns_minus_withdrawals(self):
        """Verify cash flow = portfolio returns - withdrawals."""
        # Setup: Create input in retirement phase
        input_data = {
            "timeline": {
                "current_age": 65,
                "retirement_age": 65,
                "years_in_retirement": 30
            },
            "current_assets": {
                "investment_portfolio": 1000000,
                "your_401k_ira": 0,
                "spouse_401k_ira": 0,
                "yearly_contribution": 0,
                "yearly_contribution_increase_pct": 0.0,
                "catch_up_eligible": False
            },
            "portfolio_allocation": {
                "equity_pct": 60.0,
                "fixed_income_pct": 40.0,
                "equity_return_pre_retirement_pct": 7.0,
                "fixed_income_return_pct": 3.0,
                "equity_return_post_retirement_pct": 5.0,
                "inflation_rate_pct": 2.5
            },
            "retirement_spending": {
                "spending_mode": "four_pct_rule",
                "first_year_expenses": 0.0,
                "withdrawal_pct": 4.0,
                "age_range_start": 65,
                "age_range_end": 95,
                "adjust_for_inflation": True,
                "two_period_mode": False
            }
        }

        retirement_input = RetirementInput(**input_data)
        calculator = RetirementCalculator(retirement_input)

        # For age 65 (retirement start), with $1M balance:
        # Returns: (1M * 60% * 5%) + (1M * 40% * 3%) = 30,000 + 12,000 = 42,000
        # Withdrawal (4% rule): 1M * 4% = 40,000
        # Cash flow: 42,000 - 40,000 = 2,000

        starting_balance = 1000000.0
        cash_flow = calculator._calculate_yearly_income(65, starting_balance, is_retired=True)

        expected_return = 42000.0
        expected_withdrawal = 40000.0
        expected_cash_flow = expected_return - expected_withdrawal

        assert abs(cash_flow - expected_cash_flow) < 0.01


class TestEdgeCases:
    """Test edge cases for cash flow calculations."""

    def test_zero_balance_returns_zero_cash_flow(self):
        """Verify that zero portfolio balance returns zero cash flow."""
        input_data = {
            "timeline": {
                "current_age": 65,
                "retirement_age": 65,
                "years_in_retirement": 30
            },
            "current_assets": {
                "investment_portfolio": 1000000,
                "your_401k_ira": 0,
                "spouse_401k_ira": 0,
                "yearly_contribution": 0,
                "yearly_contribution_increase_pct": 0.0,
                "catch_up_eligible": False
            },
            "portfolio_allocation": {
                "equity_pct": 60.0,
                "fixed_income_pct": 40.0,
                "equity_return_pre_retirement_pct": 7.0,
                "fixed_income_return_pct": 3.0,
                "equity_return_post_retirement_pct": 5.0,
                "inflation_rate_pct": 2.5
            },
            "retirement_spending": {
                "spending_mode": "four_pct_rule",
                "first_year_expenses": 0.0,
                "withdrawal_pct": 4.0,
                "age_range_start": 65,
                "age_range_end": 95,
                "adjust_for_inflation": True,
                "two_period_mode": False
            }
        }

        retirement_input = RetirementInput(**input_data)
        calculator = RetirementCalculator(retirement_input)

        # Zero balance should return zero cash flow
        cash_flow = calculator._calculate_yearly_income(65, 0.0, is_retired=True)

        assert cash_flow == 0.0

    def test_negative_balance_returns_zero_cash_flow(self):
        """Verify that negative portfolio balance returns zero cash flow."""
        input_data = {
            "timeline": {
                "current_age": 65,
                "retirement_age": 65,
                "years_in_retirement": 30
            },
            "current_assets": {
                "investment_portfolio": 1000000,
                "your_401k_ira": 0,
                "spouse_401k_ira": 0,
                "yearly_contribution": 0,
                "yearly_contribution_increase_pct": 0.0,
                "catch_up_eligible": False
            },
            "portfolio_allocation": {
                "equity_pct": 60.0,
                "fixed_income_pct": 40.0,
                "equity_return_pre_retirement_pct": 7.0,
                "fixed_income_return_pct": 3.0,
                "equity_return_post_retirement_pct": 5.0,
                "inflation_rate_pct": 2.5
            },
            "retirement_spending": {
                "spending_mode": "four_pct_rule",
                "first_year_expenses": 0.0,
                "withdrawal_pct": 4.0,
                "age_range_start": 65,
                "age_range_end": 95,
                "adjust_for_inflation": True,
                "two_period_mode": False
            }
        }

        retirement_input = RetirementInput(**input_data)
        calculator = RetirementCalculator(retirement_input)

        # Negative balance should return zero cash flow
        cash_flow = calculator._calculate_yearly_income(65, -1000.0, is_retired=True)

        assert cash_flow == 0.0
