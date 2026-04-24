# Two-Person Retirement Calculator V4 - Design Spec

**Date:** 2026-04-23  
**Status:** Draft - Awaiting Review  
**Previous Version:** V3 (monolithic component)

---

## Executive Summary

Design a modular, extensible retirement calculator that supports multiple people, complex assets (property, real estate), multiple account types (retirement accounts, taxable brokerage), scenario comparison, dynamic withdrawal strategies, and comprehensive visualizations.

### Scope

| What's Included | What's Out of Scope |
|-----------------|---------------------|
| Two-person household planning | Corporate retirement plans (401k matching, etc.) |
| Property/real estate integration | Business ownership valuation |
| Retirement accounts (401k, IRA, Roth) | Annuities, life insurance |
| Scenario comparison & what-if analysis | Tax optimization engine |
| Dynamic withdrawal strategies | Monte Carlo simulation (basic only) |
| Year-by-year projections | Estate planning/wills/trusts |

---

## Core Requirements

### Must-Have Features

1. **Multi-Person Planning**
   - Person 1 and Person 2 inputs with flexible age gaps
   - Optional Person 2 toggle
   - Shared retirement age option (couple retires together)

2. **Complex Assets**
   - Liquid savings (checking, savings, brokerage)
   - Real estate (primary residence, rental properties, commercial)
   - Other assets (vehicles, valuable collections, etc.)

3. **Account Types**
   - 401(k) / 403(b) with employer match tracking
   - Traditional IRA
   - Roth IRA
   - Taxable brokerage accounts

4. **Income Sources at Retirement**
   - Social Security benefits (personal + spouse)
   - Portfolio withdrawals
   - Rental income
   - Part-time work income
   - Pension payments

5. **Scenario Comparison**
   - Save multiple retirement age combinations
   - Side-by-side comparison table
   - Visual difference indicators

6. **Withdrawal Strategies**
   - Fixed percentage (4% rule, custom %)
   - Dynamic withdrawal based on portfolio performance
   - Bucket strategy (short-term, mid-term, long-term)
   - Required Minimum Distribution (RMD) calculations

7. **Visualizations**
   - Income breakdown pie chart
   - Growth projection line chart
   - Year-by-year balance table
   - Account allocation chart

8. **Validation & Error Handling**
   - Real-time input validation
   - Clear error messages with field highlighting
   - Validation summary before calculation

---

## Architecture

### Component Structure

```
frontend/src/app/(main)/dashboard/retirement/v4/
├── page.tsx                                    # Route handler
├── _components/
│   ├── CalculatorLayout.tsx                   # Split-view layout container
│   │
│   ├── InputsSection/
│   │   ├── PersonInputs/
│   │   │   ├── PersonInputCard.tsx            # Single person's financial inputs
│   │   │   └── PersonSummary.tsx              # Quick view of person stats
│   │   ├── PropertyInputs/
│   │   │   ├── PropertyList.tsx               # Add/remove properties
│   │   │   ├── PropertyCard.tsx               # Individual property form
│   │   │   └── PropertyTypeSelector.tsx       # Residential, rental, commercial
│   │   └── AccountInputs/
│   │       ├── AccountList.tsx                # Add/remove accounts
│   │       ├── AccountCard.tsx                # Individual account form
│   │       └── AccountTypeSelector.tsx        # 401k, IRA, Roth, Brokerage
│   │
│   ├── ResultsDashboard/
│   │   ├── OverviewMetrics.tsx                # Key household metrics cards
│   │   ├── IncomeBreakdownChart.tsx           # Pie chart of income sources
│   │   └── ProjectionGrowthChart.tsx          # Line chart over time
│   │
│   ├── ScenarioComparison/
│   │   ├── ScenarioManager.tsx                # Add/remove/compare scenarios
│   │   ├── ScenarioSelector.tsx               # Dropdown to switch between saved
│   │   └── ComparisonTable.tsx                # Side-by-side metrics comparison
│   │
│   ├── DetailedBreakdown/
│   │   ├── YearlyProjectionTable.tsx          # Expandable year-by-year details
│   │   ├── AccountBalanceTimeline.tsx         # Per-account growth over time
│   │   └── MonthlyIncomeBreakdown.tsx         # Income sources monthly breakdown
│   │
│   └── WithdrawalStrategy/
│       ├── StrategySelector.tsx               # Choose withdrawal approach
│       ├── DynamicWithdrawalCalculator.tsx    # Algorithmic recommendations
│       └── StrategyRecommendation.tsx         # Display optimized strategy
```

