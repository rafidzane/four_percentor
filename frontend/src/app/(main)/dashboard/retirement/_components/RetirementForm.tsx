"use client";

import { FC, useEffect, useState } from "react";
import { useForm, useWatch, FormProvider } from "react-hook-form";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { InfoIcon } from "lucide-react";

// Import section components
import { PersonalInformationSection } from "./PersonalInformationSection";
import { PortfolioAssetsSection } from "./PortfolioAssetsSection";
import { WithdrawalStrategySection } from "./WithdrawalStrategySection";
import { IncomeSourcesSection } from "./IncomeSourcesSection";
import { RealEstateSection } from "./RealEstateSection";

// Form Data Types (matching backend Pydantic models)
interface TimelineData {
  current_age: number;
  retirement_age: number;
  spouse_age?: number;
  years_in_retirement: number;
}

interface AssetsData {
  investment_portfolio: number;
  your_401k_ira: number;
  spouse_401k_ira: number;
  yearly_contribution: number;
  yearly_contribution_increase_pct: number;
  catch_up_eligible: boolean;
}

interface PortfolioData {
  equity_pct: number;
  fixed_income_pct: number;
  equity_return_pre_retirement_pct: number;
  equity_return_post_retirement_pct: number;
  fixed_income_return_pct: number;
  inflation_rate_pct: number;
  simulation_mode: "historical_all" | "single_year" | "manual";
  historical_year?: number;
}

interface SpendingData {
  spending_mode: "four_pct_rule" | "manual_withdrawal";
  first_year_expenses: number;
  withdrawal_pct: number;
  age_range_start: number;
  age_range_end: number;
  adjust_for_inflation: boolean;
  two_period_mode: boolean;
  period_1_start_age?: number;
  period_1_end_age?: number;
  period_1_withdrawal_pct?: number;
  period_2_start_age?: number;
  period_2_end_age?: number;
  period_2_withdrawal_pct?: number;
}

interface FormData {
  timeline: TimelineData;
  current_assets: AssetsData;
  portfolio_allocation: PortfolioData;
  retirement_spending: SpendingData;
  income_streams?: {
    social_security_you?: { claim_age: number; yearly_amount_today_dollars: number };
    social_security_spouse?: { claim_age: number; yearly_amount_today_dollars: number };
    pension_1?: { starting_age: number; yearly_amount: number };
    pension_2?: { starting_age: number; yearly_amount: number };
    rental_properties?: Array<{ property_name: string; net_annual_income: number; until_age: number }>;
  };
  real_estate?: {
    total_property_value: number;
    total_outstanding_mortgages: number;
    annual_appreciation_pct: number;
    model_property_sale?: boolean;
    age_of_sale?: number;
    amount_rolled_into_portfolio?: number;
  };
}

interface RetirementResponse {
  age: number[];
  portfolio_balance: number[];
  income: number[];
  expenses: number[];
  net_income: number[];
  success: boolean;
  final_balance: number;
  avg_balance: number;
  max_balance: number;
  min_balance: number;
}

const defaultValues: FormData = {
  timeline: { current_age: 35, retirement_age: 65, years_in_retirement: 30 },
  current_assets: {
    investment_portfolio: 100000,
    your_401k_ira: 150000,
    spouse_401k_ira: 0,
    yearly_contribution: 10000,
    yearly_contribution_increase_pct: 3,
    catch_up_eligible: false,
  },
  portfolio_allocation: {
    equity_pct: 70,
    fixed_income_pct: 30,
    equity_return_pre_retirement_pct: 7,
    equity_return_post_retirement_pct: 5.5,
    fixed_income_return_pct: 3.5,
    inflation_rate_pct: 3,
    simulation_mode: "historical_all",
    historical_year: 1929,
  },
  retirement_spending: {
    spending_mode: "four_pct_rule",
    first_year_expenses: 0,
    withdrawal_pct: 4,
    age_range_start: 62,
    age_range_end: 92,
    adjust_for_inflation: true,
    two_period_mode: false,
    period_1_start_age: 62,
    period_1_end_age: 65,
    period_1_withdrawal_pct: 4,
    period_2_start_age: 66,
    period_2_end_age: 92,
    period_2_withdrawal_pct: 4,
  },
};

