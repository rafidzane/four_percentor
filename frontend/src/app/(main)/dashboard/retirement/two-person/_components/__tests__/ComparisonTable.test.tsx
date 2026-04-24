import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import type { CalculationResults, RetirementInput } from "@/app/(main)/dashboard/retirement/_components/types";
import ComparisonTable from "../ScenarioComparison/ComparisonTable";

describe("ComparisonTable", () => {
  const mockScenarios = [
    {
      id: "scenario1",
      name: "Scenario 1 - Age 62",
      parameters: {
        currentAge: 35,
        retirementAge: 62,
        liquidAssets: 100000,
        illiquidAssets: 150000,
        monthlyContribution: 1500,
        annualReturnRate: 7,
        socialSecurityAge: 62,
        expectedLifespan: 90,
      } as RetirementInput,
      results: {
        yearsToRetirement: 27,
        totalLiquidSavingsAtRetirement: 1800000,
        totalNetWorthAtRetirement: 1950000,
        monthlyIncomeAtRetirement: 2400,
        socialSecurityBenefit: 2400,
        withdrawalRate: 0.047,
        projectedBalanceAtAge90: 500000,
        safeWithdrawalAmount: 78000,
        recommendedWithdrawalStrategy: "Follow the 4% rule",
      } as CalculationResults,
    },
    {
      id: "scenario2",
      name: "Scenario 2 - Age 67",
      parameters: {
        currentAge: 35,
        retirementAge: 67,
        liquidAssets: 100000,
        illiquidAssets: 150000,
        monthlyContribution: 1500,
        annualReturnRate: 7,
        socialSecurityAge: 67,
        expectedLifespan: 90,
      } as RetirementInput,
      results: {
        yearsToRetirement: 32,
        totalLiquidSavingsAtRetirement: 2400000,
        totalNetWorthAtRetirement: 2550000,
        monthlyIncomeAtRetirement: 3200,
        socialSecurityBenefit: 3200,
        withdrawalRate: 0.047,
        projectedBalanceAtAge90: 800000,
        safeWithdrawalAmount: 102000,
        recommendedWithdrawalStrategy: "Follow the 4% rule",
      } as CalculationResults,
    },
    {
      id: "scenario3",
      name: "Scenario 3 - Age 70",
      parameters: {
        currentAge: 35,
        retirementAge: 70,
        liquidAssets: 100000,
        illiquidAssets: 150000,
        monthlyContribution: 1500,
        annualReturnRate: 7,
        socialSecurityAge: 70,
        expectedLifespan: 90,
      } as RetirementInput,
      results: {
        yearsToRetirement: 35,
        totalLiquidSavingsAtRetirement: 2800000,
        totalNetWorthAtRetirement: 2950000,
        monthlyIncomeAtRetirement: 3600,
        socialSecurityBenefit: 3600,
        withdrawalRate: 0.047,
        projectedBalanceAtAge90: 1000000,
        safeWithdrawalAmount: 118000,
        recommendedWithdrawalStrategy: "Follow the 4% rule",
      } as CalculationResults,
    },
  ];

  it("renders the comparison table with scenarios", async () => {
    render(<ComparisonTable scenarios={mockScenarios} />);

    expect(screen.getByText(/Scenario 1 - Age 62/i)).toBeInTheDocument();
    expect(screen.getByText(/Scenario 2 - Age 67/i)).toBeInTheDocument();
    expect(screen.getByText(/Scenario 3 - Age 70/i)).toBeInTheDocument();

    expect(screen.getByText("Total Net Worth")).toBeInTheDocument();
    expect(screen.getByText("Liquid Savings")).toBeInTheDocument();
    expect(screen.getByText("Monthly Income")).toBeInTheDocument();
    expect(screen.getByText("Social Security")).toBeInTheDocument();
    expect(screen.getByText("Years to Retirement")).toBeInTheDocument();
  });

  it("displays correct values for each scenario", async () => {
    render(<ComparisonTable scenarios={mockScenarios} />);

    // Check that all values are present
    expect(screen.getByText(/1,950,000/)).toBeInTheDocument();
    expect(screen.getByText(/27 years/)).toBeInTheDocument();
  });

  it("highlights best total net worth value in green", async () => {
    render(<ComparisonTable scenarios={mockScenarios} />);

    const allCells = screen.getAllByRole("cell");
    // Find the cell with 2,950,000 (Scenario 3 has the highest)
    let scenario3Cell: HTMLElement | null = null;
    for (const cell of allCells) {
      if (cell.textContent?.includes("2,950,000")) {
        scenario3Cell = cell;
      }
    }

    expect(scenario3Cell).not.toBeNull();
    expect(scenario3Cell!).toHaveClass("text-green-600");
  });

  it("highlights best liquid savings value in green", async () => {
    render(<ComparisonTable scenarios={mockScenarios} />);

    const allCells = screen.getAllByRole("cell");
    let scenario3Cell: HTMLElement | null = null;
    for (const cell of allCells) {
      if (cell.textContent?.includes("2,800,000")) {
        scenario3Cell = cell;
      }
    }

    expect(scenario3Cell).not.toBeNull();
    expect(scenario3Cell!).toHaveClass("text-green-600");
  });

  it("highlights best monthly income value in green", async () => {
    render(<ComparisonTable scenarios={mockScenarios} />);

    const allCells = screen.getAllByRole("cell");
    let scenario3Cell: HTMLElement | null = null;
    for (const cell of allCells) {
      if (cell.textContent?.includes("3,600")) {
        scenario3Cell = cell;
      }
    }

    expect(scenario3Cell).not.toBeNull();
    expect(scenario3Cell!).toHaveClass("text-green-600");
  });

  it("highlights best social security value in green", async () => {
    render(<ComparisonTable scenarios={mockScenarios} />);

    const allCells = screen.getAllByRole("cell");
    let scenario3Cell: HTMLElement | null = null;
    for (const cell of allCells) {
      if (cell.textContent?.includes("3,600")) {
        scenario3Cell = cell;
      }
    }

    expect(scenario3Cell).not.toBeNull();
    expect(scenario3Cell!).toHaveClass("text-green-600");
  });

  it("handles empty scenarios array", async () => {
    render(<ComparisonTable scenarios={[]} />);

    expect(screen.queryByText(/Scenario 1/i)).not.toBeInTheDocument();
    expect(screen.getByText(/No scenarios to compare/i)).toBeInTheDocument();
  });
});
