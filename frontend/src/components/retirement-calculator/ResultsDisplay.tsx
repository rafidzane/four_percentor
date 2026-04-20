"use client";

import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useState } from "react";

import { useCalculator } from "./CalculatorContext";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function ResultsDisplay() {
  const { state, scenarios, comparisonResults, setComparisonResults } = useCalculator();
  const [selectedScenarioId, _setSelectedScenarioId] = useState<string | null>(null);

  const activeScenario = scenarios.find((s) => s.id === selectedScenarioId) || scenarios[0];

  const chartData = {
    labels: activeScenario.results.portfolioValueOverTime.map((p) => `Year ${p.year}`),
    datasets: [
      {
        label: "Portfolio Value",
        data: activeScenario.results.portfolioValueOverTime.map((p) => p.value),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `Portfolio Value: $${context.parsed.y.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => {
            return `$${value.toLocaleString()}`;
          },
        },
      },
    },
  } as const;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const _formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 dark:from-slate-900 dark:to-slate-800">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="mb-2 font-bold text-4xl text-slate-900 dark:text-white">Retirement Results</h1>
          <p className="text-slate-600 dark:text-slate-400">Detailed analysis of your retirement sustainability</p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-slate-800">
            <h2 className="mb-6 font-semibold text-2xl text-slate-900 dark:text-white">Portfolio Value Over Time</h2>
            <div className="h-80">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-slate-800">
              <h2 className="mb-6 font-semibold text-2xl text-slate-900 dark:text-white">Summary Statistics</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4 dark:bg-slate-700">
                  <span className="text-slate-600 dark:text-slate-400">Initial Portfolio</span>
                  <span className="font-semibold text-slate-900 text-xl dark:text-white">
                    {formatCurrency(state.currentAssets)}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4 dark:bg-slate-700">
                  <span className="text-slate-600 dark:text-slate-400">Annual Withdrawal</span>
                  <span className="font-semibold text-slate-900 text-xl dark:text-white">
                    {formatCurrency(activeScenario.results.annualWithdrawal)}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4 dark:bg-slate-700">
                  <span className="text-slate-600 dark:text-slate-400">Total Withdrawals</span>
                  <span className="font-semibold text-slate-900 text-xl dark:text-white">
                    {formatCurrency(activeScenario.results.totalWithdrawals)}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4 dark:bg-slate-700">
                  <span className="text-slate-600 dark:text-slate-400">Final Portfolio Value</span>
                  <span
                    className={`font-semibold text-xl ${activeScenario.results.success ? "text-green-600" : "text-red-600"}`}
                  >
                    {formatCurrency(activeScenario.results.finalPortfolioValue)}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4 dark:bg-slate-700">
                  <span className="text-slate-600 dark:text-slate-400">Depletion Year</span>
                  <span
                    className={`font-semibold text-xl ${activeScenario.results.success ? "text-green-600" : "text-red-600"}`}
                  >
                    {activeScenario.results.success ? "Never" : `Year ${activeScenario.results.depletionYear}`}
                  </span>
                </div>
              </div>
            </div>

            <div
              className={`rounded-xl p-6 ${activeScenario.results.success ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20"}`}
            >
              <h2 className="mb-2 font-semibold text-xl">
                {activeScenario.results.success ? "✓ Retirement Success" : "✗ Retirement Failure"}
              </h2>
              <p
                className={
                  activeScenario.results.success
                    ? "text-green-700 dark:text-green-400"
                    : "text-red-700 dark:text-red-400"
                }
              >
                {activeScenario.results.success
                  ? "Your portfolio will last through your entire retirement period."
                  : "Your portfolio will be depleted before the end of your retirement period."}
              </p>
            </div>
          </div>
        </div>

        {comparisonResults && (
          <div className="mt-6 rounded-xl bg-white p-6 shadow-lg dark:bg-slate-800">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-semibold text-2xl text-slate-900 dark:text-white">Scenario Comparison</h2>
              <button
                type="button"
                onClick={() => setComparisonResults(null)}
                className="px-4 py-2 text-slate-600 text-sm transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              >
                Clear Comparison
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {scenarios
                .filter((s) => s.selected)
                .map((scenario) => (
                  <div key={scenario.id} className="rounded-lg bg-slate-50 p-4 dark:bg-slate-700">
                    <h3 className="mb-2 font-semibold text-lg text-slate-900 dark:text-white">{scenario.name}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Success:</span>
                        <span className={scenario.results.success ? "text-green-600" : "text-red-600"}>
                          {scenario.results.success ? "Yes" : "No"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Final Value:</span>
                        <span className="text-slate-900 dark:text-white">
                          {formatCurrency(scenario.results.finalPortfolioValue)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Depletion Year:</span>
                        <span className="text-slate-900 dark:text-white">
                          {scenario.results.success ? "Never" : `Year ${scenario.results.depletionYear}`}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        <div className="mt-6 rounded-xl bg-blue-50 p-6 dark:bg-blue-900/20">
          <h2 className="mb-2 font-semibold text-blue-900 text-xl dark:text-blue-400">Important Notes</h2>
          <ul className="space-y-2 text-blue-800 dark:text-blue-300">
            <li>• This calculator uses the 4% rule methodology for retirement planning</li>
            <li>• Assumes inflation-adjusted withdrawals and portfolio returns</li>
            <li>• Does not account for taxes, fees, or market volatility</li>
            <li>• Results are estimates and should not be considered financial advice</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
