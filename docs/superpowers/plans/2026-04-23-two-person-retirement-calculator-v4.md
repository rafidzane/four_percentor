# Two-Person Retirement Calculator V4 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the monolithic TwoPersonRetirementCalculator.tsx with a modular, extensible architecture supporting multiple people, complex assets (property/real estate), multiple account types (401k, IRA, Roth, brokerage), scenario comparison, dynamic withdrawal strategies, and comprehensive visualizations.

**Architecture:** Split-view layout with left panel for inputs (organized in tabs: Person, Property, Accounts) and right panel for results dashboard. State managed via React Context API. Calculation engine uses pure functions. Visualizations use Recharts.

**Tech Stack:** React 19 + TypeScript, Recharts, Tailwind CSS v4, React Context API

---

## File Structure

```
frontend/src/app/(main)/dashboard/retirement/v4/
├── page.tsx                                    # Main route handler
└── _components/
    ├── CalculatorLayout.tsx                   # Split-view container
    ├── InputsSection/
    │   ├── PersonInputs/
    │   │   ├── PersonInputCard.tsx            # Single person inputs
    │   │   └── PersonSummary.tsx              # Quick view of person stats
    │   ├── PropertyInputs/
    │   │   ├── PropertyList.tsx               # Add/remove properties
    │   │   ├── PropertyCard.tsx               # Individual property form
    │   │   └── PropertyTypeSelector.tsx       # Type selector component
    │   └── AccountInputs/
    │       ├── AccountList.tsx                # Add/remove accounts
    │       ├── AccountCard.tsx                # Individual account form
    │       └── AccountTypeSelector.tsx        # Account type selector
    ├── ResultsDashboard/
    │   ├── OverviewMetrics.tsx                # Key metrics cards
    │   ├── IncomeBreakdownChart.tsx           # Pie chart of income sources
    │   └── ProjectionGrowthChart.tsx          # Line chart over time
    ├── ScenarioComparison/
    │   ├── ScenarioManager.tsx                # Add/remove/compare scenarios
    │   ├── ScenarioSelector.tsx               # Switch between saved scenarios
    │   └── ComparisonTable.tsx                # Side-by-side comparison table
    ├── DetailedBreakdown/
    │   ├── YearlyProjectionTable.tsx          # Expandable year-by-year details
    │   ├── AccountBalanceTimeline.tsx         # Per-account growth timeline
    │   └── MonthlyIncomeBreakdown.tsx         # Income sources breakdown
    └── WithdrawalStrategy/
        ├── StrategySelector.tsx               # Choose withdrawal approach
        ├── DynamicWithdrawalCalculator.tsx    # Algorithmic recommendations
        └── StrategyRecommendation.tsx         # Display optimized strategy

frontend/src/app/(main)/dashboard/retirement/_components/types/index.ts
```
