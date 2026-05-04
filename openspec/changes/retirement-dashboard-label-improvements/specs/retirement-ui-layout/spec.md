# Retirement UI Layout Specification

## Overview

This specification defines the layout improvements for the retirement dashboard UI, specifically focusing on reorganizing the Returns Simulation section to appear under Contributions within the Personal Information section.

## Requirements

### Functional Requirements

1. **Layout Restructuring**: The Returns Simulation section must be moved directly after the Contributions section in the Personal Information section.
2. **Label Simplification**: Remove redundant "Yearly" terminology from contribution-related form labels.
3. **Visual Consistency**: Maintain consistent styling and spacing within the reorganized layout.
4. **No Functional Changes**: All existing functionality, validation, and data binding must remain intact.

### Non-Functional Requirements

1. **Backward Compatibility**: No breaking changes to API contracts or data models.
2. **Performance**: No impact on page load time or form processing performance.
3. **Accessibility**: Maintain WCAG AA compliance for all form elements.
4. **Responsive Design**: All layout changes must work properly across mobile, tablet, and desktop screens.

## Implementation Details

### Layout Changes

1. **Section Reorganization**:
   - Remove the separate Returns Simulation section that currently appears as a standalone card
   - Integrate Returns Simulation content directly after the Contributions section within the Personal Information container
   - Preserve all existing form fields and conditional rendering logic

2. **Label Updates**:
   - "Yearly contribution" → "Contribution"
   - "Yearly contribution increase %" → "Contribution increase %"

### Data Flow

1. All form field names and data binding remain unchanged
2. All validation rules are preserved
3. All conditional rendering logic for simulation modes remains intact
4. No changes to backend API contracts or data models

## Success Criteria

1. Returns Simulation section appears directly after Contributions in Personal Information section
2. All form labels have been updated as specified
3. All existing functionality works exactly as before
4. No visual regressions or broken components
5. All tests pass without modification

## Acceptance Criteria

1. The UI flow is intuitive and logical for users configuring retirement parameters
2. The change reduces cognitive load by grouping related configuration elements together
3. All form validation continues to work correctly
4. Mobile responsiveness is maintained across all screen sizes