# Retirement Dashboard Section Card Design

## Overview
This document outlines the plan to convert sections in the retirement dashboard form into styled card components with consistent visual presentation. The implementation will follow a phased approach, addressing each major section individually.

## Goal
Transform existing sections in RetirementForm.tsx to use a consistent card-based layout pattern that provides better visual hierarchy and user experience while maintaining all functionality.

## Current State Analysis
The RetirementForm.tsx file contains several distinct sections:
1. Personal Information 
2. Portfolio Assets (including Contributions)
3. Returns Section (integrated with Portfolio Assets)
4. Withdrawal Strategy

Each section currently uses a basic layout approach without consistent card styling.

## Implementation Approach
We'll convert each section systematically, following these steps:
1. Analyze current section structure and content
2. Define the card component pattern to apply
3. Implement the conversion for that specific section
4. Document the changes in this spec file

## Section 1: Personal Information

### Current Structure
The Personal Information section is a single section with:
- Age inputs (current age, retirement age, spouse age, retirement years)
- Grid layout with multiple input fields
- Tooltips for each field description
- Clean but unstyled presentation

### Target Card Pattern
Following the example pattern provided, we'll wrap this section in a card component with:
- `data-slot="card"` attribute
- Consistent styling: bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm
- Card header with title and icon
- Card content area for form elements

### Implementation Plan
1. Wrap the entire Personal Information section in a div with card styling
2. Add card-header with title "Personal Information"
3. Maintain all existing input fields and tooltips
4. Preserve all functionality while improving visual presentation

### Implementation Status
✅ Completed - The Personal Information section has been converted to use the card pattern.

## Section 2: Portfolio Assets

### Current Structure
The Portfolio Assets section contains:
- Investment portfolio inputs
- 401(k)/IRA inputs for user and spouse
- Contribution section with yearly contribution and increase percentage
- Catch-up contributions checkbox
- ReturnsSection component

### Target Card Pattern
Convert this entire section into a card structure that:
- Contains all related form elements in a consistent visual container
- Maintains existing layout while adding card styling
- Ensures proper spacing and visual hierarchy

### Implementation Plan
1. Wrap the entire Portfolio Assets section in a div with card styling
2. Add card-header with title "Portfolio Assets" 
3. Maintain all existing input fields, tooltips, and ReturnsSection component
4. Preserve all functionality while improving visual presentation

### Implementation Status
✅ Completed - The Portfolio Assets section has been converted to use the card pattern.

## Section 3: Withdrawal Strategy

### Current Structure
The Withdrawal Strategy section contains:
- Spending mode selection (4% rule or manual withdrawal)
- Adjust for inflation checkbox
- Various spending-related inputs and configurations
- Tooltips for each field description
- Clean but unstyled presentation

### Target Card Pattern
Convert this entire section into a card structure that:
- Contains all related form elements in a consistent visual container
- Maintains existing layout while adding card styling
- Ensures proper spacing and visual hierarchy

### Implementation Plan
1. Wrap the entire Withdrawal Strategy section in a div with card styling
2. Add card-header with title "Withdrawal Strategy"
3. Maintain all existing input fields, tooltips, and functionality
4. Preserve all functionality while improving visual presentation

### Implementation Status
✅ Completed - The Withdrawal Strategy section has been converted to use the card pattern.

## Section 4: Income Sources

### Current Structure
The Income Sources section contains:
- Social Security inputs for you and your spouse
- Pension 1 and Pension 2 inputs
- Rental properties inputs (up to 3 properties)
- Various input fields with tooltips for each description
- Clean but unstyled presentation

### Target Card Pattern
Convert this entire section into a card structure that:
- Contains all related form elements in a consistent visual container
- Maintains existing layout while adding card styling
- Ensures proper spacing and visual hierarchy
- Uses appropriate icon (coins) to represent income sources

### Implementation Plan
1. Wrap the entire Income Sources section in a div with card styling
2. Add card-header with title "Income Sources" and coins icon
3. Maintain all existing input fields, tooltips, and functionality
4. Preserve all functionality while improving visual presentation

### Implementation Status
✅ Completed - The Income Sources section has been converted to use the card pattern.

## Proposed Enhancement: Checkbox-based Income Sources

### Overview
To improve user experience and reduce form clutter, we propose implementing a checkbox-based system for Income Sources where users can select which income sources they want to include in their retirement planning.

### Implementation Plan
1. **Frontend Changes**:
   - Add checkboxes for each income source type (Social Security, Pension 1, Pension 2, Rental Properties)
   - Conditionally render form fields based on checkbox selections
   - Maintain all existing validation and functionality
   - Update tooltips to appear after labels consistently

2. **Backend Changes**:
   - Modify the data model to support optional income sources with boolean flags
   - Update API endpoints to handle the new structure
   - Adjust validation logic for conditional fields
   - Ensure backward compatibility

3. **User Experience Improvements**:
   - Clear visual indication of which sources are selected
   - Dynamic form rendering based on selections
   - Maintain all existing tooltips and validation messages

### Current Status
🔄 In Progress - Analysis complete, implementation plan proposed

### Benefits
- Reduces form clutter for users with limited income sources
- Improves accessibility by showing only relevant fields
- Maintains all existing functionality while enhancing usability