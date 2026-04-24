'use client';

import type { CalculationResults } from '../types';

interface Scenario {
  id: string;
  name: string;
  results: CalculationResults;
  isBaseline?: boolean;
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
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
        <p className="text-gray-500">Add scenarios to compare them side-by-side</p>
      </div>
    );
  }

  const metrics = [
    { label: 'Total Net Worth at Retirement', key: 'totalNetWorthAtRetirement' },
    { label: 'Liquid Savings at Retirement', key: 'totalLiquidSavingsAtRetirement' },
    { label: 'Monthly Income at Retirement', key: 'monthlyIncomeAtRetirement' },
    { label: 'Social Security (Monthly)', key: 'socialSecurityBenefit' },
    { label: 'Safe Annual Withdrawal (4% Rule)', key: 'safeWithdrawalAmount' },
    { label: 'Years to Retirement', key: 'yearsToRetirement' },
  ];

  const getBestValue = (key: keyof CalculationResults) => {
    let bestValue = scenarios[0].results[key] as number;

    for (let i = 1; i < scenarios.length; i++) {
      const value = scenarios[i].results[key] as number;
      if (value > bestValue) {
        bestValue = value;
      }
    }

    return bestValue;
  };

  const isBest = (key: keyof CalculationResults, value: number): boolean => {
    const bestValue = getBestValue(key);
    return Math.abs(value - bestValue) < 1;
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-gray-700">
          <tr>
            <th className="px-4 py-3 font-semibold">Metric</th>
            {scenarios.map((scenario) => (
              <th
                key={scenario.id}
                className={`px-4 py-3 font-semibold ${scenario.isBaseline ? 'text-blue-600' : ''}`}
              >
                {scenario.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {metrics.map((metric) => (
            <tr key={metric.key} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-gray-600">{metric.label}</td>
              {scenarios.map((scenario) => {
                const value = scenario.results[metric.key] as number;
                const isBestMetric = isBest(metric.key, value);

                return (
                  <td
                    key={`${scenario.id}-${metric.key}`}
                    className={`px-4 py-3 font-medium ${isBestMetric ? 'bg-green-50 text-green-700' : ''}`}
                  >
                    {metric.key === 'yearsToRetirement'
                      ? `${value} years`
                      : formatCurrency(value)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 text-xs">
        <p className="text-gray-600">
          <span className="font-semibold">Green highlight</span> = best value for that metric
        </p>
      </div>
    </div>
  );
}
