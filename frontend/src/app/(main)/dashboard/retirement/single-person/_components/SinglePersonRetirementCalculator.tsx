"use client";

import { useState } from "react";

import type { CalculationResults } from "../../_components/calculateRetirement";
import ResultsDisplay from "../../_components/ResultsDisplay";
import RetirementForm from "../../_components/RetirementForm";

export default function SinglePersonRetirementCalculator() {
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleCalculate = (calculationResults: CalculationResults) => {
    setResults(calculationResults);
  };

  return (
    <div className="p-4">
      <h1 className="mb-4 w-full font-bold text-2xl">Retirement Calculator</h1>
      
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Form Section */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="mb-4 font-semibold text-gray-700">Your Information</h2>
            <RetirementForm onSubmit={handleCalculate} />
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="mb-4 font-semibold text-gray-700">Projection Results</h2>
            <ResultsDisplay results={results} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
}
