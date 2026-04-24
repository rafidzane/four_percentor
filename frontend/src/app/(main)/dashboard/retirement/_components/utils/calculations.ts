/**
 * Core calculation functions for retirement calculator
 */

import { IncomeSource, type PortfolioAllocation, RetirementInput, RetirementResults } from "../types";

/**
 * Calculate 4% rule safe withdrawal amount
 * @param portfolioValue - Total portfolio value
 * @param withdrawalRate - Annual withdrawal rate (as decimal)
 * @returns Safe annual withdrawal amount
 */
export function calculateSafeWithdrawal(portfolioValue: number, withdrawalRate: number): number {
  return portfolioValue * withdrawalRate;
}

/**
 * Calculate portfolio longevity based on 4% rule methodology
 * @param portfolioValue - Total portfolio value
 * @param annualExpenses - Annual expenses (inflation-adjusted)
 * @param withdrawalRate - Annual withdrawal rate (as decimal)
 * @param inflationRate - Expected inflation rate (as decimal)
 * @param portfolioAllocation - Portfolio allocation between equities and fixed income
 * @returns Number of years portfolio will last
 */
export function calculatePortfolioLongevity(
  portfolioValue: number,
  annualExpenses: number,
  withdrawalRate: number,
  inflationRate: number,
  portfolioAllocation: PortfolioAllocation,
): number {
  let remainingPortfolio = portfolioValue;
  let years = 0;
  const equityReturn = 0.07; // Average equity return
  const fixedIncomeReturn = 0.03; // Average fixed income return

  while (remainingPortfolio > 0 && years < 50) {
    // Calculate withdrawal for current year
    const withdrawal = calculateSafeWithdrawal(remainingPortfolio, withdrawalRate);

    // Calculate portfolio return based on allocation
    const equityReturnAmount = remainingPortfolio * portfolioAllocation.equities * equityReturn;
    const fixedIncomeReturnAmount = remainingPortfolio * portfolioAllocation.fixedIncome * fixedIncomeReturn;
    const totalReturn = equityReturnAmount + fixedIncomeReturnAmount;

    // Adjust for inflation
    const inflationAdjustedExpenses = annualExpenses * (1 + inflationRate) ** years;

    // Update portfolio
    remainingPortfolio = remainingPortfolio + totalReturn - withdrawal;

    years++;
  }

  return years;
}

/**
 * Calculate total net worth at retirement
 * @param liquidAssets - Liquid assets
 * @param illiquidAssets - Illiquid assets
 * @returns Total net worth
 */
export function calculateNetWorthAtRetirement(liquidAssets: number, illiquidAssets: number): number {
  return liquidAssets + illiquidAssets;
}

/**
 * Calculate total liquid savings at retirement
 * @param currentAssets - Current assets
 * @param monthlyContribution - Monthly contribution
 * @param yearsToRetirement - Years until retirement
 * @param annualReturnRate - Annual return rate (as decimal)
 * @returns Total liquid savings at retirement
 */
export function calculateLiquidSavingsAtRetirement(
  currentAssets: number,
  monthlyContribution: number,
  yearsToRetirement: number,
  annualReturnRate: number,
): number {
  const monthlyReturnRate = annualReturnRate / 12;
  const totalContributions = monthlyContribution * 12 * yearsToRetirement;
  const futureValue = currentAssets * (1 + annualReturnRate) ** yearsToRetirement;
  const contributionsFutureValue =
    monthlyContribution * 12 * (((1 + monthlyReturnRate) ** (yearsToRetirement * 12) - 1) / monthlyReturnRate);

  return futureValue + contributionsFutureValue;
}

/**
 * Calculate monthly income at retirement
 * @param safeWithdrawalAmount - Safe annual withdrawal amount
 * @returns Monthly income
 */
export function calculateMonthlyIncomeAtRetirement(safeWithdrawalAmount: number): number {
  return safeWithdrawalAmount / 12;
}

/**
 * Calculate Social Security benefit
 * @param monthlyAmount - Monthly Social Security amount
 * @returns Annual Social Security benefit
 */
export function calculateSocialSecurityBenefit(monthlyAmount: number): number {
  return monthlyAmount * 12;
}

/**
 * Calculate projected balance at age 90
 * @param currentAge - Current age
 * @param retirementAge - Retirement age
 * @param portfolioValue - Portfolio value at retirement
 * @param annualReturnRate - Annual return rate (as decimal)
 * @returns Projected balance at age 90
 */
export function calculateProjectedBalanceAtAge90(
  currentAge: number,
  retirementAge: number,
  portfolioValue: number,
  annualReturnRate: number,
): number {
  const yearsFromRetirementTo90 = 90 - retirementAge;
  return portfolioValue * (1 + annualReturnRate) ** yearsFromRetirementTo90;
}

/**
 * Calculate recommended withdrawal strategy
 * @param portfolioValue - Portfolio value
 * @param annualExpenses - Annual expenses
 * @param inflationRate - Inflation rate (as decimal)
 * @returns Recommended strategy string
 */
export function calculateRecommendedStrategy(
  portfolioValue: number,
  annualExpenses: number,
  inflationRate: number,
): string {
  const withdrawalRate = annualExpenses / portfolioValue;

  if (withdrawalRate <= 0.04) {
    return "Conservative: 4% rule is appropriate. Your portfolio should last 30+ years.";
  }
  if (withdrawalRate <= 0.05) {
    return "Moderate: 5% withdrawal rate may be sustainable with careful planning.";
  }
  if (withdrawalRate <= 0.06) {
    return "Aggressive: 6% withdrawal rate requires careful monitoring and flexibility.";
  }
  return "High Risk: 6%+ withdrawal rate is not recommended. Consider reducing expenses or increasing portfolio size.";
}

/**
 * Calculate total withdrawals over retirement period
 * @param safeWithdrawalAmount - Safe annual withdrawal amount
 * @param years - Number of years
 * @returns Total withdrawals
 */
export function calculateTotalWithdrawals(safeWithdrawalAmount: number, years: number): number {
  return safeWithdrawalAmount * years;
}

/**
 * Calculate final portfolio value
 * @param portfolioValue - Portfolio value at retirement
 * @param totalWithdrawals - Total withdrawals
 * @returns Final portfolio value
 */
export function calculateFinalPortfolioValue(portfolioValue: number, totalWithdrawals: number): number {
  return portfolioValue - totalWithdrawals;
}