### Data Flow

```
Inputs (Left Panel)
    ↓
User edits form fields → onChange handlers update state
    ↓
State (React Context or Zustand) ← Shared across components
    ↓
Calculate Button → Trigger calculation
    ↓
Calculation Engine (Core Logic)
    ↓
Results State ← Updated with new projections
    ↓
Dashboard (Right Panel) ← Re-renders based on results
```

### State Management Strategy

**Use React Context API** for calculator state because:
- Single source of truth for inputs and results
- Components can subscribe to specific slices
- No external dependencies
- Simple enough for this use case

```typescript
interface CalculatorState {
  // Inputs
  persons: PersonInput[];
  properties: PropertyInput[];
  accounts: AccountInput[];
  
  // Settings
  withdrawalStrategy: WithdrawalStrategyType;
  inflationRate: number;
  targetRetirementYear: number;
  
  // Results (calculated)
  results: CalculationResults | null;
  scenarios: Scenario[];
  isLoading: boolean;
  errors: ValidationError[];
}
```

---

## Component Specifications

### PersonInputCard

**Purpose:** Collect all financial data for a single person

```typescript
interface PersonInput {
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
  
  // Assets at start
  liquidAssets: number;
  propertyValues: Record<propertyId, number>;
  accountBalances: Record<accountId, number>;
  
  // Contributions
  monthlyContribution: number;
  employerMatchRate?: number;  // For 401k
  
  // Returns
  preRetirementReturnRate: number;
  postRetirementReturnRate: number;
  
  // Social Security
  estimatedSSBenefit: number;
  ssClaimingAge: number;
}
```

**UI Elements:**
- Age inputs with range validation
- Asset breakdown by type
- Contribution fields with auto-calculation preview
- Return rate sliders (0-15%)
- Social Security age selector (62-70)

---

### PropertyList & PropertyCard

**Purpose:** Manage real estate portfolio

```typescript
interface PropertyInput {
  id: string;
  name: string;
  type: 'primary_residence' | 'rental' | 'commercial' | 'vacation';
  purchasePrice: number;
  currentValue: number;
  mortgageBalance: number;
  monthlyRentIncome?: number;  // For rental properties
  appreciationRate: number;    // Annual property value growth
}
```

**Features:**
- Add/remove properties dynamically
- Property type selection affects calculations (rental = income, primary = equity)
- Mortgage tracking for net worth calculations

---

### AccountList & AccountCard

**Purpose:** Track retirement and investment accounts

```typescript
interface AccountInput {
  id: string;
  name: string;
  type: '401k' | '403b' | 'traditional_ira' | 'roth_ira' | 'brokerage';
  currentBalance: number;
  monthlyContribution: number;
  employerMatch?: {
    matchRate: number;      // e.g., 0.5 for 50%
    matchLimit: number;     // e.g., 6% of salary
  };
  preRetirementReturn: number;
  postRetirementReturn: number;
}
```

**Features:**
- Account type determines tax treatment
- Employer match tracking (401k matching)
- Separate return rates for accumulation vs withdrawal phases

---

### CalculatorLayout

**Purpose:** Split-view container with responsive behavior

```typescript
<CalculatorLayout>
  {/* Left Panel - Inputs */}
  <InputsSection>
    <PersonInputs />
    <PropertyInputs />
    <AccountInputs />
    <WithdrawalStrategy />
  </InputsSection>
  
  {/* Right Panel - Results */}
  <ResultsDashboard>
    <OverviewMetrics />
    <ScenarioComparison />
    <DetailedBreakdown />
  </ResultsDashboard>
</CalculatorLayout>
```

