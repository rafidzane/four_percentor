import { FC } from "react";
import { RetirementResponse } from "@/types/retirement";

interface RetirementResultsSummaryProps {
  result: RetirementResponse;
}

export const RetirementResultsSummary: FC<RetirementResultsSummaryProps> = ({ result }) => {
  return (
    <div data-pct="retirement-results-section" className="mb-6">
      <h3 data-pct="retirement-results-title" className="text-xl font-semibold mb-4">Results</h3>
      
      <div data-pct="retirement-results-metrics-grid" className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div data-pct="retirement-final-balance-card" className="bg-white dark:bg-gray-800 p-3 rounded-lg border">
          <p data-pct="retirement-final-balance-label" className="text-xs text-muted-foreground">Final Balance</p>
          <p data-pct="retirement-final-balance-value" className="font-bold">${result.final_balance.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}</p>
        </div>
        <div data-pct="retirement-average-balance-card" className="bg-white dark:bg-gray-800 p-3 rounded-lg border">
          <p data-pct="retirement-average-balance-label" className="text-xs text-muted-foreground">Average Balance</p>
          <p data-pct="retirement-average-balance-value" className="font-bold">${result.avg_balance.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}</p>
        </div>
        <div data-pct="retirement-max-balance-card" className="bg-white dark:bg-gray-800 p-3 rounded-lg border">
          <p data-pct="retirement-max-balance-label" className="text-xs text-muted-foreground">Max Balance</p>
          <p data-pct="retirement-max-balance-value" className="font-bold">${result.max_balance.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}</p>
        </div>
        <div data-pct="retirement-min-balance-card" className="bg-white dark:bg-gray-800 p-3 rounded-lg border">
          <p data-pct="retirement-min-balance-label" className="text-xs text-muted-foreground">Min Balance</p>
          <p data-pct="retirement-min-balance-value" className="font-bold">${result.min_balance.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}</p>
        </div>
      </div>

      <div data-pct="retirement-success-indicator-container" className="flex items-center space-x-4 mb-4">
        <span data-pct="retirement-success-indicator" className={`px-3 py-1 rounded-full font-medium ${result.success ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"}`}>
          Success: {result.success ? "Yes" : "No"}
        </span>
      </div>

      <p data-pct="retirement-explanation-text" className="text-sm text-muted-foreground">
        This projection is based on the inputs provided and assumes constant returns over time.
        Actual results may vary significantly due to market fluctuations, changing spending patterns,
        and other factors.
      </p>
    </div>
  );
};