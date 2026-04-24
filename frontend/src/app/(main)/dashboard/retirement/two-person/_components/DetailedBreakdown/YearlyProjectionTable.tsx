"use client";

import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import type { TwoPersonCalculationResults } from "../PrimaryMetrics";

interface RowDetails {
  age: number;
  interestEarned: number;
  remainingBalance: number;
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

export default function YearlyProjectionTable({ results }: Props) {
  if (!results || !results.householdProjection.yearlyProjections.length) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-center font-semibold text-gray-700">Annual Projections</h3>
        <p className="text-gray-500">No projection data available</p>
      </div>
    );
  }

  const { householdProjection } = results;
  const {
    safeWithdrawalAmount,
    combinedSocialSecurityBenefit,
    yearsToDepletion,
  } = householdProjection;

  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const toggleRowDetails = (age: number) => {
    setExpandedRow(expandedRow === age ? null : age);
  };

  const calculateYearlyData = (): Array<{
    age: number;
    balance: number;
    withdrawal: number;
    socialSecurity: number;
    netExpenses: number;
    details?: RowDetails;
  }> => {
    let currentBalance = householdProjection.totalLiquidSavingsAtRetirement;
    const data: Array<{
      age: number;
      balance: number;
      withdrawal: number;
      socialSecurity: number;
      netExpenses: number;
      details?: RowDetails;
    }> = [];

    for (let i = 0; i < householdProjection.yearlyProjections.length; i++) {
      const projection = householdProjection.yearlyProjections[i];
      if (projection.age < 62) continue;

      const monthlyReturnRate = 0.07 / 12;
      const monthsSinceRetirement = (projection.age - 62) * 12;

      const interestEarned = currentBalance * monthlyReturnRate * monthsSinceRetirement;
      const newBalance = currentBalance + interestEarned - safeWithdrawalAmount;
      
      data.push({
        age: projection.age,
        balance: Math.round(currentBalance),
        withdrawal: safeWithdrawalAmount,
        socialSecurity: combinedSocialSecurityBenefit,
        netExpenses: 0,
        details: {
          age: projection.age,
          interestEarned,
          remainingBalance: newBalance,
        },
      });

      currentBalance = newBalance;
    }

    return data;
  };

  const chartData = calculateYearlyData();

  const hasWarning = yearsToDepletion && yearsToDepletion < 28;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-center font-semibold text-gray-700">Annual Projections</h3>

      {hasWarning && (
        <div className="mb-4 rounded-lg border-2 border-red-300 bg-red-50 p-4">
          <p className="text-sm font-bold text-red-700">⚠️ Warning: Funds may deplete before age 90</p>
          <p className="text-sm text-red-600">
            Based on current projections, your funds are expected to last approximately{" "}
            {Math.round(yearsToDepletion)} years after retirement. Consider adjusting your withdrawal rate.
          </p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-max">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">Age</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">Balance</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">Withdrawal</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">Social Security</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600">Net Expenses</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {chartData.map((row) => (
              <React.Fragment key={row.age}>
                <tr 
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleRowDetails(row.age)}
                >
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.age}</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-700">{formatCurrency(row.balance)}</td>
                  <td className="px-4 py-3 text-sm text-right text-red-600">-{formatCurrency(row.withdrawal)}</td>
                  <td className="px-4 py-3 text-sm text-right text-green-600">{formatCurrency(row.socialSecurity)}</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-700">
                    {formatCurrency(row.netExpenses)}
                  </td>
                </tr>
                {expandedRow === row.age && row.details && (
                  <tr className="bg-gray-50">
                    <td colSpan={5} className="px-4 py-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-lg bg-white p-3 shadow-sm">
                          <p className="text-xs text-gray-500 uppercase">Interest Earned</p>
                          <p className="font-semibold text-green-600">{formatCurrency(Math.round(row.details.interestEarned))}</p>
                        </div>
                        <div className="rounded-lg bg-white p-3 shadow-sm">
                          <p className="text-xs text-gray-500 uppercase">Remaining Balance</p>
                          <p className="font-semibold text-blue-600">{formatCurrency(Math.round(row.details.remainingBalance))}</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {chartData.length > 1 && (
        <div className="mt-6 h-48 w-full">
          <h4 className="mb-2 text-center font-semibold text-gray-700">Balance Trajectory</h4>
          <LineChart data={chartData} width="100%" height="100%">
            <XAxis dataKey="age" label={{ value: "Age", position: "insideBottom", offset: -5 }} />
            <YAxis
              domain={[0, "auto"]}
              tickFormatter={(value) => `$${value}`}
              label={{ value: "Balance ($)", angle: -90, position: "insideLeft" }}
            />
            <Tooltip formatter={(value) => `$${value}`} />
            <Line
              type="monotone"
              dataKey="balance"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </div>
      )}
    </div>
  );
}
