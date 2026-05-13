# RetirementForm Refactoring Design

## Overview
This document outlines the approach for refactoring the large RetirementForm component into smaller, more manageable sections while maintaining all existing functionality and UI.

## Architecture Approach
The refactoring will follow a component-based architecture where each logical section of the form becomes its own React component that is imported and composed in the main RetirementForm.

## Component Breakdown

### 1. Personal Information Section
- **File**: `PersonalInformationSection.tsx`
- **Responsibilities**: 
  - Age inputs (current age, retirement age, spouse age, retirement years)
  - All tooltips and validation for these fields
  - Maintains existing card layout styling

### 2. Portfolio Assets Section  
- **File**: `PortfolioAssetsSection.tsx`
- **Responsibilities**:
  - Investment portfolio inputs
  - 401(k)/IRA inputs for user and spouse
  - Contribution section with yearly contribution and increase percentage
  - Catch-up contributions checkbox
  - ReturnsSection component integration
  - Maintains existing card layout styling

### 3. Withdrawal Strategy Section
- **File**: `WithdrawalStrategySection.tsx`
- **Responsibilities**:
  - Spending mode selection
  - Adjust for inflation checkbox
  - Period 1 configuration (age ranges, type toggle, value input)
  - Period 2 configuration with toggle to enable/disable
  - All existing form logic and validation
  - Maintains existing card layout styling

### 4. Income Sources Section
- **File**: `IncomeSourcesSection.tsx`
- **Responsibilities**:
  - Social Security (You and Spouse)
  - Pension 1 and Pension 2 inputs
  - Rental properties section with up to 3 properties
  - All tooltips and validation for income sources

### 5. Real Estate Section
- **File**: `RealEstateSection.tsx`
- **Responsibilities**:
  - Primary home information (value, mortgage, appreciation)
  - Rental properties section with up to 3 properties
  - Downsizing plan configuration
  - All tooltips and validation for real estate inputs

## Implementation Strategy

### Step 1: Create Individual Component Files
Each component will be created in the same directory structure:
```
frontend/src/app/(main)/dashboard/retirement/_components/
├── PersonalInformationSection.tsx
├── PortfolioAssetsSection.tsx
├── WithdrawalStrategySection.tsx
├── IncomeSourcesSection.tsx
├── RealEstateSection.tsx
└── RetirementForm.tsx (main file that imports all components)
```

### Step 2: Maintain Data Flow
- All form state management will be handled by the main RetirementForm component using React Hook Form
- Each section component will receive appropriate props for:
  - Form control functions (`register`, `watch`)
  - Form values
  - Error handling

### Step 3: Preserve UI Consistency
- All styling and layout patterns will remain identical to current implementation
- Card-based design patterns will be maintained
- Tooltip functionality will be preserved
- All validation behavior will be unchanged

## Technical Considerations

### TypeScript Integration
- Each new component will have proper TypeScript interfaces matching the original data models
- Form types will be properly exported and imported between components
- Type safety will be maintained throughout the refactoring process

### Component Communication
- The main RetirementForm component will manage all form state through React Hook Form
- Components will receive only necessary props for their specific functionality
- No direct communication between child components - all goes through parent

### Testing Approach
- All existing tests should continue to pass after refactoring
- Each component can be tested independently
- Integration testing will ensure proper data flow between components

## Migration Plan

1. Create new component files with identical content from original RetirementForm
2. Update main RetirementForm.tsx to import and render the new components
3. Verify all functionality works exactly as before
4. Test all form interactions, validation, and submission
5. Clean up unused code in the main file if needed