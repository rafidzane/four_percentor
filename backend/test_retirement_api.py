import requests
import json

# Test the retirement API endpoint
def test_retirement_calculation():
    url = "http://localhost:8000/fourpercent/api/v4/retirement"

    # Test data matching what our frontend sends - using the correct structure for v4
    test_data = {
        "timeline": {
            "current_age": 30,
            "retirement_age": 65,
            "years_in_retirement": 30
        },
        "current_assets": {
            "investment_portfolio": 50000,
            "your_401k_ira": 100000,
            "spouse_401k_ira": 0,
            "yearly_contribution": 10000,
            "yearly_contribution_increase_pct": 3,
            "catch_up_eligible": False
        },
        "portfolio_allocation": {
            "equity_pct": 70,
            "fixed_income_pct": 30,
            "equity_return_pre_retirement_pct": 7,
            "equity_return_post_retirement_pct": 5.5,
            "fixed_income_return_pct": 3.5,
            "inflation_rate_pct": 3,
            "simulation_mode": "historical_all",
            "historical_year": 1929
        },
        "retirement_spending": {
            "spending_mode": "four_pct_rule",
            "first_year_expenses": 0,
            "withdrawal_pct": 4,
            "age_range_start": 62,
            "age_range_end": 92,
            "adjust_for_inflation": True,
            "two_period_mode": False
        }
    }

    try:
        response = requests.post(url, json=test_data)
        print("Status Code:", response.status_code)
        print("Response Body:", response.json())
        return response.json()
    except Exception as e:
        print("Error:", str(e))
        return None

if __name__ == "__main__":
    test_retirement_calculation()