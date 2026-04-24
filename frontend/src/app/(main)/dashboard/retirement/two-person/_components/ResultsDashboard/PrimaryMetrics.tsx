"use client";

import type { CalculationResults } from "@/app/(main)/dashboard/retirement/_components/calculateRetirement";

interface TwoPersonHouseholdProjection {
  totalNetWorthAtRetirement: number;
  totalLiquidSavingsAtRetirement: number;
  monthlyIncomeAtRetirement: number;
  combinedSocialSecurityBenefit: number;
  safeWithdrawalAmount: number;
  yearsToRetirement: number;
}

export interface TwoPersonCalculationResults {
  projection1: CalculationResults | null;
  projection2: CalculationResults | null;
  householdProjection: TwoPersonHouseholdProjection;
}

interface Props {
  results: TwoPersonCalculationResults | null;
}

const formatCurrency = (value: number): string => {
  if (!value && value !== 0) return "N/A";

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  } catch (e) {
    console.error("Currency formatting error:", e);
    return `$${value.toLocaleString()}`;
  }
};

export default function PrimaryMetrics({ results }: Props) {
  if (!results) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-gray-500">Loading metrics...</p>
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
          <p className="font-bold text-lg text-gray-900">
            {formatCurrency(householdProjection.totalNetWorthAtRetirement)}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Total Household Liquid Savings</p>
          <p className="font-bold text-lg text-blue-600">
            {formatCurrency(householdProjection.totalLiquidSavingsAtRetirement)}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Total Monthly Income at Retirement</p>
          <p className="font-bold text-lg text-purple-600">
            {formatCurrency(householdProjection.monthlyIncomeAtRetirement)}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Combined Social Security (Monthly)</p>
          <p className="font-bold text-lg text-teal-600">
            {formatCurrency(householdProjection.combinedSocialSecurityBenefit)}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Safe Annual Withdrawal (4% Rule)</p>
          <p className="font-bold text-lg text-orange-600">
            {formatCurrency(householdProjection.safeWithdrawalAmount)}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Years Until Retirement</p>
          <p className="font-bold text-lg text-yellow-600">{householdProjection.yearsToRetirement} years</p>
        </div>
      </div>
    </div>
  );
}
