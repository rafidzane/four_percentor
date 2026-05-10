"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

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
    <div className="space-y-6">
      {/* Portfolio Value Chart */}
      <div className="border rounded-lg p-4">
        <h3 className="text-xl font-semibold mb-4">Portfolio Balance Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData.portfolio} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="age" label={{ value: 'Age', position: 'insideBottom', offset: -5 }} />
            <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
            <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, 'Balance']} />
            <Legend />
            <Line type="monotone" dataKey="portfolioValue" stroke="#3b82f6" name="Portfolio Balance" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Income vs Expenses Chart */}
      <div className="border rounded-lg p-4">
        <h3 className="text-xl font-semibold mb-4">Income vs Expenses</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData.portfolio} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="age" label={{ value: 'Age', position: 'insideBottom', offset: -5 }} />
            <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
            <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, 'Amount']} />
            <Legend />
            <Line type="monotone" dataKey="income" stroke="#10b981" name="Income" strokeWidth={2} />
            <Line type="monotone" dataKey="expenses" stroke="#ef4444" name="Expenses" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Success Banner */}
      <div className={`border rounded-lg p-4 ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
        <h3 className="font-semibold mb-2">
          {result.success ? '✓ Projection Successful' : '✗ Projection Failed'}
        </h3>
        <p className="text-sm text-muted-foreground">
          Final Balance: ${(result.final_balance ?? 0).toLocaleString()} | 
          Average: ${(result.avg_balance ?? 0).toLocaleString()} | 
          Min: ${(result.min_balance ?? 0).toLocaleString()} | 
          Max: ${(result.max_balance ?? 0).toLocaleString()}
        </p>
      </div>
    </div>
  );
}