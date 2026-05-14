"use client";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

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

export function RetirementCharts({ result }: { result?: any }) {
  const chartData = transformDataToChartData(result as RetirementResponse);

  if (!result) {
    return (
      <div className="h-[400px] flex items-center justify-center text-muted-foreground">
        <p>Enter your details and click "Calculate Projection" to see retirement projections</p>
      </div>
    );
  }

  if (!chartData || !chartData.portfolio.length) {
    return (
      <div className="h-[400px] flex items-center justify-center text-muted-foreground">
        <p>No data available to display</p>
      </div>
    );
  }

  return (
    <section className="group relative overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
      {/* Decorative accent bar */}
      <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500 opacity-80 transition-all group-hover:opacity-100" />

      {/* Header Section */}
      <div className="relative px-4 py-3 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Retirement Projections
        </h2>
      </div>

      {/* Chart Content */}
      <div className="px-4 py-3 space-y-6">
        {/* Portfolio Value Chart */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">Portfolio Balance Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.portfolio} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="age" label={{ value: 'Age', position: 'insideBottom', offset: -5 }} />
              <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, 'Balance']} />
              <Legend />
              <Line type="monotone" dataKey="portfolioValue" stroke="#3b82f6" name="Portfolio Balance" strokeWidth={2} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Income vs Expenses Chart */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">Income vs Expenses</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.portfolio} margin={{ top: 20, right: 30, left: 20, bottom: 20 }} barSize={6} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="age" label={{ value: 'Age', position: 'insideBottom', offset: -5 }} />
              <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(value: number, name: string) => {
                if (name === 'Income' || name === 'Expenses') return [`$${value.toLocaleString()}`, name];
                return [`$${value.toLocaleString()}`, 'Amount'];
              }} />
              <Legend />
              <Bar dataKey="income" fill="#10b981" name="Income" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" fill="#ef4444" name="Expenses" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

         
        
      </div>
    </section>
  );
}