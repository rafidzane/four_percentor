# Retirement Dashboard Tooltip Standardization Design

## Overview

This document outlines the approach for standardizing tooltips across the retirement dashboard form to ensure consistent visual presentation, positioning, and content structure.

## Current State Analysis

The retirement dashboard form currently implements tooltips in multiple locations but with inconsistent styling and positioning. Key observations include:

1. **Visual Inconsistencies**:
   - Some tooltips use `max-w-xs` while others don't
   - Different padding/margin styles applied
   - Varying tooltip positioning (right, top, etc.)

2. **Content Inconsistencies**:
   - Tooltip text varies in length and structure
   - No consistent template or format for explanations
   - Some tooltips are more detailed than others

3. **Placement Inconsistencies**:
   - Info icons placed in different locations relative to labels
   - Mixed positioning of tooltip content

## Standardization Approach

### Visual Consistency
All tooltips will use the same styling classes:
- `max-w-sm` (consistent width)
- Standard padding (`px-3 py-1.5`)
- Same side positioning (`side="right"`)
- Consistent typography and color scheme

### Content Structure
Tooltips will follow a consistent structure:
1. **Purpose/Definition** - Clear explanation of what the field does
2. **Context/Examples** - Relevant context or example values when appropriate  
3. **Important Notes** - Any warnings or considerations users should know

### Implementation Plan
1. Update all tooltip components in RetirementForm.tsx to use consistent styling
2. Standardize the content structure for tooltip text
3. Ensure consistent positioning of info icons
4. Apply changes to related components (ReturnsSection.tsx)

## Benefits

- Improved user experience through consistent interface elements
- Easier maintenance and updates to tooltip content
- Better visual coherence across the dashboard
- Reduced cognitive load for users navigating the form

## Risks & Mitigation

- **Risk**: Changes might alter existing user expectations
  - **Mitigation**: Test with a subset of users before full rollout

- **Risk**: Some tooltips may need content revision to fit structure  
  - **Mitigation**: Prioritize critical fields first, then expand to others

## Implementation Order

1. Update tooltip styling in RetirementForm.tsx (primary component)
2. Update tooltip styling in ReturnsSection.tsx 
3. Review and standardize content across all tooltips
4. Test with existing form validation and functionality