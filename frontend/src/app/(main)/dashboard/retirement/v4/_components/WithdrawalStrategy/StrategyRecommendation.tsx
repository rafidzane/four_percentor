'use client';

import type { WithdrawalStrategyType } from '../types';

interface Props {
  strategy: WithdrawalStrategyType;
  portfolioValue: number;
  monthlyIncomeNeeds: number;
}

export default function StrategyRecommendation({ strategy, portfolioValue, monthlyIncomeNeeds }: Props) {
  const recommendation = useMemo(() => {
    if (strategy === 'fixed_percentage') {
      const annualWithdrawal = portfolioValue * 0.04;
      const monthlyFromPortfolio = annualWithdrawal / 12;

      if (monthlyFromPortfolio >= monthlyIncomeNeeds) {
        return {
          status: 'good',
          message: 'The 4% rule provides sufficient income for your needs.',
          confidence: 'high',
        };
      } else {
        return {
          status: 'caution',
          message: `You'll need $${(monthlyIncomeNeeds - monthlyFromPortfolio).toLocaleString()} more per month. Consider delaying retirement or increasing savings.`,
          confidence: 'medium',
        };
      }
    } else if (strategy === 'dynamic_withdrawal') {
      return {
        status: 'good',
        message: 'Dynamic withdrawal offers flexibility to adjust based on market conditions.',
        confidence: 'high',
      };
    } else if (strategy === 'bucket_strategy') {
      return {
        status: 'good',
        message: 'Bucket strategy provides security with dedicated cash reserves.',
        confidence: 'high',
      };
    } else {
      return {
        status: 'caution',
        message: 'RMD approach may not provide sufficient income. Review carefully.',
        confidence: 'medium',
      };
    }
  }, [strategy, portfolioValue, monthlyIncomeNeeds]);

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

  const statusColors = {
    good: { bg: 'bg-green-50', border: 'border-green-400', text: 'text-green-800' },
    caution: { bg: 'bg-yellow-50', border: 'border-yellow-400', text: 'text-yellow-800' },
  };

  const style = statusColors[recommendation.status];

  return (
    <div className={`rounded-lg border ${style.border} ${style.bg} p-4`}>
      <h3 className="mb-2 font-semibold text-gray-700">Strategy Recommendation</h3>

      <p className={`text-sm ${style.text}`}>{recommendation.message}</p>

      <div className="mt-3 flex items-center gap-2">
        <span className="inline-flex h-3 w-3 rounded-full bg-green-500"></span>
        <span className="text-xs text-gray-600">Confidence: {recommendation.confidence}</span>
      </div>

      {monthlyIncomeNeeds > portfolioValue * 0.04 / 12 && (
        <div className="mt-3 rounded bg-white p-3 shadow-sm">
          <p className="text-xs font-semibold text-gray-600">Alternative Approach</p>
          <p className="mt-1 text-sm text-gray-700">
            Consider combining multiple strategies: use 4% rule as baseline, supplement with rental income or part-time work.
          </p>
        </div>
      )}
    </div>
  );
}
