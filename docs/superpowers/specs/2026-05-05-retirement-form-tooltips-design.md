# Retirement Form Tooltips Implementation Design

## Overview
This document outlines the implementation plan for adding tooltips to all remaining labels in the RetirementForm component. Based on my analysis, tooltips have been partially implemented in ReturnsSection.tsx but many fields in the main RetirementForm component are still missing tooltips.

## Current State Analysis
From examining the codebase:
1. Tooltips have already been implemented in ReturnsSection.tsx (5 tooltips)
2. The main RetirementForm component and several sections need tooltips added
3. The project already has all required imports for Tooltip components

## Implementation Scope

### Sections That Need Tooltips Added:

#### 1. Personal Information Section
- timeline.current_age - Current age
- timeline.retirement_age - Retirement age  
- timeline.spouse_age - Spouse age (optional)
- timeline.years_in_retirement - Years in retirement

#### 2. Portfolio Assets Section
- current_assets.investment_portfolio - Investment portfolio
- current_assets.your_401k_ira - Your 401(k) / IRA
- current_assets.spouse_401k_ira - Spouse 401(k) / IRA

#### 3. Contributions Section
- current_assets.yearly_contribution - Yearly contribution
- current_assets.yearly_contribution_increase_pct - Yearly contribution increase %
- current_assets.catch_up_contributions - Catch-up contributions (age 50+)

#### 4. Withdrawal Strategy Section
- retirement_spending.spending_mode - Spending mode
- retirement_spending.adjust_for_inflation - Adjust for inflation
- retirement_spending.period_1_start_age - Period 1 start age
- retirement_spending.period_1_end_age - Period 1 end age
- retirement_spending.period_1_withdrawal_type - Period 1 withdrawal type
- retirement_spending.period_1_withdrawal_pct - Period 1 withdrawal percentage
- retirement_spending.period_1_withdrawal_amount - Period 1 withdrawal amount
- retirement_spending.two_period_mode - Configure Period 2 spending
- retirement_spending.period_2_start_age - Period 2 start age
- retirement_spending.period_2_end_age - Period 2 end age
- retirement_spending.period_2_withdrawal_type - Period 2 withdrawal type
- retirement_spending.period_2_withdrawal_pct - Period 2 withdrawal percentage
- retirement_spending.period_2_withdrawal_amount - Period 2 withdrawal amount

#### 5. Income Sources Section
- income_streams.social_security_you.claim_age - Social Security (You) claim age
- income_streams.social_security_you.yearly_amount_today_dollars - Social Security (You) yearly amount
- income_streams.social_security_spouse.claim_age - Social Security (Spouse) claim age
- income_streams.social_security_spouse.yearly_amount_today_dollars - Social Security (Spouse) yearly amount
- income_streams.pension_1.starting_age - Pension 1 starting age
- income_streams.pension_1.yearly_amount - Pension 1 yearly amount
- income_streams.pension_2.starting_age - Pension 2 starting age
- income_streams.pension_2.yearly_amount - Pension 2 yearly amount
- income_streams.rental_properties.0.property_name - Rental property name
- income_streams.rental_properties.0.net_annual_income - Rental property net annual income
- income_streams.rental_properties.0.until_age - Rental property until age
- income_streams.rental_properties.1.property_name - Rental property name (2)
- income_streams.rental_properties.1.net_annual_income - Rental property net annual income (2)
- income_streams.rental_properties.1.until_age - Rental property until age (2)
- income_streams.rental_properties.2.property_name - Rental property name (3)
- income_streams.rental_properties.2.net_annual_income - Rental property net annual income (3)
- income_streams.rental_properties.2.until_age - Rental property until age (3)

#### 6. Real Estate Section
- real_estate.total_property_value - Total property value
- real_estate.total_outstanding_mortgages - Outstanding mortgage(s)
- real_estate.annual_appreciation_pct - Annual appreciation %
- real_estate.model_property_sale - Model planned property sale
- real_estate.age_of_sale - Age of sale
- real_estate.amount_rolled_into_portfolio - Amount rolled into portfolio

## Implementation Pattern

Each tooltip will follow this consistent pattern:
```tsx
<Tooltip>
  <TooltipTrigger asChild>
    <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
      <InfoIcon className="h-3 w-3 text-muted-foreground" />
    </Button>
  </TooltipTrigger>
  <TooltipContent side="right" className="max-w-xs">
    Tooltip content here explaining the field
  </TooltipContent>
</Tooltip>
```

## Content Guidelines

1. **Length**: Keep tooltip content to 3-5 sentences max
2. **Focus**: Explain what the field means, why it matters, and what reasonable values might be
3. **Consistency**: Use similar language and tone across all tooltips
4. **Context**: Include historical references where appropriate (e.g., "Historically ~7%")

## Quality Assurance

### Testing Requirements
1. All tooltips must be visible on hover
2. Tooltips should not cause layout shifts or overflow issues
3. Tooltips should be accessible via keyboard navigation
4. All form functionality must remain intact
5. Mobile responsiveness must be maintained

### Validation Steps
1. Manual testing of each tooltip interaction
2. Cross-browser compatibility testing
3. Screen reader accessibility verification
4. Performance impact assessment
5. Responsive design validation

## Timeline Estimate
- Implementation across all components: 3-4 hours
- Testing and validation: 1 hour
- Total: ~4-5 hours for complete implementation

## Success Criteria
1. All form labels have helpful tooltips
2. Tooltips provide context without being verbose
3. UI remains consistent and responsive
4. No functionality is broken
5. Accessibility standards are met