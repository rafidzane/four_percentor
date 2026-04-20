"use client";

import { useEffect, useState } from "react";

import { twoPersonRetirementApi } from "@/lib/api";
import { CalculatorErrorBoundary } from "@/components/retirement-calculator/CalculatorErrorBoundary";
import { CollapsibleSectionProvider } from "@/components/retirement-calculator/CollapsibleSectionContext";
import CollapsibleSection from "@/components/retirement-calculator/CollapsibleSection";

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

interface RetirementInputError {
  field: string;
  message: string;
}

const TwoPersonRetirementCalculator = () => {
  // Husband inputs
  const [husband, setHusband] = useState<PersonInputs>({
    currentAge: 35,
    retirementAge: 62,
    liquidAssets: 100000,
    illiquidAssets: 150000,
    monthlyContribution: 1500,
    annualReturnRate: 7,
    socialSecurityAge: 62,
    expectedLifespan: 90,
  });

  // Spouse inputs
  const [spouse, setSpouse] = useState<PersonInputs>({
    currentAge: 33,
    retirementAge: 67,
    liquidAssets: 80000,
    illiquidAssets: 120000,
    monthlyContribution: 1200,
    annualReturnRate: 7,
    socialSecurityAge: 67,
    expectedLifespan: 92,
  });

  // Sync retirement ages
  const [sameRetirementAge, setSameRetirementAge] = useState<boolean>(false);

  useEffect(() => {
    if (sameRetirementAge) {
      setSpouse((prev) => ({ ...prev, retirementAge: husband.retirementAge }));
    }
  }, [husband.retirementAge, sameRetirementAge]);

  const [results, setResults] = useState<{
    husband_projection: any;
    spouse_projection: any;
    household_projection: any;
  } | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [inputErrors, setInputErrors] = useState<Record<string, RetirementInputError[]>>({});

  const validatePersonInputs = (personName: string, inputs: PersonInputs): RetirementInputError[] => {
    const errors: RetirementInputError[] = [];
    const currentAgeNum = Number(inputs.currentAge);
    const retirementAgeNum = Number(inputs.retirementAge);
    const socialSecurityAgeNum = Number(inputs.socialSecurityAge);
    const expectedLifespanNum = Number(inputs.expectedLifespan);
    const liquidAssetsNum = Number(inputs.liquidAssets);
    const illiquidAssetsNum = Number(inputs.illiquidAssets);
    const monthlyContributionNum = Number(inputs.monthlyContribution);
    const annualReturnRateNum = Number(inputs.annualReturnRate);

    if (currentAgeNum < 18 || currentAgeNum > 100) {
      errors.push({ field: "Current Age", message: "Must be between 18 and 100" });
    }

    if (retirementAgeNum <= currentAgeNum || retirementAgeNum > 100) {
      errors.push({
        field: "Retirement Age",
        message: `Must be greater than current age (${currentAgeNum}) and less than or equal to 100`,
      });
    }

    if (socialSecurityAgeNum < 62 || socialSecurityAgeNum > 70) {
      errors.push({ field: "Social Security Age", message: "Must be between 62 and 70" });
    }

    if (expectedLifespanNum <= retirementAgeNum || expectedLifespanNum > 120) {
      errors.push({
        field: "Expected Lifespan",
        message: `Must be greater than retirement age (${retirementAgeNum}) and less than or equal to 120`,
      });
    }

    if (liquidAssetsNum < 0) {
      errors.push({ field: "Liquid Assets", message: "Cannot be negative" });
    }

    if (illiquidAssetsNum < 0) {
      errors.push({ field: "Illiquid Assets", message: "Cannot be negative" });
    }

    if (monthlyContributionNum < 0) {
      errors.push({ field: "Monthly Contribution", message: "Cannot be negative" });
    }

    if (annualReturnRateNum < 0 || annualReturnRateNum > 100) {
      errors.push({ field: "Expected Annual Return (%)", message: "Must be between 0% and 100%" });
    }

    return errors;
  };

  const calculateDeepRetirement = async () => {
    // Validate both persons
    const husbandErrors = validatePersonInputs("Husband", husband);
    const spouseErrors = validatePersonInputs("Spouse", spouse);

    if (husbandErrors.length > 0 || spouseErrors.length > 0) {
      setInputErrors({
        husband: husbandErrors,
        spouse: spouseErrors,
      });
      setError("Please fix the validation errors below");
      return;
    }

    clearErrors();
    setLoading(true);

    try {
      const requestData = {
        husband: {
          current_age: Number(husband.currentAge),
          retirement_age: Number(husband.retirementAge),
          liquid_assets: Number(husband.liquidAssets),
          illiquid_assets: Number(husband.illiquidAssets),
          monthly_contribution: Number(husband.monthlyContribution),
          annual_return_rate: Number(husband.annualReturnRate) / 100,
          social_security_age: Number(husband.socialSecurityAge),
          expected_lifespan: Number(husband.expectedLifespan),
        },
        spouse: {
          current_age: Number(spouse.currentAge),
          retirement_age: Number(spouse.retirementAge),
          liquid_assets: Number(spouse.liquidAssets),
          illiquid_assets: Number(spouse.illiquidAssets),
          monthly_contribution: Number(spouse.monthlyContribution),
          annual_return_rate: Number(spouse.annualReturnRate) / 100,
          social_security_age: Number(spouse.socialSecurityAge),
          expected_lifespan: Number(spouse.expectedLifespan),
        },
      };

      
      const response = await twoPersonRetirementApi.calculateTwoPersonRetirement(requestData);
      
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


  useEffect(() => {
    // Auto-calculate on initial load
    calculateDeepRetirement();
  }, []);

  const clearErrors = () => {
    setError(null);
    setInputErrors({});
  };

  const formatCurrency = (value: number | null | undefined): string => {
    try {
      return new Intl.NumberFormat("en-US", {
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value !== null && value !== undefined ? value : 0);
    } catch (e) {
      console.error("Currency formatting error:", e);
      return `$${value?.toLocaleString()}`;
    }
  };

  const renderPersonInputs = (
    personName: string,
    inputs: PersonInputs,
    setInputs: React.Dispatch<React.SetStateAction<PersonInputs>>,
    errors: RetirementInputError[]
  ) => (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg mb-2">{personName}</h3>
      
      {renderInput(
        "Current Age",
        inputs.currentAge,
        (val) => setInputs((prev) => ({ ...prev, currentAge: val })),
        18,
        100,
        "e.g. 35",
        errors
      )}
      
      {renderInput(
        "Retirement Age",
        inputs.retirementAge,
        (val) => setInputs((prev) => ({ ...prev, retirementAge: val })),
        Number(inputs.currentAge) + 1,
        100,
        "e.g. 62",
        errors
      )}
      
      {renderInput(
        "Liquid Assets",
        inputs.liquidAssets,
        (val) => setInputs((prev) => ({ ...prev, liquidAssets: val })),
        0,
        undefined,
        "e.g. 100000",
        errors
      )}
      
      {renderInput(
        "Illiquid Assets",
        inputs.illiquidAssets,
        (val) => setInputs((prev) => ({ ...prev, illiquidAssets: val })),
        0,
        undefined,
        "e.g. 150000",
        errors
      )}
      
      {renderInput(
        "Monthly Contribution",
        inputs.monthlyContribution,
        (val) => setInputs((prev) => ({ ...prev, monthlyContribution: val })),
        0,
        undefined,
        "e.g. 1500",
        errors
      )}
      
      {renderInput(
        "Expected Annual Return (%)",
        inputs.annualReturnRate,
        (val) => setInputs((prev) => ({ ...prev, annualReturnRate: val })),
        0,
        100,
        "e.g. 7",
        errors
      )}
      
      {renderInput(
        "Social Security Age",
        inputs.socialSecurityAge,
        (val) => setInputs((prev) => ({ ...prev, socialSecurityAge: val })),
        62,
        70,
        "e.g. 62",
        errors
      )}
      
      {renderInput(
        "Expected Lifespan",
        inputs.expectedLifespan,
        (val) => setInputs((prev) => ({ ...prev, expectedLifespan: val })),
        Number(inputs.retirementAge) + 1,
        120,
        "e.g. 90",
        errors
      )}
    </div>
  );

  const renderInput = (
    label: string,
    value: number | "",
    onChange: (val: number | "") => void,
    min?: number,
    max?: number,
    placeholder?: string,
    errors: RetirementInputError[] = []
  ) => {
    const error = errors.find((e) => e.field === label);

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
      </div>
    );
  };

  return (
    <CollapsibleSectionProvider>
      <div className="p-4">
        <h1 className="mb-4 w-full font-bold text-2xl">
          Two-Person Retirement Calculator
        </h1>

        {error && !inputErrors.husband?.length && !inputErrors.spouse?.length && (
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

        {(inputErrors.husband?.length > 0 || inputErrors.spouse?.length > 0) && (
          <div className="mb-6 rounded-lg border border-yellow-400 bg-yellow-50 px-4 py-3 text-yellow-800 shadow-sm">
            <h3 className="mb-2 font-bold">Please fix the following errors:</h3>
            {inputErrors.husband?.map((err, idx) => (
              <ul key={`husband-${idx}`} className="list-inside list-disc space-y-1 text-sm">
                <li><span className="font-medium">{err.field} (Husband):</span> {err.message}</li>
              </ul>
            ))}
            {inputErrors.spouse?.map((err, idx) => (
              <ul key={`spouse-${idx}`} className="list-inside list-disc space-y-1 text-sm">
                <li><span className="font-medium">{err.field} (Spouse):</span> {err.message}</li>
              </ul>
            ))}
          </div>
        )}

        <div className="mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={sameRetirementAge}
              onChange={(e) => setSameRetirementAge(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium">Same retirement age for both</span>
          </label>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Husband Inputs */}
          <CollapsibleSection
            sectionId="husband-inputs"
            title="Husband Details"
          >
            {renderPersonInputs("Husband", husband, setHusband, inputErrors.husband || [])}
          </CollapsibleSection>

          {/* Spouse Inputs */}
          <CollapsibleSection
            sectionId="spouse-inputs"
            title="Spouse Details"
          >
            {renderPersonInputs("Spouse", spouse, setSpouse, inputErrors.spouse || [])}
          </CollapsibleSection>
        </div>

        <CollapsibleSection sectionId="household-results" title="Household Results">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-blue-500 border-b-2" />
            </div>
          ) : results ? (
             <div className="space-y-4">
               {/* Combined Net Worth */}
               <div className="rounded-lg border-green-500 border-l-4 bg-green-50 p-3">
                 <p className="text-gray-600 text-xs">Total Household Net Worth at Retirement</p>
                 <p className="font-bold text-base text-green-700">
                   {formatCurrency(results.household_projection?.total_net_worth_at_retirement)}
                 </p>
               </div>

               {/* Combined Liquid Savings */}
               <div className="rounded-lg border-blue-500 border-l-4 bg-blue-50 p-3">
                 <p className="text-gray-600 text-xs">Total Household Liquid Savings</p>
                 <p className="font-bold text-base text-blue-700">
                   {formatCurrency(results.household_projection?.total_liquid_savings_at_retirement)}
                 </p>
               </div>

               {/* Combined Monthly Income */}
               <div className="rounded-lg border-purple-500 border-l-4 bg-purple-50 p-3">
                 <p className="text-gray-600 text-xs">Total Monthly Income at Retirement</p>
                 <p className="font-bold text-base text-purple-700">
                   {formatCurrency(results.household_projection?.monthly_income_at_retirement)}
                 </p>
               </div>

               {/* Combined Social Security */}
               <div className="rounded-lg border-teal-500 border-l-4 bg-teal-50 p-3">
                 <p className="text-gray-600 text-xs">Combined Social Security (Monthly)</p>
                 <p className="font-bold text-base text-teal-700">
                   {formatCurrency(results.household_projection?.combined_social_security_benefit)}
                 </p>
               </div>

               {/* Safe Withdrawal Amount */}
               <div className="rounded-lg border-orange-500 border-l-4 bg-orange-50 p-3">
                 <p className="text-gray-600 text-xs">Safe Annual Withdrawal (4% Rule)</p>
                 <p className="font-bold text-base text-orange-700">
                   {formatCurrency(results.household_projection?.safe_withdrawal_amount)}
                 </p>
               </div>

               {/* Years to Retirement */}
               <div className="rounded-lg border-yellow-500 border-l-4 bg-yellow-50 p-3">
                 <p className="text-gray-600 text-xs">Years Until Retirement</p>
                 <p className="font-bold text-base text-yellow-700">
                   {results.household_projection?.years_to_retirement} years
                 </p>
               </div>

               {/* Individual Projections */}
               {results.husband_projection && (
                  <CollapsibleSection sectionId="husband-details" title="Husband's Projection">
                   <div className="space-y-2 text-sm pl-4">
                     <p>Retirement Age: {results.husband_projection?.retirement_age}</p>
                     <p>Liquid Savings: {formatCurrency(results.husband_projection?.total_liquid_savings_at_retirement)}</p>
                     <p>Social Security: {formatCurrency(results.husband_projection?.social_security_benefit)}/month</p>
                   </div>
                 </CollapsibleSection>
               )}

               {results.spouse_projection && (
                  <CollapsibleSection sectionId="spouse-details" title="Spouse's Projection">
                   <div className="space-y-2 text-sm pl-4">
                     <p>Retirement Age: {results.spouse_projection?.retirement_age}</p>
                     <p>Liquid Savings: {formatCurrency(results.spouse_projection?.total_liquid_savings_at_retirement)}</p>
                     <p>Social Security: {formatCurrency(results.spouse_projection?.social_security_benefit)}/month</p>
                   </div>
                 </CollapsibleSection>
               )}
             </div>
            ) : (
              <div className="flex h-64 items-center justify-center">
                <p className="text-gray-500">Enter your information to see projections</p>
              </div>
            )}
        </CollapsibleSection>

        <button
          onClick={calculateDeepRetirement}
          disabled={loading || inputErrors.husband?.length > 0 || inputErrors.spouse?.length > 0}
          className={`w-full rounded-lg px-6 py-3 font-bold text-white transition-colors ${
            loading
              ? "cursor-not-allowed bg-gray-400"
              : inputErrors.husband?.length > 0 || inputErrors.spouse?.length > 0
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

export default TwoPersonRetirementCalculator;
