---
name: withdrawal-strategy-inputs
description: Requirements for enhanced withdrawal strategy input handling
type: spec
---

# Withdrawal Strategy Inputs

## Overview

This specification defines the requirements for enhanced withdrawal strategy inputs in the retirement calculator.

## Requirements

### Spending Mode Selection

1. The spending mode selection should distinguish between:
   - "4% Rule" - no additional inputs needed
   - "Manual Withdrawal Amount" - requires amount input and inflation adjustment option

2. When "Manual Withdrawal Amount" is selected, users must be clearly informed that the input represents an annual dollar amount.

### Inflation Adjustment

1. When using manual withdrawal amounts, users should have the option to adjust for inflation
2. This checkbox should be displayed immediately after the amount input field
3. The default behavior should be that inflation adjustment is not applied

### Two-Period Spending Mode

1. When two-period spending mode is enabled:
   - Each period should have its own age range configuration (start and end ages)
   - Each period should support both percentage and amount-based withdrawal rates
   - Default age ranges should be 50-62 for the first period and 63-end of retirement for the second

### Input Validation

1. Amount inputs should be numeric with appropriate step sizes (e.g., step=1000 for dollar amounts)
2. Percentage inputs should be numeric between 0-100 with appropriate step sizes (e.g., step=0.5)
3. Age range inputs should be within valid ranges (18-120)
4. All inputs should provide clear error messages when invalid values are entered

### Backward Compatibility

1. Existing data and configurations should continue to work
2. Default behaviors should match current implementation where possible
3. Any new fields should be optional or have sensible defaults

## Acceptance Criteria

- Users can clearly distinguish between amount-based and percentage-based inputs
- Inflation adjustment option is available when using manual withdrawal amounts
- Two-period spending mode properly configures both periods with age ranges and withdrawal rates
- Default age ranges (50-62 and 63-end) are applied automatically
- All existing functionality remains intact
- Form validation works correctly for all input types