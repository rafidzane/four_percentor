# Current Age Tooltip Design

## Overview

This document outlines the design for implementing a tooltip specifically for the "Current age" form field in the retirement dashboard, positioned directly after the label text.

## Current State

Based on my analysis, a tooltip for "Current age" already exists in PersonalSection.tsx and is positioned correctly after the label:
```jsx
<FormLabel htmlFor="timeline.current_age">
  Current age
  <Tooltip>...</Tooltip>
</FormLabel>
```

## Requirements

- Tooltip should appear immediately after "Current age" label text
- Tooltip content should provide helpful context about how current age affects retirement planning
- Maintain existing styling and positioning patterns
- Ensure proper spacing between label text and tooltip
- Preserve accessibility features

## Design Approach

### Implementation Details

The tooltip will be implemented as:
1. A FormLabel component with "Current age" text followed by a Tooltip component
2. The Tooltip will contain:
   - A Button with InfoIcon for the trigger
   - TooltipContent with contextual information
3. Positioning will be to the right side of the label text

### Technical Considerations

- Tooltip positioning: right side (consistent with other tooltips)
- Spacing: ml-1 class for appropriate spacing between label and tooltip
- Accessibility: Maintains keyboard navigation and screen reader support
- Responsive: Works correctly on all device sizes

## Expected Implementation

```jsx
<FormLabel htmlFor="timeline.current_age">
  Current age
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="ghost" size="sm" className="h-4 w-4 p-0 ml-1">
        <InfoIcon className="h-3 w-3 text-muted-foreground" />
      </Button>
    </TooltipTrigger>
    <TooltipContent side="right" className="max-w-xs">
      Your current age in years. This affects how long your retirement will last and when you can start drawing Social Security.
    </TooltipContent>
  </Tooltip>
</FormLabel>
```

## Testing Plan

- Verify tooltip appears immediately after "Current age" label
- Confirm tooltip content is readable and helpful
- Ensure no visual disruption to form layout
- Test accessibility features (keyboard navigation, screen readers)
- Validate responsive behavior across devices

## Success Criteria

- Tooltip positioned correctly after "Current age" label
- Content is clear and informative
- No impact on existing functionality
- Accessibility standards maintained
- Consistent with other tooltip designs in the dashboard