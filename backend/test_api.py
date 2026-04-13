import requests
import json

# Test the retirement API endpoint
def test_retirement_calculation():
    url = "http://localhost:8000/fourpercent/api/v1/fourpercentor/calculate"
    
    # Test data matching what our frontend sends
    test_data = {
        "current_age": 30,
        "retirement_age": 65,
        "current_savings": 50000,
        "annual_contribution": 10000,
        "annual_return": 7,
        "inflation_rate": 2.5,
        "monthly_withdrawal": 4000
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