"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from "recharts";

// Define types for our retirement data
interface RetirementDataPoint {
  year: number;
  portfolioValue: number;
  income: number;
  expenses: number;
  withdrawalRate: number;
}

interface RetirementChartData {
  portfolio: RetirementDataPoint[];
  incomeVsExpenses: RetirementDataPoint[];
  withdrawalRates: RetirementDataPoint[];
}

// Mock data for demonstration
const mockChartData: RetirementChartData = {
  portfolio: [
    { year: 2023, portfolioValue: 250000, income: 0, expenses: 0, withdrawalRate: 0 },
    { year: 2024, portfolioValue: 275000, income: 0, expenses: 0, withdrawalRate: 0 },
    { year: 2025, portfolioValue: 305000, income: 0, expenses: 0, withdrawalRate: 0 },
    { year: 2026, portfolioValue: 340000, income: 0, expenses: 0, withdrawalRate: 0 },
    { year: 2027, portfolioValue: 380000, income: 0, expenses: 0, withdrawalRate: 0 },
    { year: 2028, portfolioValue: 425000, income: 0, expenses: 0, withdrawalRate: 0 },
    { year: 2029, portfolioValue: 475000, income: 0, expenses: 0, withdrawalRate: 0 },
    { year: 2030, portfolioValue: 530000, income: 0, expenses: 0, withdrawalRate: 0 },
    { year: 2031, portfolioValue: 590000, income: 0, expenses: 0, withdrawalRate: 0 },
    { year: 2032, portfolioValue: 655000, income: 0, expenses: 0, withdrawalRate: 0 },
    { year: 2033, portfolioValue: 725000, income: 0, expenses: 0, withdrawalRate: 0 },
    { year: 2034, portfolioValue: 800000, income: 0, expenses: 0, withdrawalRate: 0 },
    { year: 2035, portfolioValue: 880000, income: 0, expenses: 0, withdrawalRate: 0 },
    { year: 2036, portfolioValue: 965000, income: 0, expenses: 0, withdrawalRate: 0 },
    { year: 2037, portfolioValue: 1055000, income: 0, expenses: 0, withdrawalRate: 0 },
    { year: 2038, portfolioValue: 1150000, income: 0, expenses: 0, withdrawalRate: 0 },
    { year: 2039, portfolioValue: 1250000, income: 0, expenses: 0, withdrawalRate: 0 },
    { year: 2040, portfolioValue: 1355000, income: 0, expenses: 0, withdrawalRate: 0 },
    { year: 2041, portfolioValue: 1465000, income: 0, expenses: 0, withdrawalRate: 0 },
    { year: 2042, portfolioValue: 1580000, income: 0, expenses: 0, withdrawalRate: 0 },
    { year: 2043, portfolioValue: 1695000, income: 0, expenses: 0, withdrawalRate: 0 },
    { year: 2044, portfolioValue: 1810000, income: 0, expenses: 0, withdrawalRate: 0 },
    { year: 2045, portfolioValue: 1925000, income: 0, expenses: 0, withdrawalRate: 0 },
    { year: 2046, portfolioValue: 2040000, income: 0, expenses: 0, withdrawalRate: 0 },
    { year: 2047, portfolioValue: 2155000, income: 0, expenses: 0, withdrawalRate: 0 },
    { year: 2048, portfolioValue: 2270000, income: 0, expenses: 0, withdrawalRate: 0 },
    { year: 2049, portfolioValue: 2385000, income: 0, expenses: 0, withdrawalRate: 0 },
    { year: 2050, portfolioValue: 2500000, income: 0, expenses: 0, withdrawalRate: 0 },
  ],
  incomeVsExpenses: [
    { year: 2023, portfolioValue: 0, income: 100000, expenses: 80000, withdrawalRate: 0 },
    { year: 2024, portfolioValue: 0, income: 105000, expenses: 82000, withdrawalRate: 0 },
    { year: 2025, portfolioValue: 0, income: 110000, expenses: 84000, withdrawalRate: 0 },
    { year: 2026, portfolioValue: 0, income: 115000, expenses: 86000, withdrawalRate: 0 },
    { year: 2027, portfolioValue: 0, income: 120000, expenses: 88000, withdrawalRate: 0 },
    { year: 2028, portfolioValue: 0, income: 125000, expenses: 90000, withdrawalRate: 0 },
    { year: 2029, portfolioValue: 0, income: 130000, expenses: 92000, withdrawalRate: 0 },
    { year: 2030, portfolioValue: 0, income: 135000, expenses: 94000, withdrawalRate: 0 },
    { year: 2031, portfolioValue: 0, income: 140000, expenses: 96000, withdrawalRate: 0 },
    { year: 2032, portfolioValue: 0, income: 145000, expenses: 98000, withdrawalRate: 0 },
    { year: 2033, portfolioValue: 0, income: 150000, expenses: 100000, withdrawalRate: 0 },
    { year: 2034, portfolioValue: 0, income: 155000, expenses: 102000, withdrawalRate: 0 },
    { year: 2035, portfolioValue: 0, income: 160000, expenses: 104000, withdrawalRate: 0 },
    { year: 2036, portfolioValue: 0, income: 165000, expenses: 106000, withdrawalRate: 0 },
    { year: 2037, portfolioValue: 0, income: 170000, expenses: 108000, withdrawalRate: 0 },
    { year: 2038, portfolioValue: 0, income: 175000, expenses: 110000, withdrawalRate: 0 },
    { year: 2039, portfolioValue: 0, income: 180000, expenses: 112000, withdrawalRate: 0 },
    { year: 2040, portfolioValue: 0, income: 185000, expenses: 114000, withdrawalRate: 0 },
    { year: 2041, portfolioValue: 0, income: 190000, expenses: 116000, withdrawalRate: 0 },
    { year: 2042, portfolioValue: 0, income: 195000, expenses: 118000, withdrawalRate: 0 },
    { year: 2043, portfolioValue: 0, income: 200000, expenses: 120000, withdrawalRate: 0 },
    { year: 2044, portfolioValue: 0, income: 205000, expenses: 122000, withdrawalRate: 0 },
    { year: 2045, portfolioValue: 0, income: 210000, expenses: 124000, withdrawalRate: 0 },
    { year: 2046, portfolioValue: 0, income: 215000, expenses: 126000, withdrawalRate: 0 },
    { year: 2047, portfolioValue: 0, income: 220000, expenses: 128000, withdrawalRate: 0 },
    { year: 2048, portfolioValue: 0, income: 225000, expenses: 130000, withdrawalRate: 0 },
    { year: 2049, portfolioValue: 0, income: 230000, expenses: 132000, withdrawalRate: 0 },
    { year: 2050, portfolioValue: 0, income: 235000, expenses: 134000, withdrawalRate: 0 },
  ],
  withdrawalRates: [
    { year: 2023, portfolioValue: 0, income: 0, expenses: 0, withdrawalRate: 0 },
    { year: 2024, portfolioValue: 0, income: 0, expenses: 0, withdrawalRate: 1.5 },
    { year: 2025, portfolioValue: 0, income: 0, expenses: 0, withdrawalRate: 1.6 },
    { year: 2026, portfolioValue: 0, income: 0, expenses: 0, withdrawalRate: 1.7 },
    { year: 2027, portfolioValue: 0, income: 0, expenses: 0, withdrawalRate: 1.8 },
    { year: 2028, portfolioValue: 0, income: 0, expenses: 0, withdrawalRate: 1.9 },
    { year: 2029, portfolioValue: 0, income: 0, expenses: 0, withdrawalRate: 2.0 },
    { year: 2030, portfolioValue: 0, income: 0, expenses: 0, withdrawalRate: 2.1 },
    { year: 2031, portfolioValue: 0, income: 0, expenses: 0, withdrawalRate: 2.2 },
    { year: 2032, portfolioValue: 0, income: 0, expenses: 0, withdrawalRate: 2.3 },
    { year: 2033, portfolioValue: 0, income: 0, expenses: 0, withdrawalRate: 2.4 },
    { year: 2034, portfolioValue: 0, income: 0, expenses: 0, withdrawalRate: 2.5 },
    { year: 2035, portfolioValue: 0, income: 0, expenses: 0, withdrawalRate: 2.6 },
    { year: 2036, portfolioValue: 0, income: 0, expenses: 0, withdrawalRate: 2.7 },
    { year: 2037, portfolioValue: 0, income: 0, expenses: 0, withdrawalRate: 2.8 },
    { year: 2038, portfolioValue: 0, income: 0, expenses: 0, withdrawalRate: 2.9 },
    { year: 2039, portfolioValue: 0, income: 0, expenses: 0, withdrawalRate: 3.0 },
    { year: 2040, portfolioValue: 0, income: 0, expenses: 0, withdrawalRate: 3.1 },
    { year: 2041, portfolioValue: 0, income: 0, expenses: 0, withdrawalRate: 3.2 },
    { year: 2042, portfolioValue: 0, income: 0, expenses: 0, withdrawalRate: 3.3 },
    { year: 2043, portfolioValue: 0, income: 0, expenses: 0, withdrawalRate: 3.4 },
    { year: 2044, portfolioValue: 0, income: 0, expenses: 0, withdrawalRate: 3.5 },
    { year: 2045, portfolioValue: 0, income: 0, expenses: 0, withdrawalRate: 3.6 },
    { year: 2046, portfolioValue: 0, income: 0, expenses: 0, withdrawalRate: 3.7 },
    { year: 2047, portfolioValue: 0, income: 0, expenses: 0, withdrawalRate: 3.8 },
    { year: 2048, portfolioValue: 0, income: 0, expenses: 0, withdrawalRate: 3.9 },
    { year: 2049, portfolioValue: 0, income: 0, expenses: 0, withdrawalRate: 4.0 },
    { year: 2050, portfolioValue: 0, income: 0, expenses: 0, withdrawalRate: 4.1 },
  ]
};

