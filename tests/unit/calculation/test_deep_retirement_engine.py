"""
Unit tests for Deep Retirement Calculation Engine

These tests verify the core calculation logic is accurate and handles edge cases.
"""

import pytest
from fourpercent.calculation.deep_retirement import (
    calculate_future_value_with_contributions,
    estimate_social_security_benefit,
    calculate_withdrawal_strategy,
    calculate_monte_carlo_success_rate,
    calculate_deep_retirement_projection,
)


class TestFutureValueCalculation:
    """Tests for compound growth calculations"""
    
    def test_no_growth_no_contributions(self):
        """Test with no growth and no contributions"""
        result = calculate_future_value_with_contributions(
            current_savings=10000,
            monthly_contribution=0,
            annual_return_rate=0,
            years=10
        )
        
        assert result == 10000
    
    def test_simple_growth(self):
        """Test with simple compound growth"""
        result = calculate_future_value_with_contributions(
            current_savings=10000,
            monthly_contribution=0,
            annual_return_rate=0.05,
            years=1
        )
        
        # With monthly compounding: $10,000 * (1 + 0.05/12)^12 = ~$10,511.62
        assert abs(result - 10511.62) < 1
    
    def test_with_monthly_contributions(self):
        """Test with monthly contributions"""
        result = calculate_future_value_with_contributions(
            current_savings=0,
            monthly_contribution=1000,
            annual_return_rate=0.06,
            years=1
        )
        
        # Should be approximately $12,000 + interest on contributions
        assert result > 12000
    
    def test_long_term_growth(self):
        """Test long-term compound growth"""
        result = calculate_future_value_with_contributions(
            current_savings=10000,
            monthly_contribution=500,
            annual_return_rate=0.07,
            years=30
        )
        
        # Should be substantial due to compound growth
        assert result > 500000
    
    def test_zero_years(self):
        """Test with zero years (edge case)"""
        result = calculate_future_value_with_contributions(
            current_savings=10000,
            monthly_contribution=500,
            annual_return_rate=0.07,
            years=0
        )
        
        assert result == 10000
    
    def test_negative_years(self):
        """Test with negative years (edge case)"""
        result = calculate_future_value_with_contributions(
            current_savings=10000,
            monthly_contribution=500,
            annual_return_rate=0.07,
            years=-1
        )
        
        # Should return current savings for invalid input
        assert result == 10000


class TestSocialSecurityCalculation:
    """Tests for Social Security benefit calculations"""
    
    def test_full_retirement_age(self):
        """Test benefit at full retirement age (67)"""
        benefit = estimate_social_security_benefit(
            full_retirement_age_benefit=2500,
            claimed_age=67
        )
        
        assert benefit == 2500
    
    def test_early_climing_reduction(self):
        """Test benefit reduction for early claiming (age 62)"""
        benefit = estimate_social_security_benefit(
            full_retirement_age_benefit=2500,
            claimed_age=62
        )
        
        # Should be reduced by approximately 25% (5 years * 5% per year)
        assert benefit <= 1875  # 2500 * 0.75
    
    def test_delayed_climing_increase(self):
        """Test benefit increase for delayed claiming (age 70)"""
        benefit = estimate_social_security_benefit(
            full_retirement_age_benefit=2500,
            claimed_age=70
        )
        
        # Should be increased by approximately 24% (3 years * 8%)
        assert benefit >= 3100  # 2500 * 1.24
    
    def test_minimum_benefit(self):
        """Test that benefit doesn't go below minimum"""
        benefit = estimate_social_security_benefit(
            full_retirement_age_benefit=2500,
            claimed_age=62
        )
        
        # Should not be less than 30% of FRA benefit
        assert benefit >= 750  # 2500 * 0.3


class TestWithdrawalStrategy:
    """Tests for withdrawal strategy calculations"""
    
    def test_four_percent_rule(self):
        """Test the 4% rule calculation"""
        result = calculate_withdrawal_strategy(
            total_savings=1000000,
            years_to_live=30,
            annual_return_rate=0.05
        )
        
        # Should be approximately $40,000 (4% of $1M)
        assert abs(result['four_percent_rule']['annual'] - 40000) < 1
    
    def test_years_to_depletion(self):
        """Test years to depletion calculation"""
        result = calculate_withdrawal_strategy(
            total_savings=500000,
            years_to_live=30,
            annual_return_rate=0.04
        )
        
        # With $20k withdrawal and 4% return, should last longer than 30 years
        assert result['years_to_depletion'] >= 30
    
    def test_zero_savings(self):
        """Test with zero savings"""
        result = calculate_withdrawal_strategy(
            total_savings=0,
            years_to_live=30,
            annual_return_rate=0.05
        )
        
        assert result['inflation_adjusted']['balance_at_end'] == 0


class TestDeepRetirementProjection:
    """Tests for complete retirement projection"""
    
    def test_basic_projection(self):
        """Test basic retirement projection"""
        input_data = {
            "current_age": 30,
            "retirement_age": 65,
            "current_savings": 50000,
            "monthly_contribution": 1000,
            "annual_return_rate": 0.07,
            "social_security_age": 67,
            "expected_lifespan": 90
        }
        
        result = calculate_deep_retirement_projection(input_data)
        
        # Verify all expected fields are present
        assert "years_to_retirement" in result
        assert "total_savings_at_retirement" in result
        assert "monthly_income_at_retirement" in result
        assert "social_security_benefit" in result
        
        # Verify reasonable values
        assert result["years_to_retirement"] == 35
        assert result["total_savings_at_retirement"] > 0
    
    def test_invalid_input(self):
        """Test with invalid input (retirement age < current age)"""
        input_data = {
            "current_age": 65,
            "retirement_age": 30,
            "current_savings": 50000,
            "monthly_contribution": 1000,
            "annual_return_rate": 0.07
        }
        
        with pytest.raises(ValueError):
            calculate_deep_retirement_projection(input_data)
    
    def test_high_return_scenario(self):
        """Test projection with high return rate"""
        input_data = {
            "current_age": 30,
            "retirement_age": 65,
            "current_savings": 10000,
            "monthly_contribution": 500,
            "annual_return_rate": 0.10,
            "social_security_age": 67,
            "expected_lifespan": 90
        }
        
        result = calculate_deep_retirement_projection(input_data)
        
        # High return should result in substantial savings
        assert result["total_savings_at_retirement"] > 2000000
    
    def test_low_return_scenario(self):
        """Test projection with low return rate"""
        input_data = {
            "current_age": 30,
            "retirement_age": 65,
            "current_savings": 10000,
            "monthly_contribution": 500,
            "annual_return_rate": 0.02,
            "social_security_age": 67,
            "expected_lifespan": 90
        }
        
        result = calculate_deep_retirement_projection(input_data)
        
        # Low return should still result in positive savings
        assert result["total_savings_at_retirement"] > 0


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
