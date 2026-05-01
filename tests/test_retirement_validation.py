"""
Test suite for retirement API validation fixes.
Tests that the API can handle None values in optional fields.
"""

import pytest
from pydantic import ValidationError

from fourpercent.models.root import RetirementInput
from fourpercent.models.income_streams import RentalPropertyInput


def test_rental_property_with_none_values():
    """Test that RentalPropertyInput accepts None values for optional fields."""
    
    # This should not raise a validation error anymore
    rental_property = RentalPropertyInput(
        property_name="Test Property",
        net_annual_income=None,  # This was causing issues before
        annual_growth_pct=2.0,
        until_age=None  # This was also causing issues before
    )
    
    assert rental_property.property_name == "Test Property"
    assert rental_property.net_annual_income is None
    assert rental_property.until_age is None


def test_rental_property_with_valid_values():
    """Test that RentalPropertyInput still works with valid values."""
    
    rental_property = RentalPropertyInput(
        property_name="Test Property",
        net_annual_income=10000.0,
        annual_growth_pct=2.0,
        until_age=75
    )
    
    assert rental_property.property_name == "Test Property"
    assert rental_property.net_annual_income == 10000.0
    assert rental_property.until_age == 75


def test_retirement_input_with_none_rental_properties():
    """Test that RetirementInput accepts None values in rental properties."""
    
    # This simulates what the frontend might send when optional sections are empty
    retirement_data = {
        "timeline": {
            "current_age": 35,
            "retirement_age": 65,
            "years_in_retirement": 30
        },
        "current_assets": {
            "investment_portfolio": 500000,
            "your_401k_ira": 200000,
            "spouse_401k_ira": 0,
            "yearly_contribution": 10000,
            "yearly_contribution_increase_pct": 3.0,
            "catch_up_eligible": True
        },
        "portfolio_allocation": {
            "equity_pct": 70.0,
            "fixed_income_pct": 30.0,
            "equity_return_pre_retirement_pct": 7.0,
            "equity_return_post_retirement_pct": 4.0
        },
        "retirement_spending": {
            "spending_strategy": "four_percent_rule",
            "annual_inflation_rate": 2.5
        },
        "income_streams": {
            "rental_properties": [
                {
                    "property_name": "Vacation Home",
                    "net_annual_income": None,  # None value - this was the problem
                    "annual_growth_pct": 2.0,
                    "until_age": None  # None value - this was the problem
                }
            ]
        }
    }
    
    # This should not raise a validation error anymore
    try:
        input_model = RetirementInput(**retirement_data)
        assert input_model.income_streams is not None
        assert len(input_model.income_streams.rental_properties) == 1
        assert input_model.income_streams.rental_properties[0].net_annual_income is None
        assert input_model.income_streams.rental_properties[0].until_age is None
        print("✓ Test passed: RetirementInput accepts None values in rental properties")
    except ValidationError as e:
        pytest.fail(f"ValidationError should not occur with None values: {e}")


if __name__ == "__main__":
    test_rental_property_with_none_values()
    test_rental_property_with_valid_values()
    test_retirement_input_with_none_rental_properties()
    print("All tests passed!")