interface RetirementFormProps {
  className?: string;
  onResult?: (result: RetirementResponse) => void;
}

export const RetirementForm: FC<RetirementFormProps> = ({ className, onResult }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<RetirementResponse | null>(null);

  const form = useForm<FormData>({
    defaultValues,
    mode: "onChange",
  });

  // Watch values for conditional rendering
  const equityPct = useWatch({ control: form.control, name: "portfolio_allocation.equity_pct", defaultValue: 70 });
  const simulationMode = useWatch({ control: form.control, name: "portfolio_allocation.simulation_mode", defaultValue: "historical_all" });
  const spendingMode = useWatch({ control: form.control, name: "retirement_spending.spending_mode", defaultValue: "four_pct_rule" });

  // Set default historical year when mode changes to single_year
  useEffect(() => {
    if (simulationMode === "single_year") {
      const currentYear = form.getValues("portfolio_allocation.historical_year");
      if (!currentYear) {
        form.setValue("portfolio_allocation.historical_year", 1929, { shouldValidate: true });
      }
    }
  }, [simulationMode, form]);

  const handleSubmit = async (data: FormData) => {
    setIsLoading(true);

    // Clean up the data to remove undefined values that might cause backend validation issues
    const cleanData = JSON.parse(JSON.stringify(data));

    // Remove empty objects for optional fields that should be null/undefined
    const processOptionalFields = (obj: any): any => {
      if (obj === null || obj === undefined) return obj;

      if (typeof obj === 'object' && !Array.isArray(obj)) {
        const cleanedObj: any = {};
        Object.keys(obj).forEach(key => {
          // Skip empty objects or arrays for optional fields
          if (obj[key] !== null && obj[key] !== undefined) {
            if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
              // If it's an object with only null/undefined values, skip it
              const hasValidValues = Object.values(obj[key]).some(val => val !== null && val !== undefined);
              if (hasValidValues) {
                cleanedObj[key] = processOptionalFields(obj[key]);
              }
            } else {
              cleanedObj[key] = obj[key];
            }
          }
        });
        return cleanedObj;
      }

      if (Array.isArray(obj)) {
        return obj.map(item => processOptionalFields(item));
      }

      return obj;
    };

    const finalData = processOptionalFields(cleanData);

    try {
      // Call the backend API
      const response = await fetch("http://localhost:8000/fourpercent/api/v4/retirement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });

      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = `API error: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch (e) {
          // If we can't parse JSON, keep the default error message
        }

        // Log the raw response for debugging
        console.error("API Response Error:", response.status, response.statusText, errorMessage);

        throw new Error(errorMessage);
      }

      const apiResult = await response.json();
      setResult(apiResult);
      if (onResult) {
        onResult(apiResult);
      }
    } catch (error: any) {
      console.error("Error calculating retirement:", error);
      // Show more specific error messages to user
      if (error.message.includes('Failed to fetch')) {
        alert("Failed to connect to the retirement calculator. Please check that the backend server is running at http://localhost:8000");
      } else {
        alert(`Calculation failed: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={`space-y-8 ${className}`}>
        {/* Section: Personal Information & Portfolio */}
        <PersonalInformationSection />
        
        {/* Portfolio Assets in Single Card */}
        <PortfolioAssetsSection />

        {/* Section: Withdrawal Strategy */}
        <WithdrawalStrategySection />

        {/* Section: Income Sources */}
        <IncomeSourcesSection />

        {/* Section: Real Estate */}
        <RealEstateSection />

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {isLoading ? "Calculating..." : "Calculate Retirement Projection"}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default RetirementForm;