#!/usr/bin/env python3

"""
Test script to validate that our import fixes work correctly
"""

import sys
import os

# Add the project root to Python path
sys.path.insert(0, '/home/rafid/devel/four_percentor')

try:
    # Test importing various modules
    from fourpercent.models.root import RetirementInput, RetirementResponse
    print("✓ Successfully imported RetirementInput and RetirementResponse")
    
    from fourpercent.models import *
    print("✓ Successfully imported all models from fourpercent.models")
    
    from fourpercent.calculation.retirement_v4 import RetirementCalculator, calculate_retirement
    print("✓ Successfully imported calculation modules")
    
    from fourpercent.api import *
    print("✓ Successfully imported API modules")
    
    print("\nAll imports successful! The fix is working correctly.")
    
except Exception as e:
    print(f"✗ Import failed with error: {e}")
    sys.exit(1)