# Two-Person Retirement Calculator - Enhanced Design

**Date:** 2026-04-23  
**Status:** Approved for implementation  
**Author:** Brainstorming session

---

## 1. Overview

### 1.1 Purpose
Enhance the two-person retirement calculator with:
- Interactive visualizations (charts, graphs)
- Scenario comparison functionality
- Detailed year-by-year projection breakdown
- Modular component architecture for maintainability

### 1.2 Scope
- Replace monolithic `TwoPersonRetirementCalculator.tsx` with modular components
- Add visualization tab with projection growth and income breakdown charts
- Add scenario comparison tab for side-by-side retirement age/ contribution comparisons
- Add detailed breakdown tab with year-by-year projection table
- Reuse existing validation logic from v2 single-person calculator

### 1.3 Out of Scope
- Backend API changes (reuse existing `/v3/retirement/calculate` endpoint)
- Authentication or user accounts
- Data persistence between sessions

---

## 2. Architecture

### 2.1 Component Structure
```
frontend/src/app/(main)/dashboard/retirement/two-person/
├── page.tsx                           # Main page with 4 tabs
└── _components/
    ├── TwoPersonRetirementCalculator.tsx  # Orchestrator component
    ├── PersonInputsSection/
    │   ├── PersonInputCard.tsx         # Individual person inputs (collapsible)
    │   └── PersonToggle.tsx            # Toggle Person 2 visibility
    ├── SharedRetirementSettings.tsx     # Shared retirement age toggle
    ├── ResultsDashboard/
    │   ├── PrimaryMetrics.tsx          # Key household metrics
    │   ├── IncomeBreakdownChart.tsx    # Pie chart: SS vs withdrawals
    │   └── ProjectionGrowthChart.tsx   # Line chart: projection over time
    ├── ScenarioComparison/
    │   ├── ScenarioSelector.tsx        # Select retirement age options
    │   └── ComparisonTable.tsx         # Side-by-side comparison table
    └── DetailedBreakdown/
        ├── ProjectionDetails.tsx       # Individual person breakdown
        └── YearlyProjectionTable.tsx   # Year-by-year projection with embedded chart
```

### 2.2 Data Flow
1. User inputs data → validation → API call
2. Results stored in state → displayed across tabs
3. Scenario comparisons re-use same calculation logic with different inputs

---

## 3. Tab Structure

### 3.1 Overview Tab
**Purpose:** Input collection and primary metrics display

**Components:**
- `PersonInputCard` (x2, Person 1 + Person 2)
- `SharedRetirementSettings` (checkbox + indicator showing driving value)
- `PrimaryMetrics` (6 key household metrics)

**Inputs per person:**
- Current age (18-100)
- Retirement age (> current age, ≤100)
- Liquid assets (≥0)
- Illiquid assets (≥0)
- Monthly contribution (≥0)
- Expected annual return (0-100%)
- Social Security age (62-70)
- Expected lifespan (> retirement age, ≤120)

### 3.2 Visualization Tab
**Purpose:** Visual representation of projections

**Components:**
- `ProjectionGrowthChart` - Line chart showing projection over time
  - X-axis: Years until retirement
  - Y-axis: Projected balance ($)
  - Lines: Person 1, Person 2, Household total
  
- `IncomeBreakdownChart` - Pie chart showing income sources at retirement
  - Segments: Social Security, Portfolio withdrawal, Other income

### 3.3 Scenarios Tab
**Purpose:** Compare different retirement scenarios side-by-side

**Components:**
- `ScenarioSelector`
  - Preset options: "Retire at 62", "Retire at 67", "Retire at 70"
  - Custom input for specific ages
  - "Add scenario" button
  
- `ComparisonTable`
  - Columns: Each saved scenario
  - Rows: Total Net Worth, Liquid Savings, Monthly Income, Social Security, Years to Retirement
  - Highlight best/worst values per metric

### 3.4 Details Tab
**Purpose:** Deep dive into year-by-year projections

**Components:**
- `ProjectionDetails` - Individual person breakdown cards
- `YearlyProjectionTable` - Year-by-year projection with embedded chart
  - Columns: Age, Balance, Withdrawal, Social Security, Expenses, Remaining Balance
  - Expandable rows for detailed breakdown
  - Embedded line chart showing balance trajectory

---

## 4. Key Features

### 4.1 Shared Retirement Age Toggle
- Checkbox: "Same retirement age for both"
- Visual indicator showing which person's age is driving the shared value (e.g., "Same as Person 1: 62")
- Auto-syncs Person 2's retirement age when enabled
- Disables Person 2's retirement age input field when active

### 4.2 Validation
- Reuse existing validation logic from `calculateRetirement.ts`
- Add cross-person validation (e.g., both can't retire next year)
- Inline error messages with red border + helper text
- Disable calculate button until all validations pass

### 4.3 Chart Visualization
- Use Recharts library (already in package.json)
- Projection growth chart: Combined line chart for all three lines
- Income breakdown chart: Pie chart showing source distribution
- Yearly projection table: Embedded mini-chart per row or section-wide chart

### 4.4 Scenario Comparison
- Save scenarios to state (not localStorage/session)
- Side-by-side comparison table
- Visual highlighting of best values per metric
- Add/remove scenarios dynamically

---

## 5. Implementation Notes

### 5.1 Tech Stack
- React 19 + TypeScript (strict mode)
- Recharts for charts
- Tailwind CSS v4 for styling
- Zustand if state complexity grows (already in dependencies)

### 5.2 API Integration
- Keep existing `twoPersonRetirementApi.calculateTwoPersonRetirement()` endpoint
- Consider caching for scenario comparisons to avoid redundant API calls
- Error handling: same pattern as v1/v2

### 5.3 State Management
- Local React state for inputs and results
- Consider Context API if state propagation becomes complex
- Keep calculations in separate utility files for testability

### 5.4 Testing Strategy
- Unit tests for each component (using vitest)
- Integration tests for form validation flow
- Snapshot tests for chart components

---

## 6. Success Criteria

- [ ] All inputs have proper validation with clear error messages
- [ ] Charts render correctly and update when inputs change
- [ ] Scenario comparison shows accurate side-by-side metrics
- [ ] Yearly projection table is performant (virtualized if needed)
- [ ] Responsive design works on mobile, tablet, and desktop
- [ ] Code follows existing patterns in single-person calculator
- [ ] Test coverage ≥80% for new components

---

## 7. Future Enhancements (Out of Scope)

- Export data to CSV/PDF
- Save/load scenarios from backend
- Historical performance charts
- Tax optimization recommendations
- Healthcare cost projection
- Inflation-adjusted projections
