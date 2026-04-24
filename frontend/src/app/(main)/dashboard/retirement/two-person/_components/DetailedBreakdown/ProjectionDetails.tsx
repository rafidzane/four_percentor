"use client";

import type { CalculationResults } from "@/app/(main)/dashboard/retirement/_components/types";

interface Props {
  personName: string;
  results: CalculationResults | null;
}

const formatCurrency = (value: number | null): string => {
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
    return `$${value?.toLocaleString()}`;
  }
};

export default function ProjectionDetails({ personName, results }: Props) {
  if (!results) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">{personName}'s Retirement Projection</h3>
        <p className="text-gray-500">No projection data available</p>
      </div>
    );
  }

  const { 
    retirementAge, 
    totalLiquidSavingsAtRetirement, 
    socialSecurityBenefit,
    safeWithdrawalAmount, 
    projectedBalanceAtAge90, 
    withdrawalRate,
    recommendedWithdrawalStrategy 
  } = results;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">{personName}'s Retirement Projection</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="rounded-lg bg-gradient-to-br from-blue-50 to-white p-4 border-l-4 border-blue-500">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Retirement Age</p>
          <p className="text-2xl font-bold text-blue-600">{retirementAge}</p>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-green-50 to-white p-4 border-l-4 border-green-500">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Liquid Savings at Retirement</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(totalLiquidSavingsAtRetirement)}</p>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-teal-50 to-white p-4 border-l-4 border-teal-500">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Social Security Benefit</p>
          <p className="text-2xl font-bold text-teal-600">{formatCurrency(socialSecurityBenefit)}/mo</p>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-orange-50 to-white p-4 border-l-4 border-orange-500">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Safe Annual Withdrawal (4%)</p>
          <p className="text-2xl font-bold text-orange-600">{formatCurrency(safeWithdrawalAmount)}</p>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-purple-50 to-white p-4 border-l-4 border-purple-500">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Projected Balance at Age 90</p>
          <p className="text-2xl font-bold text-purple-600">{formatCurrency(projectedBalanceAtAge90)}</p>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-indigo-50 to-white p-4 border-l-4 border-indigo-500">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Withdrawal Rate</p>
          <p className="text-2xl font-bold text-indigo-600">{(withdrawalRate * 100).toFixed(0)}%</p>
        </div>
      </div>

      {recommendedWithdrawalStrategy && (
        <div className="rounded-lg border-2 border-pink-300 bg-pink-50 p-4">
          <h4 className="mb-2 text-sm font-semibold text-pink-700">Recommended Strategy</h4>
          <p className="text-sm text-gray-700">{recommendedWithdrawalStrategy}</p>
        </div>
      )}
    </div>
  );
}