**Responsive Behavior:**
- Desktop: Left (30%) + Right (70%)
- Tablet: Stacked vertically with toggle
- Mobile: Tab-based navigation

---

### ResultsDashboard Components

#### OverviewMetrics

Display key household metrics in cards:

```typescript
interface HouseholdMetrics {
  totalNetWorth: number;
  liquidSavingsAtRetirement: number;
  monthlyIncomeAtRetirement: number;
  socialSecurityMonthly: number;
  safeWithdrawalAmount: number;
  yearsToRetirement: number;
  retirementPortfolioValue: number;
}
```

#### IncomeBreakdownChart

**Type:** Pie chart  
**Data:** Social Security vs Portfolio Withdrawals vs Rental vs Other  
**Interactive:** Hover to see exact values, click to explode slice

#### ProjectionGrowthChart

**Type:** Line chart with multiple series  
**X-Axis:** Age or Year  
**Y-Axis:** Total Balance ($)  
**Series:**
- Combined household balance
- Person 1 only
- Person 2 only (if different)
- Portfolio value only

**Features:**
- Zoom/pan capability
- Hover tooltip showing age + balance
- Export to PNG button

---

### ScenarioComparison

**Purpose:** Compare multiple retirement plans side-by-side

```typescript
interface Scenario {
  id: string;
  name: string;           // e.g., "Retire at 62", "Retire at 67"
  inputs: CalculatorState;  // Full input snapshot
  results: CalculationResults;
  isBaseLine: boolean;    // Compare against this scenario
}
```

**Features:**
- Add new scenarios from current inputs
- Save/load scenarios from localStorage
- Mark one as "baseline" for comparison
- Color-coded differences (green = better, red = worse)

---

### YearlyProjectionTable

**Purpose:** Detailed year-by-year breakdown with expandable rows

```typescript
interface YearlyProjection {
  age: number;
  totalBalance: number;
  withdrawalAmount: number;
  socialSecurityIncome: number;
  portfolioWithdrawal: number;
  rentalIncome: number;
  taxesPaid: number;
  endingBalance: number;
}
```

**Features:**
- Collapsible rows for each year
- Expand shows: monthly breakdown, account-level changes
- Filter by income source
- Export to CSV button

---

## Calculation Logic

### Core Algorithm

```typescript
function calculateRetirementPlan(inputs: CalculatorState): Results {
  const { persons, properties, accounts, settings } = inputs;
  
  // Step 1: Calculate years to retirement (max of all persons)
  const yearsToRetirement = Math.max(...persons.map(p => p.retirementAge - p.currentAge));
  
  // Step 2: Project asset growth until retirement
  const projectedAssets = accounts.map(account => {
    return projectGrowth({
      currentBalance: account.currentBalance,
      monthlyContribution: account.monthlyContribution,
      preRetirementReturn: account.preRetirementReturn,
      years: yearsToRetirement
    });
  });
  
  // Step 3: Project property values
  const projectedProperties = properties.map(p => {
    return p.currentValue * ((1 + p.appreciationRate) ** yearsToRetirement);
  });
  
  // Step 4: Calculate retirement income
  const totalRetirementAssets = projectedAssets.reduce((sum, a) => sum + a, 0)
    + projectedProperties.reduce((sum, p) => sum + p, 0);
  
  // Step 5: Determine withdrawal strategy
  const withdrawalStrategy = selectWithdrawalStrategy(settings.withdrawalStrategy, totalRetirementAssets);
  
  // Step 6: Project post-retirement years (to age 90 or life expectancy)
  const postRetirementYears = Math.max(...persons.map(p => p.lifeExpectancy - p.retirementAge));
  const sustainabilityResult = testSustainability({
    startingBalance: totalRetirementAssets,
    annualWithdrawal: withdrawalStrategy.monthlyWithdrawal * 12,
    returnRate: settings.postRetirementReturn,
    years: postRetirementYears,
    inflationRate: settings.inflationRate
  });
  
  // Step 7: Calculate monthly income breakdown
  const monthlyIncome = {
    socialSecurity: calculateSocialSecurity(persons),
    portfolioWithdrawal: withdrawalStrategy.monthlyWithdrawal,
    rentalIncome: properties.filter(p => p.type === 'rental').reduce((sum, p) => sum + (p.monthlyRentIncome || 0), 0),
    otherIncome: 0  // Part-time work, pensions
  };
  
  return {
    totalNetWorthAtRetirement: totalRetirementAssets,
    liquidSavingsAtRetirement: projectedAssets[0],  // Assuming first account is liquid
    monthlyIncomeAtRetirement: Object.values(monthlyIncome).reduce((sum, v) => sum + v, 0),
    socialSecurityMonthly: monthlyIncome.socialSecurity,
    safeWithdrawalAmount: withdrawalStrategy.monthlyWithdrawal * 12,
    yearsToRetirement,
    projectedBalanceAt90: sustainabilityResult.endingBalance,
    sustainabilityProbability: sustainabilityResult.successRate,
    recommendedWithdrawalStrategy: withdrawalStrategy.name,
    yearlyProjections: generateYearlyProjections(...)
  };
}
```

