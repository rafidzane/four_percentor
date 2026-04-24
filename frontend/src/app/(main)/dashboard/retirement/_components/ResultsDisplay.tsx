"use client";

import type { CalculationResults } from "./calculateRetirement";

interface Props {
  results: CalculationResults | null;
  loading: boolean;
}

export default function ResultsDisplay({ results, loading }: Props) {
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

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-blue-500 border-b-2" />
      </div>
    );
  }

  if (!results) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-500">Enter your information to see projections</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Total Net Worth at Retirement */}
      <div className="rounded-lg border-green-500 border-l-4 bg-green-50 p-3">
        <p className="text-gray-600 text-xs">Total Net Worth at Retirement</p>
        <p className="font-bold text-base text-green-700">{formatCurrency(results.totalNetWorthAtRetirement)}</p>
      </div>

      {/* Total Liquid Savings */}
      <div className="rounded-lg border-blue-500 border-l-4 bg-blue-50 p-3">
        <p className="text-gray-600 text-xs">Total Liquid Savings at Retirement</p>
        <p className="font-bold text-base text-blue-700">{formatCurrency(results.totalLiquidSavingsAtRetirement)}</p>
      </div>

      {/* Monthly Income */}
      <div className="rounded-lg border-purple-500 border-l-4 bg-purple-50 p-3">
        <p className="text-gray-600 text-xs">Monthly Income at Retirement</p>
        <p className="font-bold text-base text-purple-700">{formatCurrency(results.monthlyIncomeAtRetirement)}</p>
      </div>

      {/* Social Security Benefit */}
      <div className="rounded-lg border-teal-500 border-l-4 bg-teal-50 p-3">
        <p className="text-gray-600 text-xs">Social Security Benefit (Monthly)</p>
        <p className="font-bold text-base text-teal-700">{formatCurrency(results.socialSecurityBenefit)}</p>
      </div>

      {/* Safe Withdrawal Amount */}
      <div className="rounded-lg border-orange-500 border-l-4 bg-orange-50 p-3">
        <p className="text-gray-600 text-xs">Safe Annual Withdrawal (4% Rule)</p>
        <p className="font-bold text-base text-orange-700">{formatCurrency(results.safeWithdrawalAmount)}</p>
      </div>

      {/* Projected Balance at 90 */}
      {results.projectedBalanceAtAge90 !== undefined && results.projectedBalanceAtAge90 > 0 && (
        <div className="rounded-lg border-indigo-500 border-l-4 bg-indigo-50 p-3">
          <p className="text-gray-600 text-xs">Projected Balance at Age 90</p>
          <p className="font-bold text-base text-indigo-700">{formatCurrency(results.projectedBalanceAtAge90)}</p>
        </div>
      )}

      {/* Withdrawal Rate */}
      <div className="rounded-lg bg-gray-50 p-3">
        <p className="text-gray-600 text-xs">Withdrawal Rate</p>
        <p className="font-bold text-base text-gray-800">{(results.withdrawalRate * 100).toFixed(2)}%</p>
      </div>

      {/* Years to Retirement */}
      <div className="rounded-lg border-yellow-500 border-l-4 bg-yellow-50 p-3">
        <p className="text-gray-600 text-xs">Years Until Retirement</p>
        <p className="font-bold text-base text-yellow-700">{results.yearsToRetirement} years</p>
      </div>

      {/* Recommended Strategy */}
      <div className="rounded-lg border-pink-500 border-l-4 bg-pink-50 p-3">
        <p className="font-semibold text-gray-600 text-xs">Recommended Strategy</p>
        <p className="mt-1 text-base text-pink-800">{results.recommendedWithdrawalStrategy}</p>
      </div>
    </div>
  );
}
