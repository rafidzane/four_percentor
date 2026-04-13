"""
Deep Retirement Calculation Engine

This module contains the core calculation logic for retirement projections,
including compound growth, Social Security benefits, and withdrawal strategies.
"""

from typing import Dict, Any, Optional, List
import math


def calculate_future_value_with_contributions(
    current_savings: float,
    monthly_contribution: float,
    annual_return_rate: float,
    years: int
) -> float:
    """
    Calculate future value with compound interest and regular contributions.
    
    Args:
        current_savings: Initial amount saved
        monthly_contribution: Monthly contribution amount
        annual_return_rate: Expected annual return (as decimal, e.g., 0.07 for 7%)
        years: Number of years until retirement
    
    Returns:
        Future value of savings at retirement
    """
    if years <= 0:
        return current_savings
    
    monthly_return_rate = annual_return_rate / 12
    total_months = years * 12
    
    # Future value of current savings (compound interest)
    future_value_current = current_savings * ((1 + monthly_return_rate) ** total_months)
    
    # Future value of monthly contributions (annuity formula)
    if monthly_return_rate > 0:
        future_value_contributions = (
            monthly_contribution * 
            (((1 + monthly_return_rate) ** total_months - 1) / monthly_return_rate)
        )
    else:
        future_value_contributions = monthly_contribution * total_months
    
    return future_value_current + future_value_contributions


def estimate_social_security_benefit(
    full_retirement_age_benefit: float,
    claimed_age: int,
    full_retirement_age: int = 67
) -> float:
    """
    Estimate Social Security benefit based on claiming age.
    
    Args:
        full_retirement_age_benefit: Monthly benefit at full retirement age
        claimed_age: Age when benefits are claimed (62-70)
        full_retirement_age: Full retirement age (typically 67 for those born after 1960)
    
    Returns:
        Estimated monthly Social Security benefit
    """
    if claimed_age >= full_retirement_age:
        # Delaying beyond FRA increases benefit by ~8% per year
        years_delayed = claimed_age - full_retirement_age
        benefit = full_retirement_age_benefit * (1 + 0.08 * max(0, years_delayed))
    else:
        # Taking early reduces benefit by ~5% per month before FRA
        months_early = (full_retirement_age - claimed_age) * 12
        reduction_rate = 0.05 / 12  # 5% per year, divided by 12 months
        benefit = full_retirement_age_benefit * max(0.3, (1 - reduction_rate * months_early))
    
    return benefit


def calculate_withdrawal_strategy(
    total_savings: float,
    years_to_live: int,
    annual_return_rate: float,
    inflation_rate: float = 0.03
) -> Dict[str, Any]:
    """
    Calculate sustainable withdrawal amounts using different strategies.
    
    Args:
        total_savings: Total savings at retirement
        years_to_live: Number of years to project (lifespan - retirement age)
        annual_return_rate: Expected return on investments
        inflation_rate: Expected inflation rate
    
    Returns:
        Dictionary with various withdrawal strategy calculations
    """
    strategies = {}
    
    # 4% Rule
    safe_withdrawal_4pct = total_savings * 0.04
    strategies['four_percent_rule'] = {
        'annual': round(safe_withdrawal_4pct, 2),
        'monthly': round(safe_withdrawal_4pct / 12, 2)
    }
    
    # Fixed dollar withdrawal (inflation-adjusted)
    annual_withdrawal = safe_withdrawal_4pct
    balance = total_savings
    years_remaining = years_to_live
    
    for year in range(years_remaining):
        # Earn return on balance
        balance = balance * (1 + annual_return_rate)
        # Withdraw inflation-adjusted amount
        balance = balance - annual_withdrawal
        
        if balance <= 0:
            balance = 0
            break
    
    strategies['inflation_adjusted'] = {
        'annual': round(annual_withdrawal, 2),
        'balance_at_end': round(balance, 2)
    }
    
    # Calculate years to depletion
    balance = total_savings
    years_to_depletion = 0
    annual_withdrawal = safe_withdrawal_4pct
    
    while balance > 0 and years_to_depletion < years_to_live:
        balance = balance * (1 + annual_return_rate) - annual_withdrawal
        years_to_depletion += 1
    
    strategies['years_to_depletion'] = min(years_to_depletion, years_to_live)
    
    return strategies


def calculate_monte_carlo_success_rate(
    total_savings: float,
    annual_withdrawal: float,
    annual_return_rate: float,
    volatility: float = 0.12,  # Standard deviation of returns
    years: int = 30,
    simulations: int = 1000
) -> float:
    """
    Estimate success rate using simplified Monte Carlo simulation.
    
    Args:
        total_savings: Total savings at retirement
        annual_withdrawal: Annual withdrawal amount
        annual_return_rate: Expected average return
        volatility: Standard deviation of returns (12% is typical for stocks)
        years: Number of years to simulate
        simulations: Number of simulation runs
    
    Returns:
        Success rate as percentage (0-100)
    """
    import random
    
    successful_scenarios = 0
    
    for _ in range(simulations):
        balance = total_savings
        
        for year in range(years):
            # Generate random return based on normal distribution
            # Using Box-Muller transform for normal distribution
            u1 = random.random()
            u2 = random.random()
            z = math.sqrt(-2 * math.log(u1)) * math.cos(2 * math.pi * u2)
            
            # Return = expected return + volatility * random component
            annual_return = annual_return_rate + volatility * z
            
            # Apply return and withdrawal
            balance = balance * (1 + annual_return) - annual_withdrawal
            
            if balance <= 0:
                break
        
        if balance > 0:
            successful_scenarios += 1
    
    success_rate = (successful_scenarios / simulations) * 100
    return round(success_rate, 2)


