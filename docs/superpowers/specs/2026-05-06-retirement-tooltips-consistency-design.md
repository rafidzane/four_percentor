# Retirement Dashboard Tooltip Consistency Design

## Overview

This document outlines the approach for standardizing all tooltips in the retirement dashboard to follow a consistent pattern that matches the example structure provided. This will improve visual consistency, maintainability, and user experience.

## Current State Analysis

The retirement dashboard currently implements tooltips throughout the form but with inconsistent patterns:
- Some tooltips are wrapped in flex divs with labels
- Others are positioned differently 
- Visual styling varies between tooltip instances
- Content formatting is inconsistent

## Implementation Requirements

Based on your example, all tooltips should follow this pattern:
```jsx
<div className="flex items-center gap-1">
  <label htmlFor="field-name" className="block font-medium text-xs mb-0.5">Field Label</label>
  
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
        <InfoIcon className="h-3 w-3 text-muted-foreground" />
      </Button>
    </TooltipTrigger>
    <TooltipContent side="right" className="max-w-sm px-3 py-1.5 text-xs">
      Tooltip content explaining the field
    </TooltipContent>
  </Tooltip>
</div>
```

## Standardization Approach

### 1. Consistent Layout Structure
All tooltips will be wrapped in a div with `flex items-center gap-1` to ensure consistent spacing and alignment.

### 2. Uniform Label Styling  
All labels will use the same class structure: `block font-medium text-xs mb-0.5`

### 3. Standardized Tooltip Components
All tooltips will use the same component structure:
- `TooltipTrigger` with `asChild` prop
- `Button` with consistent variant, size and styling 
- `InfoIcon` with consistent sizing and color
- `TooltipContent` with consistent classes: `max-w-sm px-3 py-1.5 text-xs`

### 4. Content Structure
All tooltip content will be formatted consistently with clear explanations of field purposes.

## Implementation Plan

### Phase 1: Update Tooltip Wrapping Pattern
Convert all tooltips to use the flex div pattern throughout the RetirementForm.tsx file.

### Phase 2: Apply Consistent Styling
Ensure all tooltips have identical styling classes and positioning.

### Phase 3: Content Standardization
Standardize tooltip content across all fields for consistency.

## Benefits

- Improved visual consistency across the entire dashboard
- Easier maintenance as all tooltips follow the same pattern
- Better user experience with predictable tooltip placement
- Simplified future modifications to tooltip components

## Risks & Mitigation

- **Risk**: Changes might disrupt existing layout
  - **Mitigation**: Test thoroughly after implementation

- **Risk**: Some tooltips may have content that doesn't fit the standard format
  - **Mitigation**: Review and adjust content as needed while maintaining consistency in structure

## Implementation Order

1. Update all tooltip wrappers to use flex div pattern
2. Apply consistent styling classes across all tooltips  
3. Standardize tooltip content structure
4. Verify all functionality remains intact
5. Test responsive behavior across different screen sizes