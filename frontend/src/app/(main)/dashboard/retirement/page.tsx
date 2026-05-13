"use client";

import { RetirementForm } from "./_components/RetirementForm";
import { RetirementCharts } from "./_components/RetirementCharts";
import { RetirementSummaryCards } from "@/components/retirement-dashboard/ui/RetirementSummaryCards";
import { useState } from "react";

export default function Page() {
  const [result, setResult] = useState<any>(null);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Retirement Calculator</h2>
        <p className="text-muted-foreground mt-1">
          Plan your retirement with comprehensive input and projection tools
        </p>
      </div>

      {/* Two-column layout: Form on left, Results/Charts on right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Form */}
        <div className="flex flex-col">
          <RetirementForm onResult={setResult} />
        </div>

        {/* Right Column - Results & Charts (only visible after calculation) */}
        <div className="flex flex-col space-y-6">
          {result ? null : (
            <p className="text-sm text-muted-foreground text-center italic lg:text-left py-8">
              Enter your details and click "Calculate Projection" to see retirement results
            </p>
          )}

          {/* Summary Cards Section */}
          {result && (
            <>
              <RetirementSummaryCards
                finalBalance={result.final_balance || 0}
                averageBalance={result.avg_balance || 0}
                maxBalance={result.max_balance || 0}
                minBalance={result.min_balance || 0}
              />

              
              {/* Charts Section */}
              <RetirementCharts result={result} />
            </>
          )}
        </div>
      </div>

      {/* Manual calculation indicator - only show after results */}
      {result && (
        <p className="text-sm text-muted-foreground text-center italic">
          Manual calculation enabled for Income Sources and Real Estate sections
        </p>
      )}
    </div>
  );
}