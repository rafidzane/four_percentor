import { FC } from "react";
import { RetirementResponse } from "@/types/retirement";

interface RetirementResultsSummaryProps {
  result: RetirementResponse;
}

export const RetirementResultsSummary: FC<RetirementResultsSummaryProps> = ({ result }) => {
  return (
    <div className="mb-6">
      <h3 className="text-xl font-semibold mb-4">Results</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border">
          <p className="text-xs text-muted-foreground">Final Balance</p>
          <p className="font-bold">${result.final_balance.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border">
          <p className="text-xs text-muted-foreground">Average Balance</p>
          <p className="font-bold">${result.avg_balance.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border">
          <p className="text-xs text-muted-foreground">Max Balance</p>
          <p className="font-bold">${result.max_balance.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border">
          <p className="text-xs text-muted-foreground">Min Balance</p>
          <p className="font-bold">${result.min_balance.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}</p>
        </div>
      </div>

      <div className="flex items-center space-x-4 mb-4">
        <span className={`px-3 py-1 rounded-full font-medium ${result.success ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"}`}>
          Success: {result.success ? "Yes" : "No"}
        </span>
      </div>

      <p className="text-sm text-muted-foreground">
        This projection is based on the inputs provided and assumes constant returns over time.
        Actual results may vary significantly due to market fluctuations, changing spending patterns,
        and other factors.
      </p>
    </div>
  );
};