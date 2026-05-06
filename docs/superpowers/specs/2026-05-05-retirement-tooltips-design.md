# Retirement Dashboard Tooltip Implementation Design

## Overview

This document outlines the design for implementing consistent tooltips in the Personal Information section of the retirement dashboard form. The implementation will follow the styling and structure shown in the ReturnsSection component, ensuring consistency across the application.

## Current State Analysis

The current Personal Information section (lines 210-260 in RetirementForm.tsx) contains four fields:
1. Current age
2. Retirement age  
3. Spouse age (optional)
4. Years in retirement

Currently, these fields do not have tooltips implemented, though the form imports all necessary tooltip components.

## Design Requirements

### Visual Implementation
- All labels in the Personal Information section will be wrapped in a div structure matching the example:
```jsx
<div className="space-y-1">
  <div className="flex items-center gap-1">
    <label htmlFor="timeline.current_age" className="block font-medium text-xs mb-0.5">Current age</label>
    <Tooltip>...</Tooltip>
  </div>
</div>
```

### Tooltip Structure
Each tooltip will follow the pattern used in ReturnsSection:
- TooltipTrigger with `asChild` prop wrapping an InfoIcon button
- TooltipContent positioned to the right side
- Max-width constraint of max-w-xs for readability
- Consistent styling with existing tooltip components

### Content Guidelines
Each tooltip should provide contextual help explaining:
1. Current age - Your current age. This is used to calculate your retirement timeline and determine when you'll enter retirement.
2. Retirement age - The age at which you plan to retire. This affects how long your retirement savings need to last.
3. Spouse age (optional) - Your spouse's current age, if applicable. Used for joint retirement planning calculations.
4. Years in retirement - The number of years you expect to be retired. This determines how long your savings must sustain you.

## Implementation Plan

### Component Structure
The Personal Information section will be updated to:
1. Import necessary components (Tooltip, TooltipTrigger, TooltipContent, Button, InfoIcon)
2. Wrap each label in the required div structure
3. Add appropriate tooltip content for each field
4. Maintain existing form functionality and validation

### Files to Modify
- `/home/rafid/devel/four_percentor/frontend/src/components/retirement-dashboard/ui/RetirementForm.tsx`

## Success Criteria
1. All four fields in Personal Information section have tooltips
2. Tooltips appear consistently on hover
3. Tooltip content is clear and helpful
4. No functional changes to existing form behavior
5. Visual consistency with other tooltip implementations in the application

## Testing Approach
1. Verify all tooltips display correctly when hovering over info icons
2. Ensure tooltips don't interfere with form functionality
3. Confirm no regressions in form validation or data submission
4. Test responsiveness across different screen sizes
