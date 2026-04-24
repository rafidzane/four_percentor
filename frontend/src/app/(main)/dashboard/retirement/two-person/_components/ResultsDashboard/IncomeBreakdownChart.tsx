"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { TwoPersonCalculationResults } from "../PrimaryMetrics";

interface ChartDataPoint {
  name: string;
  value: number;
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

export default function IncomeBreakdownChart({ results }: Props) {
  if (!results) {
    return (
      <div className="flex h-80 w-full items-center justify-center rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-gray-500">Loading chart...</p>
      </div>
    );
  }

  const { householdProjection } = results;

  const socialSecurityMonthly = householdProjection.combinedSocialSecurityBenefit;
  const portfolioWithdrawalMonthly = householdProjection.safeWithdrawalAmount / 12;
  const totalMonthlyIncome = householdProjection.monthlyIncomeAtRetirement;

  const chartData: ChartDataPoint[] = [
    { name: "Social Security", value: socialSecurityMonthly },
    {
      name: "Portfolio Withdrawal",
      value: portfolioWithdrawalMonthly,
    },
  ];

  const colors = ["#3b82f6", "#8b5cf6"];

  return (
    <div className="h-80 w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="mb-4 text-center font-semibold text-gray-700">Income Breakdown</h3>
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-blue-50 p-3 text-center">
          <p className="text-xs text-blue-600">Social Security (Monthly)</p>
          <p className="font-bold text-blue-900">{formatCurrency(socialSecurityMonthly)}/month</p>
        </div>
        <div className="rounded-lg bg-purple-50 p-3 text-center">
          <p className="text-xs text-purple-600">Portfolio Withdrawal (Monthly)</p>
          <p className="font-bold text-purple-900">{formatCurrency(portfolioWithdrawalMonthly)}/month</p>
        </div>
      </div>
      <div className="w-full h-full">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${formatCurrency(value)}/month`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
