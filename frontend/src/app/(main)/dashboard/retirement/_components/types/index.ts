/**
 * TypeScript interfaces for retirement calculator parameters
 */

export interface RetirementInput {
  currentAge: number;
  retirementAge: number;
  liquidAssets: number;
  illiquidAssets: number;
  monthlyContribution: number;
  annualReturnRate: number;
  socialSecurityAge: number;
  expectedLifespan: number;
}

export interface RetirementResults {
  yearsToRetirement: number;
  totalLiquidSavingsAtRetirement: number;
  totalNetWorthAtRetirement: number;
  monthlyIncomeAtRetirement: number;
  socialSecurityBenefit: number;
  withdrawalRate: number;
  projectedBalanceAtAge90: number;
  safeWithdrawalAmount: number;
  recommendedWithdrawalStrategy: string;
}

export interface RetirementInputError {
  field: string;
  message: string;
}

export interface Scenario {
  id: string;
  name: string;
  parameters: RetirementInput;
  results: RetirementResults;
}

export interface PortfolioAllocation {
  equities: number;
  fixedIncome: number;
}

export interface IncomeSource {
  type: "socialSecurity" | "pension" | "other";
  monthlyAmount: number;
  startingAge: number;
  inflationAdjustment: number;
}

export interface CalculatorState {
  scenarios: Scenario[];
  selectedScenarioId: string | null;
  currentScenario: Scenario | null;
  isLoading: boolean;
  error: string | null;
}

export interface TwoPersonCalculationResults {
  person1: RetirementResults;
  person2: RetirementResults;
  combined: {
    totalMonthlyIncome: number;
    totalNetWorthAtRetirement: number;
    jointLifeExpectancy: number;
    withdrawalRate: number;
    safeWithdrawalAmount: number;
  };
}

export interface SharedRetirementSettingsState {
  inflationRate: number;
  marketReturnAssumption: number;
  riskTolerance: "low" | "medium" | "high";
  withdrawalStrategy: "fixed" | "variable" | "systematic";
}
