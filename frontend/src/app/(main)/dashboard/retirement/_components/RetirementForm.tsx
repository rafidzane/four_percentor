"use client";

import { FC, useEffect, useState, useMemo } from "react";
import { useForm, useWatch, FormProvider } from "react-hook-form";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { InfoIcon, Loader2 } from "lucide-react";
import { useRetirementCalculation, RetirementResponse as CalculationResult } from "@/hooks/useRetirementCalculation";

// Import section components
import { PersonalInformationSection } from "./PersonalInformationSection";
import { PortfolioAssetsSection } from "./PortfolioAssetsSection";
import { WithdrawalStrategySection } from "./WithdrawalStrategySection";
import { IncomeSourcesSection } from "./IncomeSourcesSection";
import { RealEstateSection } from "./RealEstateSection";

// Loading spinner component for manual calculation button
const LoadingSpinner = () => (
  <Loader2 className="h-4 w-4 animate-spin" />
);

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
  catch_up_contributions?: boolean;
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
  period_1_withdrawal_type?: "percentage" | "amount";
  period_1_withdrawal_amount?: number;
  period_2_start_age?: number;
  period_2_end_age?: number;
  period_2_withdrawal_pct?: number;
  period_2_withdrawal_type?: "percentage" | "amount";
  period_2_withdrawal_amount?: number;
}

export interface FormData {
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
    rental_properties?: Array<{ value: number; net_annual_income: number; until_age: number }>;
  };
}

interface RetirementFormProps {
  className?: string;
  onResult?: (result: CalculationResult) => void;
}

export const RetirementForm: FC<RetirementFormProps> = ({ className, onResult }) => {
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
      period_1_withdrawal_type: "percentage",
      period_2_start_age: 66,
      period_2_end_age: 92,
      period_2_withdrawal_pct: 4,
      period_2_withdrawal_type: "percentage",
    },
  };

  const form = useForm<FormData>({
    defaultValues,
    mode: "onChange",
  });

  // Selective watch - only active sections trigger auto-calculation
  // Personal Information (timeline), Portfolio Assets (current_assets), Withdrawal Strategy (retirement_spending)
  const watchedActiveFields = form.watch(['timeline', 'current_assets', 'portfolio_allocation', 'retirement_spending']);

  // Passive watches - fields that don't trigger calculation but are still accessible
  const incomeStreams = form.watch('income_streams');
  const realEstate = form.watch('real_estate');

  // Auto-calculate with 1 second debounce for active sections only
  // Pass the raw array directly - hook will handle comparison
  const { results, isLoading, isError, error, calculateNow } = useRetirementCalculation(
    watchedActiveFields && Array.isArray(watchedActiveFields) ? {
      timeline: watchedActiveFields[0],
      current_assets: watchedActiveFields[1],
      portfolio_allocation: watchedActiveFields[2],
      retirement_spending: watchedActiveFields[3],
    } : null, 
    1000
  );

  // Handle result updates
  useEffect(() => {
    if (results && onResult) {
      console.log('Setting result:', results.success);
      onResult(results);
    }
  }, [results, onResult]);
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

  return (
    <FormProvider {...form}>
      <form onSubmit={(e) => e.preventDefault()} className={`space-y-8 ${className}`}>
        {/* Section: Personal Information & Portfolio */}
        <PersonalInformationSection />
        
        {/* Portfolio Assets in Single Card */}
        <PortfolioAssetsSection />

        {/* Section: Withdrawal Strategy */}
        <WithdrawalStrategySection />

        {/* Section: Income Sources - Manual calculation required */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="cursor-help">
              <IncomeSourcesSection />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Manual calculation required. Complete all fields and click "Calculate Projection" to submit.</p>
          </TooltipContent>
        </Tooltip>

        {/* Section: Real Estate - Manual calculation required */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="cursor-help">
              <RealEstateSection />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Manual calculation required. Complete all fields and click "Calculate Projection" to submit.</p>
          </TooltipContent>
        </Tooltip>

        {/* Manual Calculate Button */}
        <Button 
          onClick={() => calculateNow()}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <LoadingSpinner />
              Calculating...
            </>
          ) : (
            'Calculate Projection'
          )}
        </Button>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center justify-center py-4 text-sm text-muted-foreground">
            <span className="mr-2">⏳</span>
            Calculating...
          </div>
        )}

        {/* Error Banner */}
        {isError && error && (
          <div className="bg-destructive/10 border border-destructive rounded-lg p-4">
            <p className="text-destructive font-medium">{error.message}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
              className="mt-2 bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Auto-calculation indicator */}
        {!isLoading && !isError && (
          <p className="text-sm text-muted-foreground text-center italic">
            Manual calculation enabled for Income Sources and Real Estate sections
          </p>
        )}
      </form>
    </FormProvider>
  );
};

export default RetirementForm;