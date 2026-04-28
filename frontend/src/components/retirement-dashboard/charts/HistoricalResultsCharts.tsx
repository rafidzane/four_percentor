import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Types
interface ChartPoint {
  age: number;
  balance: number;
  income: number;
  expenses: number;
}

interface HistoricalResultsChartsProps {
  data: ChartPoint[];
  successProbability?: number;
  yearOfDepletion?: number | null;
  isLoading?: boolean;
  error?: string | null;
}

// Color palettes for light/dark mode
const LIGHT_COLORS = ["#3b82f6", "#10b981", "#ef4444"];
const DARK_COLORS = ["#60a5fa", "#34d399", "#f87171"];

export function PortfolioBalanceChart({ data }: { data: ChartPoint[] }) {
  const isDarkMode = useMemo(() => {
    if (typeof window === "undefined") return false;
    return document.documentElement.classList.contains("dark");
  }, []);

  const colors = isDarkMode ? DARK_COLORS : LIGHT_COLORS;

  // Prepare chart data with formatted values
  const chartData = useMemo(
    () =>
      data.map((point) => ({
        age: point.age,
        balance: point.balance,
        income: point.income,
        expenses: point.expenses,
      })),
    [data]
  );

  if (chartData.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed">
        <p className="text-sm text-gray-500 dark:text-gray-400">No data available</p>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    if (!value && value !== 0) return "";
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}k`;
    return `$${value.toFixed(0)}`;
  };

  const formatTooltipValue = (value: number) => {
    if (!value && value !== 0) return "";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#374151" : "#e5e7eb"} />
          <XAxis
            dataKey="age"
            type="number"
            domain={["auto", "auto"]}
            tick={{ fill: isDarkMode ? "#d1d5db" : "#6b7280", fontSize: 11 }}
            label={{
              value: "Age",
              position: "insideBottomRight",
              offset: -10,
              fill: isDarkMode ? "#9ca3af" : "#6b7280",
            }}
          />
          <YAxis
            tick={{ fill: isDarkMode ? "#d1d5db" : "#6b7280", fontSize: 11 }}
            tickFormatter={formatCurrency}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
              color: isDarkMode ? "#f3f4f6" : "#1f2937",
              border: `1px solid ${isDarkMode ? "#374151" : "#d1d5db"}`,
            }}
            itemStyle={{ fontSize: 12 }}
            formatter={formatTooltipValue}
          />
          <Legend verticalAlign="bottom" height={36} />
          <Line
            type="monotone"
            dataKey="balance"
            name="Portfolio Balance"
            stroke={colors[0]}
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
            fill={`url(#gradient-${colors[0]})`}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function IncomeVsExpensesChart({ data }: { data: ChartPoint[] }) {
  const isDarkMode = useMemo(() => {
    if (typeof window === "undefined") return false;
    return document.documentElement.classList.contains("dark");
  }, []);

  const colors = isDarkMode ? DARK_COLORS : LIGHT_COLORS;

  // Prepare chart data
  const chartData = useMemo(
    () =>
      data.map((point) => ({
        age: point.age,
        income: point.income,
        expenses: point.expenses,
      })),
    [data]
  );

  if (chartData.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed">
        <p className="text-sm text-gray-500 dark:text-gray-400">No data available</p>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    if (!value && value !== 0) return "";
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}k`;
    return `$${value.toFixed(0)}`;
  };

  const formatTooltipValue = (value: number) => {
    if (!value && value !== 0) return "";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#374151" : "#e5e7eb"} />
          <XAxis
            dataKey="age"
            type="number"
            domain={["auto", "auto"]}
            tick={{ fill: isDarkMode ? "#d1d5db" : "#6b7280", fontSize: 11 }}
            label={{
              value: "Age",
              position: "insideBottomRight",
              offset: -10,
              fill: isDarkMode ? "#9ca3af" : "#6b7280",
            }}
          />
          <YAxis
            tick={{ fill: isDarkMode ? "#d1d5db" : "#6b7280", fontSize: 11 }}
            tickFormatter={formatCurrency}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
              color: isDarkMode ? "#f3f4f6" : "#1f2937",
              border: `1px solid ${isDarkMode ? "#374151" : "#d1d5db"}`,
            }}
            itemStyle={{ fontSize: 12 }}
            formatter={formatTooltipValue}
          />
          <Legend verticalAlign="bottom" height={36} />
          <Bar dataKey="income" name="Income" fill={colors[1]} stackId="stack" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expenses" name="Expenses" fill={colors[2]} stackId="stack" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ResultsSummary({ successProbability, yearOfDepletion }: { successProbability?: number; yearOfDepletion: number | null }) {
  const isDarkMode = useMemo(() => {
    if (typeof window === "undefined") return false;
    return document.documentElement.classList.contains("dark");
  }, []);

  const isSuccess = successProbability !== undefined && successProbability >= 0.75;

  return (
    <div className="grid grid-cols-2 gap-4">
      {successProbability !== undefined && (
        <Card className={`border-l-4 ${isSuccess ? "border-green-500 bg-green-50/10 dark:bg-green-900/20" : "border-red-500 bg-red-50/10 dark:bg-red-900/20"}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Probability</CardTitle>
            {isSuccess ? (
              <div className="h-4 w-4 rounded-full bg-green-500" />
            ) : (
              <div className="h-4 w-4 rounded-full bg-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isSuccess ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
              {successProbability > 0 ? `${(successProbability * 100).toFixed(1)}%` : "N/A"}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {isSuccess
                ? "Portfolio likely to last throughout retirement"
                : "Risk of portfolio depletion"}
            </p>
          </CardContent>
        </Card>
      )}

      {yearOfDepletion !== null && (
        <Card className="border-l-4 border-orange-500 bg-orange-50/10 dark:bg-orange-900/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Year of Depletion</CardTitle>
            <div className="h-4 w-4 rounded-full bg-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {yearOfDepletion}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Age when portfolio runs out</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export function HistoricalResultsCharts({ data, successProbability, yearOfDepletion, isLoading, error }: HistoricalResultsChartsProps) {
  if (isLoading) {
    return (
      <div className="flex h-96 flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        <p className="mt-4 text-sm text-gray-500">Loading charts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50 dark:bg-red-900/10">
        <CardContent className="pt-6">
          <p className="text-sm text-red-600">{error}</p>
          <p className="text-xs text-gray-500 mt-2">Please check your input values and try again</p>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex h-96 flex-col items-center justify-center">
        <p className="text-sm text-gray-500">Enter retirement parameters to see charts</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Success Metrics */}
      <ResultsSummary successProbability={successProbability} yearOfDepletion={yearOfDepletion} />

      {/* Charts */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Balance Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <PortfolioBalanceChart data={data} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Income vs Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <IncomeVsExpensesChart data={data} />
        </CardContent>
      </Card>
    </div>
  );
}

export default HistoricalResultsCharts;
