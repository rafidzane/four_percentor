"""
Retirement V4 Calculation Engine

This module provides the core calculation logic for the comprehensive retirement planner.
It handles timeline validation, portfolio projection, income streams, and expense calculations.
"""

from typing import Optional
import math

from fourpercent.models.root import RetirementInput, RetirementResponse


class RetirementCalculator:
    """Main calculator class for retirement projections"""

    def __init__(self, input_data: RetirementInput):
        self.input = input_data

    def calculate_projection(self) -> RetirementResponse:
        """
        Calculate retirement projection based on input parameters.

        Returns RetirementResponse with annual balances and metrics.
        """
        timeline = self.input.timeline
        current_age = timeline.current_age
        retirement_age = timeline.retirement_age
        years_in_retirement = timeline.years_in_retirement

        # Calculate end age (based on spouse if younger, otherwise standard)
        end_age = current_age + years_in_retirement
        
        # Get portfolio data
        assets = self.input.current_assets
        portfolio_balance = (
            assets.investment_portfolio +
            assets.your_401k_ira +
            assets.spouse_401k_ira
        )
        
        yearly_contribution = assets.yearly_contribution
        contribution_growth = assets.yearly_contribution_increase_pct / 100
        
        # Get portfolio returns
        portfolio = self.input.portfolio_allocation
        equity_return_pre = portfolio.equity_return_pre_retirement_pct / 100
        equity_return_post = portfolio.equity_return_post_retirement_pct / 100
        fixed_income_return = portfolio.fixed_income_return_pct / 100
        inflation_rate = portfolio.inflation_rate_pct / 100
        
        # Calculate asset allocation returns
        pre_retirement_return = (
            (portfolio.equity_pct / 100) * equity_return_pre +
            (portfolio.fixed_income_pct / 100) * fixed_income_return
        )
        
        post_retirement_return = (
            (portfolio.equity_pct / 100) * equity_return_post +
            (portfolio.fixed_income_pct / 100) * fixed_income_return
        )
        
        # Calculate spending
        spending = self.input.retirement_spending
        spending_mode = spending.spending_mode

        # Handle two-period spending mode
        if spending.two_period_mode:
            # Validate that all period fields are provided when two_period_mode is enabled
            if (spending.period_1_start_age is None or spending.period_1_end_age is None or
                spending.period_1_withdrawal_pct is None or spending.period_2_start_age is None or
                spending.period_2_end_age is None or spending.period_2_withdrawal_pct is None):
                raise ValueError("All two-period fields must be provided when two_period_mode is enabled")

            # For now, we'll use the withdrawal percentages as defined in each period
            # This will be handled during the year-by-year calculation
        else:
            if spending_mode == "four_pct_rule":
                first_year_withdrawal = portfolio_balance * 0.04
            else:
                first_year_withdrawal = spending.first_year_expenses

        # Initialize arrays for results
        ages = []
        balances = []
        net_cash_flows = []
        expenses_list = []

        current_contribution = yearly_contribution
        current_spending = first_year_withdrawal

        for year in range(current_age, end_age + 1):
            ages.append(year)

            if year < retirement_age:
                # Pre-retirement: add contributions, earn returns
                starting_balance = portfolio_balance
                portfolio_balance += current_contribution
                portfolio_balance *= (1 + pre_retirement_return)

                current_contribution *= (1 + contribution_growth)
                current_spending *= (1 + inflation_rate)  # Adjust for inflation

                # Calculate cash flow using starting balance
                annual_cash_flow = self._calculate_yearly_income(year, starting_balance, False)
            else:
                # Post-retirement: withdraw expenses, earn post-retirement returns
                starting_balance = portfolio_balance

                # Handle two-period spending logic
                if spending.two_period_mode:
                    # Determine which period we're in and set appropriate spending
                    if year >= spending.period_1_start_age and year <= spending.period_1_end_age:
                        # In period 1 - use period 1 withdrawal rate
                        current_spending = portfolio_balance * (spending.period_1_withdrawal_pct / 100)
                    elif year >= spending.period_2_start_age and year <= spending.period_2_end_age:
                        # In period 2 - use period 2 withdrawal rate
                        current_spending = portfolio_balance * (spending.period_2_withdrawal_pct / 100)
                    else:
                        # Year is outside both periods - should not happen, but for safety
                        current_spending = portfolio_balance * (spending.withdrawal_pct / 100) if spending.spending_mode == "four_pct_rule" else spending.first_year_expenses
                else:
                    # Single period spending logic
                    current_spending = portfolio_balance * (spending.withdrawal_pct / 100) if spending.spending_mode == "four_pct_rule" else spending.first_year_expenses

                portfolio_balance -= current_spending
                portfolio_balance *= (1 + post_retirement_return)

                # Adjust spending for inflation each year (only applies to period withdrawal rates)
                # Note: In a more sophisticated model, we might adjust the percentage rates for inflation as well
                # For now, just adjusting the absolute amount by inflation rate
                if spending.two_period_mode:
                    # For two-period mode, we're already calculating the right withdrawal amounts based on portfolio value each year
                    pass
                else:
                    current_spending *= (1 + inflation_rate)

                # Calculate cash flow using starting balance
                annual_cash_flow = self._calculate_yearly_income(year, starting_balance, True)

            balances.append(portfolio_balance)
            net_cash_flows.append(annual_cash_flow)
            expenses_list.append(current_spending)
        
        # Determine success (portfolio > 0 throughout)
        success = all(b >= 0 for b in balances)
        
        if not success and len(balances) > 0:
            year_of_depletion = next((i + current_age for i, b in enumerate(balances) if b < 0), None)
        else:
            year_of_depletion = None

        return RetirementResponse(
            age=ages,
            portfolio_balance=balances,
            net_cash_flows=net_cash_flows,
            expenses=expenses_list,
            success=success,
            success_probability=None,  # Would need Monte Carlo for this
            year_of_depletion=year_of_depletion,
            final_balance=balances[-1] if balances else 0,
            avg_balance=sum(balances) / len(balances) if balances else 0,
            max_balance=max(balances) if balances else 0,
            min_balance=min(balances) if balances else 0
        )
    
    def _calculate_yearly_income(
        self, age: int, portfolio_balance: float, is_retired: bool
    ) -> float:
        """Calculate net cash flow for a given year.

        Pre-retirement: returns + contributions
        Post-retirement: returns - withdrawals

        Args:
            age: Current age
            portfolio_balance: Starting balance for this year
            is_retired: Whether we're in retirement phase

        Returns:
            Net cash flow (positive = net gain, negative = net loss)
        """
        if portfolio_balance <= 0:
            return 0.0

        timeline = self.input.timeline
        assets = self.input.current_assets
        portfolio = self.input.portfolio_allocation

        # Calculate pre-retirement return rate
        pre_retirement_return = (
            (portfolio.equity_pct / 100) * (portfolio.equity_return_pre_retirement_pct / 100)
            + (portfolio.fixed_income_pct / 100) * (portfolio.fixed_income_return_pct / 100)
        )

        # Calculate post-retirement return rate
        post_retirement_return = (
            (portfolio.equity_pct / 100) * (portfolio.equity_return_post_retirement_pct / 100)
            + (portfolio.fixed_income_pct / 100) * (portfolio.fixed_income_return_pct / 100)
        )

        # Calculate returns on portfolio
        if is_retired:
            return_rate = post_retirement_return
        else:
            return_rate = pre_retirement_return

        returns = portfolio_balance * return_rate

        if not is_retired:
            # Pre-retirement: add contributions
            contribution = assets.yearly_contribution
            cash_flow = returns + contribution
        else:
            # Post-retirement: subtract withdrawals based on spending config
            withdrawal = self._calculate_withdrawal(age, portfolio_balance)
            cash_flow = returns - withdrawal

        return cash_flow

    def _calculate_withdrawal(self, age: int, portfolio_balance: float) -> float:
        """Calculate withdrawal amount for a given year."""
        spending = self.input.retirement_spending

        if spending.two_period_mode:
            # Determine which period we're in
            if (spending.period_1_start_age is not None and spending.period_1_end_age is not None
                and age >= spending.period_1_start_age and age <= spending.period_1_end_age):
                withdrawal_pct = spending.period_1_withdrawal_pct
            elif (spending.period_2_start_age is not None and spending.period_2_end_age is not None
                  and age >= spending.period_2_start_age and age <= spending.period_2_end_age):
                withdrawal_pct = spending.period_2_withdrawal_pct
            else:
                # Fallback to standard calculation
                withdrawal_pct = spending.withdrawal_pct if hasattr(spending, 'withdrawal_pct') else 4.0
        else:
            # Single period spending
            if spending.spending_mode == "four_pct_rule":
                withdrawal_pct = 4.0
            elif hasattr(spending, 'withdrawal_pct') and spending.withdrawal_pct is not None:
                withdrawal_pct = spending.withdrawal_pct
            else:
                # Fallback: use first_year_expenses as dollar amount or percentage
                if hasattr(spending, 'first_year_expenses') and spending.first_year_expenses is not None:
                    # If first_year_expenses is set, we need to convert to percentage
                    withdrawal_pct = (spending.first_year_expenses / portfolio_balance) * 100
                else:
                    withdrawal_pct = 4.0

        return portfolio_balance * (withdrawal_pct / 100)
    
    def validate_inputs(self) -> tuple[bool, list[str]]:
        """Validate input data and return (is_valid, error_messages)"""
        errors = []

        # Validate equity + fixed income = 100
        portfolio = self.input.portfolio_allocation
        if abs(portfolio.equity_pct + portfolio.fixed_income_pct - 100.0) > 0.01:
            errors.append("Equity and fixed income percentages must sum to 100%")

        # Validate ages
        timeline = self.input.timeline
        if timeline.current_age >= timeline.retirement_age:
            errors.append("Retirement age must be greater than current age")

        if timeline.retirement_age + timeline.years_in_retirement > 120:
            errors.append("Projection period exceeds reasonable limits (max 120 years)")

        # Validate spending inputs
        spending = self.input.retirement_spending
        if spending.two_period_mode:
            # Validate all two-period fields are provided
            if (spending.period_1_start_age is None or spending.period_1_end_age is None or
                spending.period_1_withdrawal_pct is None or spending.period_2_start_age is None or
                spending.period_2_end_age is None or spending.period_2_withdrawal_pct is None):
                errors.append("All two-period fields must be provided when two_period_mode is enabled")

            # Validate age ranges make sense for two-period mode
            if (spending.period_1_start_age is not None and spending.period_1_end_age is not None and
                spending.period_1_end_age < spending.period_1_start_age):
                errors.append("Period 1 end age must be greater than or equal to period 1 start age")

            if (spending.period_2_start_age is not None and spending.period_2_end_age is not None and
                spending.period_2_end_age < spending.period_2_start_age):
                errors.append("Period 2 end age must be greater than or equal to period 2 start age")

            # Validate that periods are properly ordered (period 1 should end before period 2 starts)
            if (spending.period_1_end_age is not None and spending.period_2_start_age is not None and
                spending.period_1_end_age >= spending.period_2_start_age):
                errors.append("Period 1 must end before period 2 starts")

        return len(errors) == 0, errors


def calculate_retirement(input_data: RetirementInput) -> RetirementResponse:
    """Convenience function to run retirement calculation"""
    calculator = RetirementCalculator(input_data)
    
    # Validate inputs
    is_valid, errors = calculator.validate_inputs()
    if not is_valid:
        raise ValueError(f"Invalid input data: {', '.join(errors)}")
    
    return calculator.calculate_projection()
