// Unit tests for CalculatorContext state management

import { describe, it, expect, beforeEach, vi } from "vitest";

import { CalculatorProvider, useCalculator, type RetirementCalculatorState } from "../CalculatorContext";

// Mock Chart.js
vi.mock("chart.js", () => ({
  CategoryScale: vi.fn(),
  Chart: vi.fn(),
  Filler: vi.fn(),
  Legend: vi.fn(),
  LinearScale: vi.fn(),
  LineElement: vi.fn(),
  PointElement: vi.fn(),
  Title: vi.fn(),
  Tooltip: vi.fn(),
}));

describe("CalculatorContext", () => {
  let TestComponent: React.FC;

  beforeEach(() => {
    TestComponent = () => {
      const calculator = useCalculator();
      return (
        <div>
          <div data-testid="current-age">{calculator.state.currentAge}</div>
          <div data-testid="retirement-age">{calculator.state.retirementAge}</div>
          <div data-testid="current-assets">{calculator.state.currentAssets}</div>
          <button onClick={() => calculator.updateState({ currentAge: 50 })} data-testid="update-age">
            Update Age
          </button>
          <button onClick={calculator.calculate} data-testid="calculate">
            Calculate
          </button>
          <button onClick={calculator.addScenario} data-testid="add-scenario">
            Add Scenario
          </button>
          <button onClick={() => calculator.removeScenario("test-scenario")} data-testid="remove-scenario">
            Remove Scenario
          </button>
          <button onClick={() => calculator.selectScenario("test-scenario")} data-testid="select-scenario">
            Select Scenario
          </button>
          <button onClick={() => calculator.compareScenarios(["test-scenario"])} data-testid="compare-scenarios">
            Compare Scenarios
          </button>
          <div data-testid="scenarios-count">{calculator.scenarios.length}</div>
          <div data-testid="comparison-results">
            {calculator.comparisonResults ? "Has results" : "No results"}
          </div>
        </div>
      );
    };
  });

  it("should provide initial state", () => {
    const { result } = renderHook(() => useCalculator(), {
      wrapper: CalculatorProvider,
    });

    expect(result.current.state.currentAge).toBe(45);
    expect(result.current.state.retirementAge).toBe(65);
    expect(result.current.state.currentAssets).toBe(500000);
    expect(result.current.state.firstYearExpenses).toBe(40000);
  });

  it("should update state", () => {
    const { result } = renderHook(() => useCalculator(), {
      wrapper: CalculatorProvider,
    });

    act(() => {
      result.current.updateState({ currentAge: 50 });
    });

    expect(result.current.state.currentAge).toBe(50);
  });

  it("should calculate results", () => {
    const { result } = renderHook(() => useCalculator(), {
      wrapper: CalculatorProvider,
    });

    act(() => {
      result.current.calculate();
    });

    expect(result.current.scenarios).toHaveLength(1);
    expect(result.current.scenarios[0].results.success).toBeDefined();
  });

  it("should add scenario", () => {
    const { result } = renderHook(() => useCalculator(), {
      wrapper: CalculatorProvider,
    });

    const initialCount = result.current.scenarios.length;

    act(() => {
      result.current.addScenario();
    });

    expect(result.current.scenarios.length).toBe(initialCount + 1);
  });

  it("should remove scenario", () => {
    const { result } = renderHook(() => useCalculator(), {
      wrapper: CalculatorProvider,
    });

    act(() => {
      result.current.addScenario();
    });

    const initialCount = result.current.scenarios.length;

    act(() => {
      result.current.removeScenario(result.current.scenarios[0].id);
    });

    expect(result.current.scenarios.length).toBe(initialCount - 1);
  });

  it("should select scenario", () => {
    const { result } = renderHook(() => useCalculator(), {
      wrapper: CalculatorProvider,
    });

    act(() => {
      result.current.addScenario();
    });

    const scenarioId = result.current.scenarios[0].id;

    act(() => {
      result.current.selectScenario(scenarioId);
    });

    expect(result.current.state.currentAge).toBe(45);
  });

  it("should compare scenarios", () => {
    const { result } = renderHook(() => useCalculator(), {
      wrapper: CalculatorProvider,
    });

    act(() => {
      result.current.addScenario();
      result.current.addScenario();
    });

    const scenarioIds = result.current.scenarios.map((s) => s.id);

    act(() => {
      result.current.compareScenarios(scenarioIds);
    });

    expect(result.current.comparisonResults).toBeDefined();
  });

  it("should handle invalid state updates", () => {
    const { result } = renderHook(() => useCalculator(), {
      wrapper: CalculatorProvider,
    });

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    act(() => {
      result.current.updateState({ currentAge: -1 });
    });

    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it("should handle invalid calculations", () => {
    const { result } = renderHook(() => useCalculator(), {
      wrapper: CalculatorProvider,
    });

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    act(() => {
      result.current.updateState({ currentAssets: -1000 });
      result.current.calculate();
    });

    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it("should set scenarios", () => {
    const { result } = renderHook(() => useCalculator(), {
      wrapper: CalculatorProvider,
    });

    const newScenarios = [
      {
        id: "scenario-1",
        name: "Scenario 1",
        state: {
          currentAge: 45,
          retirementAge: 65,
          currentAssets: 500000,
          firstYearExpenses: 40000,
          equityAllocation: 60,
          fixedIncomeAllocation: 40,
          withdrawalRate: 4,
          socialSecurity: 0,
          socialSecurityAge: 67,
          spouseSocialSecurity: 0,
          spouseSocialSecurityAge: 67,
          pension: 0,
          pensionInflation: 2,
          equityReturn: 8,
          fixedIncomeReturn: 4,
          inflation: 3,
          retirementDuration: 30,
          inflationAdjustment: true,
        },
        results: {
          success: true,
          finalPortfolioValue: 0,
          totalWithdrawals: 0,
          depletionYear: 0,
          annualWithdrawal: 0,
          portfolioValueOverTime: [],
        },
        selected: false,
      },
    ];

    act(() => {
      result.current.setScenarios(newScenarios);
    });

    expect(result.current.scenarios).toHaveLength(1);
  });

  it("should set comparison results", () => {
    const { result } = renderHook(() => useCalculator(), {
      wrapper: CalculatorProvider,
    });

    const newResults = {
      success: true,
      finalPortfolioValue: 100000,
      totalWithdrawals: 120000,
      depletionYear: 30,
      annualWithdrawal: 4000,
      portfolioValueOverTime: [],
    };

    act(() => {
      result.current.setComparisonResults(newResults);
    });

    expect(result.current.comparisonResults).toEqual(newResults);
  });

  it("should throw error when useCalculator is used outside provider", () => {
    const { result } = renderHook(() => useCalculator(), {
      wrapper: ({ children }) => (
        <div>{children}</div>
      ),
    });

    expect(() => {
      result.current;
    }).toThrow("useCalculator must be used within a CalculatorProvider");
  });
});