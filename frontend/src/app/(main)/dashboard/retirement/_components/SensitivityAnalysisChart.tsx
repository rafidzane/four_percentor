'use client';

import React, { useState } from 'react';
import { calculateFutureValueWithContributions } from '@/lib/calculation';

interface SensitivityAnalysisProps {
  currentSavings: number;
  monthlyContribution: number;
  annualReturnRate: number;
  yearsToRetirement: number;
}

const SensitivityAnalysisChart = ({
  currentSavings,
  monthlyContribution,
  annualReturnRate,
  yearsToRetirement
}: SensitivityAnalysisProps) => {
  const [returnRates, setReturnRates] = useState<number[]>([3, 5, 7, 9, 11]);
  
  // Calculate projections for different return rates
  const dataPoints = returnRates.map(rate => ({
    rate,
    futureValue: calculateFutureValueWithContributions(
      currentSavings,
      monthlyContribution,
      rate / 100,
      yearsToRetirement
    )
  }));

  // Find min and max values for chart scaling
  const maxValue = Math.max(...dataPoints.map(d => d.futureValue));
  const minValue = Math.min(...dataPoints.map(d => d.futureValue));

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Sensitivity Analysis</h2>
      <p className="text-sm text-gray-600 mb-4">
        How different annual return rates affect your retirement savings
      </p>

      {/* Chart */}
      <div className="relative h-64 w-full bg-gray-50 rounded-lg p-4 border border-gray-200">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between py-8 text-xs text-gray-500">
          <span>{formatLargeNumber(maxValue)}</span>
          <span>{formatLargeNumber((maxValue + minValue) / 2)}</span>
          <span>{formatLargeNumber(minValue)}</span>
        </div>

        {/* Chart bars */}
        <div className="absolute left-8 right-0 top-0 bottom-0 flex items-end justify-around px-4">
          {dataPoints.map((point, index) => {
            const barHeightPercentage = 
              ((point.futureValue - minValue) / (maxValue - minValue || 1)) * 90 + 5;
            
            return (
              <div key={index} className="flex flex-col items-center gap-2 w-12">
                {/* Tooltip */}
                <div className="opacity-0 hover:opacity-100 absolute -mt-8 bg-gray-800 text-white text-xs rounded px-2 py-1 transition-opacity z-10 whitespace-nowrap">
                  {formatCurrency(point.futureValue)} @ {point.rate}% return
                </div>

                {/* Bar */}
                <div 
                  className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t hover:from-blue-600 hover:to-blue-400 transition-all duration-300"
                  style={{ height: `${barHeightPercentage}%` }}
                />
                
                {/* X-axis label */}
                <div className="text-xs font-medium text-gray-700">{point.rate}%</div>
              </div>
            );
          })}
        </div>

        {/* Chart title */}
        <div className="absolute bottom-2 right-4 text-xs text-gray-500">
          Future Value at Retirement
        </div>
      </div>

      {/* Data table */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left font-semibold">Return Rate</th>
              <th className="p-3 text-right font-semibold">Future Value</th>
              <th className="p-3 text-right font-semibold">Difference</th>
            </tr>
          </thead>
          <tbody>
            {dataPoints.map((point, index) => {
              const diff = index > 0 
                ? point.futureValue - dataPoints[index - 1].futureValue 
                : 0;
              
              return (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{point.rate}%</td>
                  <td className="p-3 text-right">{formatCurrency(point.futureValue)}</td>
                  <td className={`p-3 text-right ${diff > 0 ? 'text-green-600' : ''}`}>
                    {index > 0 ? (diff > 0 ? '+' : '') + formatCurrency(diff) : '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Analysis insights */}
      <div className="mt-6 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
        <h3 className="font-semibold text-blue-900 mb-2">Key Insights</h3>
        <ul className="space-y-1 text-sm text-blue-800">
          <li>
            A {annualReturnRate + 2}% return would add approximately{' '}
            {formatCurrency(
              calculateFutureValueWithContributions(
                currentSavings, monthlyContribution, (annualReturnRate + 2) / 100, yearsToRetirement
              ) - dataPoints.find(d => d.rate === annualReturnRate)?.futureValue || 0
            )}
          </li>
          <li>
            A {annualReturnRate - 2}% return would result in approximately{' '}
            {formatCurrency(
              calculateFutureValueWithContributions(
                currentSavings, monthlyContribution, (annualReturnRate - 2) / 100, yearsToRetirement
              )
            )}
          </li>
          <li>
            The difference between a {Math.min(...returnRates)}% and {Math.max(...returnRates)}% 
            return could be over {formatCurrency(
              dataPoints[dataPoints.length - 1].futureValue - dataPoints[0].futureValue
            )} in today's dollars.
          </li>
        </ul>
      </div>
    </div>
  );
};

// Helper functions
const formatCurrency = (value: number): string => {
  if (!value && value !== 0) return 'N/A';
  
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  } catch (e) {
    console.error('Currency formatting error:', e);
    return `$${value.toLocaleString()}`;
  }
};

const formatLargeNumber = (num: number): string => {
  if (num >= 1_000_000_000) {
    return `$${(num / 1_000_000_000).toFixed(1)}B`;
  } else if (num >= 1_000_000) {
    return `$${(num / 1_000_000).toFixed(1)}M`;
  } else if (num >= 1_000) {
    return `$${(num / 1_000).toFixed(1)}K`;
  }
  return `$${Math.round(num)}`;
};

export default SensitivityAnalysisChart;
