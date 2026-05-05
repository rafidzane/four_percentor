# Retirement Dashboard Tooltips Implementation Design

## Overview
This document outlines the implementation plan for adding tooltips to all labels in the retirement dashboard UI. The goal is to provide users with helpful context and explanations without cluttering the interface.

## Current State Analysis
The retirement dashboard currently has several form fields with descriptive labels, but many of them would benefit from additional explanation to help users understand what values to enter and why certain inputs matter.

## Requirements
1. Add tooltips to all form labels that need clarification
2. Ensure tooltips provide helpful context without being overly verbose
3. Maintain consistent styling with existing tooltip components
4. Position tooltips appropriately for good UX (typically on the right side)
5. Preserve all existing functionality and data flow

## Labels Requiring Tooltips

### Timeline Section
- Current age: Age of the user at the start of retirement planning
- Retirement age: Age when the user expects to retire
- Spouse age (optional): Age of spouse for joint planning
- Years in retirement: Total number of years expected in retirement

### Portfolio Assets Section
- Investment portfolio: Taxable brokerage, ETFs, mutual funds balance
- Your 401(k) / IRA: Individual retirement account balance
- Spouse 401(k) / IRA: Spouse retirement account balance

### Contributions Section  
- Yearly contribution: Amount contributed to retirement accounts annually
- Yearly contribution increase %: Annual percentage increase in contributions
- Catch-up contributions (age 50+): Option for additional contributions after age 50

### Returns Simulation Section (from ReturnsSection component)
- Returns simulation mode: How returns are calculated
- Pre-retirement equity return %: Expected equity return before retirement
- Post-retirement equity return %: Expected equity return during retirement
- Fixed income return %: Expected fixed income return (bonds, CDs)
- Inflation rate %: Annual inflation rate for expense projections
- Historical year: Specific year to simulate market data

### Withdrawal Strategy Section (newly compacted)
- Spending mode: How spending is calculated
- Adjust for inflation: Whether to adjust spending for inflation
- Period 1 configuration: First period spending parameters
- Period 2 configuration: Second period spending parameters
- Period 1 start age: Start age of first period
- Period 1 end age: End age of first period
- Period 1 withdrawal %: Percentage of portfolio withdrawn in first period
- Period 2 start age: Start age of second period
- Period 2 end age: End age of second period
- Period 2 withdrawal %: Percentage of portfolio withdrawn in second period

## Implementation Approach

### 1. Tooltips Component Usage
The project already has a `Tooltip`, `TooltipTrigger`, and `TooltipContent` component available from `@/components/ui/tooltip`. These will be used to implement tooltips consistently.

### 2. Tooltip Content Guidelines
- Keep tooltip content concise (3-5 sentences max)
- Focus on providing context, not just repeating the label text
- Explain what the field means, why it matters, and what reasonable values might be
- Use simple, accessible language

### 3. Implementation Pattern
Following the existing pattern in ReturnsSection:
```jsx
<Tooltip>
  <TooltipTrigger asChild>
    <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
      <InfoIcon className="h-3 w-3 text-muted-foreground" />
    </Button>
  </TooltipTrigger>
  <TooltipContent side="right" className="max-w-xs">
    Tooltip content here
  </TooltipContent>
</Tooltip>
```

## Implementation Plan

### Phase 1: Label Analysis
1. Identify all labels in the form that would benefit from tooltips
2. Determine appropriate tooltip content for each label
3. Create consistent messaging guidelines

### Phase 2: Tooltips Implementation
1. Add tooltips to all relevant labels in RetirementForm.tsx
2. Add tooltips to labels in ReturnsSection.tsx (if needed)
3. Ensure proper positioning and styling

### Phase 3: Testing and Validation
1. Verify that tooltips work correctly on all form elements
2. Test accessibility with screen readers
3. Ensure no layout issues or conflicts with existing UI

## Success Metrics
- All relevant labels have tooltips with helpful context
- Tooltips are positioned appropriately (right side)
- No visual regression in form layout
- Tooltips are accessible and readable
- No performance impact from tooltip implementation