'use client';

import { useState, useEffect } from 'react';
import CalculatorLayout from './_components/CalculatorLayout';
import PersonInputCard from './_components/InputsSection/PersonInputs/PersonInputCard';
import OverviewMetrics from './_components/ResultsDashboard/OverviewMetrics';
import MonthlyIncomeBreakdown from './_components/DetailedBreakdown/MonthlyIncomeBreakdown';

import type {
  PersonInput,
  CalculatorInputsV4,
  HouseholdResults,
} from '../_components/types';

export default function TwoPersonRetirementV4Page() {
  const [inputs, setInputs] = useState<CalculatorInputsV4>({
    persons: [
      {
        id: 'person1',
        currentAge: 35,
        retirementAge: 62,
        lifeExpectancy: 90,
        liquidAssets: 100000,
        monthlyContribution: 1500,
        preRetirementReturnRate: 6,
        postRetirementReturnRate: 4,
        estimatedSSBenefit: 2500,
        ssClaimingAge: 67,
      },
      {
        id: 'person2',
        currentAge: 33,
        retirementAge: 67,
        lifeExpectancy: 92,
        liquidAssets: 80000,
        monthlyContribution: 1200,
        preRetirementReturnRate: 6,
        postRetirementReturnRate: 4,
        estimatedSSBenefit: 2300,
        ssClaimingAge: 67,
      },
    ],
    properties: [],
    accounts: [],
    withdrawalStrategy: 'fixed_percentage',
    inflationRate: 0.03,
    targetRetirementYear: new Date().getFullYear() + 27,
  });

  const [results, setResults] = useState<HouseholdResults | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    calculateRetirement();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const calculateRetirement = async () => {
    setLoading(true);

    try {
      const resultsData = performCalculations(inputs);
      setResults(resultsData);
    } catch (error) {
      console.error('Calculation error:', error);
      alert('Error calculating retirement plan. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  const performCalculations = (calcInputs: CalculatorInputsV4): HouseholdResults => {
    // Step 1: Calculate years to retirement
    const yearsToRetirement = Math.max(
      ...calcInputs.persons.map((p) => p.retirementAge - p.currentAge),
    );

    // Step 2: Project account growth until retirement (simplified)
    const liquidSavingsAtRetirement = calcInputs.persons.reduce(
      (sum, p) => sum + p.liquidAssets,
      0
    );

    // Step 3: Calculate Social Security benefits
    const socialSecurityMonthly = calcInputs.persons.reduce(
      (sum, p) => sum + p.estimatedSSBenefit,
      0
    );

    // Step 4: Determine withdrawal strategy
    let monthlyWithdrawal = 0;
    if (calcInputs.withdrawalStrategy === 'fixed_percentage') {
      monthlyWithdrawal = liquidSavingsAtRetirement * 0.04 / 12;
    } else if (calcInputs.withdrawalStrategy === 'dynamic_withdrawal') {
      monthlyWithdrawal = liquidSavingsAtRetirement * 0.035 / 12;
    } else {
      monthlyWithdrawal = liquidSavingsAtRetirement * 0.04 / 12;
    }

    // Step 5: Calculate total monthly income
    const totalMonthlyIncome = socialSecurityMonthly + monthlyWithdrawal;

    // Step 6: Project to age 90 (simplified)
    let projectedBalanceAt90 = liquidSavingsAtRetirement;
    const postRetirementYears = Math.max(
      ...calcInputs.persons.map((p) => p.lifeExpectancy - p.retirementAge),
    );

    for (let year = 0; year < postRetirementYears; year++) {
      projectedBalanceAt90 *= 1.04;
      projectedBalanceAt90 -= monthlyWithdrawal * 12;
    }

    if (projectedBalanceAt90 < 0) {
      projectedBalanceAt90 = 0;
    }

    // Step 7: Calculate sustainability probability
    const safeWithdrawalRate =
      monthlyWithdrawal * 12 / liquidSavingsAtRetirement || 0;
    let sustainabilityProbability = 95;

    if (safeWithdrawalRate > 0.045) {
      sustainabilityProbability = 80;
    } else if (safeWithdrawalRate > 0.05) {
      sustainabilityProbability = 65;
    } else if (safeWithdrawalRate > 0.055) {
      sustainabilityProbability = 50;
    }

    // Step 8: Build household results
    return {
      totalNetWorthAtRetirement: liquidSavingsAtRetirement,
      liquidSavingsAtRetirement,
      monthlyIncomeAtRetirement: Math.round(totalMonthlyIncome),
      socialSecurityMonthly: Math.round(socialSecurityMonthly),
      safeWithdrawalAmount: Math.round(liquidSavingsAtRetirement * 0.04),
      yearsToRetirement,
      projectedBalanceAt90: Math.round(projectedBalanceAt90),
      sustainabilityProbability,
      recommendedWithdrawalStrategy: `${calcInputs.withdrawalStrategy.replace('_', ' ').toUpperCase()} Strategy`,
      personProjections: calcInputs.persons.map((p) => ({
        id: p.id,
        currentAge: p.currentAge,
        retirementAge: p.retirementAge,
        lifeExpectancy: p.lifeExpectancy,
        totalLiquidSavingsAtRetirement: 0,
        socialSecurityMonthly: Math.round(p.estimatedSSBenefit),
      })),
      propertyProjections: [],
      accountProjections: [],
      monthlyIncomeBreakdown: {
        socialSecurity: Math.round(socialSecurityMonthly),
        portfolioWithdrawal: Math.round(monthlyWithdrawal),
        rentalIncome: 0,
        otherIncome: 0,
      },
    };
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <CalculatorLayout>
        {/* Person Inputs */}
        <div className="mb-6 space-y-4">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">
            Person Inputs
          </h2>
          {inputs.persons.map((person, idx) => (
            <PersonInputCard
              key={person.id}
              person={person}
              onChange={(updatedPerson) => {
                const updatedPersons = [...inputs.persons];
                updatedPersons[idx] = updatedPerson;
                setInputs({ ...inputs, persons: updatedPersons });
              }}
            />
          ))}
        </div>

        {/* Results Dashboard */}
        <div className="mt-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">
            Results Dashboard
          </h2>

          {loading ? (
            <div className="flex h-64 items-center justify-center rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
              <div className="h-12 w-12 animate-spin rounded-full border-blue-500 border-b-2" />
            </div>
          ) : results ? (
            <>
              <OverviewMetrics results={results} loading={loading} />

              <div className="mt-6 space-y-6">
                <MonthlyIncomeBreakdown results={results} />
              </div>
            </>
          ) : (
            <p className="text-gray-500">Enter your information to see projections</p>
          )}
        </div>

        {/* Calculate Button */}
        <button
          onClick={calculateRetirement}
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {loading ? 'Calculating...' : 'Recalculate Retirement Plan'}
        </button>
      </CalculatorLayout>
    </div>
  );
}
