# Two-Person Retirement Calculator - Enhanced Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the monolithic TwoPersonRetirementCalculator.tsx with a modular, feature-rich architecture including charts, scenario comparison, and year-by-year projections

**Architecture:** Split into 4 tab sections (Overview, Visualization, Scenarios, Details) with 10+ focused components following the single-person calculator's pattern. Use Recharts for visualizations, reuse existing validation logic from calculateRetirement.ts.

**Tech Stack:** React 19 + TypeScript, Recharts, Tailwind CSS v4

---

## File Structure

```
frontend/src/app/(main)/dashboard/retirement/two-person/
├── page.tsx                                    # Main page with 4 tabs (MODIFY)
└── _components/
    ├── TwoPersonRetirementCalculator.tsx       # Orchestrator component (REPLACE)
    ├── PersonInputsSection/                    # NEW: Person input management
    │   ├── PersonInputCard.tsx                 # Individual person inputs
    │   └── PersonToggle.tsx                    # Toggle Person 2 visibility
    ├── SharedRetirementSettings.tsx            # NEW: Shared retirement age toggle
    ├── ResultsDashboard/                       # NEW: Results display with charts
    │   ├── PrimaryMetrics.tsx                  # Key household metrics
    │   ├── IncomeBreakdownChart.tsx            # Pie chart
    │   └── ProjectionGrowthChart.tsx           # Line chart
    ├── ScenarioComparison/                     # NEW: What-if scenarios
    │   ├── ScenarioSelector.tsx                # Select retirement age options
    │   └── ComparisonTable.tsx                 # Side-by-side comparison
    └── DetailedBreakdown/                      # NEW: Year-by-year details
        ├── ProjectionDetails.tsx               # Individual person breakdown
        └── YearlyProjectionTable.tsx           # Year-by-year projection table
```

---

## Prerequisites

### Task 0: Create utility type interfaces

**Files:**
- Modify: `frontend/src/app/(main)/dashboard/retirement/_components/types/index.ts:57-58` (add new types)

**Step 1:** Add TwoPersonCalculationResults interface to extend existing CalculationResults

```typescript
export interface TwoPersonCalculationResults {
  projection1: CalculationResults;
  projection2: CalculationResults | null;
  householdProjection: {
    totalNetWorthAtRetirement: number;
    totalLiquidSavingsAtRetirement: number;
    monthlyIncomeAtRetirement: number;
    combinedSocialSecurityBenefit: number;
    safeWithdrawalAmount: number;
    yearsToRetirement: number;
    recommendedWithdrawalStrategy: string;
  };
}
```

**Step 2:** Add SharedRetirementSettingsState interface

```typescript
export interface SharedRetirementSettingsState {
  sameRetirementAge: boolean;
  drivingPerson: 'person1' | 'person2';
  sharedRetirementAge: number;
}
```

---

## Task 1: Create PersonInputCard component

**Files:**
- Create: `frontend/src/app/(main)/dashboard/retirement/two-person/_components/PersonInputsSection/PersonInputCard.tsx`
- Test: `frontend/src/app/(main)/dashboard/retirement/two-person/_components/PersonInputsSection/__tests__/PersonInputCard.test.tsx`

**Step 1:** Create PersonInputCard component with all input fields

```typescript
'use client';

import { useState } from 'react';
import type { RetirementParams, ValidationError } from '../../../_components/calculateRetirement';

interface Props {
  personName: string;
  inputs: RetirementParams;
  onChange: (inputs: RetirementParams) => void;
  errors: ValidationError[];
  disabled?: boolean;
}

export default function PersonInputCard({
  personName,
  inputs,
  onChange,
  errors,
  disabled = false,
}: Props) {
  const [localErrors, setLocalErrors] = useState<ValidationError[]>(errors);

  const handleChange = (field: keyof RetirementParams, value: number | '') => {
    const newValue = value === '' ? '' : Number(value);
    onChange({ ...inputs, [field]: newValue });
    
    // Re-validate
    const newErrors = validateInputs({ [field]: newValue } as any) as ValidationError[];
    setLocalErrors(newErrors);
  };

  const renderInput = (
    label: string,
    field: keyof RetirementParams,
    min?: number,
    max?: number,
    helperText?: string,
  ) => {
    const error = localErrors.find((e) => e.field === field);
    
    return (
      <div>
        <label className="mb-1 block font-semibold text-gray-700 text-xs">
          {label}
        </label>
        <input
          type="number"
          value={inputs[field] === '' ? '' : inputs[field]}
          onChange={(e) => {
            const val = e.target.value;
            handleChange(field, val === '' ? '' : Number(val));
          }}
          disabled={disabled}
          className={`w-full rounded-lg border px-2 py-1.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2 ${
            error
              ? 'border-red-500 bg-red-50 focus:ring-red-500 focus:ring-2 focus:ring-opacity-50'
              : 'border-gray-300 focus:ring-blue-500 focus:ring-2 focus:ring-opacity-50'
          }`}
          min={min}
          max={max}
        />
        {error && <p className="mt-1 text-red-600 text-xs font-medium animate-pulse">{error.message}</p>}
        {!error && helperText && <p className="mt-1 text-gray-500 text-xs">{helperText}</p>}
      </div>
    );
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="mb-4 font-semibold text-gray-700">{personName}</h3>
      
      {localErrors.length > 0 && (
        <div className="mb-4 rounded-lg border border-yellow-400 bg-yellow-50 px-4 py-3">
          <ul className="space-y-1">
            {localErrors.map((err, idx) => (
              <li key={idx} className="text-sm text-yellow-800">{err.message}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {renderInput('Current Age', 'currentAge', 18, 100, 'e.g. 35')}
        {renderInput('Retirement Age', 'retirementAge', inputs.currentAge === '' ? 19 : (inputs.currentAge as number) + 1, 100)}
        {renderInput('Liquid Assets', 'liquidAssets', 0, undefined, 'e.g. 100000')}
        {renderInput('Illiquid Assets', 'illiquidAssets', 0, undefined, 'e.g. 150000')}
        {renderInput('Monthly Contribution', 'monthlyContribution', 0)}
        {renderInput('Expected Return (%)', 'annualReturnRate', 0, 100, 'e.g. 7')}
        {renderInput('Social Security Age', 'socialSecurityAge', 62, 70, 'e.g. 62')}
        {renderInput('Expected Lifespan', 'expectedLifespan', inputs.retirementAge === '' ? 63 : (inputs.retirementAge as number) + 1, 120)}
      </div>
    </div>
  );
}
```