### Withdrawal Strategy Types

```typescript
type WithdrawalStrategyType = 
  | 'fixed_percentage'       // e.g., 4% of portfolio each year
  | 'dynamic_withdrawal'     // Adjust for market performance
  | 'bucket_strategy'        // Short/medium/long-term buckets
  | 'rmd_approach'           // Required Minimum Distribution based

interface WithdrawalStrategy {
  name: string;
  monthlyWithdrawal: number;
  annualAdjustmentRate: number;  // Inflation adjustment %
  sustainabilityProbability: number;
  details: string;  // Explanation of strategy
}
```

---

## UI/UX Guidelines

### Color Scheme
- **Primary:** Blue (#3B82F6) for primary actions, main brand
- **Success:** Green (#10B981) for positive metrics, growth
- **Warning:** Yellow (#F59E0B) for cautionary items
- **Danger:** Red (#EF4444) for errors, negative projections
- **Neutral:** Gray (#6B7280) for labels,次要 information

### Form Layout
- Left-aligned labels with top margin
- Error messages below fields in red
- Helper text below inputs (gray, smaller)
- Range sliders for percentages (0-15% return rates)

### Dashboard Layout
- Metrics cards: 3-column grid on desktop, single column on mobile
- Charts: Full width below metrics
- Tables: Scrollable with sticky headers

---

## Technical Implementation Plan

### Phase 1: Core Infrastructure
- [ ] Create project structure and types
- [ ] Implement React Context for state management
- [ ] Build calculation engine (pure functions)
- [ ] Set up form validation utilities

### Phase 2: Input Components
- [ ] Person input forms
- [ ] Property management components
- [ ] Account tracking interface

### Phase 3: Results Dashboard
- [ ] Overview metrics cards
- [ ] Income breakdown charts (Recharts)
- [ ] Projection growth charts

### Phase 4: Advanced Features
- [ ] Scenario comparison system
- [ ] Year-by-year projections
- [ ] Withdrawal strategy calculator

### Phase 5: Polish & Testing
- [ ] Responsive design fixes
- [ ] Accessibility audit
- [ ] Unit tests for calculation engine
- [ ] Integration tests for key flows

---

## Success Criteria

| Criterion | Definition |
|-----------|------------|
| **Performance** | Calculate results in <1 second for typical inputs |
| **Accuracy** | Results match manual calculations within 0.5% |
| **Usability** | Users can complete full setup in <3 minutes |
| **Reliability** | No validation errors show after correct input |
| **Visual Clarity** | All key metrics visible without scrolling on desktop |

---

## Future Enhancements (Stretch)

- Monte Carlo simulation (1000 iterations)
- Tax optimization recommendations
- Social Security claiming strategy optimization
- Estate planning integration
- Mobile app version

---

*End of Design Spec*
