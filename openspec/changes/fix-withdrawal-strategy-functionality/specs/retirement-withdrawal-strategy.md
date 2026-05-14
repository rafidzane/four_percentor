# Retirement Withdrawal Strategy Specification

## Overview

This spec defines the expected behavior for the retirement withdrawal strategy section, including toggle functionality and multi-period configuration.

## Withdrawal Type Selection

### Percentage Mode
- When selected, displays an input field for percentage of portfolio to withdraw annually
- Input accepts values from 0 to 100
- Step increment: 0.5
- Backend field: `period_X_withdrawal_pct` (stored as decimal internally)
- Tooltip: "Percentage of portfolio to withdraw annually (e.g., 4% for 4% rule)"

### Amount Mode
- When selected, displays an input field for fixed dollar amount to withdraw annually
- Input accepts values from 0 with step increment of 100
- Backend field: `period_X_withdrawal_amount` (stored in cents internally)
- Tooltip: "Fixed dollar amount to withdraw annually"

### Toggle Behavior
- Switch component snaps discretely between percentage and amount modes
- State updates immediately when toggled
- No confirmation or additional steps required
- Form validation should reflect current mode selection

## Period 2 Configuration

### Enable Checkbox
- Checkbox labeled "Configure Period 2 spending"
- When checked, displays the Period 2 configuration panel
- When unchecked, hides Period 2 panel completely
- Backend field: `two_period_mode` (boolean)

### Period 2 Panel Content
When visible, includes:
1. Age range inputs (start age - end age)
2. Withdrawal type toggle (percentage/amount)
3. Value input (percentage or amount based on toggle)

## Data Model

```typescript
interface SpendingData {
  two_period_mode: boolean;
  
  // Period 1 (always visible)
  period_1_start_age?: number;
  period_1_end_age?: number;
  period_1_withdrawal_pct?: number;    // When type = "percentage"
  period_1_withdrawal_amount?: number; // When type = "amount"
  period_1_withdrawal_type: "percentage" | "amount";
  
  // Period 2 (conditional on two_period_mode)
  period_2_start_age?: number;
  period_2_end_age?: number;
  period_2_withdrawal_pct?: number;    // When type = "percentage"
  period_2_withdrawal_amount?: number; // When type = "amount"
  period_2_withdrawal_type: "percentage" | "amount";
}
```

## Validation Rules

1. **Age range validation**:
   - Start age must be ≥ 18
   - End age must be > start age
   - Maximum end age: 120

2. **Withdrawal value validation**:
   - Percentage: 0 ≤ value ≤ 100
   - Amount: value ≥ 0

3. **Required fields** (when mode is active):
   - `period_X_start_age` and `period_X_end_age` must be provided
   - Exactly one of `period_X_withdrawal_pct` or `period_X_withdrawal_amount` must be set based on type selection

4. **Two-period constraints**:
   - Period 2 start age must be > Period 1 end age (if both configured)
   - Both periods can use different withdrawal strategies independently

## UI Accessibility Requirements

- All interactive elements must be keyboard navigable
- ARIA labels for toggle switches indicating current selection
- Screen reader announcements when visibility toggles (Period 2 panel shows/hides)
- Proper form field IDs matching their names for label association