def calculate_deep_retirement_projection(input_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Calculate comprehensive retirement projection based on input parameters.
    
    Args:
        input_data: Dictionary containing all input parameters
    
    Returns:
        Dictionary with complete retirement projection
    """
    # Extract inputs
    current_age = input_data['current_age']
    retirement_age = input_data['retirement_age']
    current_savings = input_data['current_savings']
    monthly_contribution = input_data['monthly_contribution']
    annual_return_rate = input_data['annual_return_rate']
    social_security_age = input_data.get('social_security_age', 67)
    expected_lifespan = input_data.get('expected_lifespan', 90)
    inflation_rate = input_data.get('inflation_rate', 0.03)
    
    # Years until retirement
    years_to_retirement = retirement_age - current_age
    
    if years_to_retirement <= 0:
        raise ValueError("Retirement age must be greater than current age")
    
    # Calculate total savings at retirement
    total_savings_at_retirement = calculate_future_value_with_contributions(
        current_savings=current_savings,
        monthly_contribution=monthly_contribution,
        annual_return_rate=annual_return_rate,
        years=years_to_retirement
    )
    
    # Estimate Social Security benefit (simplified: ~$2,500/month at FRA 67)
    social_security_fra = 2500  # Full retirement age benefit
    social_security_benefit = estimate_social_security_benefit(
        full_retirement_age_benefit=social_security_fra,
        claimed_age=social_security_age
    )
    
    # Calculate withdrawal strategies
    remaining_years = expected_lifespan - retirement_age
    withdrawal_strategies = calculate_withdrawal_strategy(
        total_savings=total_savings_at_retirement,
        years_to_live=remaining_years,
        annual_return_rate=annual_return_rate,
        inflation_rate=inflation_rate
    )
    
    safe_withdrawal_amount = withdrawal_strategies['four_percent_rule']['annual']
    
    monthly_income_at_retirement = (
        (safe_withdrawal_amount / 12) + 
        social_security_benefit
    )
    
    # Project balance at age 90
    projected_balance = total_savings_at_retirement
    annual_withdrawal = safe_withdrawal_amount
    
    for year in range(remaining_years):
        projected_balance = projected_balance * (1 + annual_return_rate) - annual_withdrawal
        
        if projected_balance <= 0:
            projected_balance = 0
            break
    
    # Calculate withdrawal rate
    withdrawal_rate = safe_withdrawal_amount / total_savings_at_retirement if total_savings_at_retirement > 0 else 0
    
    # Determine recommended strategy based on time horizon
    if years_to_retirement < 10:
        strategy = "Conservative: Focus on preserving capital with moderate withdrawals"
    elif years_to_retirement < 25:
        strategy = "Balanced: Mix of income and growth with sustainable withdrawal rate"
    else:
        strategy = "Aggressive: Focus on growth with room for higher early retirement spending"
    
    # Calculate inflation-adjusted savings
    inflation_adjusted_savings = total_savings_at_retirement / ((1 + inflation_rate) ** years_to_retirement)
    
    # Calculate Monte Carlo success rate (simplified - using fewer simulations for performance)
    mc_success_rate = calculate_monte_carlo_success_rate(
        total_savings=total_savings_at_retirement,
        annual_withdrawal=safe_withdrawal_amount,
        annual_return_rate=annual_return_rate,
        volatility=0.12,
        years=remaining_years,
        simulations=500  # Reduced for performance
    )
    
    return {
        'years_to_retirement': years_to_retirement,
        'total_savings_at_retirement': round(total_savings_at_retirement, 2),
        'monthly_income_at_retirement': round(monthly_income_at_retirement, 2),
        'social_security_benefit': round(social_security_benefit, 2),
        'withdrawal_rate': round(withdrawal_rate, 4),
        'projected_balance_at_age_90': round(projected_balance, 2),
        'safe_withdrawal_amount': round(safe_withdrawal_amount, 2),
        'recommended_withdrawal_strategy': strategy,
        'inflation_adjusted_savings': round(inflation_adjusted_savings, 2),
        'years_to_depletion': withdrawal_strategies.get('years_to_depletion'),
        'monte_carlo_success_rate': mc_success_rate
    }


def compare_scenarios(scenarios: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Compare multiple retirement scenarios and generate comparison metrics.
    
    Args:
        scenarios: List of scenario dictionaries with input_data and projection
    
    Returns:
        Comparison results including side-by-side metrics
    """
    if not scenarios:
        return {'scenarios': [], 'comparison_metrics': {}}
    
    # Extract key metrics from each scenario
    comparison_metrics = {}
    metric_names = [
        'total_savings_at_retirement',
        'monthly_income_at_retirement', 
        'social_security_benefit',
        'safe_withdrawal_amount',
        'projected_balance_at_age_90',
        'years_to_depletion'
    ]
    
    for scenario in scenarios:
        name = scenario.get('name', f"Scenario {scenarios.index(scenario) + 1}")
        projection = scenario.get('projection', {})
        
        comparison_metrics[name] = {}
        for metric in metric_names:
            value = projection.get(metric)
            if value is not None:
                comparison_metrics[name][metric] = round(value, 2)
    
    # Calculate relative differences
    if len(scenarios) > 1:
        first_scenario_name = list(comparison_metrics.keys())[0]
        first_projection = comparison_metrics[first_scenario_name]
        
        for name, metrics in comparison_metrics.items():
            if name != first_scenario_name:
                metrics['relative_diff'] = {}
                for metric in metric_names:
                    if metric in first_projection and metric in metrics:
                        diff = ((metrics[metric] - first_projection[metric]) / 
                                first_projection[metric] * 100) if first_projection[metric] != 0 else 0
                        metrics['relative_diff'][metric] = round(diff, 2)
    
    return {
        'scenarios': scenarios,
        'comparison_metrics': comparison_metrics
    }
