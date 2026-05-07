"use client";

import { FC, useEffect, useState } from "react";
import { useForm, useWatch, FormProvider } from "react-hook-form";
import { ReturnsSection } from "@/components/retirement-dashboard/ui/ReturnsSection";
import { PortfolioSection } from "@/components/retirement-dashboard/ui/PortfolioSection";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { InfoIcon } from "lucide-react";

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
      {/* Enhanced Personal Information section with Contributions and Returns */}
      <section className="rounded-xl border p-4 min-h-[200px]">
        <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
        <div className="grid grid-cols-1 gap-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <label htmlFor="timeline.current_age" className="block font-medium text-xs mb-0.5">Age</label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                      <InfoIcon className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-sm px-3 py-1.5 text-xs">
                    Your current age. This is used to calculate your retirement timeline and determine when you'll enter retirement.
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex items-center gap-1">
                <input
                  id="timeline.current_age"
                  type="number"
                  min={18}
                  max={100}
                  {...form.register("timeline.current_age", { valueAsNumber: true })}
                  className="w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
                />
                
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <label htmlFor="timeline.retirement_age" className="block font-medium text-xs mb-0.5">Retire age</label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                      <InfoIcon className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-sm px-3 py-1.5 text-xs">
                    The age at which you plan to retire. This determines your retirement timeline and affects investment strategy.
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex items-center gap-1">
                <input
                  id="timeline.retirement_age"
                  type="number"
                  min={18}
                  max={100}
                  {...form.register("timeline.retirement_age", { valueAsNumber: true })}
                  className="w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <label htmlFor="timeline.spouse_age" className="block font-medium text-xs mb-0.5">Spouse age</label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                      <InfoIcon className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-sm px-3 py-1.5 text-xs">
                    Your spouse's age, if applicable. This affects joint retirement planning and Social Security benefits.
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex items-center gap-1">
                <input
                  id="timeline.spouse_age"
                  type="number"
                  min={18}
                  max={100}
                  {...form.register("timeline.spouse_age", { valueAsNumber: true })}
                  className="w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <label htmlFor="timeline.years_in_retirement" className="block font-medium text-xs mb-0.5">Retirement years</label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                      <InfoIcon className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-sm px-3 py-1.5 text-xs">
                    The number of years you expect to spend in retirement. This affects your withdrawal strategy and investment planning.
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex items-center gap-1">
                <input
                  id="timeline.years_in_retirement"
                  type="number"
                  min={1}
                  max={50}
                  {...form.register("timeline.years_in_retirement", { valueAsNumber: true })}
                  className="w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio Assets in Single Card */}
        <div className="mt-3">
          <h4 className="font-medium mb-2">Portfolio Assets</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <label htmlFor="current_assets.investment_portfolio" className="block font-medium text-xs mb-0.5">Investment portfolio</label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                      <InfoIcon className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-sm px-3 py-1.5 text-xs">
                    Taxable brokerage, ETFs, mutual funds balance. This represents your total non-retirement investment assets.
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex items-center gap-1">
                <input
                  id="current_assets.investment_portfolio"
                  type="number"
                  min={0}
                  step={1000}
                  {...form.register("current_assets.investment_portfolio", { valueAsNumber: true })}
                  className="w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">Taxable brokerage, ETFs, mutual funds</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <label htmlFor="current_assets.your_401k_ira" className="block font-medium text-xs mb-0.5">Your 401(k) / IRA</label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                      <InfoIcon className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    Individual retirement account balance. This includes your 401(k), IRA, and other tax-advantaged accounts.
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex items-center gap-1">
                <input
                  id="current_assets.your_401k_ira"
                  type="number"
                  min={0}
                  step={1000}
                  {...form.register("current_assets.your_401k_ira", { valueAsNumber: true })}
                  className="w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">Individual retirement account balance</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <label htmlFor="current_assets.spouse_401k_ira" className="block font-medium text-xs mb-0.5">Spouse 401(k) / IRA</label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                      <InfoIcon className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    Spouse retirement account balance. This includes spouse's 401(k), IRA, and other tax-advantaged accounts.
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex items-center gap-1">
                <input
                  id="current_assets.spouse_401k_ira"
                  type="number"
                  min={0}
                  step={1000}
                  {...form.register("current_assets.spouse_401k_ira", { valueAsNumber: true })}
                  className="w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">Spouse retirement account balance</p>
            </div>
          </div>

          {/* Contributions Section - moved into Portfolio Assets */}
          <div className="mt-3">
            <h4 className="font-medium mb-2">Contributions</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <label htmlFor="current_assets.yearly_contribution" className="block font-medium text-xs mb-0.5">Yearly contribution</label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                        <InfoIcon className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      Amount contributed to retirement accounts annually. This represents your regular investment into retirement savings.
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex items-center gap-1">
                  <input
                    id="current_assets.yearly_contribution"
                    type="number"
                    min={0}
                    step={500}
                    {...form.register("current_assets.yearly_contribution", { valueAsNumber: true })}
                    className="w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <label htmlFor="current_assets.yearly_contribution_increase_pct" className="block font-medium text-xs mb-0.5">
                    Contribution increase %
                  </label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                        <InfoIcon className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      Annual percentage increase in contributions (e.g., 3% for inflation adjustment). This helps maintain purchasing power.
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex items-center gap-1">
                  <input
                    id="current_assets.yearly_contribution_increase_pct"
                    type="number"
                    min={0}
                    max={100}
                    step={0.5}
                    {...form.register("current_assets.yearly_contribution_increase_pct", { valueAsNumber: true })}
                    className="w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 mt-3 pt-2">
                <input
                  id="current_assets.catch_up_contributions"
                  type="checkbox"
                  {...form.register("current_assets.catch_up_contributions")}
                  className="h-3 w-3 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="current_assets.catch_up_contributions" className="text-xs">
                  Catch-up contrib.
                </label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                      <InfoIcon className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    Option for additional contributions after age 50 (e.g., $7,500 instead of $6,500)
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
           <div className="mt-3">
            <ReturnsSection />
          </div>
        </div>
      </section>

      {/* Section: Returns - now integrated into Personal section */}
     

      {/* Section: Withdrawal Strategy */}
      <section className="rounded-xl border p-3 min-h-[200px]">
        <h3 className="text-lg font-semibold mb-3">Withdrawal Strategy</h3>

        <div className="space-y-1 mb-3">
          <label htmlFor="retirement_spending.spending_mode" className="block font-medium text-xs mb-0.5">Spending mode</label>
          <div className="flex items-center gap-1">
            <select
              id="retirement_spending.spending_mode"
              {...form.register("retirement_spending.spending_mode")}
              className="w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
            >
              <option value="four_pct_rule">4% Rule (safe withdrawal rate)</option>
              <option value="manual_withdrawal">Manual Withdrawal Amount</option>
            </select>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                  <InfoIcon className="h-3 w-3 text-muted-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-xs">
                Choose how spending is calculated (4% rule or manual input). The 4% rule provides a safe withdrawal rate, while manual allows custom amounts.
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        <div className="flex items-center space-x-2 mb-3">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              id="retirement_spending.adjust_for_inflation"
              type="checkbox"
              {...form.register("retirement_spending.adjust_for_inflation")}
              className="h-3 w-3 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-xs">Adjust for inflation</span>
          </label>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                <InfoIcon className="h-3 w-3 text-muted-foreground" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-xs">
              Whether to adjust spending for inflation over time. This helps maintain purchasing power throughout retirement.
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Period 1 Configuration - Always visible */}
        <div className="mb-3">
          <h4 className="font-medium mb-2">Period 1</h4>
          <div className="flex flex-wrap gap-2 mb-2">
            <div className="flex-1 min-w-[80px]">
              <label htmlFor="retirement_spending.period_1_start_age" className="block font-medium text-xs mb-0.5">Age</label>
              <div className="flex gap-1">
                <input
                  id="retirement_spending.period_1_start_age"
                  type="number"
                  min={18}
                  max={100}
                  {...form.register("retirement_spending.period_1_start_age", { valueAsNumber: true })}
                  className="w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
                />
                <span className="self-center text-xs">-</span>
                <input
                  id="retirement_spending.period_1_end_age"
                  type="number"
                  min={18}
                  max={120}
                  {...form.register("retirement_spending.period_1_end_age", { valueAsNumber: true })}
                  className="w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                      <InfoIcon className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    Age range for Period 1 of your withdrawal strategy. This defines when this withdrawal approach applies.
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
            
            <div className="flex-1 min-w-[80px]">
              <label htmlFor="retirement_spending.period_1_withdrawal_type" className="block font-medium text-xs mb-0.5">Type</label>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => form.setValue("retirement_spending.period_1_withdrawal_type", "percentage")}
                  className={`flex-1 py-1 px-2 text-xs rounded-md ${
                    form.watch("retirement_spending.period_1_withdrawal_type") === "percentage"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  Pct
                </button>
                <button
                  type="button"
                  onClick={() => form.setValue("retirement_spending.period_1_withdrawal_type", "amount")}
                  className={`flex-1 py-1 px-2 text-xs rounded-md ${
                    form.watch("retirement_spending.period_1_withdrawal_type") === "amount"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  Amt
                </button>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                      <InfoIcon className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    Choose withdrawal strategy type for Period 1: percentage of portfolio or fixed dollar amount.
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
            
            <div className="flex-1 min-w-[80px]">
              <label htmlFor="retirement_spending.period_1_withdrawal_value" className="block font-medium text-xs mb-0.5">Value</label>
              {form.watch("retirement_spending.period_1_withdrawal_type") === "percentage" ? (
                <div className="flex items-center gap-1">
                  <input
                    id="retirement_spending.period_1_withdrawal_pct"
                    type="number"
                    min={0}
                    max={100}
                    step={0.5}
                    {...form.register("retirement_spending.period_1_withdrawal_pct", { valueAsNumber: true })}
                    className="w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
                  />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                        <InfoIcon className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      Percentage of portfolio to withdraw annually (e.g., 4% for 4% rule). This represents a percentage-based withdrawal strategy.
                    </TooltipContent>
                  </Tooltip>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <input
                    id="retirement_spending.period_1_withdrawal_amount"
                    type="number"
                    min={0}
                    step={100}
                    {...form.register("retirement_spending.period_1_withdrawal_amount", { valueAsNumber: true })}
                    className="w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
                  />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                        <InfoIcon className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      Fixed dollar amount to withdraw annually. This represents a fixed dollar withdrawal strategy.
                    </TooltipContent>
                  </Tooltip>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Toggle for Period 2 - next to inflation */}
        <div className="flex items-center space-x-2 mb-3">
          <input
            id="retirement_spending.two_period_mode"
            type="checkbox"
            {...form.register("retirement_spending.two_period_mode")}
            className="h-3 w-3 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label htmlFor="retirement_spending.two_period_mode" className="text-xs">
            Configure Period 2 spending
          </label>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                <InfoIcon className="h-3 w-3 text-muted-foreground" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-xs">
              Enable second period for more complex withdrawal strategies. This allows you to define different spending rules for different age ranges.
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Period 2 Configuration - Only shown when enabled */}
        {form.watch("retirement_spending.two_period_mode") && (
          <div className="mb-3">
            <h4 className="font-medium mb-2">Period 2</h4>
            <div className="flex flex-wrap gap-2 mb-2">
              <div className="flex-1 min-w-[80px]">
                <label htmlFor="retirement_spending.period_2_start_age" className="block font-medium text-xs mb-0.5">Age</label>
                <div className="flex gap-1">
                  <input
                    id="retirement_spending.period_2_start_age"
                    type="number"
                    min={18}
                    max={120}
                    {...form.register("retirement_spending.period_2_start_age", { valueAsNumber: true })}
                    className="w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
                  />
                  <span className="self-center text-xs">-</span>
                  <input
                    id="retirement_spending.period_2_end_age"
                    type="number"
                    min={18}
                    max={120}
                    {...form.register("retirement_spending.period_2_end_age", { valueAsNumber: true })}
                    className="w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
                  />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                        <InfoIcon className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      Age range for Period 2 of your withdrawal strategy. This defines when this withdrawal approach applies.
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              
              <div className="flex-1 min-w-[80px]">
                <label htmlFor="retirement_spending.period_2_withdrawal_type" className="block font-medium text-xs mb-0.5">Type</label>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => form.setValue("retirement_spending.period_2_withdrawal_type", "percentage")}
                    className={`flex-1 py-1 px-2 text-xs rounded-md ${
                      form.watch("retirement_spending.period_2_withdrawal_type") === "percentage"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    Pct
                  </button>
                  <button
                    type="button"
                    onClick={() => form.setValue("retirement_spending.period_2_withdrawal_type", "amount")}
                    className={`flex-1 py-1 px-2 text-xs rounded-md ${
                      form.watch("retirement_spending.period_2_withdrawal_type") === "amount"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    Amt
                  </button>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                        <InfoIcon className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      Choose withdrawal strategy type for Period 2: percentage of portfolio or fixed dollar amount.
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
              
              <div className="flex-1 min-w-[80px]">
                <label htmlFor="retirement_spending.period_2_withdrawal_value" className="block font-medium text-xs mb-0.5">Value</label>
                {form.watch("retirement_spending.period_2_withdrawal_type") === "percentage" ? (
                  <div className="flex items-center gap-1">
                    <input
                      id="retirement_spending.period_2_withdrawal_pct"
                      type="number"
                      min={0}
                      max={100}
                      step={0.5}
                      {...form.register("retirement_spending.period_2_withdrawal_pct", { valueAsNumber: true })}
                      className="w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
                    />
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                          <InfoIcon className="h-3 w-3 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        Percentage of portfolio to withdraw annually (e.g., 4% for 4% rule). This represents a percentage-based withdrawal strategy.
                      </TooltipContent>
                    </Tooltip>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <input
                      id="retirement_spending.period_2_withdrawal_amount"
                      type="number"
                      min={0}
                      step={100}
                      {...form.register("retirement_spending.period_2_withdrawal_amount", { valueAsNumber: true })}
                      className="w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
                    />
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                          <InfoIcon className="h-3 w-3 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        Fixed dollar amount to withdraw annually. This represents a fixed dollar withdrawal strategy.
                      </TooltipContent>
                    </Tooltip>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Section: Income Sources */}
      <section className="rounded-xl border p-6 min-h-[200px]">
        <h3 className="text-lg font-semibold mb-4">Income Sources</h3>

        <div className="space-y-6">
          {/* Social Security - You */}
          <div className="rounded-lg border p-4 space-y-4">
            <h4 className="font-medium text-xs">Social Security (You)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="income_streams.social_security_you.claim_age" className="block font-medium text-xs mb-0.5">Claim age</label>
                <div className="flex items-center gap-1">
                  <input
                    id="income_streams.social_security_you.claim_age"
                    type="number"
                    min={62}
                    max={70}
                    {...form.register("income_streams.social_security_you.claim_age", { valueAsNumber: true })}
                    className="w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
                  />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                        <InfoIcon className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      The age at which you plan to claim Social Security benefits. Claiming earlier reduces monthly payments, while waiting increases them.
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="income_streams.social_security_you.yearly_amount_today_dollars" className="block font-medium text-xs mb-0.5">
                  Yearly amount (today's dollars)
                </label>
                <div className="flex items-center gap-1">
                  <input
                    id="income_streams.social_security_you.yearly_amount_today_dollars"
                    type="number"
                    min={0}
                    step={100}
                    {...form.register("income_streams.social_security_you.yearly_amount_today_dollars", { valueAsNumber: true })}
                    className="w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
                  />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                        <InfoIcon className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      The annual Social Security benefit amount you expect to receive, adjusted for today's purchasing power.
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>

          {/* Social Security - Spouse */}
          <div className="rounded-lg border p-4 space-y-4">
            <h4 className="font-medium text-xs">Social Security (Spouse)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="income_streams.social_security_spouse.claim_age" className="block font-medium text-xs mb-0.5">Claim age</label>
                <div className="flex items-center gap-1">
                  <input
                    id="income_streams.social_security_spouse.claim_age"
                    type="number"
                    min={62}
                    max={70}
                    {...form.register("income_streams.social_security_spouse.claim_age", { valueAsNumber: true })}
                    className="w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
                  />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                        <InfoIcon className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      The age at which your spouse plans to claim Social Security benefits. Claiming earlier reduces monthly payments, while waiting increases them.
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="income_streams.social_security_spouse.yearly_amount_today_dollars" className="block font-medium text-xs mb-0.5">
                  Yearly amount (today's dollars)
                </label>
                <div className="flex items-center gap-1">
                  <input
                    id="income_streams.social_security_spouse.yearly_amount_today_dollars"
                    type="number"
                    min={0}
                    step={100}
                    {...form.register("income_streams.social_security_spouse.yearly_amount_today_dollars", { valueAsNumber: true })}
                    className="w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
                  />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                        <InfoIcon className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      The annual Social Security benefit amount your spouse expects to receive, adjusted for today's purchasing power.
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>

          {/* Pension 1 */}
          <div className="rounded-lg border p-4 space-y-4">
            <h4 className="font-medium text-xs">Pension 1</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="income_streams.pension_1.starting_age" className="block font-medium text-xs mb-0.5">Starting age</label>
                <div className="flex items-center gap-1">
                  <input
                    id="income_streams.pension_1.starting_age"
                    type="number"
                    min={18}
                    max={100}
                    {...form.register("income_streams.pension_1.starting_age", { valueAsNumber: true })}
                    className="w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
                  />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                        <InfoIcon className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      The age at which your pension benefits begin. This determines when you'll start receiving pension payments.
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="income_streams.pension_1.yearly_amount" className="block font-medium text-xs mb-0.5">Yearly amount</label>
                <div className="flex items-center gap-1">
                  <input
                    id="income_streams.pension_1.yearly_amount"
                    type="number"
                    min={0}
                    step={100}
                    {...form.register("income_streams.pension_1.yearly_amount", { valueAsNumber: true })}
                    className="w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
                  />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                        <InfoIcon className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      The annual pension benefit amount you expect to receive, adjusted for today's purchasing power.
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>

          {/* Pension 2 */}
          <div className="rounded-lg border p-4 space-y-4">
            <h4 className="font-medium text-xs">Pension 2 (optional)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="income_streams.pension_2.starting_age" className="block font-medium text-xs mb-0.5">Starting age</label>
                <div className="flex items-center gap-1">
                  <input
                    id="income_streams.pension_2.starting_age"
                    type="number"
                    min={18}
                    max={100}
                    {...form.register("income_streams.pension_2.starting_age", { valueAsNumber: true })}
                    className="w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
                  />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                        <InfoIcon className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      The age at which your second pension benefits begin. This determines when you'll start receiving pension payments.
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="income_streams.pension_2.yearly_amount" className="block font-medium text-xs mb-0.5">Yearly amount</label>
                <div className="flex items-center gap-1">
                  <input
                    id="income_streams.pension_2.yearly_amount"
                    type="number"
                    min={0}
                    step={100}
                    {...form.register("income_streams.pension_2.yearly_amount", { valueAsNumber: true })}
                    className="w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
                  />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                        <InfoIcon className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      The annual pension benefit amount you expect to receive from your second pension, adjusted for today's purchasing power.
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>

          {/* Rental Properties */}
          <div className="rounded-lg border p-4 space-y-4">
            <h4 className="font-medium text-xs">Rental Income (up to 3 properties)</h4>

            {[0, 1, 2].map((index) => (
              <div key={index} className="space-y-3 border-t pt-4">
                <h5 className="text-xs font-semibold uppercase text-gray-500">Property {index + 1}</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label htmlFor={`income_streams.rental_properties.${index}.property_name`} className="block font-medium text-xs mb-0.5">Name</label>
                    <div className="flex items-center gap-1">
                      <input
                        id={`income_streams.rental_properties.${index}.property_name`}
                        {...form.register(`income_streams.rental_properties.${index}.property_name`)}
                        className="w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
                        placeholder="Property A"
                      />
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                            <InfoIcon className="h-3 w-3 text-muted-foreground" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-xs">
                          Name or identifier for this rental property.
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor={`income_streams.rental_properties.${index}.net_annual_income`} className="block font-medium text-xs mb-0.5">
                      Net annual income
                    </label>
                    <div className="flex items-center gap-1">
                      <input
                        id={`income_streams.rental_properties.${index}.net_annual_income`}
                        type="number"
                        min={0}
                        step={500}
                        {...form.register(`income_streams.rental_properties.${index}.net_annual_income`, { valueAsNumber: true })}
                        className="w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
                      />
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                            <InfoIcon className="h-3 w-3 text-muted-foreground" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-xs">
                          Net annual income from this rental property after all expenses (taxes, maintenance, vacancies).
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor={`income_streams.rental_properties.${index}.until_age`} className="block font-medium text-xs mb-0.5">Until age</label>
                    <div className="flex items-center gap-1">
                      <input
                        id={`income_streams.rental_properties.${index}.until_age`}
                        type="number"
                        min={18}
                        max={120}
                        {...form.register(`income_streams.rental_properties.${index}.until_age`, { valueAsNumber: true })}
                        className="w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
                      />
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                            <InfoIcon className="h-3 w-3 text-muted-foreground" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-xs">
                          Age at which you expect to stop receiving income from this rental property (e.g., when selling the property).
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section: Real Estate */}
      <section className="rounded-xl border p-6 min-h-[200px]">
        <h3 className="text-lg font-semibold mb-4">Real Estate</h3>

        {/* Primary Home */}
        <div className="space-y-4 mb-6">
          <h4 className="font-medium text-xs">Primary Home</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label htmlFor="real_estate.total_property_value" className="block font-medium text-xs mb-0.5">Total property value</label>
              <div className="flex items-center gap-1">
                <input
                  id="real_estate.total_property_value"
                  type="number"
                  min={0}
                  step={5000}
                  {...form.register("real_estate.total_property_value", { valueAsNumber: true })}
                  className="w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                      <InfoIcon className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    Total value of your primary home, including land and improvements.
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="real_estate.total_outstanding_mortgages" className="block font-medium text-xs mb-0.5">Outstanding mortgage(s)</label>
              <div className="flex items-center gap-1">
                <input
                  id="real_estate.total_outstanding_mortgages"
                  type="number"
                  min={0}
                  step={1000}
                  {...form.register("real_estate.total_outstanding_mortgages", { valueAsNumber: true })}
                  className="w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                      <InfoIcon className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    Total outstanding balance on all mortgages secured by your primary home.
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="real_estate.annual_appreciation_pct" className="block font-medium text-xs mb-0.5">Annual appreciation %</label>
              <div className="flex items-center gap-1">
                <input
                  id="real_estate.annual_appreciation_pct"
                  type="number"
                  min={0}
                  max={20}
                  step={0.1}
                  {...form.register("real_estate.annual_appreciation_pct", { valueAsNumber: true })}
                  className="w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                      <InfoIcon className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    Expected annual appreciation rate of your primary home's value. Historical average is ~3%.
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>

        {/* Rental Properties */}
        <div className="space-y-4 mb-6">
          <h4 className="font-medium text-xs">Rental Properties (up to 3)</h4>

          {[0, 1, 2].map((index) => (
            <div key={index} className="space-y-3 border-t pt-4">
              <h5 className="text-xs font-semibold uppercase text-gray-500">Property {index + 1}</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label htmlFor={`real_estate.rental_properties.${index}.property_name`} className="block font-medium text-xs mb-0.5">Name</label>
                  <div className="flex items-center gap-1">
                    <input
                      id={`real_estate.rental_properties.${index}.property_name`}
                      {...form.register(`real_estate.rental_properties.${index}.property_name` as any)}
                      className="w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
                      placeholder="Rental A"
                    />
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                          <InfoIcon className="h-3 w-3 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        Name or identifier for this rental property.
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor={`real_estate.rental_properties.${index}.value`} className="block font-medium text-xs mb-0.5">Property value</label>
                  <div className="flex items-center gap-1">
                    <input
                      id={`real_estate.rental_properties.${index}.value`}
                      type="number"
                      min={0}
                      step={5000}
                      {...form.register(`real_estate.rental_properties.${index}.value`, { valueAsNumber: true })}
                      className="w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
                    />
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                          <InfoIcon className="h-3 w-3 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        Total value of this rental property including land and improvements.
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor={`real_estate.rental_properties.${index}.net_annual_income`} className="block font-medium text-xs mb-0.5">
                    Net annual income
                  </label>
                  <div className="flex items-center gap-1">
                    <input
                      id={`real_estate.rental_properties.${index}.net_annual_income`}
                      type="number"
                      min={0}
                      step={500}
                      {...form.register(`real_estate.rental_properties.${index}.net_annual_income`, { valueAsNumber: true })}
                      className="w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
                    />
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                          <InfoIcon className="h-3 w-3 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        Net annual income from this rental property after all expenses (taxes, maintenance, vacancies).
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Downsizing Plan */}
        <div className="space-y-4">
          <h4 className="font-medium text-xs">Downsizing Plan</h4>

          <label className="flex items-center space-x-3 cursor-pointer mb-4">
            <input
              id="real_estate.model_property_sale"
              type="checkbox"
              {...form.register("real_estate.model_property_sale")}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span>Model planned property sale (downsizing in retirement)</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                  <InfoIcon className="h-3 w-3 text-muted-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-xs">
                Check if you plan to sell a property during retirement to supplement income.
              </TooltipContent>
            </Tooltip>
          </label>

          {form.watch("real_estate.model_property_sale") && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="real_estate.age_of_sale" className="block font-medium text-xs mb-0.5">Age of sale</label>
                  <div className="flex items-center gap-1">
                    <input
                      id="real_estate.age_of_sale"
                      type="number"
                      min={18}
                      max={100}
                      {...form.register("real_estate.age_of_sale", { valueAsNumber: true })}
                      className="w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
                    />
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                          <InfoIcon className="h-3 w-3 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        Age at which you plan to sell the property. This affects your retirement timeline and income planning.
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="real_estate.amount_rolled_into_portfolio" className="block font-medium text-xs mb-0.5">
                    Amount rolled into portfolio
                  </label>
                  <div className="flex items-center gap-1">
                    <input
                      id="real_estate.amount_rolled_into_portfolio"
                      type="number"
                      min={0}
                      step={5000}
                      {...form.register("real_estate.amount_rolled_into_portfolio", { valueAsNumber: true })}
                      className="w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
                    />
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                          <InfoIcon className="h-3 w-3 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        Amount from the property sale that will be added to your investment portfolio.
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

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
