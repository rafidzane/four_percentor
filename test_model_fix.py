#!/usr/bin/env python3

import sys
import os

# Add the current directory to Python path so we can import our local modules
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from fourpercent.models.income_streams import RentalPropertyInput
    print("✓ Successfully imported RentalPropertyInput")
    
    # Test 1: Try creating with None values (this should work now)
    try:
        prop = RentalPropertyInput(
            property_name="Test Property", 
            net_annual_income=None,
            annual_growth_pct=2.0,
            until_age=None
        )
        print("✓ Created RentalPropertyInput with None values successfully")
        print(f"  - property_name: {prop.property_name}")
        print(f"  - net_annual_income: {prop.net_annual_income}")
        print(f"  - until_age: {prop.until_age}")
    except Exception as e:
        print(f"✗ Failed to create with None values: {e}")
        
    # Test 2: Try creating with valid values (should still work)
    try:
        prop = RentalPropertyInput(
            property_name="Test Property", 
            net_annual_income=10000.0,
            annual_growth_pct=2.0,
            until_age=75
        )
        print("✓ Created RentalPropertyInput with valid values successfully")
        print(f"  - property_name: {prop.property_name}")
        print(f"  - net_annual_income: {prop.net_annual_income}")
        print(f"  - until_age: {prop.until_age}")
    except Exception as e:
        print(f"✗ Failed to create with valid values: {e}")

except ImportError as e:
    print(f"✗ Failed to import: {e}")
except Exception as e:
    print(f"✗ Unexpected error: {e}")