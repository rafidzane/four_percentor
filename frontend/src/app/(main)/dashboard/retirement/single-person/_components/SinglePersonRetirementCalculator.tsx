"use client";

import { useEffect, useState } from "react";

import { deepRetirementApi } from "@/lib/api";
import { CalculatorErrorBoundary } from "@/components/retirement-calculator/CalculatorErrorBoundary";
import { CollapsibleSectionProvider } from "@/components/retirement-calculator/CollapsibleSectionContext";
import CollapsibleSection from "@/components/retirement-calculator/CollapsibleSection";

interface RetirementInputError {
  field: string;
  message: string;
}

const RetirementCalculator = () => {
  const [currentAge, setCurrentAge] = useState<number | "">(30);
  const [retirementAge, setRetirementAge] = useState<number | "">(65);
  const [liquidAssets, setLiquidAssets] = useState<number | "">(50000);
  const [illiquidAssets, setIlliquidAssets] = useState<number | "">(200000);
  const [monthlyContribution, setMonthlyContribution] = useState<number | "">(
    1000,
  );
  const [annualReturnRate, setAnnualReturnRate] = useState<number | "">(7);
  const [socialSecurityAge, setSocialSecurityAge] = useState<number | "">(67);
  const [expectedLifespan, setExpectedLifespan] = useState<number | "">(90);

  const [results, setResults] = useState<{
    yearsToRetirement: number;
    totalLiquidSavingsAtRetirement: number;
    totalNetWorthAtRetirement: number;
    monthlyIncomeAtRetirement: number;
    socialSecurityBenefit: number;
    withdrawalRate: number;
    projectedBalanceAtAge90?: number;
    safeWithdrawalAmount: number;
    recommendedWithdrawalStrategy: string;
    inflationAdjustedSavings?: number;
    yearsToDepletion?: number;
    monteCarloSuccessRate?: number;
  } | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [inputErrors, setInputErrors] = useState<RetirementInputError[]>([]);

  const calculateDeepRetirement = async () => {
    // Validate inputs
    if (!validateInputs()) {
      setError("Please fix the validation errors below");
      return;
    }

    // Clear previous errors
    clearErrors();

    setLoading(true);

    try {
      // Prepare data for API call - convert camelCase to snake_case
      const requestData = {
        current_age: Number(currentAge),
        retirement_age: Number(retirementAge),
        liquid_assets: Number(liquidAssets),
        illiquid_assets: Number(illiquidAssets),
        monthly_contribution: Number(monthlyContribution),
        annual_return_rate: Number(annualReturnRate) / 100, // Convert percentage to decimal
        social_security_age: Number(socialSecurityAge),
        expected_lifespan: Number(expectedLifespan),
      };

      // Call the deep retirement API
      console.log("Request data:", requestData);
      const response =
        await deepRetirementApi.calculateDeepRetirement(requestData);

      console.log("API Response received:", response);
      console.log("Response keys:", Object.keys(response));
      console.log(
        "Has projectedBalanceAtAge90:",
        "projectedBalanceAtAge90" in response,
      );

      // Validate response - make it more flexible
      if (!validateResults(response)) {
        throw new Error("Invalid response from server");
      }

      setResults(response);
    } catch (err: any) {
      console.error(
        "Error calculating deep retirement:",
        err,
        "Response data:",
        err.response?.data,
      );

      if (err.response?.status === 422) {
        setError(
          "Invalid input parameters. Please check your values and try again.",
        );
      } else if (err.response?.status === 500) {
        setError("Server error. Please try again later.");
      } else {
        setError(
          "Failed to calculate retirement projections. Please check your inputs and try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculateDeepRetirement();
  }, []);

  const validateInputs = (): boolean => {
    const errors: RetirementInputError[] = [];

    // Convert to numbers for comparison
    const currentAgeNum = Number(currentAge);
    const retirementAgeNum = Number(retirementAge);
    const socialSecurityAgeNum = Number(socialSecurityAge);
    const expectedLifespanNum = Number(expectedLifespan);
    const liquidAssetsNum = Number(liquidAssets);
    const illiquidAssetsNum = Number(illiquidAssets);
    const monthlyContributionNum = Number(monthlyContribution);
    const annualReturnRateNum = Number(annualReturnRate);

    // Current Age validation
    if (currentAge === "" || currentAgeNum < 18 || currentAgeNum > 100) {
      errors.push({
        field: "Current Age",
        message: "Must be between 18 and 100",
      });
    }

    // Retirement Age validation
    if (
      retirementAge === "" ||
      retirementAgeNum <= currentAgeNum ||
      retirementAgeNum > 100
    ) {
      errors.push({
        field: "Retirement Age",
        message: `Must be greater than current age (${currentAgeNum}) and less than or equal to 100`,
      });
    }

    // Social Security Age validation
    if (
      socialSecurityAge === "" ||
      socialSecurityAgeNum < 62 ||
      socialSecurityAgeNum > 70
    ) {
      errors.push({
        field: "Social Security Age",
        message: "Must be between 62 and 70",
      });
    }

    // Expected Lifespan validation
    if (
      expectedLifespan === "" ||
      expectedLifespanNum <= retirementAgeNum ||
      expectedLifespanNum > 120
    ) {
      errors.push({
        field: "Expected Lifespan",
        message: `Must be greater than retirement age (${retirementAgeNum}) and less than or equal to 120`,
      });
    }

    // Liquid Assets validation
    if (liquidAssets === "" || liquidAssetsNum < 0) {
      errors.push({ field: "Liquid Assets", message: "Cannot be negative" });
    }

    // Illiquid Assets validation
    if (illiquidAssets === "" || illiquidAssetsNum < 0) {
      errors.push({ field: "Illiquid Assets", message: "Cannot be negative" });
    }

    // Monthly Contribution validation
    if (monthlyContribution === "" || monthlyContributionNum < 0) {
      errors.push({
        field: "Monthly Contribution",
        message: "Cannot be negative",
      });
    }

    // Annual Return Rate validation
    if (
      annualReturnRate === "" ||
      annualReturnRateNum < 0 ||
      annualReturnRateNum > 100
    ) {
      errors.push({
        field: "Expected Annual Return (%)",
        message: "Must be between 0% and 100%",
      });
    }

    // Total assets validation
    const totalAssets = liquidAssetsNum + illiquidAssetsNum;
    if (totalAssets === 0) {
      errors.push({
        field: "Total Assets",
        message: "Total assets cannot be zero",
      });
    }

    // Validate that retirement age is not too close to current age
    if (retirementAgeNum - currentAgeNum < 1) {
      errors.push({
        field: "Retirement Age",
        message: "Retirement age must be at least 1 year after current age",
      });
    }

    // Validate that expected lifespan is reasonable
    if (expectedLifespanNum > 120) {
      errors.push({
        field: "Expected Lifespan",
        message: "Expected lifespan cannot exceed 120 years",
      });
    }

    setInputErrors(errors);
    return errors.length === 0;
  };

  const validateResults = (results: any): boolean => {
    if (!results) return false;

    const requiredFields = [
      "yearsToRetirement",
      "totalLiquidSavingsAtRetirement",
      "totalNetWorthAtRetirement",
      "monthlyIncomeAtRetirement",
      "socialSecurityBenefit",
      "withdrawalRate",
      "safeWithdrawalAmount",
      "recommendedWithdrawalStrategy",
    ];

    for (const field of requiredFields) {
      if (results[field] === undefined || results[field] === null) {
        console.error(`Missing required field in results: ${field}`);
        console.error("Available fields:", Object.keys(results));
        return false;
      }
    }

    return true;
  };

  const clearErrors = () => {
    setError(null);
    setInputErrors([]);
  };

  const [sectionStates, setSectionStates] = useState<SectionState>({
    "retirement-parameters": true,
    scenarios: true,
    results: true,
  });

  const handleReset = () => {
    clearErrors();
    calculateDeepRetirement();
    setSectionStates({
      "retirement-parameters": true,
      scenarios: true,
      results: true,
    });
  };

  const formatCurrency = (value: number): string => {
    if (!value && value !== 0) return "N/A";

    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    } catch (e) {
      console.error("Currency formatting error:", e);
      return `$${value.toLocaleString()}`;
    }
  };

  const renderInput = (
    label: string,
    value: number | "",
    onChange: (val: number | "") => void,
    min?: number,
    max?: number,
    placeholder?: string,
    helperText?: string,
  ) => {
    const error = inputErrors.find((e) => e.field === label);

    return (
      <div>
        <label className="mb-1 block font-semibold text-gray-700 text-xs">
          {label}
        </label>
        <input
          type="number"
          value={value === "" ? "" : value}
          onChange={(e) => {
            const val = e.target.value;
            onChange(val === "" ? "" : Number(val));
          }}
          className={`w-full rounded-lg border px-2 py-1.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2 ${
            error
              ? "border-red-500 bg-red-50 focus:ring-red-500 focus:ring-2 focus:ring-opacity-50"
              : "border-gray-300 focus:ring-blue-500 focus:ring-2 focus:ring-opacity-50"
          }`}
          min={min}
          max={max}
          placeholder={placeholder}
        />
        {error && (
          <p className="mt-1 text-red-600 text-xs font-medium animate-pulse">
            {error.message}
          </p>
        )}
        {!error && helperText && (
          <p className="mt-1 text-gray-500 text-xs">{helperText}</p>
        )}
      </div>
    );
  };

  return (
    <CollapsibleSectionProvider>
      <div className="p-4">
        <h1 className="mb-4 w-full font-bold text-2xl">
          Deep Retirement Calculator
        </h1>

        {error && !inputErrors.length && (
          <div className="mb-3 rounded-lg border border-red-400 bg-red-50 px-3 py-2 text-sm text-red-700 shadow-sm">
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {inputErrors.length > 0 && (
          <div className="mb-6 rounded-lg border border-yellow-400 bg-yellow-50 px-4 py-3 text-yellow-800 shadow-sm">
            <h3 className="mb-2 font-bold">Please fix the following errors:</h3>
            <ul className="list-inside list-disc space-y-1">
               {inputErrors.map((err, idx) => (
                 <li key={idx} className="text-sm">
                   <span className="font-medium">{err.field}:</span>{" "}
                   {err.message}
                 </li>
               ))}
          </ul>
        )}

        {/* Chart Placeholder - embedded in results section */}
        <div className="space-y-4 lg:hidden">
          <CollapsibleSection sectionId="charts" title="Projection Charts">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
              <p className="text-gray-500">
                Chart visualization coming soon...
              </p>
            </div>
          </CollapsibleSection>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Retirement Parameters - Column 1 */}
          <CollapsibleSection
            sectionId="retirement-parameters"
            title="Retirement Parameters"
          >
            <div className="space-y-4">
              {renderInput(
                "Current Age",
                currentAge,
                setCurrentAge,
                18,
                100,
                "e.g. 30",
              )}

              {renderInput(
                "Retirement Age",
                retirementAge,
                setRetirementAge,
                Number(currentAge) + 1,
                100,
                "e.g. 65",
              )}

              {renderInput(
                "Liquid Assets",
                liquidAssets,
                setLiquidAssets,
                0,
                undefined,
                "e.g. 50000",
                "Savings, stocks, bonds, and other easily accessible funds",
              )}

              {renderInput(
                "Illiquid Assets",
                illiquidAssets,
                setIlliquidAssets,
                0,
                undefined,
                "e.g. 200000",
                "Real estate, private equity, and other non-easily-accessible assets",
              )}

              {renderInput(
                "Monthly Contribution",
                monthlyContribution,
                setMonthlyContribution,
                0,
                undefined,
                "e.g. 1000",
              )}

              {renderInput(
                "Expected Annual Return (%)",
                annualReturnRate,
                setAnnualReturnRate,
                0,
                100,
                "e.g. 7",
                "Average annual return you expect (as a percentage)",
              )}

              {renderInput(
                "Social Security Age",
                socialSecurityAge,
                setSocialSecurityAge,
                62,
                70,
                "e.g. 67",
              )}

              {renderInput(
                "Expected Lifespan",
                expectedLifespan,
                setExpectedLifespan,
                Number(retirementAge) + 1,
                120,
                "e.g. 90",
              )}
            </div>
          </CollapsibleSection>

          {/* Results Section - Column 2 (spans 2 columns) */}
          <div className="lg:col-span-2">
            <CollapsibleSection sectionId="results" title="Results">
              {loading ? (
                <div className="flex h-64 items-center justify-center">
                  <div className="h-12 w-12 animate-spin rounded-full border-blue-500 border-b-2" />
                </div>
              ) : results ? (
                <div className="space-y-4">
                {/* Total Net Worth at Retirement */}
                <div className="rounded-lg border-green-500 border-l-4 bg-green-50 p-3">
                  <p className="text-gray-600 text-xs">
                    Total Net Worth at Retirement
                  </p>
                  <p className="font-bold text-base text-green-700">
                    {formatCurrency(results.totalNetWorthAtRetirement)}
                  </p>
                </div>

                {/* Total Liquid Savings */}
                <div className="rounded-lg border-blue-500 border-l-4 bg-blue-50 p-3">
                  <p className="text-gray-600 text-xs">
                    Total Liquid Savings at Retirement
                  </p>
                  <p className="font-bold text-base text-blue-700">
                    {formatCurrency(results.totalLiquidSavingsAtRetirement)}
                  </p>
                </div>

                {/* Monthly Income */}
                <div className="rounded-lg border-purple-500 border-l-4 bg-purple-50 p-3">
                  <p className="text-gray-600 text-xs">
                    Monthly Income at Retirement
                  </p>
                  <p className="font-bold text-base text-purple-700">
                    {formatCurrency(results.monthlyIncomeAtRetirement)}
                  </p>
                </div>

                {/* Social Security Benefit */}
                <div className="rounded-lg border-teal-500 border-l-4 bg-teal-50 p-3">
                  <p className="text-gray-600 text-xs">
                    Social Security Benefit (Monthly)
                  </p>
                  <p className="font-bold text-base text-teal-700">
                    {formatCurrency(results.socialSecurityBenefit)}
                  </p>
                </div>

                {/* Safe Withdrawal Amount */}
                <div className="rounded-lg border-orange-500 border-l-4 bg-orange-50 p-3">
                  <p className="text-gray-600 text-xs">
                    Safe Annual Withdrawal (4% Rule)
                  </p>
                  <p className="font-bold text-base text-orange-700">
                    {formatCurrency(results.safeWithdrawalAmount)}
                  </p>
                </div>

                {/* Projected Balance at 90 */}
                {results.projectedBalanceAtAge90 !== undefined &&
                  results.projectedBalanceAtAge90 > 0 && (
                    <div className="rounded-lg border-indigo-500 border-l-4 bg-indigo-50 p-3">
                      <p className="text-gray-600 text-xs">
                        Projected Balance at Age 90
                      </p>
                      <p className="font-bold text-base text-indigo-700">
                        {formatCurrency(results.projectedBalanceAtAge90)}
                      </p>
                    </div>
                  )}

                {/* Withdrawal Rate */}
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-gray-600 text-xs">Withdrawal Rate</p>
                  <p className="font-bold text-base text-gray-800">
                    {(results.withdrawalRate * 100).toFixed(2)}%
                  </p>
                </div>

                {/* Years to Retirement */}
                <div className="rounded-lg border-yellow-500 border-l-4 bg-yellow-50 p-3">
                  <p className="text-gray-600 text-xs">
                    Years Until Retirement
                  </p>
                  <p className="font-bold text-base text-yellow-700">
                    {results.yearsToRetirement} years
                  </p>
                </div>

                {/* Recommended Strategy */}
                <div className="rounded-lg border-pink-500 border-l-4 bg-pink-50 p-3">
                  <p className="font-semibold text-gray-600 text-xs">
                    Recommended Strategy
                  </p>
                  <p className="mt-1 text-base text-pink-800">
                    {results.recommendedWithdrawalStrategy}
                  </p>
                </div>

                {/* Additional Metrics */}
                {results.inflationAdjustedSavings !== undefined && (
                  <div className="rounded-lg border-cyan-500 border-l-4 bg-cyan-50 p-3">
                    <p className="text-gray-600 text-xs">
                      Inflation-Adjusted Savings (Today's Dollars)
                    </p>
                    <p className="font-bold text-base text-cyan-700">
                      {formatCurrency(results.inflationAdjustedSavings)}
                    </p>
                  </div>
                )}

                {results.yearsToDepletion !== undefined && (
                  <div className="rounded-lg border-lime-500 border-l-4 bg-lime-50 p-3">
                    <p className="text-gray-600 text-xs">Years to Depletion</p>
                    <p className="font-bold text-base text-lime-700">
                      {results.yearsToDepletion.toFixed(2)} years
                    </p>
                  </div>
                )}

                {results.monteCarloSuccessRate !== undefined && (
                  <div className="rounded-lg border-amber-500 border-l-4 bg-amber-50 p-3">
                    <p className="text-gray-600 text-xs">
                      Monte Carlo Success Rate
                    </p>
                    <p className="font-bold text-base text-amber-700">
                      {results.monteCarloSuccessRate.toFixed(2)}%
                    </p>
                  </div>
                )}

                {/* Withdrawal Rate */}
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="text-gray-600 text-sm">Withdrawal Rate</p>
                  <p className="font-bold text-gray-800 text-xl">
                    {(results.withdrawalRate * 100).toFixed(2)}%
                  </p>
                </div>

                {/* Years to Retirement */}
                <div className="rounded-lg border-yellow-500 border-l-4 bg-yellow-50 p-4">
                  <p className="text-gray-600 text-sm">
                    Years Until Retirement
                  </p>
                  <p className="font-bold text-xl text-yellow-700">
                    {results.yearsToRetirement} years
                  </p>
                </div>

                {/* Recommended Strategy */}
                <div className="rounded-lg border-pink-500 border-l-4 bg-pink-50 p-4">
                  <p className="font-semibold text-gray-600 text-sm">
                    Recommended Strategy
                  </p>
                  <p className="mt-1 text-base text-pink-800">
                    {results.recommendedWithdrawalStrategy}
                  </p>
                </div>

                {/* Additional Metrics */}
                {results.inflationAdjustedSavings !== undefined && (
                  <div className="rounded-lg border-cyan-500 border-l-4 bg-cyan-50 p-4">
                    <p className="text-gray-600 text-sm">
                      Inflation-Adjusted Savings (Today's Dollars)
                    </p>
                    <p className="font-bold text-cyan-700 text-xl">
                      {formatCurrency(results.inflationAdjustedSavings)}
                    </p>
                  </div>
                )}

                {results.yearsToDepletion !== undefined && (
                  <div className="rounded-lg border-lime-500 border-l-4 bg-lime-50 p-4">
                    <p className="text-gray-600 text-sm">Years to Depletion</p>
                    <p className="font-bold text-lime-700 text-xl">
                      {results.yearsToDepletion.toFixed(2)} years
                    </p>
                  </div>
                )}

                {results.monteCarloSuccessRate !== undefined && (
                  <div className="rounded-lg border-amber-500 border-l-4 bg-amber-50 p-4">
                    <p className="text-gray-600 text-sm">
                      Monte Carlo Success Rate
                    </p>
                    <p className="font-bold text-amber-700 text-xl">
                      {results.monteCarloSuccessRate.toFixed(2)}%
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center">
                <p className="text-gray-500">
                  Enter your information to see projections
                </p>
              </div>
            )}
          </CollapsibleSection>

          {/* Chart Placeholder - embedded in results section */}
          <div className="space-y-4">
            <CollapsibleSection sectionId="charts" title="Projection Charts">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
                <p className="text-gray-500">
                  Chart visualization coming soon...
                </p>
              </div>
            </CollapsibleSection>
          </div>
        </div>

        <button
          onClick={handleReset}
          disabled={loading || inputErrors.length > 0}
          className={`w-full rounded-lg px-6 py-3 font-bold text-white transition-colors ${
            loading
              ? "cursor-not-allowed bg-gray-400"
              : inputErrors.length > 0
                ? "cursor-not-allowed bg-gray-400"
                : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Calculating..." : "Calculate Retirement Plan"}
        </button>
      </div>
    </CollapsibleSectionProvider>
  );
};

export default RetirementCalculator;
