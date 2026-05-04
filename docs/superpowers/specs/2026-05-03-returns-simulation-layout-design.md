# Returns Simulation Layout Design

## Overview

This document outlines the design for reorganizing the retirement dashboard's UI to move the Returns Simulation section under the Contributions section within the Personal Information section. This change improves the logical grouping of related configuration parameters and creates a more intuitive user experience.

## Current State Analysis

The existing retirement form structure has the following sections:
1. Personal Information (timeline fields)
2. Portfolio Assets 
3. Contributions
4. Returns & Inflation (separate section)
5. Withdrawal Strategy

The Returns & Inflation section is currently positioned as a separate section after Contributions, but it's conceptually related to investment configuration parameters that are grouped with contributions.

## Proposed Solution

### 1. Improved Section Organization

The redesigned UI will restructure the Personal Information section to:
- Keep all personal timeline information in one place
- Group Portfolio Assets and Contributions together logically 
- Position Returns Simulation immediately after Contributions within the same section container
- Maintain clear visual separation between different logical groups

### 2. Component Structure

#### Personal Information Section (Updated)
1. Timeline fields (current age, retirement age, etc.)
2. Portfolio Assets section:
   - Investment portfolio
   - Your 401(k) / IRA  
   - Spouse 401(k) / IRA
3. Contributions section:
   - Yearly contribution
   - Yearly contribution increase %
   - Catch-up eligibility (age 50+)
4. Returns Simulation section (moved directly after Contributions):
   - Simulation mode selection
   - Manual input fields (if selected)
   - Single year selection (if selected)

### 3. Visual Design

#### Layout Structure:
- All inputs organized in clear sections with appropriate spacing
- The Returns Simulation section appears immediately after Contributions 
- Consistent styling throughout the Personal Information section
- Clear visual hierarchy with section headers

#### Visual Hierarchy:
- Personal Information title as primary header
- Portfolio Assets, Contributions, and Returns Simulation as sub-sections within same container
- Consistent padding and spacing between sections

### 4. User Experience Improvements

1. **Logical Grouping**: Related configuration parameters stay together (portfolio assets, contributions, returns)
2. **Clear Flow**: Users can configure their entire investment strategy in sequence
3. **Reduced Navigation**: No need to scroll between separate sections for related information
4. **Better Context**: Returns simulation settings are immediately adjacent to contribution inputs

## Implementation Details

### Technical Approach
1. Modify the RetirementForm.tsx component to reorganize section placement
2. Move Returns Simulation content directly after Contributions within Personal Information section
3. Preserve all existing form validation logic and data flow
4. Maintain consistent styling with existing components

### Data Model Changes
The data model remains unchanged - this is purely a UI layout change:
- All existing field names and structure remain the same
- No changes to form handling or validation logic

## Benefits

1. **Improved Usability**: Users can configure their entire investment strategy in logical sequence
2. **Better Information Architecture**: Related fields are grouped together for easier comprehension  
3. **Reduced Cognitive Load**: Less scrolling and mental mapping between sections
4. **Maintained Functionality**: All existing features preserved with improved layout

## Risks and Mitigations

1. **Layout Complexity**: Adding more fields to Contributions section - Mitigation: Use appropriate spacing and visual separation
2. **User Adaptation**: Users may need time to adjust to new layout - Mitigation: Clear section headers guide the user
3. **Validation Logic**: Cross-validation between periods - Mitigation: Preserve existing validation logic

## Implementation Plan

1. Modify RetirementForm.tsx to reorganize section placement
2. Move Returns Simulation content immediately after Contributions section
3. Ensure all form elements maintain proper functionality 
4. Test with various combinations of inputs
5. Verify that existing data flows remain intact
6. Conduct usability testing with team members

## Design Impact

This change will significantly improve the user experience by creating a more logical flow for configuring retirement investment parameters, making it easier for users to set up their entire portfolio strategy in one cohesive section.