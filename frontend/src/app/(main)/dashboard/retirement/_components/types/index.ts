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

// ============================================================================
// V4 Calculator Types
// ============================================================================

export type PropertyType = 'primary_residence' | 'rental' | 'commercial' | 'vacation';

export interface PropertyInput {
  id: string;
  name: string;
  type: PropertyType;
  purchasePrice: number;
  currentValue: number;
  mortgageBalance: number;
  monthlyRentIncome?: number;
  appreciationRate: number;
}

export interface PropertyProjection {
  id: string;
  currentYearValue: number;
  projectedYearlyAppreciation: number;
}

export type AccountType = '401k' | '403b' | 'traditional_ira' | 'roth_ira' | 'brokerage';

export interface AccountInput {
  id: string;
  name: string;
  type: AccountType;
  currentBalance: number;
  monthlyContribution: number;
  employerMatch?: { matchRate: number; matchLimit: number };
  preRetirementReturn: number;
  postRetirementReturn: number;
}

export interface AccountProjection {
  id: string;
  name: string;
  type: AccountType;
  currentYearBalance: number;
}

export interface PersonInput {
  id: string;
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
  liquidAssets: number;
  monthlyContribution: number;
  preRetirementReturnRate: number;
  postRetirementReturnRate: number;
  estimatedSSBenefit: number;
  ssClaimingAge: number;
}

export interface PersonProjection {
  id: string;
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
  totalLiquidSavingsAtRetirement: number;
  socialSecurityMonthly: number;
}

export type WithdrawalStrategyType = 
  | 'fixed_percentage' 
  | 'dynamic_withdrawal' 
  | 'bucket_strategy' 
  | 'rmd_approach';

export interface ScenarioV4 {
  id: string;
  name: string;
  inputs: CalculatorInputsV4;
  results: HouseholdResults | null;
  createdAt: number;
  isBaseline: boolean;
}

export interface CalculatorInputsV4 {
  persons: PersonInput[];
  properties: PropertyInput[];
  accounts: AccountInput[];
  withdrawalStrategy: WithdrawalStrategyType;
  inflationRate: number;
  targetRetirementYear: number;
}

export interface MonthlyIncomeBreakdown {
  socialSecurity: number;
  portfolioWithdrawal: number;
  rentalIncome: number;
  otherIncome: number;
}

export interface HouseholdResults {
  totalNetWorthAtRetirement: number;
  liquidSavingsAtRetirement: number;
  monthlyIncomeAtRetirement: number;
  socialSecurityMonthly: number;
  safeWithdrawalAmount: number;
  yearsToRetirement: number;
  projectedBalanceAt90: number;
  sustainabilityProbability: number;
  recommendedWithdrawalStrategy: string;
  personProjections: PersonProjection[];
  propertyProjections: PropertyProjection[];
  accountProjections: AccountProjection[];
  monthlyIncomeBreakdown: MonthlyIncomeBreakdown;
}

export interface ValidationError {
  field: string;
  message: string;
}
