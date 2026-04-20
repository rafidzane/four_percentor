"use client";

import type React from "react";
import { createContext, useContext, useState } from "react";

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

import { validateCalculatorState, type ValidationResult } from "../../lib/validation/retirement-calculator-validation";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export interface RetirementCalculatorState {
  currentAge: number;
  retirementAge: number;
  currentAssets: number;
  firstYearExpenses: number;
  equityAllocation: number;
  fixedIncomeAllocation: number;
  withdrawalRate: number;
  socialSecurity: number;
  socialSecurityAge: number;
  spouseSocialSecurity: number;
  spouseSocialSecurityAge: number;
  pension: number;
  pensionInflation: number;
  equityReturn: number;
  fixedIncomeReturn: number;
  inflation: number;
  retirementDuration: number;
  inflationAdjustment: boolean;
}

export interface Scenario {
  id: string;
  name: string;
  state: RetirementCalculatorState;
  results: CalculationResults;
  selected: boolean;
}

export interface CalculationResults {
  success: boolean;
  finalPortfolioValue: number;
  totalWithdrawals: number;
  depletionYear: number;
  annualWithdrawal: number;
  portfolioValueOverTime: Array<{ year: number; value: number }>;
}

interface CalculatorContextType {
  state: RetirementCalculatorState;
  scenarios: Scenario[];
  addScenario: () => void;
  removeScenario: (id: string) => void;
  selectScenario: (id: string) => void;
  updateState: (updates: Partial<RetirementCalculatorState>) => void;
  calculate: () => void;
  compareScenarios: (scenarioIds: string[]) => void;
  comparisonResults: CalculationResults | null;
  setScenarios: React.Dispatch<React.SetStateAction<Scenario[]>>;
  setComparisonResults: React.Dispatch<React.SetStateAction<CalculationResults | null>>;
}

const CalculatorContext = createContext<CalculatorContextType | undefined>(undefined);

export function CalculatorProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<RetirementCalculatorState>({
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

  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [comparisonResults, setComparisonResults] = useState<CalculationResults | null>(null);

  const addScenario = () => {
    const newScenario: Scenario = {
      id: `scenario-${Date.now()}`,
      name: `Scenario ${scenarios.length + 1}`,
      state: { ...state },
      results: {
        success: false,
        finalPortfolioValue: 0,
        totalWithdrawals: 0,
        depletionYear: 0,
        annualWithdrawal: 0,
        portfolioValueOverTime: [],
      },
      selected: false,
    };
    setScenarios([...scenarios, newScenario]);
  };

  const removeScenario = (id: string) => {
    setScenarios(scenarios.filter((s) => s.id !== id));
  };

  const selectScenario = (id: string) => {
    const scenario = scenarios.find((s) => s.id === id);
    if (scenario) {
      setState(scenario.state);
    }
  };

  const updateState = (updates: Partial<RetirementCalculatorState>) => {
    setState((prev) => {
      const newState = { ...prev, ...updates };
      const validation = validateCalculatorState(newState);
      if (!validation.valid) {
        console.error("Validation errors:", validation.errors);
      }
      return newState;
    });
  };

  const calculate = () => {
    const validation = validateCalculatorState(state);
    if (!validation.valid) {
      console.error("Validation errors:", validation.errors);
      return;
    }
    const results = performCalculation(state);
    setScenarios((prev) => prev.map((s) => ({ ...s, results })));
  };

  const compareScenarios = (scenarioIds: string[]) => {
    const selectedScenarios = scenarios.filter((s) => scenarioIds.includes(s.id));
    if (selectedScenarios.length >= 2) {
      const comparison = performComparison(selectedScenarios);
      setComparisonResults(comparison);
    }
  };

  return (
    <CalculatorContext.Provider
      value={{
        state,
        scenarios,
        addScenario,
        removeScenario,
        selectScenario,
        updateState,
        calculate,
        compareScenarios,
        comparisonResults,
        setScenarios,
        setComparisonResults,
      }}
    >
      {children}
    </CalculatorContext.Provider>
  );
}

export function useCalculator() {
  const context = useContext(CalculatorContext);
  if (context === undefined) {
    throw new Error("useCalculator must be used within a CalculatorProvider");
  }
  return context;
}

function performCalculation(state: RetirementCalculatorState): CalculationResults {
  const annualWithdrawal = state.currentAssets * (state.withdrawalRate / 100);
  const equityAmount = state.currentAssets * (state.equityAllocation / 100);
  const fixedIncomeAmount = state.currentAssets * (state.fixedIncomeAllocation / 100);

  const portfolioValueOverTime: Array<{ year: number; value: number }> = [];
  let currentPortfolio = state.currentAssets;
  let totalWithdrawals = 0;
  let depletionYear = state.retirementDuration;

  for (let year = 1; year <= state.retirementDuration; year++) {
    const equityReturn = equityAmount * (state.equityReturn / 100);
    const fixedIncomeReturn = fixedIncomeAmount * (state.fixedIncomeReturn / 100);
    const totalReturn = equityReturn + fixedIncomeReturn;

    let withdrawal = annualWithdrawal;
    if (state.inflationAdjustment) {
      withdrawal = annualWithdrawal * (1 + state.inflation / 100) ** (year - 1);
    }

    currentPortfolio = currentPortfolio + totalReturn - withdrawal;
    totalWithdrawals += withdrawal;

    if (currentPortfolio <= 0 && depletionYear === state.retirementDuration) {
      depletionYear = year;
    }

    portfolioValueOverTime.push({ year, value: Math.max(0, currentPortfolio) });
  }

  const finalPortfolioValue = Math.max(0, currentPortfolio);
  const success = depletionYear === state.retirementDuration;

  return {
    success,
    finalPortfolioValue,
    totalWithdrawals,
    depletionYear,
    annualWithdrawal,
    portfolioValueOverTime,
  };
}

function performComparison(scenarios: Scenario[]): CalculationResults {
  const comparison = {
    success: true,
    finalPortfolioValue: 0,
    totalWithdrawals: 0,
    depletionYear: 0,
    annualWithdrawal: 0,
    portfolioValueOverTime: [] as Array<{ year: number; value: number }>,
  };

  scenarios.forEach((scenario) => {
    comparison.finalPortfolioValue += scenario.results.finalPortfolioValue;
    comparison.totalWithdrawals += scenario.results.totalWithdrawals;
    comparison.depletionYear = Math.max(comparison.depletionYear, scenario.results.depletionYear);
    comparison.annualWithdrawal += scenario.results.annualWithdrawal;
    comparison.portfolioValueOverTime = comparison.portfolioValueOverTime.map((point, index) => ({
      year: point.year,
      value: point.value + scenario.results.portfolioValueOverTime[index].value,
    }));
  });

  return comparison;
}
