import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import type { CalculationResults } from "@/app/(main)/dashboard/retirement/_components/calculateRetirement";
import YearlyProjectionTable from "../YearlyProjectionTable";

interface TwoPersonHouseholdProjection {
  yearsToRetirement: number;
  totalLiquidSavingsAtRetirement: number;
  totalNetWorthAtRetirement: number;
  monthlyIncomeAtRetirement: number;
  combinedSocialSecurityBenefit: number;
  safeWithdrawalAmount: number;
  recommendedWithdrawalStrategy: string;
  projectedBalanceAtAge90?: number;
  inflationAdjustedSavings?: number;
  yearsToDepletion?: number | null;
  monteCarloSuccessRate?: number;
  yearlyProjections: Array<{
    age: number;
    person1LiquidSavings: number;
    person2LiquidSavings: number;
    householdTotalLiquidSavings: number;
  }>;
}

export interface TwoPersonCalculationResults {
  projection1: CalculationResults | null;
  projection2: CalculationResults | null;
  householdProjection: TwoPersonHouseholdProjection;
}

describe("YearlyProjectionTable", () => {
  const mockResults: TwoPersonCalculationResults = {
    projection1: null,
    projection2: null,
    householdProjection: {
      yearsToRetirement: 25,
      totalLiquidSavingsAtRetirement: 2000000,
      totalNetWorthAtRetirement: 2300000,
      monthlyIncomeAtRetirement: 12000,
      combinedSocialSecurityBenefit: 4800,
      safeWithdrawalAmount: 92000,
      recommendedWithdrawalStrategy: "Follow the 4% rule",
      projectedBalanceAtAge90: 500000,
      inflationAdjustedSavings: 1000000,
      yearsToDepletion: 35,
      monteCarloSuccessRate: 85,
      yearlyProjections: [
        {
          age: 62,
          person1LiquidSavings: 1000000,
          person2LiquidSavings: 1000000,
          householdTotalLiquidSavings: 2000000,
        },
        {
          age: 63,
          person1LiquidSavings: 980000,
          person2LiquidSavings: 975000,
          householdTotalLiquidSavings: 1955000,
        },
        {
          age: 64,
          person1LiquidSavings: 950000,
          person2LiquidSavings: 940000,
          householdTotalLiquidSavings: 1890000,
        },
      ],
    },
  };

  it("displays the yearly projection table", async () => {
    render(<YearlyProjectionTable results={mockResults} />);

    expect(screen.getByText(/Annual Projections/i)).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();

    expect(screen.getByText(/Age/i)).toBeInTheDocument();
    
    const balanceHeader = screen.getAllByRole("columnheader").find(el => 
      el.textContent?.includes("Balance") && el.tagName === "TH"
    );
    expect(balanceHeader).toBeInTheDocument();
    
    expect(screen.getByText(/Withdrawal/i)).toBeInTheDocument();
    expect(screen.getByText(/Social Security/i)).toBeInTheDocument();
    expect(screen.getByText(/Net Expenses/i)).toBeInTheDocument();
  });

  it("displays correct values for each year", async () => {
    render(<YearlyProjectionTable results={mockResults} />);

    expect(screen.getByText(/62/)).toBeInTheDocument();
    expect(screen.getByText(/\$2,000,000/)).toBeInTheDocument();

    expect(screen.getByText(/63/)).toBeInTheDocument();
    
    expect(screen.getByText(/64/)).toBeInTheDocument();
  });

  it("handles null results gracefully", async () => {
    render(<YearlyProjectionTable results={null} />);

    expect(screen.getByText(/Annual Projections/i)).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(screen.getByText(/No projection data available/i)).toBeInTheDocument();
  });

  it("shows warning when funds may deplete", async () => {
    const resultsWithDepletion: TwoPersonCalculationResults = {
      ...mockResults,
      householdProjection: {
        ...mockResults.householdProjection,
        yearsToDepletion: 20,
      },
    };

    render(<YearlyProjectionTable results={resultsWithDepletion} />);

    expect(screen.getByText(/Warning/i)).toBeInTheDocument();
    const warningElements = screen.getAllByText(/deplete/i);
    expect(warningElements.length).toBeGreaterThan(0);
  });
});