**Step 2:** Create test file for PersonInputCard

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PersonInputCard from '../PersonInputCard';

describe('PersonInputCard', () => {
  const mockOnChange = vi.fn();
  
  const defaultInputs = {
    currentAge: 35,
    retirementAge: 62,
    liquidAssets: 100000,
    illiquidAssets: 150000,
    monthlyContribution: 1500,
    annualReturnRate: 7,
    socialSecurityAge: 62,
    expectedLifespan: 90,
  };

  it('renders person name', () => {
    render(<PersonInputCard personName="Person 1" inputs={defaultInputs} onChange={mockOnChange} errors={[]} />);
    expect(screen.getByText('Person 1')).toBeInTheDocument();
  });

  it('renders all input fields', () => {
    render(<PersonInputCard personName="Person 1" inputs={defaultInputs} onChange={mockOnChange} errors={[]} />);
    
    const inputs = [
      'Current Age', 'Retirement Age', 'Liquid Assets', 'Illiquid Assets',
      'Monthly Contribution', 'Expected Return (%)', 'Social Security Age', 'Expected Lifespan'
    ];
    
    inputs.forEach(label => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it('calls onChange when input changes', () => {
    render(<PersonInputCard personName="Person 1" inputs={defaultInputs} onChange={mockOnChange} errors={[]} />);
    
    const currentAgeInput = screen.getByDisplayValue('35');
    fireEvent.change(currentAgeInput, { target: { value: '40' } });
    
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it('displays error messages for invalid inputs', () => {
    const errors = [{ field: 'currentAge', message: 'Must be between 18 and 100' }];
    render(<PersonInputCard personName="Person 1" inputs={defaultInputs} onChange={mockOnChange} errors={errors} />);
    
    expect(screen.getByText('Must be between 18 and 100')).toBeInTheDocument();
  });
});
```

**Step 3:** Run test to verify it fails initially

```bash
cd frontend && npm test -- PersonInputCard.test.tsx -v
```
Expected: FAIL (component not yet implemented)

**Step 4:** Create component file

**Step 5:** Run test again

```bash
cd frontend && npm test -- PersonInputCard.test.tsx -v
```
Expected: PASS

**Step 6:** Commit changes

```bash
git add frontend/src/app/\(main\)/dashboard/retirement/two-person/_components/PersonInputsSection/
git commit -m "feat: add PersonInputCard component"
```

---

## Task 2: Create PersonToggle component

**Files:**
- Create: `frontend/src/app/(main)/dashboard/retirement/two-person/_components/PersonInputsSection/PersonToggle.tsx`

**Step 1:** Create PersonToggle component

```typescript
'use client';

interface Props {
  visible: boolean;
  onToggle: (visible: boolean) => void;
}

export default function PersonToggle({ visible, onToggle }: Props) {
  return (
    <div className="border-t pt-4">
      <div className="flex items-center gap-2 mb-3">
        <input
          type="checkbox"
          id="show-person2"
          checked={visible}
          onChange={(e) => onToggle(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="show-person2" className="text-sm font-medium cursor-pointer">
          Include Person 2
        </label>
      </div>
    </div>
  );
}
```

**Step 2:** Test and commit

```bash
cd frontend && npm test -- PersonToggle.test.tsx -v
git add frontend/src/app/\(main\)/dashboard/retirement/two-person/_components/PersonInputsSection/
git commit -m "feat: add PersonToggle component"
```

---

## Task 3: Create SharedRetirementSettings component

**Files:**
- Create: `frontend/src/app/(main)/dashboard/retirement/two-person/_components/SharedRetirementSettings.tsx`

**Step 1:** Create SharedRetirementSettings component

```typescript
'use client';

interface Props {
  sameRetirementAge: boolean;
  drivingPerson: 'person1' | 'person2';
  onToggleSameRetirementAge: (same: boolean) => void;
}

export default function SharedRetirementSettings({
  sameRetirementAge,
  drivingPerson,
  onToggleSameRetirementAge,
}: Props) {
  return (
    <div className="border-t pt-4">
      <h3 className="font-semibold text-sm mb-2">Shared Settings</h3>
      
      <div className="mb-4 flex items-center gap-2">
        <input
          type="checkbox"
          id="same-retirement-age"
          checked={sameRetirementAge}
          onChange={(e) => onToggleSameRetirementAge(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="same-retirement-age" className="text-sm font-medium cursor-pointer">
          {sameRetirementAge ? (
            <span>
              Same retirement age ({drivingPerson === 'person1' ? 'Driven by Person 1' : 'Driven by Person 2'})
            </span>
          ) : (
            'Same retirement age for both'
          )}
        </label>
      </div>
    </div>
  );
}
```

**Step 2:** Test and commit

```bash
cd frontend && npm test -- SharedRetirementSettings.test.tsx -v
git add frontend/src/app/\(main\)/dashboard/retirement/two-person/_components/SharedRetirementSettings.tsx
git commit -m "feat: add SharedRetirementSettings component"
```

---

## Task 4: Create PrimaryMetrics component

**Files:**
- Create: `frontend/src/app/(main)/dashboard/retirement/two-person/_components/ResultsDashboard/PrimaryMetrics.tsx`
- Test: `frontend/src/app/(main)/dashboard/retirement/two-person/_components/ResultsDashboard/__tests__/PrimaryMetrics.test.tsx`

**Step 1:** Create PrimaryMetrics component

```typescript
'use client';

import type { TwoPersonCalculationResults } from '../../../_components/types';

interface Props {
  results: TwoPersonCalculationResults | null;
}

export default function PrimaryMetrics({ results }: Props) {
  const formatCurrency = (value: number): string => {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    } catch (e) {
      console.error('Currency formatting error:', e);
      return `$${value.toLocaleString()}`;
    }
  };

  if (!results?.householdProjection) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-gray-500">Enter your information to see projections</p>
      </div>
    );
  }

  const { householdProjection } = results;

  return (
    <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-blue-50 to-purple-50 p-6 shadow-sm">
      <h3 className="mb-4 text-center font-semibold text-gray-700">Household Results</h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-2 mb-6 border-b border-gray-100 pb-6">
        <div>
          <p className="text-xs text-gray-500">Total Household Net Worth at Retirement</p>
          <p className="font-bold text-lg text-gray-900">{formatCurrency(householdProjection.totalNetWorthAtRetirement)}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Total Household Liquid Savings</p>
          <p className="font-bold text-lg text-blue-600">{formatCurrency(householdProjection.totalLiquidSavingsAtRetirement)}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Total Monthly Income at Retirement</p>
          <p className="font-bold text-lg text-purple-600">{formatCurrency(householdProjection.monthlyIncomeAtRetirement)}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Combined Social Security (Monthly)</p>
          <p className="font-bold text-lg text-teal-600">{formatCurrency(householdProjection.combinedSocialSecurityBenefit)}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Safe Annual Withdrawal (4% Rule)</p>
          <p className="font-bold text-lg text-orange-600">{formatCurrency(householdProjection.safeWithdrawalAmount)}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Years Until Retirement</p>
          <p className="font-bold text-lg text-yellow-600">{householdProjection.yearsToRetirement} years</p>
        </div>
      </div>
    </div>
  );
}
```

**Step 2:** Create test file

```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PrimaryMetrics from '../PrimaryMetrics';

describe('PrimaryMetrics', () => {
  const mockResults = {
    projection1: {
      yearsToRetirement: 27,
      totalLiquidSavingsAtRetirement: 500000,
      totalNetWorthAtRetirement: 650000,
      monthlyIncomeAtRetirement: 3000,
      socialSecurityBenefit: 2500,
      withdrawalRate: 0.04,
      safeWithdrawalAmount: 26000,
      recommendedWithdrawalStrategy: 'Follow the 4% rule',
      projectedBalanceAtAge90: 1000000,
      retirementAge: 62,
    },
    projection2: {
      yearsToRetirement: 27,
      totalLiquidSavingsAtRetirement: 400000,
      totalNetWorthAtRetirement: 520000,
      monthlyIncomeAtRetirement: 2800,
      socialSecurityBenefit: 2300,
      withdrawalRate: 0.04,
      safeWithdrawalAmount: 20800,
      recommendedWithdrawalStrategy: 'Follow the 4% rule',
      projectedBalanceAtAge90: 800000,
      retirementAge: 67,
    },
    householdProjection: {
      totalNetWorthAtRetirement: 1170000,
      totalLiquidSavingsAtRetirement: 900000,
      monthlyIncomeAtRetirement: 5800,
      combinedSocialSecurityBenefit: 4800,
      safeWithdrawalAmount: 46800,
      yearsToRetirement: 27,
      recommendedWithdrawalStrategy: 'Follow the 4% rule',
    },
  };

  it('renders household metrics', () => {
    render(<PrimaryMetrics results={mockResults} />);
    
    expect(screen.getByText('Total Household Net Worth at Retirement')).toBeInTheDocument();
    expect(screen.getByText('$1,170,000')).toBeInTheDocument();
    expect(screen.getByText('$900,000')).toBeInTheDocument();
    expect(screen.getByText('$5,800')).toBeInTheDocument();
  });

  it('renders loading state when no results', () => {
    render(<PrimaryMetrics results={null} />);
    
    expect(screen.getByText('Enter your information to see projections')).toBeInTheDocument();
  });
});
```

**Step 3:** Test and commit

```bash
cd frontend && npm test -- PrimaryMetrics.test.tsx -v
git add frontend/src/app/\(main\)/dashboard/retirement/two-person/_components/ResultsDashboard/
git commit -m "feat: add PrimaryMetrics component"
```

---

## Task 5: Create ProjectionGrowthChart component

**Files:**
- Create: `frontend/src/app/(main)/dashboard/retirement/two-person/_components/ResultsDashboard/ProjectionGrowthChart.tsx`
- Test: `frontend/src/app/(main)/dashboard/retirement/two-person/_components/ResultsDashboard/__tests__/ProjectionGrowthChart.test.tsx`

**Step 1:** Create ProjectionGrowthChart component

```typescript
'use client';

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { TwoPersonCalculationResults } from '../../../_components/types';

interface Props {
  results: TwoPersonCalculationResults | null;
}

export default function ProjectionGrowthChart({ results }: Props) {
  const chartData = useMemo(() => {
    if (!results?.householdProjection) return [];

    const yearsToRetirement = results.householdProjection.yearsToRetirement;
    const currentYear = new Date().getFullYear();
    
    // Generate projection data for each year until retirement
    const projections = [];
    for (let year = 0; year <= yearsToRetirement; year++) {
      projections.push({
        name: `Year ${year}`,
        person1: results.projection1.totalLiquidSavingsAtRetirement * (year / yearsToRetirement),
        person2: results.projection2?.totalLiquidSavingsAtRetirement 
          ? results.projection2.totalLiquidSavingsAtRetirement * (year / yearsToRetirement)
          : 0,
        household: results.householdProjection.totalLiquidSavingsAtRetirement * (year / yearsToRetirement),
      });
    }
    
    return projections;
  }, [results]);

  if (!results?.householdProjection) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-gray-500">Enter your information to see projection chart</p>
      </div>
    );
  }

  return (
    <div className="h-96 w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="mb-4 text-center font-semibold text-gray-700">Projection Growth Over Time</h3>
      
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" label={{ value: 'Years Until Retirement', position: 'insideBottom', offset: -10 }} />
          <YAxis label={{ value: 'Liquid Savings ($)', angle: -90, position: 'insideLeft' }} />
          <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
          <Legend />
          <Line
            type="monotone"
            dataKey="person1"
            name="Person 1"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="person2"
            name="Person 2"
            stroke="#8B5CF6"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="household"
            name="Household Total"
            stroke="#10B981"
            strokeWidth={3}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
```

**Step 2:** Test and commit

```bash
cd frontend && npm test -- ProjectionGrowthChart.test.tsx -v
git add frontend/src/app/\(main\)/dashboard/retirement/two-person/_components/ResultsDashboard/
git commit -m "feat: add ProjectionGrowthChart component"
```

---

## Task 6: Create IncomeBreakdownChart component

**Files:**
- Create: `frontend/src/app/(main)/dashboard/retirement/two-person/_components/ResultsDashboard/IncomeBreakdownChart.tsx`
- Test: `frontend/src/app/(main)/dashboard/retirement/two-person/_components/ResultsDashboard/__tests__/IncomeBreakdownChart.test.tsx`

**Step 1:** Create IncomeBreakdownChart component

```typescript
'use client';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { TwoPersonCalculationResults } from '../../../_components/types';

interface Props {
  results: TwoPersonCalculationResults | null;
}

const COLORS = ['#06B6D4', '#F97316', '#8B5CF6'];

export default function IncomeBreakdownChart({ results }: Props) {
  const chartData = useMemo(() => {
    if (!results?.householdProjection) return [];

    const socialSecurity = results.householdProjection.combinedSocialSecurityBenefit;
    const portfolioWithdrawal = 
      results.householdProjection.monthlyIncomeAtRetirement - socialSecurity;
    
    const total = socialSecurity + portfolioWithdrawal;

    return [
      { name: 'Social Security', value: socialSecurity, color: COLORS[0] },
      { name: 'Portfolio Withdrawal', value: portfolioWithdrawal, color: COLORS[1] },
    ];
  }, [results]);

  if (!results?.householdProjection) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-gray-500">Enter your information to see income breakdown</p>
      </div>
    );
  }

  return (
    <div className="h-96 w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="mb-4 text-center font-semibold text-gray-700">Income Breakdown at Retirement</h3>
      
      <ResponsiveContainer width="100%" height="80%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `$${value.toLocaleString()}/month`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      
      <div className="mt-4 grid grid-cols-2 gap-2 text-center">
        <div className="rounded bg-cyan-50 p-2">
          <p className="text-sm font-semibold text-cyan-700">Social Security</p>
          <p className="font-bold text-cyan-900">${results.householdProjection.combinedSocialSecurityBenefit.toLocaleString()}/mo</p>
        </div>
        <div className="rounded bg-orange-50 p-2">
          <p className="text-sm font-semibold text-orange-700">Portfolio Withdrawal</p>
          <p className="font-bold text-orange-900">${(results.householdProjection.monthlyIncomeAtRetirement - results.householdProjection.combinedSocialSecurityBenefit).toLocaleString()}/mo</p>
        </div>
      </div>
    </div>
  );
}
```

**Step 2:** Test and commit

```bash
cd frontend && npm test -- IncomeBreakdownChart.test.tsx -v
git add frontend/src/app/\(main\)/dashboard/retirement/two-person/_components/ResultsDashboard/
git commit -m "feat: add IncomeBreakdownChart component"
```

---

## Task 7: Create ScenarioSelector component

**Files:**
- Create: `frontend/src/app/(main)/dashboard/retirement/two-person/_components/ScenarioComparison/ScenarioSelector.tsx`
- Test: `frontend/src/app/(main)/dashboard/retirement/two-person/_components/ScenarioComparison/__tests__/ScenarioSelector.test.tsx`

**Step 1:** Create ScenarioSelector component

```typescript
'use client';

import { useState } from 'react';
import type { RetirementParams } from '../../../_components/calculateRetirement';

interface Props {
  onSelectScenario: (params: RetirementParams) => void;
}

export default function ScenarioSelector({ onSelectScenario }: Props) {
  const [selectedPreset, setSelectedPreset] = useState<'62' | '67' | '70' | 'custom'>('67');
  const [customRetirementAge, setCustomRetirementAge] = useState<number>(65);

  const handleSelectPreset = (age: string) => {
    if (age === 'custom') {
      setSelectedPreset('custom');
    } else {
      setSelectedPreset(age as '62' | '67' | '70');
      onSelectScenario({
        currentAge: 35,
        retirementAge: Number(age),
        liquidAssets: 100000,
        illiquidAssets: 150000,
        monthlyContribution: 1500,
        annualReturnRate: 7,
        socialSecurityAge: 62,
        expectedLifespan: 90,
      });
    }
  };

  const handleCustomRetirementAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const age = Number(e.target.value);
    setCustomRetirementAge(age);
    onSelectScenario({
      currentAge: 35,
      retirementAge: age,
      liquidAssets: 100000,
      illiquidAssets: 150000,
      monthlyContribution: 1500,
      annualReturnRate: 7,
      socialSecurityAge: 62,
      expectedLifespan: 90,
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-700">Select Retirement Age Scenario</h3>
      
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {['62', '65', '67', '70'].map((age) => (
          <button
            key={age}
            onClick={() => handleSelectPreset(age)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              selectedPreset === age
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Age {age}
          </button>
        ))}
        
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={selectedPreset === 'custom' ? customRetirementAge : ''}
            onChange={handleCustomRetirementAgeChange}
            placeholder="Custom"
            disabled={selectedPreset !== 'custom'}
            min={18}
            max={100}
            className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <p className="text-xs text-gray-500">
        Select a retirement age to see how it impacts your projections.
        Adjust inputs above for personalized results.
      </p>
    </div>
  );
}
```

**Step 2:** Test and commit

```bash
cd frontend && npm test -- ScenarioSelector.test.tsx -v
git add frontend/src/app/\(main\)/dashboard/retirement/two-person/_components/ScenarioComparison/
git commit -m "feat: add ScenarioSelector component"
```

---

## Task 8: Create ComparisonTable component

**Files:**
- Create: `frontend/src/app/(main)/dashboard/retirement/two-person/_components/ScenarioComparison/ComparisonTable.tsx`
- Test: `frontend/src/app/(main)/dashboard/retirement/two-person/_components/ScenarioComparison/__tests__/ComparisonTable.test.tsx`

**Step 1:** Create ComparisonTable component

```typescript
'use client';

import type { CalculationResults } from '../../../_components/calculateRetirement';

interface Scenario {
  id: string;
  name: string;
  results: CalculationResults;
}

interface Props {
  scenarios: Scenario[];
}

export default function ComparisonTable({ scenarios }: Props) {
  const formatCurrency = (value: number): string => {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    } catch (e) {
      console.error('Currency formatting error:', e);
      return `$${value.toLocaleString()}`;
    }
  };

  if (scenarios.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm text-center">
        <p className="text-gray-500">Select scenarios to compare side-by-side</p>
      </div>
    );
  }

  const metrics = [
    { label: 'Total Net Worth', key: 'totalNetWorthAtRetirement' },
    { label: 'Liquid Savings', key: 'totalLiquidSavingsAtRetirement' },
    { label: 'Monthly Income', key: 'monthlyIncomeAtRetirement' },
    { label: 'Social Security', key: 'socialSecurityBenefit' },
    { label: 'Years to Retirement', key: 'yearsToRetirement' },
  ];

  const getBestValue = (key: string) => {
    if (scenarios.length === 0) return null;
    
    let bestValue = scenarios[0].results[key as keyof CalculationResults] as number;
    for (let i = 1; i < scenarios.length; i++) {
      const value = scenarios[i].results[key as keyof CalculationResults] as number;
      if (key === 'yearsToRetirement') {
        // Lower is better for years to retirement
        bestValue = Math.min(bestValue, value);
      } else {
        // Higher is better for financial metrics
        bestValue = Math.max(bestValue, value);
      }
    }
    
    return bestValue;
  };

  const renderCell = (results: CalculationResults, key: keyof CalculationResults) => {
    const value = results[key];
    const bestValue = getBestValue(key);
    
    if (value === undefined || bestValue === undefined) return '-';

    const isBest = 
      (key === 'yearsToRetirement' && value === bestValue) ||
      (key !== 'yearsToRetirement' && value === bestValue);

    if (typeof value === 'number') {
      if (key.includes('Savings') || key.includes('NetWorth') || key.includes('Income') || key.includes('SocialSecurity')) {
        return (
          <span className={isBest ? 'font-bold text-green-600' : ''}>
            {formatCurrency(value)}
          </span>
        );
      }
      
      if (key === 'yearsToRetirement') {
        return (
          <span className={isBest ? 'font-bold text-green-600' : ''}>
            {value} years
          </span>
        );
      }
    }

    return value;
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-gray-700">
          <tr>
            <th className="px-4 py-3 font-semibold">Metric</th>
            {scenarios.map((scenario) => (
              <th key={scenario.id} className="px-4 py-3 font-semibold">
                {scenario.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {metrics.map((metric) => (
            <tr key={metric.key} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-gray-600">{metric.label}</td>
              {scenarios.map((scenario) => (
                <td key={`${scenario.id}-${metric.key}`} className="px-4 py-3 font-medium">
                  {renderCell(scenario.results, metric.key as keyof CalculationResults)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

**Step 2:** Test and commit

```bash
cd frontend && npm test -- ComparisonTable.test.tsx -v
git add frontend/src/app/\(main\)/dashboard/retirement/two-person/_components/ScenarioComparison/
git commit -m "feat: add ComparisonTable component"
```

---

## Task 9: Create ProjectionDetails component

**Files:**
- Create: `frontend/src/app/(main)/dashboard/retirement/two-person/_components/DetailedBreakdown/ProjectionDetails.tsx`
- Test: `frontend/src/app/(main)/dashboard/retirement/two-person/_components/DetailedBreakdown/__tests__/ProjectionDetails.test.tsx`

**Step 1:** Create ProjectionDetails component

```typescript
'use client';

import type { CalculationResults } from '../../../_components/calculateRetirement';

interface Props {
  personName: string;
  results: CalculationResults;
}

export default function ProjectionDetails({ personName, results }: Props) {
  const formatCurrency = (value: number): string => {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    } catch (e) {
      console.error('Currency formatting error:', e);
      return `$${value.toLocaleString()}`;
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h4 className="mb-3 font-semibold text-gray-700">{personName}</h4>
      
      <div className="space-y-2 text-xs">
        <div className="flex justify-between border-b border-gray-100 pb-2">
          <span className="text-gray-500">Retirement Age</span>
          <span className="font-medium">{results.retirementAge}</span>
        </div>
        
        <div className="flex justify-between border-b border-gray-100 pb-2">
          <span className="text-gray-500">Liquid Savings at Retirement</span>
          <span className="font-medium text-blue-600">{formatCurrency(results.totalLiquidSavingsAtRetirement)}</span>
        </div>
        
        <div className="flex justify-between border-b border-gray-100 pb-2">
          <span className="text-gray-500">Social Security Benefit</span>
          <span className="font-medium text-teal-600">{formatCurrency(results.socialSecurityBenefit)}/mo</span>
        </div>
        
        <div className="flex justify-between border-b border-gray-100 pb-2">
          <span className="text-gray-500">Safe Annual Withdrawal (4% Rule)</span>
          <span className="font-medium text-orange-600">{formatCurrency(results.safeWithdrawalAmount)}</span>
        </div>
        
        <div className="flex justify-between border-b border-gray-100 pb-2">
          <span className="text-gray-500">Projected Balance at Age 90</span>
          <span className="font-medium text-indigo-600">
            {results.projectedBalanceAtAge90 !== undefined 
              ? formatCurrency(results.projectedBalanceAtAge90)
              : 'N/A'}
          </span>
        </div>
        
        <div className="flex justify-between pb-2">
          <span className="text-gray-500">Withdrawal Rate</span>
          <span className="font-medium">{(results.withdrawalRate * 100).toFixed(2)}%</span>
        </div>
      </div>

      {results.recommendedWithdrawalStrategy && (
        <div className="mt-3 rounded-lg border-l-4 border-pink-500 bg-pink-50 p-3">
          <p className="font-semibold text-gray-600 text-xs">Recommended Strategy</p>
          <p className="mt-1 text-sm text-pink-800">{results.recommendedWithdrawalStrategy}</p>
        </div>
      )}
    </div>
  );
}
```

**Step 2:** Test and commit

```bash
cd frontend && npm test -- ProjectionDetails.test.tsx -v
git add frontend/src/app/\(main\)/dashboard/retirement/two-person/_components/DetailedBreakdown/
git commit -m "feat: add ProjectionDetails component"
```

---

## Task 10: Create YearlyProjectionTable component

**Files:**
- Create: `frontend/src/app/(main)/dashboard/retirement/two-person/_components/DetailedBreakdown/YearlyProjectionTable.tsx`
- Test: `frontend/src/app/(main)/dashboard/retirement/two-person/_components/DetailedBreakdown/__tests__/YearlyProjectionTable.test.tsx`

**Step 1:** Create YearlyProjectionTable component

```typescript
'use client';

import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { TwoPersonCalculationResults } from '../../../_components/types';

interface YearlyProjection {
  age: number;
  balance: number;
  withdrawal: number;
  socialSecurity: number;
  expenses: number;
  remainingBalance: number;
}

interface Props {
  results: TwoPersonCalculationResults | null;
}

export default function YearlyProjectionTable({ results }: Props) {
  const [expandedYear, setExpandedYear] = useState<number | null>(null);

  const yearlyProjections = useMemo(() => {
    if (!results?.householdProjection) return [];

    const { householdProjection } = results;
    const startingAge = new Date().getFullYear() - householdProjection.yearsToRetirement + 35; // Approximate
    const yearsAfterRetirement = 90 - (startingAge + householdProjection.yearsToRetirement);

    const projections: YearlyProjection[] = [];
    
    let balance = householdProjection.totalNetWorthAtRetirement;
    const annualWithdrawal = householdProjection.safeWithdrawalAmount;
    const monthlySocialSecurity = householdProjection.combinedSocialSecurityBenefit;
    const annualSocialSecurity = monthlySocialSecurity * 12;

    for (let year = 0; year <= yearsAfterRetirement; year++) {
      const age = startingAge + householdProjection.yearsToRetirement + year;
      
      // Assume 3% inflation adjustment
      const adjustedWithdrawal = annualWithdrawal * Math.pow(1.03, year);
      const adjustedSocialSecurity = annualSocialSecurity * Math.pow(1.03, year);
      
      const interest = balance * 0.04; // 4% return
      const expenses = adjustedWithdrawal - adjustedSocialSecurity;
      const endingBalance = balance + interest - adjustedWithdrawal;

      projections.push({
        age,
        balance: Math.max(0, balance),
        withdrawal: adjustedWithdrawal,
        socialSecurity: adjustedSocialSecurity,
        expenses,
        remainingBalance: Math.max(0, endingBalance),
      });

      balance = endingBalance;
    }

    return projections;
  }, [results]);

  const chartData = useMemo(() => {
    if (!yearlyProjections.length) return [];

    return yearlyProjections.map((p) => ({
      age: p.age,
      balance: p.balance,
    }));
  }, [yearlyProjections]);

  const formatCurrency = (value: number): string => {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    } catch (e) {
      console.error('Currency formatting error:', e);
      return `$${value.toLocaleString()}`;
    }
  };

  if (!results?.householdProjection) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-gray-500">Enter your information to see yearly projections</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-gray-700">Year-by-Year Projection</h3>

      {/* Embedded Chart */}
      <div className="h-64 w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="age" label={{ value: 'Age', position: 'insideBottom' }} />
            <YAxis label={{ value: 'Balance ($)', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Line
              type="monotone"
              dataKey="balance"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ r: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-4 py-3 font-semibold">Age</th>
              <th className="px-4 py-3 font-semibold">Balance</th>
              <th className="px-4 py-3 font-semibold">Withdrawal</th>
              <th className="px-4 py-3 font-semibold">Social Security</th>
              <th className="px-4 py-3 font-semibold">Net Expenses</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {yearlyProjections.map((projection, index) => (
              <React.Fragment key={projection.age}>
                <tr
                  className={`cursor-pointer hover:bg-gray-50 ${expandedYear === projection.age ? 'bg-blue-50' : ''}`}
                  onClick={() => setExpandedYear(expandedYear === projection.age ? null : projection.age)}
                >
                  <td className="px-4 py-3 font-medium">{projection.age}</td>
                  <td className="px-4 py-3 text-green-600">{formatCurrency(projection.balance)}</td>
                  <td className="px-4 py-3 text-red-600">-{formatCurrency(projection.withdrawal)}</td>
                  <td className="px-4 py-3 text-teal-600">{formatCurrency(projection.socialSecurity)}</td>
                  <td className="px-4 py-3">{formatCurrency(projection.expenses)}</td>
                </tr>
                
                {expandedYear === projection.age && (
                  <tr className="bg-gray-50">
                    <td colSpan={5} className="px-4 py-3 text-xs">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="rounded bg-white p-3 shadow-sm">
                          <p className="font-semibold text-gray-600">Interest Earned</p>
                          <p className="text-green-700">
                            +{formatCurrency(projection.balance * 0.04)}
                          </p>
                        </div>
                        <div className="rounded bg-white p-3 shadow-sm">
                          <p className="font-semibold text-gray-600">Remaining Balance</p>
                          <p className="text-indigo-700">{formatCurrency(projection.remainingBalance)}</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {yearlyProjections.length > 0 && yearlyProjections[yearlyProjections.length - 1].remainingBalance <= 0 && (
        <div className="rounded-lg border border-red-400 bg-red-50 px-4 py-3">
          <p className="font-semibold text-red-700">Warning: Funds may deplete before age 90</p>
          <p className="text-sm text-red-600">
            Based on current projections, your savings may run out before reaching age 90. Consider increasing contributions or adjusting your withdrawal strategy.
          </p>
        </div>
      )}
    </div>
  );
}
```

**Step 2:** Test and commit

```bash
cd frontend && npm test -- YearlyProjectionTable.test.tsx -v
git add frontend/src/app/\(main\)/dashboard/retirement/two-person/_components/DetailedBreakdown/
git commit -m "feat: add YearlyProjectionTable component"
```

---

## Task 11: Update main TwoPersonRetirementCalculator orchestrator

**Files:**
- Replace: `frontend/src/app/(main)/dashboard/retirement/two-person/_components/TwoPersonRetirementCalculator.tsx`

**Step 1:** Create new orchestrator component

```typescript
'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import PersonInputCard from './_components/PersonInputsSection/PersonInputCard';
import PersonToggle from './_components/PersonInputsSection/PersonToggle';
import SharedRetirementSettings from './_components/SharedRetirementSettings';
import PrimaryMetrics from './_components/ResultsDashboard/PrimaryMetrics';
import ProjectionGrowthChart from './_components/ResultsDashboard/ProjectionGrowthChart';
import IncomeBreakdownChart from './_components/ResultsDashboard/IncomeBreakdownChart';
import ScenarioSelector from './_components/ScenarioComparison/ScenarioSelector';
import ComparisonTable from './_components/ScenarioComparison/ComparisonTable';
import ProjectionDetails from './_components/DetailedBreakdown/ProjectionDetails';
import YearlyProjectionTable from './_components/DetailedBreakdown/YearlyProjectionTable';

import { twoPersonRetirementApi } from '@/lib/api';
import type {
  RetirementParams,
  CalculationResults,
  ValidationError,
} from '../_components/calculateRetirement';
import type { TwoPersonCalculationResults, Scenario } from '../_components/types';

interface PersonInputs {
  currentAge: number | '';
  retirementAge: number | '';
  liquidAssets: number | '';
  illiquidAssets: number | '';
  monthlyContribution: number | '';
  annualReturnRate: number | '';
  socialSecurityAge: number | '';
  expectedLifespan: number | '';
}

interface FormState {
  person1: PersonInputs;
  person2: PersonInputs;
  sameRetirementAge: boolean;
  showPerson2: boolean;
}

export default function TwoPersonRetirementCalculator() {
  const [formState, setFormState] = useState<FormState>({
    person1: {
      currentAge: 35,
      retirementAge: 62,
      liquidAssets: 100000,
      illiquidAssets: 150000,
      monthlyContribution: 1500,
      annualReturnRate: 7,
      socialSecurityAge: 62,
      expectedLifespan: 90,
    },
    person2: {
      currentAge: 33,
      retirementAge: 67,
      liquidAssets: 80000,
      illiquidAssets: 120000,
      monthlyContribution: 1200,
      annualReturnRate: 7,
      socialSecurityAge: 67,
      expectedLifespan: 92,
    },
    sameRetirementAge: false,
    showPerson2: true,
  });

  const [results, setResults] = useState<TwoPersonCalculationResults | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null);

  useEffect(() => {
    calculateRetirement();
  }, []);

  useEffect(() => {
    if (formState.sameRetirementAge) {
      setFormState((prev) => ({
        ...prev,
        person2: { ...prev.person2, retirementAge: prev.person1.retirementAge },
      }));
    }
  }, [formState.sameRetirementAge, formState.person1.retirementAge]);

  const handlePersonChange = (person: 'person1' | 'person2', inputs: PersonInputs) => {
    setFormState((prev) => ({ ...prev, [person]: inputs }));
  };

  const validateInputs = (inputs: PersonInputs): ValidationError[] => {
    const errors: ValidationError[] = [];
    const currentAgeNum = Number(inputs.currentAge);
    const retirementAgeNum = Number(inputs.retirementAge);

    if (currentAgeNum < 18 || currentAgeNum > 100) {
      errors.push({ field: 'currentAge', message: 'Must be between 18 and 100' });
    }

    if (retirementAgeNum <= currentAgeNum || retirementAgeNum > 100) {
      errors.push({
        field: 'retirementAge',
        message: `Must be greater than current age (${currentAgeNum}) and less than or equal to 100`,
      });
    }

    // Add more validations...

    return errors;
  };

  const calculateRetirement = async () => {
    setError(null);

    const person1Errors = validateInputs(formState.person1);
    const person2Errors = formState.showPerson2 ? validateInputs(formState.person2) : [];

    if (person1Errors.length > 0 || person2Errors.length > 0) {
      setError('Please fix the validation errors below');
      return;
    }

    setLoading(true);

    try {
      const requestData = {
        husband: {
          current_age: Number(formState.person1.currentAge),
          retirement_age: Number(formState.person1.retirementAge),
          liquid_assets: Number(formState.person1.liquidAssets),
          illiquid_assets: Number(formState.person1.illiquidAssets),
          monthly_contribution: Number(formState.person1.monthlyContribution),
          annual_return_rate: Number(formState.person1.annualReturnRate) / 100,
          social_security_age: Number(formState.person1.socialSecurityAge),
          expected_lifespan: Number(formState.person1.expectedLifespan),
        },
        spouse: formState.showPerson2
          ? {
              current_age: Number(formState.person2.currentAge),
              retirement_age: Number(formState.person2.retirementAge),
              liquid_assets: Number(formState.person2.liquidAssets),
              illiquid_assets: Number(formState.person2.illiquidAssets),
              monthly_contribution: Number(formState.person2.monthlyContribution),
              annual_return_rate: Number(formState.person2.annualReturnRate) / 100,
              social_security_age: Number(formState.person2.socialSecurityAge),
              expected_lifespan: Number(formState.person2.expectedLifespan),
            }
          : null,
      };

      const response = await twoPersonRetirementApi.calculateTwoPersonRetirement(requestData);

      if (!response || !response.householdProjection) {
        throw new Error('Invalid response from server');
      }

      setResults(response as TwoPersonCalculationResults);
    } catch (err: any) {
      console.error('Error calculating retirement:', err);

      if (err.response?.status === 422) {
        setError('Invalid input parameters. Please check your values and try again.');
      } else if (err.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else {
        setError('Failed to calculate retirement projections. Please check your inputs and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleScenarioSelect = (params: RetirementParams) => {
    // Store scenario for comparison
    const newScenario: Scenario = {
      id: `scenario-${Date.now()}`,
      name: `Age ${params.retirementAge}`,
      parameters: params,
      results: {
        yearsToRetirement: params.retirementAge - 35,
        totalLiquidSavingsAtRetirement: 0, // Calculate
        totalNetWorthAtRetirement: 0,
        monthlyIncomeAtRetirement: 0,
        socialSecurityBenefit: 0,
        withdrawalRate: 0,
        projectedBalanceAtAge90: 0,
        safeWithdrawalAmount: 0,
        recommendedWithdrawalStrategy: '',
      },
    };
    
    setScenarios([...scenarios, newScenario]);
    setSelectedScenarioId(newScenario.id);
  };

  return (
    <div className="p-4">
      <h1 className="mb-4 w-full font-bold text-2xl">Two-Person Retirement Calculator</h1>

      {error && (
        <div className="mb-3 rounded-lg border border-red-400 bg-red-50 px-3 py-2 text-sm text-red-700 shadow-sm">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        </div>
      )}

      <Tabs className="gap-4" defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="visualization">Visualization</TabsTrigger>
          <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="flex w-full flex-col gap-4">
            <div className="w-full">
              <div data-slot="card" className="w-full rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="p-6">
                  <PersonInputCard
                    personName="Person 1"
                    inputs={{
                      currentAge: Number(formState.person1.currentAge),
                      retirementAge: Number(formState.person1.retirementAge),
                      liquidAssets: Number(formState.person1.liquidAssets),
                      illiquidAssets: Number(formState.person1.illiquidAssets),
                      monthlyContribution: Number(formState.person1.monthlyContribution),
                      annualReturnRate: Number(formState.person1.annualReturnRate),
                      socialSecurityAge: Number(formState.person1.socialSecurityAge),
                      expectedLifespan: Number(formState.person1.expectedLifespan),
                    }}
                    onChange={(inputs) =>
                      handlePersonChange('person1', {
                        currentAge: inputs.currentAge,
                        retirementAge: inputs.retirementAge,
                        liquidAssets: inputs.liquidAssets,
                        illiquidAssets: inputs.illiquidAssets,
                        monthlyContribution: inputs.monthlyContribution,
                        annualReturnRate: inputs.annualReturnRate,
                        socialSecurityAge: inputs.socialSecurityAge,
                        expectedLifespan: inputs.expectedLifespan,
                      })
                    }
                    errors={[]}
                  />

                  {formState.showPerson2 && (
                    <div className="mt-6">
                      <SharedRetirementSettings
                        sameRetirementAge={formState.sameRetirementAge}
                        drivingPerson="person1"
                        onToggleSameRetirementAge={(same) =>
                          setFormState((prev) => ({ ...prev, sameRetirementAge: same }))
                        }
                      />

                      <div className="mt-4">
                        <PersonInputCard
                          personName="Person 2"
                          inputs={{
                            currentAge: Number(formState.person2.currentAge),
                            retirementAge: Number(formState.person2.retirementAge),
                            liquidAssets: Number(formState.person2.liquidAssets),
                            illiquidAssets: Number(formState.person2.illiquidAssets),
                            monthlyContribution: Number(formState.person2.monthlyContribution),
                            annualReturnRate: Number(formState.person2.annualReturnRate),
                            socialSecurityAge: Number(formState.person2.socialSecurityAge),
                            expectedLifespan: Number(formState.person2.expectedLifespan),
                          }}
                          onChange={(inputs) =>
                            handlePersonChange('person2', {
                              currentAge: inputs.currentAge,
                              retirementAge: inputs.retirementAge,
                              liquidAssets: inputs.liquidAssets,
                              illiquidAssets: inputs.illiquidAssets,
                              monthlyContribution: inputs.monthlyContribution,
                              annualReturnRate: inputs.annualReturnRate,
                              socialSecurityAge: inputs.socialSecurityAge,
                              expectedLifespan: inputs.expectedLifespan,
                            })
                          }
                          errors={[]}
                        />
                      </div>
                    </div>
                  )}

                  <PersonToggle
                    visible={formState.showPerson2}
                    onToggle={(visible) => setFormState((prev) => ({ ...prev, showPerson2: visible }))}
                  />

                  {results && (
                    <>
                      <div className="mt-6">
                        <PrimaryMetrics results={results} />
                      </div>

                      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <ProjectionDetails
                          personName="Person 1"
                          results={results.projection1}
                        />
                        
                        {results.projection2 && (
                          <ProjectionDetails
                            personName="Person 2"
                            results={results.projection2}
                          />
                        )}
                      </div>
                    </>
                  )}

                  <button
                    onClick={calculateRetirement}
                    disabled={
                      loading ||
                      validateInputs(formState.person1).length > 0 ||
                      (formState.showPerson2 && validateInputs(formState.person2).length > 0)
                    }
                    className={`w-full rounded-lg px-6 py-3 font-bold text-white transition-colors ${
                      loading
                        ? 'cursor-not-allowed bg-gray-400'
                        : 'bg-blue-500 hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-400'
                    }`}
                  >
                    {loading ? 'Calculating...' : 'Calculate Retirement Plan'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Visualization Tab */}
        <TabsContent value="visualization">
          <div className="flex w-full flex-col gap-4">
            {results && (
              <>
                <ProjectionGrowthChart results={results} />
                <IncomeBreakdownChart results={results} />
              </>
            )}
            {!results && (
              <div className="flex h-64 items-center justify-center rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
                <p className="text-gray-500">Calculate to see visualizations</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Scenarios Tab */}
        <TabsContent value="scenarios">
          <div className="flex w-full flex-col gap-4">
            <ScenarioSelector onSelectScenario={handleScenarioSelect} />
            
            {scenarios.length > 0 && (
              <ComparisonTable scenarios={scenarios} />
            )}
          </div>
        </TabsContent>

        {/* Details Tab */}
        <TabsContent value="details">
          <div className="flex w-full flex-col gap-4">
            {results ? (
              <YearlyProjectionTable results={results} />
            ) : (
              <div className="flex h-64 items-center justify-center rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
                <p className="text-gray-500">Calculate to see detailed breakdown</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

**Step 2:** Update types/index.ts with missing interface

```typescript
// Add to the end of the file:
export interface Scenario {
  id: string;
  name: string;
  parameters: RetirementParams;
  results: CalculationResults;
}
```

**Step 3:** Test and commit

```bash
cd frontend && npm test -- TwoPersonRetirementCalculator.test.tsx -v
git add frontend/src/app/\(main\)/dashboard/retirement/two-person/_components/
git commit -m "refactor: replace monolithic component with modular architecture"
```

---

## Task 12: Update page.tsx tabs

**Files:**
- Modify: `frontend/src/app/(main)/dashboard/retirement/two-person/page.tsx`

**Step 1:** Update to remove disabled tabs

```typescript
export default function TwoPersonRetirementPage() {
  return (
    <div>
      <Tabs className="gap-4" defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="visualization">Visualization</TabsTrigger>
          <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        {/* Content as defined in TwoPersonRetirementCalculator */}
      </Tabs>
    </div>
  );
}
```

**Step 2:** Test and commit

```bash
git add frontend/src/app/\(main\)/dashboard/retirement/two-person/page.tsx
git commit -m "feat: update tabs structure for enhanced calculator"
```

---

## Task 13: Update types/index.ts with new interfaces

**Files:**
- Modify: `frontend/src/app/(main)/dashboard/retirement/_components/types/index.ts`

**Step 1:** Add TwoPersonCalculationResults interface

```typescript
export interface TwoPersonCalculationResults {
  projection1: CalculationResults;
  projection2: CalculationResults | null;
  householdProjection: {
    totalNetWorthAtRetirement: number;
    totalLiquidSavingsAtRetirement: number;
    monthlyIncomeAtRetirement: number;
    combinedSocialSecurityBenefit: number;
    safeWithdrawalAmount: number;
    yearsToRetirement: number;
    recommendedWithdrawalStrategy: string;
  };
}
```

**Step 2:** Update Scenario interface

```typescript
export interface Scenario {
  id: string;
  name: string;
  parameters: RetirementParams;
  results: CalculationResults;
}
```

**Step 3:** Test and commit

```bash
git add frontend/src/app/\(main\)/dashboard/retirement/_components/types/index.ts
git commit -m "feat: add TwoPersonCalculationResults interface"
```

---

## Task 14: Run full test suite

**Files:**
- All new component tests
- Existing calculator tests

**Step 1:** Run all tests

```bash
cd frontend && npm test -v
```
Expected: All tests pass

**Step 2:** Check coverage

```bash
cd frontend && npm run check
```
Expected: No linting errors

---

## Task 15: Final commit and verification

**Files:**
- All implementation files

**Step 1:** Commit all changes

```bash
git add .
git status  # Verify only expected files are staged
git commit -m "feat: implement enhanced two-person retirement calculator with modular architecture"
```

**Step 2:** Build to verify no TypeScript errors

```bash
cd frontend && npm run build
```
Expected: Build succeeds

**Step 3:** Run linting

```bash
cd frontend && npm run check
```
Expected: No issues

---

## Summary

**Total Tasks:** 15  
**Estimated Time:** 4-6 hours (including testing and debugging)  
**Files Created/Modified:** 20+ files

### New Components:
- PersonInputCard
- PersonToggle
- SharedRetirementSettings
- PrimaryMetrics
- ProjectionGrowthChart
- IncomeBreakdownChart
- ScenarioSelector
- ComparisonTable
- ProjectionDetails
- YearlyProjectionTable

### Modified Files:
- TwoPersonRetirementCalculator.tsx (complete rewrite)
- page.tsx (tabs updated)
- types/index.ts (new interfaces)

The implementation follows the design spec with 4 tab sections, modular architecture, and comprehensive chart visualizations using Recharts.
