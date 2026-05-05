# Retirement Dashboard Tooltip Position Design

## Overview

This document outlines the design for repositioning tooltips in the retirement dashboard UI components so that they appear directly after each form label text rather than after input fields.

## Current State

Currently, tooltips are positioned to the right of input fields within a flex container. This creates a visual separation between labels and inputs.

## Requirements

- Tooltips should appear immediately after form label text
- Maintain all existing functionality and behavior
- Ensure proper spacing and alignment for accessibility
- Keep consistent styling across all components
- No impact on form validation or data flow

## Design Approach

### Component Modifications

The change will be implemented in the following components:
1. `PersonalSection.tsx` - All form labels and inputs
2. `ReturnsSection.tsx` - All form labels and inputs
3. Other retirement dashboard UI components that use tooltips (if any)

### Implementation Details

Instead of placing tooltips within a flex container with input fields, we'll:
1. Modify the FormLabel structure to include tooltip positioning after label text
2. Use CSS to ensure proper spacing between label text and tooltip
3. Maintain existing tooltip content and behavior
4. Ensure responsive design works correctly

### Technical Considerations

- Tooltip positioning will be adjusted from `right` to inline after label text
- Spacing between label and tooltip needs to be consistent (typically 0.25rem or similar)
- Accessibility: ensure tooltips remain keyboard navigable and screen reader friendly
- Responsive behavior: tooltips should maintain proper positioning on all screen sizes

## Expected Changes

### Before (Current):
```jsx
<FormLabel htmlFor="timeline.current_age">Current age</FormLabel>
<FormControl>
  <div className="flex items-center gap-1">
    <Input ... />
    <Tooltip>...</Tooltip>
  </div>
</FormControl>
```

### After (Proposed):
```jsx
<FormLabel htmlFor="timeline.current_age">
  Current age
  <Tooltip>...</Tooltip>
</FormLabel>
<FormControl>
  <Input ... />
</FormControl>
```

## Implementation Steps

1. Identify all components that use tooltips in the retirement dashboard
2. Modify PersonalSection.tsx to position tooltips after labels
3. Modify ReturnsSection.tsx to position tooltips after labels  
4. Update other components as needed for consistency
5. Test positioning across different screen sizes
6. Verify accessibility and keyboard navigation

## Testing Plan

- Verify all tooltips appear correctly positioned after labels
- Ensure no form functionality is broken
- Check responsive behavior on mobile/tablet/desktop
- Confirm accessibility standards are maintained
- Validate that tooltip content remains unchanged