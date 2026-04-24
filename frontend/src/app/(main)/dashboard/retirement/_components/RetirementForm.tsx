"use client";

import { useState } from "react";

import { deepRetirementApi } from "@/lib/api";

import type { CalculationResults, RetirementParams, ValidationError } from "./calculateRetirement";
import { calculateRetirementProjection, validateInputs } from "./calculateRetirement";

interface Props {
  onSubmit: (results: CalculationResults) => void;
}

export default function RetirementForm({ onSubmit }: Props) {
  const [currentAge, setCurrentAge] = useState<number | "">(30);
  const [retirementAge, setRetirementAge] = useState<number | "">(65);
  const [liquidAssets, setLiquidAssets] = useState<number | "">(50000);
  const [illiquidAssets, setIlliquidAssets] = useState<number | "">(200000);
  const [monthlyContribution, setMonthlyContribution] = useState<number | "">(1000);
  const [annualReturnRate, setAnnualReturnRate] = useState<number | "">(7);
  const [socialSecurityAge, setSocialSecurityAge] = useState<number | "">(67);
  const [expectedLifespan, setExpectedLifespan] = useState<number | "">(90);

  const [inputErrors, setInputErrors] = useState<ValidationError[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleChange = (setter: React.Dispatch<React.SetStateAction<number | "">>, value: number | "") => {
    setter(value === "" ? "" : Number(value));
    if (inputErrors.length > 0) {
      validateAndSetErrors();
    }
  };

  const validateAndSetErrors = () => {
    const params = getParams();
    const errors = validateInputs(params);
    setInputErrors(errors);
    return errors.length === 0;
  };

  const getParams = (): Partial<RetirementParams> => ({
    currentAge: Number(currentAge),
    retirementAge: Number(retirementAge),
    liquidAssets: Number(liquidAssets),
    illiquidAssets: Number(illiquidAssets),
    monthlyContribution: Number(monthlyContribution),
    annualReturnRate: Number(annualReturnRate),
    socialSecurityAge: Number(socialSecurityAge),
    expectedLifespan: Number(expectedLifespan),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAndSetErrors()) {
      setApiError("Please fix the validation errors below");
      return;
    }

    const params = getParams();
    clearErrors();

    setLoading(true);

    try {
      const requestData = {
        current_age: Number(currentAge),
        retirement_age: Number(retirementAge),
        liquid_assets: Number(liquidAssets),
        illiquid_assets: Number(illiquidAssets),
        monthly_contribution: Number(monthlyContribution),
        annual_return_rate: Number(annualReturnRate) / 100,
        social_security_age: Number(socialSecurityAge),
        expected_lifespan: Number(expectedLifespan),
      };

      const response = await deepRetirementApi.calculateDeepRetirement(requestData);

      if (!response || !response.yearsToRetirement) {
        throw new Error("Invalid response from server");
      }

      onSubmit(response);
    } catch (err: any) {
      console.error("Error calculating deep retirement:", err, "Response data:", err.response?.data);

      if (err.response?.status === 422) {
        setApiError("Invalid input parameters. Please check your values");
      } else if (err.response?.status === 500) {
        setApiError("Server error. Please try again later.");
      } else {
        setApiError("Failed to calculate retirement projections. Please check your inputs and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const clearErrors = () => {
    setApiError(null);
    setInputErrors([]);
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
        <label className="mb-1 block font-semibold text-gray-700 text-xs">{label}</label>
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
        {error && <p className="mt-1 text-red-600 text-xs font-medium animate-pulse">{error.message}</p>}
        {!error && helperText && <p className="mt-1 text-gray-500 text-xs">{helperText}</p>}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {apiError && !inputErrors.length && (
        <div className="rounded-lg border border-red-400 bg-red-50 px-3 py-2 text-sm text-red-700 shadow-sm">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">{apiError}</span>
          </div>
        </div>
      )}

      {inputErrors.length > 0 && (
        <div className="rounded-lg border border-yellow-400 bg-yellow-50 px-4 py-3 text-yellow-800 shadow-sm">
          <h3 className="mb-2 font-bold">Please fix the following errors:</h3>
          <ul className="list-inside list-disc space-y-1">
            {inputErrors.map((err, idx) => (
              <li key={idx} className="text-sm">
                <span className="font-medium">{err.field}:</span> {err.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {renderInput("Current Age", currentAge, (val) => handleChange(setCurrentAge, val), 18, 100, "e.g. 30")}

        {renderInput(
          "Retirement Age",
          retirementAge,
          (val) => handleChange(setRetirementAge, val),
          currentAge === "" ? 19 : Number(currentAge) + 1,
          100,
          "e.g. 65",
        )}

        {renderInput(
          "Liquid Assets",
          liquidAssets,
          (val) => handleChange(setLiquidAssets, val),
          0,
          undefined,
          "e.g. 50000",
          "Savings, stocks, bonds, and other easily accessible funds",
        )}

        {renderInput(
          "Illiquid Assets",
          illiquidAssets,
          (val) => handleChange(setIlliquidAssets, val),
          0,
          undefined,
          "e.g. 200000",
          "Real estate, private equity, and other non-easily-accessible assets",
        )}

        {renderInput(
          "Monthly Contribution",
          monthlyContribution,
          (val) => handleChange(setMonthlyContribution, val),
          0,
          undefined,
          "e.g. 1000",
        )}

        {renderInput(
          "Expected Annual Return (%)",
          annualReturnRate,
          (val) => handleChange(setAnnualReturnRate, val),
          0,
          100,
          "e.g. 7",
          "Average annual return you expect (as a percentage)",
        )}

        {renderInput(
          "Social Security Age",
          socialSecurityAge,
          (val) => handleChange(setSocialSecurityAge, val),
          62,
          70,
          "e.g. 67",
        )}

        {renderInput(
          "Expected Lifespan",
          expectedLifespan,
          (val) => handleChange(setExpectedLifespan, val),
          retirementAge === "" ? 66 : Number(retirementAge) + 1,
          120,
          "e.g. 90",
        )}
      </div>

      <button
        type="submit"
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
    </form>
  );
}
