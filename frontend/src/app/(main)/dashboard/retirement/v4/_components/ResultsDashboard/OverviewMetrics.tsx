'use client';

import type { HouseholdResults } from '../types';

interface Props {
  results: HouseholdResults | null;
  loading?: boolean;
}

export default function OverviewMetrics({ results, loading = false }: Props) {
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

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <div className="h-12 w-12 animate-spin rounded-full border-blue-500 border-b-2" />
      </div>
    );
  }

  if (!results) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-gray-500">Enter your information to see projections</p>
      </div>
    );
  }

  const metrics = [
    {
      label: 'Total Household Net Worth at Retirement',
      value: results.totalNetWorthAtRetirement,
      colorClass: 'bg-gradient-to-br from-blue-500 to-purple-600',
      textColor: 'text-white',
    },
    {
      label: 'Total Liquid Savings',
      value: results.liquidSavingsAtRetirement,
      colorClass: 'bg-gradient-to-br from-cyan-500 to-blue-600',
      textColor: 'text-white',
    },
    {
      label: 'Monthly Income at Retirement',
      value: results.monthlyIncomeAtRetirement,
      colorClass: 'bg-gradient-to-br from-green-500 to-emerald-600',
      textColor: 'text-white',
    },
    {
      label: 'Safe Annual Withdrawal (4% Rule)',
      value: results.safeWithdrawalAmount,
      colorClass: 'bg-gradient-to-br from-orange-500 to-red-600',
      textColor: 'text-white',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric, idx) => (
          <div key={idx} className={`rounded-lg p-6 shadow-sm ${metric.colorClass}`}>
            <p className={`mb-2 text-xs font-medium uppercase tracking-wide ${metric.textColor} opacity-90`}>
              {metric.label}
            </p>
            <p className={`text-3xl font-bold ${metric.textColor}`}>{formatCurrency(metric.value)}</p>
          </div>
        ))}
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">Years to Retirement</p>
          <p className="font-bold text-gray-900">{results.yearsToRetirement} years</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">Projected Balance at 90</p>
          <p className="font-bold text-green-600">{formatCurrency(results.projectedBalanceAt90)}</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">Sustainability Probability</p>
          <p
            className={`font-bold ${
              results.sustainabilityProbability >= 90
                ? 'text-green-600'
                : results.sustainabilityPercentage >= 70
                  ? 'text-yellow-600'
                  : 'text-red-600'
            }`}
          >
            {results.sustainabilityProbability.toFixed(1)}%
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-gray-500">Recommended Strategy</p>
          <p className="font-medium text-purple-600">
            {results.recommendedWithdrawalStrategy.split(':')[0]}
          </p>
        </div>
      </div>

      {/* Social Security Breakdown */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-gray-700">Social Security Monthly</h3>
        <p className="text-lg font-bold text-teal-600">{formatCurrency(results.socialSecurityMonthly)}</p>
      </div>

      {/* Strategy Recommendation */}
      {results.recommendedWithdrawalStrategy.includes(':') && (
        <div className="rounded-lg border-l-4 border-pink-500 bg-pink-50 p-4">
          <p className="text-xs font-semibold text-pink-700">Recommended Strategy</p>
          <p className="mt-1 text-sm text-pink-900">{results.recommendedWithdrawalStrategy}</p>
        </div>
      )}
    </div>
  );
}
