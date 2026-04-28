## Context

The retirement calculator currently uses a single withdrawal rate throughout retirement. Users need more sophisticated modeling capabilities to represent real-world spending patterns that change over time.

## Goals / Non-Goals

**Goals:**
- Support two distinct spending periods with different age ranges and withdrawal percentages
- Allow flexible configuration of when each period begins
- Maintain backward compatibility with single-period mode
- Ensure the UI clearly communicates the dual-period approach to users

**Non-Goals:**
- Support more than two spending periods (for simplicity and usability)
- Complex spending rules beyond age-based periods
- Advanced financial modeling features like inflation-adjusted spending changes

## Decisions

1. **Two Period Structure**: 
   - Period 1: Age range start to period transition point
   - Period 2: From transition point to end of projection
   - The transition point will be the retirement age (65) for simplicity

2. **UI Design**:
   - Add a toggle switch for "Two-period spending mode" 
   - When enabled, show separate inputs for both periods
   - Default values should be sensible and maintain existing behavior

3. **Backend Logic**:
   - When two-period mode is disabled, use current single-period logic
   - When enabled, calculate spending separately for each period based on their age ranges
   - Use withdrawal percentages from each period appropriately during the calculation

## Two-Period Spending Model

```
Period 1: Ages X to Y (inclusive)
- Withdrawal rate: P1%

Period 2: Ages Y+1 to Z (inclusive) 
- Withdrawal rate: P2%
```

Where:
- X = start age of period 1
- Y = end age of period 1  
- Y+1 = start age of period 2
- Z = end age of period 2

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Confusing UI for new users | Clear labels, tooltips, and examples |
| Incorrect age range overlap | Input validation to ensure proper age ordering |
| Backward compatibility issues | Default to single-period mode with sensible fallbacks |

## Technical Implementation Plan

1. **Frontend**:
   - Add toggle switch in Withdrawal Strategy section
   - Conditionally render period inputs based on toggle state
   - Maintain existing default values when switching modes

2. **Backend**: 
   - Update input models to support two-period spending
   - Modify calculation engine to apply different withdrawal rates per period
   - Ensure validation of age ranges and percentages

## Input Structure

```
retirement_spending: {
  two_period_mode: boolean,
  period_1_start_age: number,  
  period_1_end_age: number,
  period_1_withdrawal_pct: number,
  period_2_start_age: number,
  period_2_end_age: number,
  period_2_withdrawal_pct: number
}
```