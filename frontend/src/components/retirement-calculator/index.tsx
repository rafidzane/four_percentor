"use client";

import { CalculatorProvider } from "./CalculatorContext";
import ResultsDisplay from "./ResultsDisplay";
import RetirementCalculator from "./RetirementCalculator";

export default function RetirementCalculatorPage() {
  return (
    <CalculatorProvider>
      <div className="min-h-screen">
        <RetirementCalculator />
        <ResultsDisplay />
      </div>
    </CalculatorProvider>
  );
}
