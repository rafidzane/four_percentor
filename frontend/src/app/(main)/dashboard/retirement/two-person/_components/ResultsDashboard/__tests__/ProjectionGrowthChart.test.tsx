import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import ProjectionGrowthChart, { type TwoPersonCalculationResults } from "../ProjectionGrowthChart";

describe("ProjectionGrowthChart", () => {
  it("renders the chart container with data when results are provided", async () => {
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

    const { container } = render(<ProjectionGrowthChart results={mockResults} />);

    expect(screen.getByText("Projection Growth")).toBeInTheDocument();
    expect(container.querySelector(".h-80.w-full.rounded-lg.border")).toBeInTheDocument();
  });

  it("renders loading state when results is null", async () => {
    render(<ProjectionGrowthChart results={null} />);

    expect(screen.getByText(/Loading chart.../)).toBeInTheDocument();
  });

  it("displays the chart with proper structure for projection lines", async () => {
    const mockResults: TwoPersonCalculationResults = {
      projection1: { retirementAge: 62, totalLiquidSavingsAtRetirement: 500000, socialSecurityBenefit: 2000 },
      projection2: { retirementAge: 67, totalLiquidSavingsAtRetirement: 400000, socialSecurityBenefit: 1500 },
      householdProjection: {
        totalNetWorthAtRetirement: 1200000,
        totalLiquidSavingsAtRetirement: 900000,
        monthlyIncomeAtRetirement: 3500,
        combinedSocialSecurityBenefit: 3500,
        safeWithdrawalAmount: 48000,
        yearsToRetirement: 10,
      },
    };

    const { container } = render(<ProjectionGrowthChart results={mockResults} />);

    expect(screen.getByText("Projection Growth")).toBeInTheDocument();
    expect(container.querySelector(".h-80.w-full")).toBeInTheDocument();
  });
});
