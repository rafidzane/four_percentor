import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import ProjectionDetails from "../ProjectionDetails";

describe("ProjectionDetails", () => {
  const mockResults = {
    yearsToRetirement: 25,
    totalLiquidSavingsAtRetirement: 1500000,
    totalNetWorthAtRetirement: 1700000,
    monthlyIncomeAtRetirement: 4000,
    socialSecurityBenefit: 3000,
    withdrawalRate: 0.04,
    projectedBalanceAtAge90: 800000,
    safeWithdrawalAmount: 68000,
    recommendedWithdrawalStrategy: "Follow the 4% rule",
    retirementAge: 62,
  };

  it("displays individual projection metrics", async () => {
    render(<ProjectionDetails personName="John" results={mockResults} />);

    expect(screen.getByText(/John's Retirement Projection/i)).toBeInTheDocument();

    expect(screen.getByText(/Retirement Age/i)).toBeInTheDocument();
    expect(screen.getByText(/62/i)).toBeInTheDocument();

    expect(screen.getByText(/Liquid Savings at Retirement/i)).toBeInTheDocument();
    expect(screen.getByText(/\$1,500,000/)).toBeInTheDocument();

    expect(screen.getByText(/Social Security Benefit/i)).toBeInTheDocument();
    expect(screen.getByText(/\$3,000\/mo/i)).toBeInTheDocument();

    expect(screen.getByText(/Safe Annual Withdrawal/i)).toBeInTheDocument();
    expect(screen.getByText(/\$68,000/)).toBeInTheDocument();

    expect(screen.getByText(/Projected Balance at Age 90/i)).toBeInTheDocument();
    expect(screen.getByText(/\$800,000/)).toBeInTheDocument();

    expect(screen.getByText(/Withdrawal Rate/i)).toBeInTheDocument();
    const allText = screen.getAllByRole("paragraph").map(el => el.textContent);
    const rateFound = allText.some(text => text?.includes("4%"));
    expect(rateFound).toBe(true);
  });

  it("handles null results gracefully", async () => {
    render(<ProjectionDetails personName="Jane" results={null} />);

    expect(screen.getByText(/Jane's Retirement Projection/i)).toBeInTheDocument();
    expect(screen.getByText(/No projection data available/i)).toBeInTheDocument();
  });

  it("displays recommended strategy in pink border box when available", async () => {
    const resultsWithStrategy = {
      ...mockResults,
      recommendedWithdrawalStrategy: "Conservative: Focus on preserving capital",
    };

    render(<ProjectionDetails personName="John" results={resultsWithStrategy} />);

    const strategyBox = screen.getByText(/Conservative: Focus on preserving capital/i);
    expect(strategyBox).toBeInTheDocument();
  });

  it("formats currency values correctly", async () => {
    render(<ProjectionDetails personName="Test Person" results={mockResults} />);

    expect(screen.getByText(/\$1,500,000/)).toBeInTheDocument();
    expect(screen.getByText(/\$68,000/)).toBeInTheDocument();
    expect(screen.getByText(/\$800,000/)).toBeInTheDocument();
  });
});
