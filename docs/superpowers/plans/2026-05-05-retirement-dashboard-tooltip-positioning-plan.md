# Implementation Plan: Retirement Dashboard Tooltip Positioning

## Overview
This document outlines the step-by-step implementation plan to reposition all tooltips in the retirement dashboard UI components so that they appear directly after form label text instead of after input fields.

## Components to Modify
1. `PersonalSection.tsx`
2. `ReturnsSection.tsx` 
3. Other retirement dashboard components that use tooltips (as identified)

## Implementation Steps

### Phase 1: Analysis and Preparation
1. **Identify all components with tooltips** - Scan the entire retirement dashboard for tooltip usage
2. **Create backup of current implementation** - Save original files before making changes
3. **Define consistent styling approach** - Determine spacing, positioning, and alignment standards

### Phase 2: PersonalSection.tsx Modifications
1. **Modify FormLabel structure** - Add tooltips directly after label text in all form sections:
   - Timeline section labels (current_age, retirement_age, spouse_age, years_in_retirement)
   - Portfolio Assets section labels (investment_portfolio, your_401k_ira, spouse_401k_ira, yearly_contribution, yearly_contribution_increase_pct, catch_up_contributions)
   - Returns Simulation section labels (simulation_mode, equity_return_pre_retirement_pct, equity_return_post_retirement_pct, fixed_income_return_pct, inflation_rate_pct, historical_year)

2. **Update positioning** - Move tooltip from after input to after label text
3. **Maintain spacing** - Ensure consistent spacing between label text and tooltip

### Phase 3: ReturnsSection.tsx Modifications  
1. **Modify FormLabel structure** - Add tooltips directly after label text:
   - Returns simulation mode (with Select component)
   - Pre-retirement equity return %
   - Post-retirement equity return %
   - Fixed income return %
   - Inflation rate %
   - Historical year

2. **Update positioning** - Move tooltip from after input to after label text
3. **Maintain consistency** - Ensure all tooltips follow same positioning approach

### Phase 4: Cross-component Consistency
1. **Scan other components** - Check for additional tooltip usage in:
   - IncomeSourcesSection.tsx
   - ContributionsSection.tsx  
   - PortfolioSection.tsx
   - RealEstateSection.tsx
   - ExpensesSection.tsx
   - WithdrawalSection.tsx

2. **Apply consistent changes** - Implement same positioning approach across all components

### Phase 5: Testing and Validation
1. **Verify positioning** - Confirm tooltips appear after labels in all sections
2. **Test responsiveness** - Ensure proper display on mobile/tablet/desktop
3. **Validate accessibility** - Check keyboard navigation and screen reader compatibility  
4. **Confirm functionality** - Verify no form validation or data flow issues

## Technical Implementation Details

### CSS Considerations
- Add consistent spacing (margin-left) between label text and tooltip
- Ensure tooltips don't disrupt label line height or alignment
- Maintain proper vertical alignment for inline positioning

### Accessibility Requirements
- Keep tooltip keyboard navigation intact
- Preserve screen reader support 
- Ensure sufficient contrast and sizing
- Maintain focus order for tab navigation

## Expected Changes in Structure

### Before:
```jsx
<FormLabel htmlFor="timeline.current_age">Current age</FormLabel>
<FormControl>
  <div className="flex items-center gap-1">
    <Input ... />
    <Tooltip>...</Tooltip>
  </div>
</FormControl>
```

### After:
```jsx
<FormLabel htmlFor="timeline.current_age">
  Current age
  <Tooltip>...</Tooltip>
</FormLabel>
<FormControl>
  <Input ... />
</FormControl>
```

## Timeline Estimate
- Phase 1: 1 hour - Analysis and preparation
- Phase 2: 2 hours - PersonalSection.tsx modifications  
- Phase 3: 2 hours - ReturnsSection.tsx modifications
- Phase 4: 1 hour - Cross-component consistency
- Phase 5: 1 hour - Testing and validation
- **Total: ~7 hours**

## Success Criteria
- All tooltips positioned after labels rather than inputs
- No functional changes to forms or validation
- Consistent styling across all components
- Responsive design maintained on all devices
- Accessibility standards preserved