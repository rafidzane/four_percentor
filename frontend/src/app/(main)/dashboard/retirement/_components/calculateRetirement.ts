// Calculation engine for retirement projections

export interface RetirementParams {
  currentAge: number;
  retirementAge: number;
  liquidAssets: number;
  illiquidAssets: number;
  monthlyContribution: number;
  annualReturnRate: number;
  socialSecurityAge: number;
  expectedLifespan: number;
}

export interface CalculationResults {
  yearsToRetirement: number;
  totalLiquidSavingsAtRetirement: number;
  totalNetWorthAtRetirement: number;
  monthlyIncomeAtRetirement: number;
  socialSecurityBenefit: number;
  withdrawalRate: number;
  projectedBalanceAtAge90?: number;
  safeWithdrawalAmount: number;
  recommendedWithdrawalStrategy: string;
  retirementAge: number;
}

export function calculateCompoundInterest(
  principal: number,
  monthlyContribution: number,
  annualRate: number,
  years: number,
): number {
  const monthlyRate = annualRate / 100 / 12;
  const months = years * 12;

  if (monthlyRate === 0) {
    return principal + monthlyContribution * months;
  }

  const compoundFactor = (1 + monthlyRate) ** months;
  const futureValue = principal * compoundFactor;
  const contributionsFutureValue = monthlyContribution * ((compoundFactor - 1) / monthlyRate);

  return futureValue + contributionsFutureValue;
}

export function estimateSocialSecurityBenefit(
  currentAge: number,
  retirementAge: number,
  socialSecurityAge: number,
  averageMonthlyEarnings = 4000,
): number {
  const yearsUntilSS = socialSecurityAge - currentAge;

  if (yearsUntilSS <= 0) {
    return averageMonthlyEarnings * 0.7;
  }

  const fullRetirementBenefit = averageMonthlyEarnings * 0.9;
  const reductionFactor = Math.max(0.25, 1 - (yearsUntilSS - 36) * 0.0055);

  return fullRetirementBenefit * reductionFactor;
}

export function calculateRetirementProjection(params: RetirementParams): CalculationResults {
  const yearsToRetirement = params.retirementAge - params.currentAge;

  if (yearsToRetirement <= 0) {
    throw new Error("Retirement age must be greater than current age");
  }

  const totalLiquidSavingsAtRetirement = calculateCompoundInterest(
    params.liquidAssets,
    params.monthlyContribution,
    params.annualReturnRate,
    yearsToRetirement,
  );

  const totalNetWorthAtRetirement = totalLiquidSavingsAtRetirement + params.illiquidAssets;

  const socialSecurityBenefit = estimateSocialSecurityBenefit(
    params.currentAge,
    params.retirementAge,
    params.socialSecurityAge,
  );

  const monthlyIncomeAtRetirement = socialSecurityBenefit;

  const safeWithdrawalAmount = totalNetWorthAtRetirement * 0.04;

  const withdrawalRate = (monthlyIncomeAtRetirement * 12) / totalNetWorthAtRetirement || 0;

  let recommendedWithdrawalStrategy = "Follow the 4% rule for sustainable withdrawals.";
  if (withdrawalRate > 0.05) {
    recommendedWithdrawalStrategy =
      "High withdrawal rate detected. Consider reducing withdrawals or increasing savings.";
  } else if (withdrawalRate < 0.03) {
    recommendedWithdrawalStrategy = "Conservative withdrawal rate. You may have flexibility to increase withdrawals.";
  }

  const projectedBalanceAtAge90 = calculateProjectedExceptionalBalance(
    totalNetWorthAtRetirement,
    params.annualReturnRate,
    params.expectedLifespan,
    params.retirementAge,
  );

  return {
    yearsToRetirement,
    totalLiquidSavingsAtRetirement,
    totalNetWorthAtRetirement,
    monthlyIncomeAtRetirement,
    socialSecurityBenefit,
    withdrawalRate,
    safeWithdrawalAmount,
    recommendedWithdrawalStrategy,
    projectedBalanceAtAge90,
    retirementAge: params.retirementAge,
  };
}

function calculateProjectedExceptionalBalance(
  initialBalance: number,
  annualReturnRate: number,
  expectedLifespan: number,
  retirementAge: number,
): number | undefined {
  const yearsAfterRetirement = expectedLifespan - retirementAge;

  if (yearsAfterRetirement <= 0) {
    return undefined;
  }

  const monthlyRate = annualReturnRate / 100 / 12;
  const monthlyWithdrawal = (initialBalance * 0.04) / 12;
  let balance = initialBalance;

  for (let month = 0; month < yearsAfterRetirement * 12; month++) {
    const interest = balance * monthlyRate;
    balance += interest - monthlyWithdrawal;

    if (balance <= 0) {
      return 0;
    }
  }

  return Math.max(0, balance);
}

export function validateInputs(params: Partial<RetirementParams>): ValidationError[] {
  const errors: ValidationError[] = [];

  if (params.currentAge !== undefined) {
    if (params.currentAge < 18 || params.currentAge > 100) {
      errors.push({ field: "currentAge", message: "Must be between 18 and 100" });
    }
  }

  if (params.retirementAge !== undefined) {
    if (params.retirementAge <= (params.currentAge || 0)) {
      errors.push({
        field: "retirementAge",
        message: `Must be greater than current age (${params.currentAge})`,
      });
    }
    if (params.retirementAge > 100) {
      errors.push({ field: "retirementAge", message: "Must be less than or equal to 100" });
    }
  }

  if (params.socialSecurityAge !== undefined) {
    if (params.socialSecurityAge < 62 || params.socialSecurityAge > 70) {
      errors.push({
        field: "socialSecurityAge",
        message: "Must be between 62 and 70",
      });
    }
  }

  if (params.expectedLifespan !== undefined && params.retirementAge !== undefined) {
    if (params.expectedLifespan <= params.retirementAge) {
      errors.push({
        field: "expectedLifespan",
        message: `Must be greater than retirement age (${params.retirementAge})`,
      });
    }
    if (params.expectedLifespan > 120) {
      errors.push({ field: "expectedLifespan", message: "Must be less than or equal to 120" });
    }
  }

  if (params.liquidAssets !== undefined && params.liquidAssets < 0) {
    errors.push({ field: "liquidAssets", message: "Cannot be negative" });
  }

  if (params.illiquidAssets !== undefined && params.illiquidAssets < 0) {
    errors.push({ field: "illiquidAssets", message: "Cannot be negative" });
  }

  if (params.monthlyContribution !== undefined && params.monthlyContribution < 0) {
    errors.push({ field: "monthlyContribution", message: "Cannot be negative" });
  }

  if (params.annualReturnRate !== undefined && (params.annualReturnRate < 0 || params.annualReturnRate > 100)) {
    errors.push({
      field: "annualReturnRate",
      message: "Must be between 0% and 100%",
    });
  }

  const totalAssets = (params.liquidAssets || 0) + (params.illiquidAssets || 0);
  if (totalAssets === 0) {
    errors.push({ field: "assets", message: "Total assets cannot be zero" });
  }

  return errors;
}

export interface ValidationError {
  field: string;
  message: string;
}
