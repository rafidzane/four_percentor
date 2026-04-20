# Currency Formatting Spec

## Overview
Ensure all monetary values display with consistent, user-friendly formatting.

## Requirements

### 1. Format Pattern
- Currency: USD ($)
- Thousands separator: comma (,)
- Decimal places: 0 (round to whole dollars for display)

### 2. Fields Requiring Formatting
- Liquid assets
- Illiquid assets  
- Total liquid savings at retirement
- Total net worth at retirement
- Monthly income at retirement
- Social security benefits
- Safe withdrawal amount

### 3. Implementation Requirements
- Use `Intl.NumberFormat` with:
  - `style: 'currency'`
  - `currency: 'USD'`
  - `minimumFractionDigits: 0`
  - `maximumFractionDigits: 0`

## Acceptance Criteria
1. All monetary values display with $ prefix
2. Thousands separated by commas (e.g., $1,234,567)
3. No decimal places shown
4. Zero values display as $0
