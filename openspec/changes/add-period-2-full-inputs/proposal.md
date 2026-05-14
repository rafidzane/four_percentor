## Why

Period 2 of the withdrawal strategy currently has incomplete input controls. While Period 1 has a complete set of inputs (Start Age, End Age, Type toggle, and Value), Period 2 only shows Start/End ages with the type/value section missing or broken. This prevents users from configuring distinct withdrawal strategies for different retirement phases.

## What Changes

### UI Changes
- Add Start Age input to Period 2 configuration (currently missing)
- Add End Age input to Period 2 configuration (partially implemented, needs validation fix)
- Implement Type toggle (Amount/Percentage) for Period 2 with same UI pattern as Period 1
- Add Value input field that switches between amount ($) and percentage (%) based on type

### Data Model Changes
- Update `retirement_spending.period_2_*` fields in `FormData` interface:
  - `period_2_start_age`: number (Start age for period 2)
  - `period_2_end_age`: number (End age for period 2)  
  - `period_2_withdrawal_type`: "amount" | "percentage"
  - `period_2_withdrawal_amount`: number (when type = amount)
  - `period_2_withdrawal_pct`: number (when type = percentage)

### Backend Changes
- Update Pydantic models to accept Period 2 configuration with all withdrawal fields
- Ensure Monte Carlo simulation processes Period 2 with its specific age range and withdrawal strategy

## Capabilities

### New Capabilities
- `period-2-full-inputs`: Complete set of period-specific inputs for configuring Phase 2 retirement withdrawals including start/end ages, type toggle (amount/percentage), and value input

### Modified Capabilities
- None - this adds new functionality without breaking existing behavior

## Impact

**Frontend:**
- `WithdrawalStrategySection.tsx` - Update Period 2 section with full input controls matching Period 1
- `RetirementForm.tsx` - May need to update defaultValues to include period_2 fields

**Backend:**
- `/backend/src/simulator/` - Update Pydantic models for withdrawal strategy to handle period_2 configuration
- Simulation logic should use period_2_start_age through period_2_end_age with its specific withdrawal rate/type

**API Contracts:**
- No breaking changes - existing period_1 behavior remains unchanged
