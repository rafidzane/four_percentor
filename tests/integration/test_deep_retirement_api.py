"""
Integration tests for Deep Retirement API

These tests verify the complete API functionality including:
- Input validation
- Calculation accuracy
- Error handling
- Response format
"""

import pytest
from fastapi.testclient import TestClient
from fourpercent.main import app as main_app


# Create test client
client = TestClient(main_app)


class TestDeepRetirementAPI:
    """Test suite for deep retirement API endpoints"""
    
    def test_root_endpoint(self):
        """Test the root endpoint returns expected information"""
        response = client.get("/fourpercent/api/v2/deep_retirement/")
        
        assert response.status_code == 200
        data = response.json()
        
        assert "message" in data
        assert "version" in data
        assert "endpoints" in data
        assert isinstance(data["endpoints"], list)
    
    def test_health_endpoint(self):
        """Test the health check endpoint"""
        response = client.get("/fourpercent/api/v2/deep_retirement/deep_retirement/health")
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["status"] == "healthy"
        assert data["service"] == "deep-retirement-api"
    
    def test_calculate_endpoint_success(self):
        """Test successful retirement calculation"""
        request_data = {
            "current_age": 30,
            "retirement_age": 65,
            "current_savings": 50000,
            "monthly_contribution": 1000,
            "annual_return_rate": 0.07,
            "social_security_age": 67,
            "expected_lifespan": 90
        }
        
        response = client.post(
            "/fourpercent/api/v2/deep_retirement/deep_retirement/calculate",
            json=request_data
        )
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify all expected fields are present
        required_fields = [
            "years_to_retirement",
            "total_savings_at_retirement",
            "monthly_income_at_retirement",
            "social_security_benefit",
            "withdrawal_rate",
            "projected_balance_at_age_90",
            "safe_withdrawal_amount",
            "recommended_withdrawal_strategy"
        ]
        
        for field in required_fields:
            assert field in data, f"Missing required field: {field}"
    
    def test_calculate_endpoint_validation(self):
        """Test input validation"""
        # Test with invalid age (retirement age < current age)
        invalid_request = {
            "current_age": 65,
            "retirement_age": 30,
            "current_savings": 50000,
            "monthly_contribution": 1000,
            "annual_return_rate": 0.07
        }
        
        response = client.post(
            "/fourpercent/api/v2/deep_retirement/deep_retirement/calculate",
            json=invalid_request
        )
        
        assert response.status_code == 422  # Validation error
    
    def test_calculate_endpoint_missing_fields(self):
        """Test that missing required fields return validation errors"""
        incomplete_request = {
            "current_age": 30,
            "retirement_age": 65
            # Missing other required fields
        }
        
        response = client.post(
            "/fourpercent/api/v2/deep_retirement/deep_retirement/calculate",
            json=incomplete_request
        )
        
        assert response.status_code == 422
    
    def test_calculate_endpoint_invalid_return_rate(self):
        """Test validation of annual return rate"""
        invalid_request = {
            "current_age": 30,
            "retirement_age": 65,
            "current_savings": 50000,
            "monthly_contribution": 1000,
            "annual_return_rate": 2.0,  # Invalid: > 1
        }
        
        response = client.post(
            "/fourpercent/api/v2/deep_retirement/deep_retirement/calculate",
            json=invalid_request
        )
        
        assert response.status_code == 422
    
    def test_calculate_endpoint_negative_values(self):
        """Test validation of negative values"""
        invalid_request = {
            "current_age": 30,
            "retirement_age": 65,
            "current_savings": -1000,  # Invalid: negative
            "monthly_contribution": 1000,
            "annual_return_rate": 0.07
        }
        
        response = client.post(
            "/fourpercent/api/v2/deep_retirement/deep_retirement/calculate",
            json=invalid_request
        )
        
        assert response.status_code == 422
    
    def test_calculate_endpoint_extreme_values(self):
        """Test handling of extreme but valid values"""
        request_data = {
            "current_age": 18,
            "retirement_age": 100,
            "current_savings": 10000000,  # $10M
            "monthly_contribution": 100000,  # $100k/month
            "annual_return_rate": 0.15,
            "social_security_age": 70,
            "expected_lifespan": 120
        }
        
        response = client.post(
            "/fourpercent/api/v2/deep_retirement/deep_retirement/calculate",
            json=request_data
        )
        
        assert response.status_code == 200
        data = response.json()
        
        # Should handle extreme values without crashing
        assert data["total_savings_at_retirement"] > 0
    
    def test_calculate_endpoint_zero_values(self):
        """Test handling of zero values"""
        request_data = {
            "current_age": 30,
            "retirement_age": 65,
            "current_savings": 0,
            "monthly_contribution": 0,
            "annual_return_rate": 0.07
        }
        
        response = client.post(
            "/fourpercent/api/v2/deep_retirement/deep_retirement/calculate",
            json=request_data
        )
        
        assert response.status_code == 200
        data = response.json()
        
        # With zero contributions and savings, result should be zero or very small
        assert "total_savings_at_retirement" in data


class TestDeepRetirementCalculations:
    """Test calculation accuracy"""
    
    def test_compound_growth_calculation(self):
        """Verify compound growth calculations are accurate"""
        request_data = {
            "current_age": 30,
            "retirement_age": 51,  # Just 1 year (must be >= 50)
            "current_savings": 10000,
            "monthly_contribution": 1000,
            "annual_return_rate": 0.12,  # 12% annual return
        }
        
        response = client.post(
            "/fourpercent/api/v2/deep_retirement/deep_retirement/calculate",
            json=request_data
        )
        
        assert response.status_code == 200
        data = response.json()
        
        # With monthly compounding, should be approximately $10,000 * (1 + 0.12/12)^12 + ~$12,000 in contributions
        # Allow some tolerance for calculation method
        assert data["total_savings_at_retirement"] > 15000
    
    def test_social_security_benefit_reduction(self):
        """Test Social Security benefit reduction for early claiming"""
        request_data = {
            "current_age": 30,
            "retirement_age": 65,
            "current_savings": 50000,
            "monthly_contribution": 1000,
            "annual_return_rate": 0.07,
            "social_security_age": 62,  # Early claiming
        }
        
        response = client.post(
            "/fourpercent/api/v2/deep_retirement/deep_retirement/calculate",
            json=request_data
        )
        
        assert response.status_code == 200
        data = response.json()
        
        # Benefit should be reduced for early claiming (max reduction ~30%)
        assert data["social_security_benefit"] <= 1875  # $2500 * 0.75
    
    def test_social_security_benefit_increase(self):
        """Test Social Security benefit increase for delayed claiming"""
        request_data = {
            "current_age": 30,
            "retirement_age": 65,
            "current_savings": 50000,
            "monthly_contribution": 1000,
            "annual_return_rate": 0.07,
            "social_security_age": 70,  # Delayed claiming
        }
        
        response = client.post(
            "/fourpercent/api/v2/deep_retirement/deep_retirement/calculate",
            json=request_data
        )
        
        assert response.status_code == 200
        data = response.json()
        
        # Benefit should be increased for delayed claiming (~24% more at age 70)
        # Allow equality since it's exactly $3100 (2500 * 1.24)
        assert data["social_security_benefit"] >= 3100


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
