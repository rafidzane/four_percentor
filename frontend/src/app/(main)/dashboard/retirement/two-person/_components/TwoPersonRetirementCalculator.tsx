"use client";

import { useEffect, useState } from "react";

import { twoPersonRetirementApi } from "@/lib/api";

import type { CalculationResults } from "../../_components/calculateRetirement";

interface PersonInputs {
  currentAge: number | "";
  retirementAge: number | "";
  liquidAssets: number | "";
  illiquidAssets: number | "";
  monthlyContribution: number | "";
  annualReturnRate: number | "";
  socialSecurityAge: number | "";
  expectedLifespan: number | "";
}

export default function TwoPersonRetirementCalculator() {
  const [person1, setPerson1] = useState<PersonInputs>({
    currentAge: 35,
    retirementAge: 62,
    liquidAssets: 100000,
    illiquidAssets: 150000,
    monthlyContribution: 1500,
    annualReturnRate: 7,
    socialSecurityAge: 62,
    expectedLifespan: 90,
  });

  const [person2, setPerson2] = useState<PersonInputs>({
    currentAge: 33,
    retirementAge: 67,
    liquidAssets: 80000,
    illiquidAssets: 120000,
    monthlyContribution: 1200,
    annualReturnRate: 7,
    socialSecurityAge: 67,
    expectedLifespan: 92,
  });

  const [sameRetirementAge, setSameRetirementAge] = useState<boolean>(false);

  useEffect(() => {
    if (sameRetirementAge) {
      setPerson2((prev) => ({ ...prev, retirementAge: person1.retirementAge }));
    }
  }, [person1.retirementAge, sameRetirementAge]);

  const [results, setResults] = useState<{
    projection1: CalculationResults;
    projection2: CalculationResults;
    householdProjection: any;
  } | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showPerson2Inputs, setShowPerson2Inputs] = useState<boolean>(true);

  useEffect(() => {
    calculateDeepRetirement();
  }, []);

  const formatCurrency = (value: number): string => {
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

  const validatePersonInputs = (personName: string, inputs: PersonInputs): Record<string, string> => {
    const errors: Record<string, string> = {};
    const currentAgeNum = Number(inputs.currentAge);
    const retirementAgeNum = Number(inputs.retirementAge);
    const socialSecurityAgeNum = Number(inputs.socialSecurityAge);
    const expectedLifespanNum = Number(inputs.expectedLifespan);

    if (currentAgeNum < 18 || currentAgeNum > 100) {
      errors.currentAge = "Must be between 18 and 100";
    }

    if (retirementAgeNum <= currentAgeNum || retirementAgeNum > 100) {
      errors.retirementAge = `Must be greater than current age (${currentAgeNum}) and less than or equal to 100`;
    }

    if (socialSecurityAgeNum < 62 || socialSecurityAgeNum > 70) {
      errors.socialSecurityAge = "Must be between 62 and 70";
    }

    if (expectedLifespanNum <= retirementAgeNum || expectedLifespanNum > 120) {
      errors.expectedLifespan = `Must be greater than retirement age (${retirementAgeNum}) and less than or equal to 120`;
    }

    const liquidAssetsNum = Number(inputs.liquidAssets);
    if (liquidAssetsNum < 0) {
      errors.liquidAssets = "Cannot be negative";
    }

    const illiquidAssetsNum = Number(inputs.illiquidAssets);
    if (illiquidAssetsNum < 0) {
      errors.illiquidAssets = "Cannot be negative";
    }

    const monthlyContributionNum = Number(inputs.monthlyContribution);
    if (monthlyContributionNum < 0) {
      errors.monthlyContribution = "Cannot be negative";
    }

    const annualReturnRateNum = Number(inputs.annualReturnRate);
    if (annualReturnRateNum < 0 || annualReturnRateNum > 100) {
      errors.annualReturnRate = "Must be between 0% and 100%";
    }

    const totalAssets = liquidAssetsNum + illiquidAssetsNum;
    if (totalAssets === 0) {
      errors.totalAssets = "Total assets cannot be zero";
    }

    return errors;
  };

  const calculateDeepRetirement = async () => {
    setError(null);

    const person1Errors = validatePersonInputs("Person 1", person1);
    const person2Errors = showPerson2Inputs ? validatePersonInputs("Person 2", person2) : {};

    if (Object.keys(person1Errors).length > 0 || Object.keys(person2Errors).length > 0) {
      setError("Please fix the validation errors below");
      return;
    }

    setLoading(true);

    try {
      const requestData = {
        husband: {
          current_age: Number(person1.currentAge),
          retirement_age: Number(person1.retirementAge),
          liquid_assets: Number(person1.liquidAssets),
          illiquid_assets: Number(person1.illiquidAssets),
          monthly_contribution: Number(person1.monthlyContribution),
          annual_return_rate: Number(person1.annualReturnRate) / 100,
          social_security_age: Number(person1.socialSecurityAge),
          expected_lifespan: Number(person1.expectedLifespan),
        },
        spouse: {
          current_age: Number(person2.currentAge),
          retirement_age: Number(person2.retirementAge),
          liquid_assets: Number(person2.liquidAssets),
          illiquid_assets: Number(person2.illiquidAssets),
          monthly_contribution: Number(person2.monthlyContribution),
          annual_return_rate: Number(person2.annualReturnRate) / 100,
          social_security_age: Number(person2.socialSecurityAge),
          expected_lifespan: Number(person2.expectedLifespan),
        },
      };

      const response = await twoPersonRetirementApi.calculateTwoPersonRetirement(requestData);

      if (!response || !response.householdProjection) {
        throw new Error("Invalid response from server");
      }

      setResults(response as any);
    } catch (err: any) {
      console.error("Error calculating two-person retirement:", err);

      if (err.response?.status === 422) {
        setError("Invalid input parameters. Please check your values and try again.");
      } else if (err.response?.status === 500) {
        setError("Server error. Please try again later.");
      } else {
        setError("Failed to calculate retirement projections. Please check your inputs and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const renderPersonInputs = (
    personName: string,
    inputs: PersonInputs,
    setInputs: React.Dispatch<React.SetStateAction<PersonInputs>>,
    errors: Record<string, string>,
  ) => (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm mb-2">{personName}</h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block font-semibold text-gray-700 text-xs">Current Age</label>
          <input
            type="number"
            value={inputs.currentAge === "" ? "" : inputs.currentAge}
            onChange={(e) => {
              const val = e.target.value;
              setInputs((prev) => ({ ...prev, currentAge: val === "" ? "" : Number(val) }));
            }}
            className={`w-full rounded-lg border px-2 py-1.5 text-sm focus:outline-none focus:ring-2 ${
              errors.currentAge ? "border-red-500 bg-red-50 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
            }`}
            min={18}
            max={100}
          />
          {errors.currentAge && <p className="mt-1 text-red-600 text-xs">{errors.currentAge}</p>}
        </div>

        <div>
          <label className="mb-1 block font-semibold text-gray-700 text-xs">Retirement Age</label>
          <input
            type="number"
            value={inputs.retirementAge === "" ? "" : inputs.retirementAge}
            onChange={(e) => {
              const val = e.target.value;
              setInputs((prev) => ({ ...prev, retirementAge: val === "" ? "" : Number(val) }));
            }}
            className={`w-full rounded-lg border px-2 py-1.5 text-sm focus:outline-none focus:ring-2 ${
              errors.retirementAge
                ? "border-red-500 bg-red-50 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            min={Number(inputs.currentAge) + 1}
            max={100}
          />
          {errors.retirementAge && <p className="mt-1 text-red-600 text-xs">{errors.retirementAge}</p>}
        </div>

        <div>
          <label className="mb-1 block font-semibold text-gray-700 text-xs">Liquid Assets</label>
          <input
            type="number"
            value={inputs.liquidAssets === "" ? "" : inputs.liquidAssets}
            onChange={(e) => {
              const val = e.target.value;
              setInputs((prev) => ({ ...prev, liquidAssets: val === "" ? "" : Number(val) }));
            }}
            className={`w-full rounded-lg border px-2 py-1.5 text-sm focus:outline-none focus:ring-2 ${
              errors.liquidAssets
                ? "border-red-500 bg-red-50 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            min={0}
          />
          {errors.liquidAssets && <p className="mt-1 text-red-600 text-xs">{errors.liquidAssets}</p>}
        </div>

        <div>
          <label className="mb-1 block font-semibold text-gray-700 text-xs">Illiquid Assets</label>
          <input
            type="number"
            value={inputs.illiquidAssets === "" ? "" : inputs.illiquidAssets}
            onChange={(e) => {
              const val = e.target.value;
              setInputs((prev) => ({ ...prev, illiquidAssets: val === "" ? "" : Number(val) }));
            }}
            className={`w-full rounded-lg border px-2 py-1.5 text-sm focus:outline-none focus:ring-2 ${
              errors.illiquidAssets
                ? "border-red-500 bg-red-50 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            min={0}
          />
          {errors.illiquidAssets && <p className="mt-1 text-red-600 text-xs">{errors.illiquidAssets}</p>}
        </div>

        <div>
          <label className="mb-1 block font-semibold text-gray-700 text-xs">Monthly Contribution</label>
          <input
            type="number"
            value={inputs.monthlyContribution === "" ? "" : inputs.monthlyContribution}
            onChange={(e) => {
              const val = e.target.value;
              setInputs((prev) => ({ ...prev, monthlyContribution: val === "" ? "" : Number(val) }));
            }}
            className={`w-full rounded-lg border px-2 py-1.5 text-sm focus:outline-none focus:ring-2 ${
              errors.monthlyContribution
                ? "border-red-500 bg-red-50 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            min={0}
          />
          {errors.monthlyContribution && <p className="mt-1 text-red-600 text-xs">{errors.monthlyContribution}</p>}
        </div>

        <div>
          <label className="mb-1 block font-semibold text-gray-700 text-xs">Expected Annual Return (%)</label>
          <input
            type="number"
            value={inputs.annualReturnRate === "" ? "" : inputs.annualReturnRate}
            onChange={(e) => {
              const val = e.target.value;
              setInputs((prev) => ({ ...prev, annualReturnRate: val === "" ? "" : Number(val) }));
            }}
            className={`w-full rounded-lg border px-2 py-1.5 text-sm focus:outline-none focus:ring-2 ${
              errors.annualReturnRate
                ? "border-red-500 bg-red-50 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            min={0}
            max={100}
          />
          {errors.annualReturnRate && <p className="mt-1 text-red-600 text-xs">{errors.annualReturnRate}</p>}
        </div>

        <div>
          <label className="mb-1 block font-semibold text-gray-700 text-xs">Social Security Age</label>
          <input
            type="number"
            value={inputs.socialSecurityAge === "" ? "" : inputs.socialSecurityAge}
            onChange={(e) => {
              const val = e.target.value;
              setInputs((prev) => ({ ...prev, socialSecurityAge: val === "" ? "" : Number(val) }));
            }}
            className={`w-full rounded-lg border px-2 py-1.5 text-sm focus:outline-none focus:ring-2 ${
              errors.socialSecurityAge
                ? "border-red-500 bg-red-50 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            min={62}
            max={70}
          />
          {errors.socialSecurityAge && <p className="mt-1 text-red-600 text-xs">{errors.socialSecurityAge}</p>}
        </div>

        <div>
          <label className="mb-1 block font-semibold text-gray-700 text-xs">Expected Lifespan</label>
          <input
            type="number"
            value={inputs.expectedLifespan === "" ? "" : inputs.expectedLifespan}
            onChange={(e) => {
              const val = e.target.value;
              setInputs((prev) => ({ ...prev, expectedLifespan: val === "" ? "" : Number(val) }));
            }}
            className={`w-full rounded-lg border px-2 py-1.5 text-sm focus:outline-none focus:ring-2 ${
              errors.expectedLifespan
                ? "border-red-500 bg-red-50 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
            min={Number(inputs.retirementAge) + 1}
            max={120}
          />
          {errors.expectedLifespan && <p className="mt-1 text-red-600 text-xs">{errors.expectedLifespan}</p>}
        </div>
      </div>
    </div>
  );

  const handleSameRetirementAge = (checked: boolean) => {
    setSameRetirementAge(checked);
    if (checked) {
      setPerson2((prev) => ({ ...prev, retirementAge: person1.retirementAge }));
    }
  };

  return (
    <div className="p-4">
      <h1 className="mb-4 w-full font-bold text-2xl">Two-Person Retirement Calculator</h1>

      {error && (
        <div className="mb-3 rounded-lg border border-red-400 bg-red-50 px-3 py-2 text-sm text-red-700 shadow-sm">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Person 1 Inputs - 1 column */}
        <div className="lg:col-span-1 space-y-4">
          {renderPersonInputs("Person 1", person1, setPerson1, validatePersonInputs("Person 1", person1))}

          <div className="border-t pt-4">
            <div className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                id="show-person2"
                checked={showPerson2Inputs}
                onChange={(e) => {
                  setShowPerson2Inputs(e.target.checked);
                }}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="show-person2" className="text-sm font-medium cursor-pointer">
                Include Person 2
              </label>
            </div>

            {showPerson2Inputs && (
              <>
                <h3 className="font-semibold text-sm mb-2">Person 2 Details</h3>

                <div className="mb-4 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="same-retirement-age"
                    checked={sameRetirementAge}
                    onChange={(e) => handleSameRetirementAge(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="same-retirement-age" className="text-sm font-medium cursor-pointer">
                    Same Retirement Age
                  </label>
                </div>

                {renderPersonInputs("Person 2", person2, setPerson2, validatePersonInputs("Person 2", person2))}
              </>
            )}
          </div>
        </div>

        {/* Results Section - 3 columns */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex h-64 items-center justify-center rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
              <div className="h-12 w-12 animate-spin rounded-full border-blue-500 border-b-2" />
            </div>
          ) : results ? (
            <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-blue-50 to-purple-50 p-6 shadow-sm">
              <h3 className="mb-4 text-center font-semibold text-gray-700">Household Results</h3>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-2 mb-6 border-b border-gray-100 pb-6">
                <div>
                  <p className="text-xs text-gray-500">Total Household Net Worth at Retirement</p>
                  <p className="font-bold text-lg text-gray-900">
                    ${results.householdProjection.totalNetWorthAtRetirement?.toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Total Household Liquid Savings</p>
                  <p className="font-bold text-lg text-blue-600">
                    ${results.householdProjection.totalLiquidSavingsAtRetirement?.toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Total Monthly Income at Retirement</p>
                  <p className="font-bold text-lg text-purple-600">
                    ${results.householdProjection.monthlyIncomeAtRetirement?.toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Combined Social Security (Monthly)</p>
                  <p className="font-bold text-lg text-teal-600">
                    ${results.householdProjection.combinedSocialSecurityBenefit?.toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Safe Annual Withdrawal (4% Rule)</p>
                  <p className="font-bold text-lg text-orange-600">
                    ${results.householdProjection.safeWithdrawalAmount?.toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Years Until Retirement</p>
                  <p className="font-bold text-lg text-yellow-600">
                    {results.householdProjection.yearsToRetirement} years
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.projection1 && (
                  <div className="rounded-lg bg-white p-4 shadow-sm">
                    <h4 className="mb-3 font-semibold text-sm text-gray-700">Person 1 Projection</h4>
                    <div className="space-y-2 text-xs">
                      <p>
                        <span className="text-gray-500">Retirement Age:</span> {results.projection1.retirementAge}
                      </p>
                      <p>
                        <span className="text-gray-500">Liquid Savings:</span> $
                        {results.projection1.totalLiquidSavingsAtRetirement.toLocaleString()}
                      </p>
                      <p>
                        <span className="text-gray-500">Social Security:</span> $
                        {results.projection1.socialSecurityBenefit.toLocaleString()}/month
                      </p>
                    </div>
                  </div>
                )}

                {results.projection2 && (
                  <div className="rounded-lg bg-white p-4 shadow-sm">
                    <h4 className="mb-3 font-semibold text-sm text-gray-700">Person 2 Projection</h4>
                    <div className="space-y-2 text-xs">
                      <p>
                        <span className="text-gray-500">Retirement Age:</span> {results.projection2.retirementAge}
                      </p>
                      <p>
                        <span className="text-gray-500">Liquid Savings:</span> $
                        {results.projection2.totalLiquidSavingsAtRetirement.toLocaleString()}
                      </p>
                      <p>
                        <span className="text-gray-500">Social Security:</span> $
                        {results.projection2.socialSecurityBenefit.toLocaleString()}/month
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 rounded-lg border-l-4 border-pink-500 bg-pink-50 p-3">
                <p className="font-semibold text-gray-600 text-xs">Recommended Strategy</p>
                <p className="mt-1 text-base text-pink-800">
                  {results.householdProjection.recommendedWithdrawalStrategy}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
              <p className="text-gray-500">Enter your information to see projections</p>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={calculateDeepRetirement}
        disabled={
          loading ||
          Object.keys(validatePersonInputs("Person 1", person1)).length > 0 ||
          (showPerson2Inputs && Object.keys(validatePersonInputs("Person 2", person2)).length > 0)
        }
        className={`w-full rounded-lg px-6 py-3 font-bold text-white transition-colors ${
          loading
            ? "cursor-not-allowed bg-gray-400"
            : "bg-blue-500 hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-400"
        }`}
      >
        {loading ? "Calculating..." : "Calculate Retirement Plan"}
      </button>
    </div>
  );
}