export function RetirementCharts() {
  const [chartData, setChartData] = useState<RetirementChartData>(mockChartData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-4">
      <h3 className="text-xl font-semibold">Retirement Projection</h3>
      
      {/* Portfolio Value Chart */}
      <div className="flex-1 min-h-[200px] max-h-[250px]">
        <h4 className="text-lg font-medium mb-2">Portfolio Value Over Time</h4>
        <div className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData.portfolio}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="year" 
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
              />
              <Tooltip 
                formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Portfolio Value']}
                labelFormatter={(label) => `Year: ${label}`}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="portfolioValue" 
                stroke="#3b82f6" 
                fill="#93c5fd" 
                name="Portfolio Value"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Income vs Expenses Chart */}
      <div className="flex-1 min-h-[200px] max-h-[250px]">
        <h4 className="text-lg font-medium mb-2">Income vs Expenses</h4>
        <div className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData.incomeVsExpenses}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="year" 
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip 
                formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Amount']}
                labelFormatter={(label) => `Year: ${label}`}
              />
              <Legend />
              <Bar dataKey="income" fill="#10b981" name="Income" />
              <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Withdrawal Rates Chart */}
      <div className="flex-1 min-h-[200px] max-h-[250px]">
        <h4 className="text-lg font-medium mb-2">Withdrawal Rate Over Time</h4>
        <div className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData.withdrawalRates}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="year" 
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                domain={[0, 6]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Withdrawal Rate']}
                labelFormatter={(label) => `Year: ${label}`}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="withdrawalRate" 
                stroke="#8b5cf6" 
                activeDot={{ r: 8 }} 
                name="Withdrawal Rate"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}