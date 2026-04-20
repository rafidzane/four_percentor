"use client";

import type React from "react";
import { useState } from "react";

import { useCalculator, RetirementCalculatorState } from "./CalculatorContext";
import { CollapsibleSectionProvider } from "./CollapsibleSectionContext";
import ResultsDisplay from "./ResultsDisplay";

export default function RetirementCalculator() {
  const { state, updateState, calculate, scenarios, addScenario, removeScenario, selectScenario, comparisonResults, setScenarios, compareScenarios, setComparisonResults, expandAllSections } =
    useCalculator();
  const [_activeTab, setActiveTab] = useState<"inputs" | "scenarios" | "results">("inputs");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const numValue = type === "checkbox" ? checked : parseFloat(value) || 0;
    updateState({ [name]: numValue } as any);
  };

  const handleSliderChange = (name: keyof RetirementCalculatorState, value: number) => {
    updateState({ [name]: value } as any);
  };

  const _handlePercentageChange = (name: keyof RetirementCalculatorState, value: number) => {
    updateState({ [name]: value } as any);
  };

  const handleToggle = (name: keyof RetirementCalculatorState) => {
    updateState({ [name]: !state[name] } as any);
  };

  const handleScenarioNameChange = (id: string, name: string) => {
    setScenarios(scenarios.map((s) => (s.id === id ? { ...s, name } : s)));
  };

  const handleCompare = () => {
    const selected = scenarios.filter((s) => s.selected);
    if (selected.length >= 2) {
      compareScenarios(selected.map((s) => s.id));
    }
  };

  const _handleClearComparison = () => {
    setComparisonResults(null);
  };

  const handleReset = () => {
    updateState({
      currentAge: 45,
      retirementAge: 65,
      currentAssets: 500000,
      firstYearExpenses: 40000,
      equityAllocation: 60,
      fixedIncomeAllocation: 40,
      withdrawalRate: 4,
      socialSecurity: 0,
      socialSecurityAge: 67,
      spouseSocialSecurity: 0,
      spouseSocialSecurityAge: 67,
      pension: 0,
      pensionInflation: 2,
      equityReturn: 8,
      fixedIncomeReturn: 4,
      inflation: 3,
      retirementDuration: 30,
      inflationAdjustment: true,
    });
    setScenarios([]);
    setComparisonResults(null);
    expandAllSections();
  };

  const calculateAndShowResults = () => {
    calculate();
    setActiveTab("results");
  };

  const _formatCurrency = (value: number) => {
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
    <CollapsibleSectionProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 dark:from-slate-900 dark:to-slate-800">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="mb-2 font-bold text-4xl text-slate-900 dark:text-white">4% Rule Retirement Calculator</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Plan your retirement with the time-tested 4% rule methodology
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <CollapsibleSection
                sectionId="retirement-parameters"
                title="Retirement Parameters"
              >
                <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-slate-800">
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="font-semibold text-2xl text-slate-900 dark:text-white">Retirement Parameters</h2>
                    <button
                      onClick={handleReset}
                      className="px-4 py-2 text-slate-600 text-sm transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    >
                      Reset
                    </button>
                  </div>

                  <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="currentAge" className="mb-2 block font-medium text-slate-700 text-sm dark:text-slate-300">
                      Current Age
                    </label>
                    <input
                      id="currentAge"
                      type="number"
                      name="currentAge"
                      value={state.currentAge}
                      onChange={handleInputChange}
                      min="18"
                      max="100"
                      className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="retirementAge" className="mb-2 block font-medium text-slate-700 text-sm dark:text-slate-300">
                      Retirement Age
                    </label>
                    <input
                      id="retirementAge"
                      type="number"
                      name="retirementAge"
                      value={state.retirementAge}
                      onChange={handleInputChange}
                      min={state.currentAge}
                      max="100"
                      className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="currentAssets" className="mb-2 block font-medium text-slate-700 text-sm dark:text-slate-300">
                    Current Portfolio Value
                  </label>
                  <input
                    id="currentAssets"
                    type="number"
                    name="currentAssets"
                    value={state.currentAssets}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  />
                </div>

                <div>
                  <label htmlFor="firstYearExpenses" className="mb-2 block font-medium text-slate-700 text-sm dark:text-slate-300">
                    First Year Expenses
                  </label>
                  <input
                    id="firstYearExpenses"
                    type="number"
                    name="firstYearExpenses"
                    value={state.firstYearExpenses}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  />
                </div>

                <div>
                  <label htmlFor="withdrawalRate" className="mb-2 block font-medium text-slate-700 text-sm dark:text-slate-300">
                    Withdrawal Rate
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      id="withdrawalRate"
                      type="range"
                      name="withdrawalRate"
                      value={state.withdrawalRate}
                      onChange={(e) => handleSliderChange("withdrawalRate", parseFloat(e.target.value))}
                      min="1"
                      max="10"
                      step="0.1"
                      className="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-slate-200 dark:bg-slate-600"
                    />
                    <input
                      id="withdrawalRateNumber"
                      type="number"
                      name="withdrawalRate"
                      value={state.withdrawalRate}
                      onChange={handleInputChange}
                      min="1"
                      max="10"
                      step="0.1"
                      className="w-20 rounded-lg border border-slate-300 px-2 py-2 text-center focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="equityAllocation" className="mb-2 block font-medium text-slate-700 text-sm dark:text-slate-300">
                    Portfolio Allocation
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="equityAllocation" className="mb-2 block text-slate-600 text-sm dark:text-slate-400">Equities</label>
                      <input
                        id="equityAllocation"
                        type="number"
                        name="equityAllocation"
                        value={state.equityAllocation}
                        onChange={handleInputChange}
                        min="0"
                        max="100"
                        className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label htmlFor="fixedIncomeAllocation" className="mb-2 block text-slate-600 text-sm dark:text-slate-400">Fixed Income</label>
                      <input
                        id="fixedIncomeAllocation"
                        type="number"
                        name="fixedIncomeAllocation"
                        value={state.fixedIncomeAllocation}
                        onChange={handleInputChange}
                        min="0"
                        max="100"
                        className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="equityReturn" className="mb-2 block font-medium text-slate-700 text-sm dark:text-slate-300">
                    Expected Returns
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="equityReturn" className="mb-2 block text-slate-600 text-sm dark:text-slate-400">Equity Return</label>
                      <input
                        id="equityReturn"
                        type="number"
                        name="equityReturn"
                        value={state.equityReturn}
                        onChange={handleInputChange}
                        min="-20"
                        max="30"
                        step="0.1"
                        className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label htmlFor="fixedIncomeReturn" className="mb-2 block text-slate-600 text-sm dark:text-slate-400">
                        Fixed Income Return
                      </label>
                      <input
                        id="fixedIncomeReturn"
                        type="number"
                        name="fixedIncomeReturn"
                        value={state.fixedIncomeReturn}
                        onChange={handleInputChange}
                        min="-20"
                        max="10"
                        step="0.1"
                        className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="inflation" className="mb-2 block font-medium text-slate-700 text-sm dark:text-slate-300">
                    Inflation Rate
                  </label>
                  <input
                    id="inflation"
                    type="number"
                    name="inflation"
                    value={state.inflation}
                    onChange={handleInputChange}
                    min="0"
                    max="20"
                    step="0.1"
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-medium text-slate-700 text-sm dark:text-slate-300">
                    Retirement Duration
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      name="retirementDuration"
                      value={state.retirementDuration}
                      onChange={(e) => handleSliderChange("retirementDuration", parseFloat(e.target.value))}
                      min="1"
                      max="50"
                      className="h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-slate-200 dark:bg-slate-600"
                    />
                    <input
                      type="number"
                      name="retirementDuration"
                      value={state.retirementDuration}
                      onChange={handleInputChange}
                      min="1"
                      max="50"
                      className="w-20 rounded-lg border border-slate-300 px-2 py-2 text-center focus:border-transparent focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                    />
                  </div>
                </div>

                  <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4 dark:bg-slate-700">
                    <label className="font-medium text-slate-700 text-sm dark:text-slate-300">Inflation Adjustment</label>
                    <input
                      type="checkbox"
                      name="inflationAdjustment"
                      checked={state.inflationAdjustment}
                      onChange={() => handleToggle("inflationAdjustment")}
                      className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={calculateAndShowResults}
                className="mt-6 w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Calculate Results
              </button>
            </CollapsibleSection>

            <CollapsibleSection
              sectionId="scenarios"
              title="Scenarios"
            >
              <div className="space-y-6">
                <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-slate-800">
                  <h2 className="mb-4 font-semibold text-slate-900 text-xl dark:text-white">Quick Actions</h2>
                  <div className="space-y-3">
                    <button
                      onClick={addScenario}
                      className="w-full rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition-colors hover:bg-green-700"
                    >
                      + Add Scenario
                    </button>
                    <button
                      onClick={handleCompare}
                      disabled={scenarios.filter((s) => s.selected).length < 2}
                      className="w-full rounded-lg bg-purple-600 px-4 py-2 font-medium text-white transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Compare Scenarios
                    </button>
                  </div>
                </div>

                <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-slate-800">
                  <h2 className="mb-4 font-semibold text-slate-900 text-xl dark:text-white">Scenarios</h2>
                  <div className="max-h-64 space-y-3 overflow-y-auto">
                    {scenarios.map((scenario) => (
                      <div key={scenario.id} className="rounded-lg bg-slate-50 p-3 dark:bg-slate-700">
                        <input
                          type="text"
                          value={scenario.name}
                          onChange={(e) => handleScenarioNameChange(scenario.id, e.target.value)}
                          className="mb-2 w-full font-medium text-slate-900 text-sm dark:text-white"
                        />
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={scenario.selected}
                            onChange={(e) => {
                              setScenarios(
                                scenarios.map((s) => (s.id === scenario.id ? { ...s, selected: e.target.checked } : s)),
                              );
                            }}
                            className="h-4 w-4 rounded border-slate-300 text-blue-600"
                          />
                          <button
                            onClick={() => removeScenario(scenario.id)}
                            className="text-red-600 text-sm hover:text-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CollapsibleSection>

            <CollapsibleSection
              sectionId="results"
              title="Results"
            >
              <ResultsDisplay />
            </CollapsibleSection>
          </div>
        </div>
      </div>
    </CollapsibleSectionProvider>
  );
}
