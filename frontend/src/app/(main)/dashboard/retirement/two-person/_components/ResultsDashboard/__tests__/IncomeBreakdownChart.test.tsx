import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import IncomeBreakdownChart, { type TwoPersonCalculationResults } from "../IncomeBreakdownChart";

const mockSocialSecurityBenefit = 3500;
const mockSafeWithdrawalAmount = 48000;

vi.mock("recharts", () => ({
  PieChart: vi.fn(() => <div data-testid="mock-pie-chart">PieChart</div>),
  Pie: vi.fn(() => <div data-testid="mock-pie">Pie</div>),
  Cell: vi.fn(() => <div data-testid="mock-cell">Cell</div>),
  Tooltip: vi.fn(() => <div data-testid="mock-tooltip">Tooltip</div>),
  Legend: vi.fn(() => <div data-testid="mock-legend">Legend</div>),
  ResponsiveContainer: vi.fn(({ children }) => <div data-testid="mock-responsive-container">{children}</div>),
}));

describe("IncomeBreakdownChart", () => {
  it("renders the chart with income breakdown data when results are provided", async () => {
    const mockResults: TwoPersonCalculationResults = {
      projection1: { retirementAge: 62, totalLiquidSavingsAtRetirement: 500000, socialSecurityBenefit: 2000 },
      projection2: { retirementAge: 67, totalLiquidSavingsAtRetirement: 400000, socialSecurityBenefit: 1500 },
      householdProjection: {
        totalNetWorthAtRetirement: 1200000,
        totalLiquidSavingsAtRetirement: 900000,
        monthlyIncomeAtRetirement: 7333,
        combinedSocialSecurityBenefit: mockSocialSecurityBenefit,
        safeWithdrawalAmount: mockSafeWithdrawalAmount,
        yearsToRetirement: 15,
      },
    };

    const { container } = render(<IncomeBreakdownChart results={mockResults} />);

    expect(screen.getByText("Income Breakdown")).toBeInTheDocument();
    expect(container.querySelector(".h-80.w-full.rounded-lg.border")).toBeInTheDocument();
    expect(screen.getByText(/Social Security \(Monthly\)/)).toBeInTheDocument();
    expect(screen.getByText(/Portfolio Withdrawal \(Monthly\)/)).toBeInTheDocument();
  });

  it("renders loading state when results is null", async () => {
    render(<IncomeBreakdownChart results={null} />);

    expect(screen.getByText(/Loading chart.../)).toBeInTheDocument();
  });

  it("displays monthly income breakdown grid with Social Security and Portfolio Withdrawal amounts", async () => {
    const mockResults: TwoPersonCalculationResults = {
      projection1: { retirementAge: 62, totalLiquidSavingsAtRetirement: 500000, socialSecurityBenefit: 2000 },
      projection2: { retirementAge: 67, totalLiquidSavingsAtRetirement: 400000, socialSecurityBenefit: 1500 },
      householdProjection: {
        totalNetWorthAtRetirement: 1200000,
        totalLiquidSavingsAtRetirement: 900000,
        monthlyIncomeAtRetirement: 7333,
        combinedSocialSecurityBenefit: mockSocialSecurityBenefit,
        safeWithdrawalAmount: mockSafeWithdrawalAmount,
        yearsToRetirement: 10,
      },
    };

    render(<IncomeBreakdownChart results={mockResults} />);

    expect(screen.getByText(/Social Security \(Monthly\)/)).toBeInTheDocument();
    expect(screen.getByText(/\$3,500\/month/)).toBeInTheDocument();
    expect(screen.getByText(/Portfolio Withdrawal \(Monthly\)/)).toBeInTheDocument();
    expect(screen.getByText(/\$4,000\/month/)).toBeInTheDocument();
  });
});
