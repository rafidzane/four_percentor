'use client';

import { useMemo } from 'react';
import type { WithdrawalStrategyType } from '../types';

interface Props {
  portfolioValue: number;
  strategy: WithdrawalStrategyType;
}

export default function DynamicWithdrawalCalculator({ portfolioValue, strategy }: Props) {
  const calculation = useMemo(() => {
    if (strategy === 'fixed_percentage') {
      const firstYearWithdrawal = portfolioValue * 0.04;
      const monthlyWithdrawal = firstYearWithdrawal / 12;

      return {
        monthlyWithdrawal,
        annualWithdrawal: firstYearWithdrawal,
        adjustmentRate: 0.03,
        sustainabilityProbability: 96,
        details: '4% of initial portfolio value, adjusted for inflation each year',
      };
    } else if (strategy === 'dynamic_withdrawal') {
      const baseWithdrawal = portfolioValue * 0.035;
      const monthlyWithdrawal = baseWithdrawal / 12;

      return {
        monthlyWithdrawal,
        annualWithdrawal: baseWithdrawal,
        adjustmentRate: 0.02,
        sustainabilityProbability: 92,
        details: 'Adjust withdrawals annually based on portfolio performance and remaining years',
      };
    } else if (strategy === 'bucket_strategy') {
      const shortTermBucket = portfolioValue * 0.3;
      const midTermBucket = portfolioValue * 0.4;

      const monthlyWithdrawal = (shortTermBucket / 36) + (midTermBucket / 84);

      return {
        monthlyWithdrawal,
        annualWithdrawal: monthlyWithdrawal * 12,
        adjustmentRate: 0,
        sustainabilityProbability: 95,
        details: 'Assets separated into short-term (cash), mid-term (bonds), long-term (stocks) buckets',
      };
    } else {
      const lifeExpectancy = 87;
      const years = lifeExpectancy - 62;
      const divisor = portfolioValue / years;
      const monthlyWithdrawal = divisor / 12;

      return {
        monthlyWithdrawal,
        annualWithdrawal: divisor,
        adjustmentRate: 0.03,
        sustainabilityProbability: 85,
        details: 'Withdraw based on IRS life expectancy tables',
      };
    }
  }, [portfolioValue, strategy]);

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
      <h3 className="mb-4 font-semibold text-gray-700">Withdrawal Strategy Calculator</h3>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="rounded-lg bg-blue-50 p-4">
          <p className="text-xs text-gray-500">Monthly Withdrawal</p>
          <p className="font-bold text-xl text-blue-700">{formatCurrency(calculation.monthlyWithdrawal)}</p>
        </div>

        <div className="rounded-lg bg-purple-50 p-4">
          <p className="text-xs text-gray-500">Annual Withdrawal</p>
          <p className="font-bold text-xl text-purple-700">{formatCurrency(calculation.annualWithdrawal)}</p>
        </div>

        <div className="rounded-lg bg-green-50 p-4">
          <p className="text-xs text-gray-500">Sustainability Probability</p>
          <p
            className={`font-bold text-xl ${
              calculation.sustainabilityProbability >= 90
                ? 'text-green-700'
                : calculation.sustainabilityPercentage >= 70
                  ? 'text-yellow-700'
                  : 'text-red-700'
            }`}
          >
            {calculation.sustainabilityProbability}%
          </p>
        </div>

        <div className="rounded-lg bg-orange-50 p-4">
          <p className="text-xs text-gray-500">Inflation Adjustment</p>
          <p className="font-bold text-xl text-orange-700">{calculation.adjustmentRate * 100}%/year</p>
        </div>
      </div>

      <div className="rounded-lg border-l-4 border-pink-500 bg-pink-50 p-3">
        <p className="text-xs font-semibold text-pink-700">Strategy Details</p>
        <p className="mt-1 text-sm text-pink-900">{calculation.details}</p>
      </div>

      {calculation.sustainabilityProbability < 80 && (
        <div className="mt-4 rounded-lg border-l-4 border-red-500 bg-red-50 p-3">
          <p className="font-semibold text-red-700">Caution</p>
          <p className="text-sm text-red-600 mt-1">
            This strategy has a lower sustainability probability. Consider increasing savings or adjusting your withdrawal rate.
          </p>
        </div>
      )}
    </div>
  );
}
