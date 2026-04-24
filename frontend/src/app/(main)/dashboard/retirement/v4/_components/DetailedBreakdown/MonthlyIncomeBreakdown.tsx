'use client';

import type { HouseholdResults } from '../types';

interface Props {
  results: HouseholdResults | null;
}

export default function MonthlyIncomeBreakdown({ results }: Props) {
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

  if (!results?.monthlyIncomeBreakdown) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-gray-500">Enter your information to see income breakdown</p>
      </div>
    );
  }

  const { socialSecurity, portfolioWithdrawal, rentalIncome = 0, otherIncome = 0 } =
    results.monthlyIncomeBreakdown;

  const totalMonthlyIncome = socialSecurity + portfolioWithdrawal + rentalIncome + otherIncome;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-center font-semibold text-gray-700">Monthly Income Breakdown</h3>

      {/* Total Monthly Income */}
      <div className="mb-6 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 p-4 text-white">
        <p className="text-xs opacity-90">Total Monthly Income at Retirement</p>
        <p className="text-3xl font-bold">{formatCurrency(totalMonthlyIncome)}</p>
      </div>

      {/* Breakdown */}
      <div className="space-y-3">
        <div className="flex items-center gap-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
          <div className="h-12 w-12 flex-shrink-0 rounded-full bg-cyan-500" />
          <div className="flex-1">
            <p className="font-medium text-gray-900">Social Security</p>
            <p className="text-xs text-gray-500">{(socialSecurity / totalMonthlyIncome * 100).toFixed(1)}% of total</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-blue-700">{formatCurrency(socialSecurity)}</p>
            <p className="text-xs text-gray-500">/ month</p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
          <div className="h-12 w-12 flex-shrink-0 rounded-full bg-orange-500" />
          <div className="flex-1">
            <p className="font-medium text-gray-900">Portfolio Withdrawal</p>
            <p className="text-xs text-gray-500">{(portfolioWithdrawal / totalMonthlyIncome * 100).toFixed(1)}% of total</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-blue-700">{formatCurrency(portfolioWithdrawal)}</p>
            <p className="text-xs text-gray-500">/ month</p>
          </div>
        </div>

        {rentalIncome > 0 && (
          <div className="flex items-center gap-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
            <div className="h-12 w-12 flex-shrink-0 rounded-full bg-green-500" />
            <div className="flex-1">
              <p className="font-medium text-gray-900">Rental Income</p>
              <p className="text-xs text-gray-500">{(rentalIncome / totalMonthlyIncome * 100).toFixed(1)}% of total</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-blue-700">{formatCurrency(rentalIncome)}</p>
              <p className="text-xs text-gray-500">/ month</p>
            </div>
          </div>
        )}

        {otherIncome > 0 && (
          <div className="flex items-center gap-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
            <div className="h-12 w-12 flex-shrink-0 rounded-full bg-purple-500" />
            <div className="flex-1">
              <p className="font-medium text-gray-900">Other Income</p>
              <p className="text-xs text-gray-500">{(otherIncome / totalMonthlyIncome * 100).toFixed(1)}% of total</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-blue-700">{formatCurrency(otherIncome)}</p>
              <p className="text-xs text-gray-500">/ month</p>
            </div>
          </div>
        )}
      </div>

      {/* Annual Summary */}
      <div className="mt-6 rounded-lg border-t border-gray-200 pt-4">
        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <p className="text-gray-500">Annual Social Security</p>
            <p className="font-bold text-teal-600">{formatCurrency(socialSecurity * 12)}</p>
          </div>

          <div>
            <p className="text-gray-500">Annual Portfolio Withdrawal</p>
            <p className="font-bold text-orange-600">{formatCurrency(portfolioWithdrawal * 12)}</p>
          </div>

          <div>
            <p className="text-gray-500">Annual Total</p>
            <p className="font-bold text-blue-700">{formatCurrency(totalMonthlyIncome * 12)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
