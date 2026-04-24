import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import PrimaryMetrics, { type TwoPersonCalculationResults } from "../PrimaryMetrics";

describe("PrimaryMetrics", () => {
  it("renders all 6 household metrics with correct values", async () => {
    const mockResults: TwoPersonCalculationResults = {
      projection1: { retirementAge: 62, totalLiquidSavingsAtRetirement: 500000, socialSecurityBenefit: 2000 },
      projection2: { retirementAge: 67, totalLiquidSavingsAtRetirement: 400000, socialSecurityBenefit: 1500 },
      householdProjection: {
        totalNetWorthAtRetirement: 1200000,
        totalLiquidSavingsAtRetirement: 900000,
        monthlyIncomeAtRetirement: 3500,
        combinedSocialSecurityBenefit: 3500,
        safeWithdrawalAmount: 48000,
        yearsToRetirement: 15,
      },
    };

    render(<PrimaryMetrics results={mockResults} />);

    expect(screen.getByText(/Total Household Net Worth at Retirement/)).toBeInTheDocument();
    expect(screen.getByText("$1,200,000")).toBeInTheDocument();

    expect(screen.getByText(/Total Household Liquid Savings/)).toBeInTheDocument();
    expect(screen.getByText("$900,000")).toBeInTheDocument();

    expect(screen.getByText(/Total Monthly Income at Retirement/)).toBeInTheDocument();
    expect(screen.getAllByText("$3,500").length).toBeGreaterThanOrEqual(2);

    expect(screen.getByText(/Combined Social Security \(Monthly\)/)).toBeInTheDocument();

    expect(screen.getByText(/Safe Annual Withdrawal \(4% Rule\)/)).toBeInTheDocument();
    expect(screen.getByText("$48,000")).toBeInTheDocument();

    expect(screen.getByText(/Years Until Retirement/)).toBeInTheDocument();
    expect(screen.getByText("15 years")).toBeInTheDocument();
  });

  it("renders loading state when results is null", async () => {
    render(<PrimaryMetrics results={null} />);

    expect(screen.getByText(/Loading metrics.../)).toBeInTheDocument();
  });

  it("displays formatted currency values correctly for large numbers", async () => {
    const mockResults: TwoPersonCalculationResults = {
      projection1: { retirementAge: 62, totalLiquidSavingsAtRetirement: 1500000, socialSecurityBenefit: 3000 },
      projection2: { retirementAge: 67, totalLiquidSavingsAtRetirement: 1200000, socialSecurityBenefit: 2500 },
      householdProjection: {
        totalNetWorthAtRetirement: 3500000,
        totalLiquidSavingsAtRetirement: 2700000,
        monthlyIncomeAtRetirement: 5500,
        combinedSocialSecurityBenefit: 5500,
        safeWithdrawalAmount: 140000,
        yearsToRetirement: 20,
      },
    };

    render(<PrimaryMetrics results={mockResults} />);

    expect(screen.getByText("$3,500,000")).toBeInTheDocument();
    expect(screen.getByText("$2,700,000")).toBeInTheDocument();
    expect(screen.getByText("$140,000")).toBeInTheDocument();
  });

  it("shows years to retirement without currency formatting", async () => {
    const mockResults: TwoPersonCalculationResults = {
      projection1: { retirementAge: 62, totalLiquidSavingsAtRetirement: 500000, socialSecurityBenefit: 2000 },
      projection2: { retirementAge: 67, totalLiquidSavingsAtRetirement: 400000, socialSecurityBenefit: 1500 },
      householdProjection: {
        totalNetWorthAtRetirement: 1200000,
        totalLiquidSavingsAtRetirement: 900000,
        monthlyIncomeAtRetirement: 3500,
        combinedSocialSecurityBenefit: 3500,
        safeWithdrawalAmount: 48000,
        yearsToRetirement: 12,
      },
    };

    render(<PrimaryMetrics results={mockResults} />);

    expect(screen.getByText("12 years")).toBeInTheDocument();
    expect(screen.queryByText("$12 years")).not.toBeInTheDocument();
  });
});
