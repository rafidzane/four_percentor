"use client";

import { FC } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

// Define the type for retirement response
interface RetirementResponse {
  age: number[];
  portfolio_balance: number[];
  income: number[];
  expenses: number[];
  net_income: number[];
  success: boolean;
  final_balance: number;
  avg_balance: number;
  max_balance: number;
  min_balance: number;
}

// Transform API response into chart-compatible data format
function transformDataToChartData(result?: RetirementResponse) {
  if (!result || !result.age.length) return null;

  const portfolio = result.age.map((age, index) => ({
    age,
    portfolioValue: result.portfolio_balance[index] ?? 0,
    income: result.income[index] ?? 0,
    expenses: result.expenses[index] ?? 0,
  }));

  return { portfolio };
}

interface RetirementResultsSummaryProps {
  result: RetirementResponse;
}

export const RetirementResultsSummary: FC<RetirementResultsSummaryProps> = ({ result }) => {
  const chartData = transformDataToChartData(result);
  const isSuccess = result.success;

  const formatValue = (val: number) =>
    `$${val.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  return (
    <section className="group relative overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
      {/* Decorative accent bar */}
      <div
        className={`absolute inset-y-0 left-0 w-1.5 opacity-80 transition-all group-hover:opacity-100 ${
          isSuccess ? "bg-gradient-to-b from-emerald-500 to-green-600" : "bg-gradient-to-b from-red-500 to-orange-500"
        }`}
      />

      {/* Header Section */}
      <div className="relative px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <h2 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Retirement Projections
        </h2>
        <span
          className={cn(
            "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border",
            isSuccess
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900"
              : "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400 border-red-100 dark:border-red-900"
          )}
        >
          {isSuccess ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 mr-1">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              Projection Successful
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 mr-1">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              Projection Failed
            </>
          )}
        </span>
      </div>

      {/* Content Section */}
      <div className="px-4 py-3 space-y-6">
        {/* All balances in one card */}
        <div className={`rounded-xl p-4 ${isSuccess ? "bg-slate-50 dark:bg-slate-900/50" : "bg-red-50 dark:bg-red-950/10"} border ${isSuccess ? "border-slate-200 dark:border-slate-800" : "border-red-100 dark:border-red-900/30"}`}>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">Key Balances</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Final Balance */}
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Final</p>
              <p className={cn(
                "font-mono text-base font-bold tabular-nums",
                isSuccess ? "text-slate-900 dark:text-slate-100" : "text-red-700 dark:text-red-400"
              )}>
                {formatValue(result.final_balance)}
              </p>
            </div>

            {/* Average Balance */}
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Average</p>
              <p className="font-mono text-base font-bold tabular-nums text-slate-700 dark:text-slate-300">
                {formatValue(result.avg_balance)}
              </p>
            </div>

            {/* Max Balance */}
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Peak</p>
              <p className="font-mono text-base font-bold tabular-nums text-slate-700 dark:text-slate-300">
                {formatValue(result.max_balance)}
              </p>
            </div>

            {/* Min Balance */}
            <div>
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Lowest</p>
              <p className={cn(
                "font-mono text-base font-bold tabular-nums",
                isSuccess ? "text-slate-700 dark:text-slate-300" : "text-red-700 dark:text-red-400"
              )}>
                {formatValue(result.min_balance)}
              </p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="space-y-4">
          {/* Portfolio Value Chart */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">Portfolio Balance Over Time</h3>
            {chartData && (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={chartData.portfolio} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="age" label={{ value: "Age", position: "insideBottom", offset: -5 }} />
                  <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                  <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, "Balance"]} />
                  <Legend />
                  <Line type="monotone" dataKey="portfolioValue" stroke="#3b82f6" name="Portfolio Balance" strokeWidth={2} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Income vs Expenses Chart */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">Income vs Expenses</h3>
            {chartData && (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={chartData.portfolio} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="age" label={{ value: "Age", position: "insideBottom", offset: -5 }} />
                  <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                  <Tooltip formatter={(value: number, name: string) => {
                    if (name === "Income" || name === "Expenses") return [`$${value.toLocaleString()}`, name];
                    return [`$${value.toLocaleString()}`, "Amount"];
                  }} />
                  <Legend />
                  <Line type="monotone" dataKey="income" stroke="#10b981" name="Income" strokeWidth={2} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="expenses" stroke="#ef4444" name="Expenses" strokeWidth={2} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Success/Failure Message */}
        <div
          className={cn(
            "rounded-xl px-4 py-3",
            isSuccess
              ? "bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900"
              : "bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900"
          )}
        >
          <div className="flex items-center gap-3">
            {isSuccess ? (
              <>
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/50">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">Projection Successful</span>
              </>
            ) : (
              <>
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-red-800 dark:text-red-300">Projection Failed</span>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RetirementResultsSummary;
