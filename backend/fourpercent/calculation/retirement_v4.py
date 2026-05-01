"""
Retirement V4 Calculation Engine

This module provides the core calculation logic for the comprehensive retirement planner.
It handles timeline validation, portfolio projection, income streams, and expense calculations.
"""

from typing import Optional
import math

from fourpercent.models.root import RetirementInput, RetirementResponse
from fourpercent.models.health import HealthDataOutput
from fourpercent.models.debt import DebtOutput


class RetirementCalculator:
    """Main calculator class for retirement projections"""

    def __init__(self, input_data: RetirementInput):
        self.input = input_data
        self.health_output = self._calculate_health_adjustments()
        self.debt_output = self._calculate_debt_adjustments()
    
    def calculate_projection(self) -> RetirementResponse:
        """
        Calculate retirement projection based on input parameters.

        Returns RetirementResponse with annual balances and metrics.
        """
        timeline = self.input.timeline
        current_age = timeline.current_age
        retirement_age = timeline.retirement_age
        years_in_retirement = timeline.years_in_retirement

        # Apply health adjustments to the retirement period
        adjusted_years_in_retirement = self.health_output.adjusted_years_in_retirement or years_in_retirement

        # Calculate end age (based on spouse if younger, otherwise standard)
        end_age = current_age + adjusted_years_in_retirement
        
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
        incomes = []
        expenses_list = []
        net_incomes = []

        current_contribution = yearly_contribution
        current_spending = first_year_withdrawal
        
        for year in range(current_age, end_age + 1):
            ages.append(year)

            if year < retirement_age:
                # Pre-retirement: add contributions, earn returns
                portfolio_balance += current_contribution
                portfolio_balance *= (1 + pre_retirement_return)

                current_contribution *= (1 + contribution_growth)
                current_spending *= (1 + inflation_rate)  # Adjust for inflation

            else:
                # Post-retirement: withdraw expenses, earn post-retirement returns
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

            balances.append(portfolio_balance)

            # Calculate income and expenses
            annual_income = self._calculate_yearly_income(year)
            annual_expenses = current_spending

            incomes.append(annual_income)
            expenses_list.append(annual_expenses)
            net_incomes.append(annual_income - annual_expenses)
        
        # Determine success (portfolio > 0 throughout)
        success = all(b >= 0 for b in balances)
        
        if not success and len(balances) > 0:
            year_of_depletion = next((i + current_age for i, b in enumerate(balances) if b < 0), None)
        else:
            year_of_depletion = None
        
        return RetirementResponse(
            age=ages,
            portfolio_balance=balances,
            income=incomes,
            expenses=expenses_list,
            net_income=net_incomes,
            success=success,
            success_probability=None,  # Would need Monte Carlo for this
            year_of_depletion=year_of_depletion,
            final_balance=balances[-1] if balances else 0,
            avg_balance=sum(balances) / len(balances) if balances else 0,
            max_balance=max(balances) if balances else 0,
            min_balance=min(balances) if balances else 0,
            total_debt=self.debt_output.total_debt,
            monthly_debt_service=self.debt_output.monthly_debt_service,
            debt_to_income_ratio=self.debt_output.debt_to_income_ratio
        )
    
    def _calculate_health_adjustments(self) -> HealthDataOutput:
        """Calculate health-based adjustments to retirement planning"""
        health_data = self.input.health_data

        # Default values
        longevity_multiplier = 1.0
        healthcare_cost_multiplier = 1.0
        adjusted_years_in_retirement = 0

        if health_data and health_data.health_status:
            # Apply longevity multipliers based on health status
            health_multipliers = {
                "excellent": 1.12,
                "good": 1.08,
                "average": 1.00,
                "fair": 0.96,
                "poor": 0.92
            }

            longevity_multiplier = health_multipliers.get(health_data.health_status, 1.0)

        # Apply healthcare cost escalation multipliers
        if health_data and health_data.healthcare_cost_escalation:
            escalation_multipliers = {
                "normal": 1.0,
                "high": 1.03,
                "very_high": 1.05
            }

            healthcare_cost_multiplier = escalation_multipliers.get(health_data.healthcare_cost_escalation, 1.0)

        # If user provided custom expected lifespan, adjust years_in_retirement accordingly
        if health_data and health_data.expected_lifespan:
            timeline = self.input.timeline
            base_years = timeline.years_in_retirement
            # Calculate difference from baseline (assumed baseline of 30 years)
            expected_years = health_data.expected_lifespan - timeline.current_age
            adjusted_years_in_retirement = max(1, min(expected_years, 50))  # Keep reasonable bounds

        return HealthDataOutput(
            longevity_multiplier=longevity_multiplier,
            healthcare_cost_multiplier=healthcare_cost_multiplier,
            adjusted_years_in_retirement=adjusted_years_in_retirement
        )

    def _calculate_debt_adjustments(self) -> DebtOutput:
        """Calculate debt-related adjustments to retirement planning"""
        debt_data = self.input.debt

        # Default values
        total_debt = 0.0
        monthly_debt_service = 0.0
        debt_to_income_ratio = 0.0
        estimated_debt_free_year = None

        if debt_data:
            # Calculate total debt from all sources
            if debt_data.mortgage and debt_data.mortgage.balance:
                total_debt += debt_data.mortgage.balance or 0.0

            if debt_data.auto_loans:
                for loan in debt_data.auto_loans:
                    if loan.balance:
                        total_debt += loan.balance

            if debt_data.credit_cards and debt_data.credit_cards.total_balance:
                total_debt += debt_data.credit_cards.total_balance or 0.0

            if debt_data.student_loans and debt_data.student_loans.balance:
                total_debt += debt_data.student_loans.balance or 0.0

            # Calculate monthly debt service
            if debt_data.mortgage and debt_data.mortgage.monthly_payment:
                monthly_debt_service += debt_data.mortgage.monthly_payment or 0.0

            if debt_data.auto_loans:
                for loan in debt_data.auto_loans:
                    if loan.monthly_payment:
                        monthly_debt_service += loan.monthly_payment

            if debt_data.credit_cards and debt_data.credit_cards.total_balance:
                # Estimate minimum payment as 2-3% of balance
                min_payment_pct = debt_data.credit_cards.min_payment_pct or 2.5
                credit_card_min_payment = (debt_data.credit_cards.total_balance * min_payment_pct / 100) / 12
                monthly_debt_service += credit_card_min_payment

            if debt_data.student_loans and debt_data.student_loans.monthly_payment:
                monthly_debt_service += debt_data.student_loans.monthly_payment or 0.0

            # Calculate debt-to-income ratio (simplified - using current income)
            # In a real implementation, we'd use projected retirement income
            if total_debt > 0:
                # For now, estimate debt service as a percentage of total assets
                # This is a placeholder that would be improved in a more sophisticated model
                total_assets = (
                    self.input.current_assets.investment_portfolio +
                    self.input.current_assets.your_401k_ira +
                    self.input.current_assets.spouse_401k_ira
                )

                if total_assets > 0:
                    debt_to_income_ratio = monthly_debt_service / (total_assets / 12) if total_assets > 0 else 0.0

        return DebtOutput(
            total_debt=total_debt,
            monthly_debt_service=monthly_debt_service,
            debt_to_income_ratio=debt_to_income_ratio,
            estimated_debt_free_year=estimated_debt_free_year
        )

    def _calculate_yearly_income(self, age: int) -> float:
        """Calculate total yearly income for a given age"""
        total_income = 0.0

        # Calculate Social Security (simplified - would need actual COLA logic)
        if self.input.income_streams and self.input.income_streams.social_security_you:
            ss_you = self.input.income_streams.social_security_you
            if age >= ss_you.claim_age:
                total_income += ss_you.yearly_amount_today_dollars

        if self.input.income_streams and self.input.income_streams.social_security_spouse:
            ss_spouse = self.input.income_streams.social_security_spouse
            if age >= ss_spouse.claim_age:
                total_income += ss_spouse.yearly_amount_today_dollars

        # Calculate pensions (simplified - would need actual COLA logic)
        if self.input.income_streams and self.input.income_streams.pension_1:
            pension1 = self.input.income_streams.pension_1
            if age >= pension1.starting_age:
                total_income += pension1.yearly_amount

        if self.input.income_streams and self.input.income_streams.pension_2:
            pension2 = self.input.income_streams.pension_2
            if age >= pension2.starting_age:
                total_income += pension2.yearly_amount

        # Calculate rental income (simplified - would need actual growth logic)
        if self.input.income_streams and self.input.income_streams.rental_properties:
            for prop in self.input.income_streams.rental_properties:
                # Skip properties with None values to avoid validation errors
                if prop.until_age is not None and prop.net_annual_income is not None:
                    if age <= prop.until_age:
                        total_income += prop.net_annual_income

        return total_income
    
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
