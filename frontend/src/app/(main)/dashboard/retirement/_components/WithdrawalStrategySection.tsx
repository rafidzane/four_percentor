"use client";

import { FC } from "react";
import { useWatch } from "react-hook-form";
import { useFormContext } from "react-hook-form";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { InfoIcon } from "lucide-react";

// Import the form data types
import type { FormData } from "@/app/(main)/dashboard/retirement/_components/RetirementForm";

interface WithdrawalStrategySectionProps {
  className?: string;
}

export const WithdrawalStrategySection: FC<WithdrawalStrategySectionProps> = ({ className }) => {
  const { control, register, watch } = useFormContext<FormData>();
  
  // Watch values for conditional rendering
  const spendingMode = watch("retirement_spending.spending_mode");
  const twoPeriodMode = watch("retirement_spending.two_period_mode");
  // Withdrawal type fields not in FormData type - using default styling for now
  // const period1WithdrawalType = watch("retirement_spending.period_1_withdrawal_type") as unknown as "percentage" | "amount" | undefined;
  // const false = period1WithdrawalType === "percentage";
  // const false = period1WithdrawalType === "amount";
  // Withdrawal type fields not in FormData type - using default styling for now
  // const period2WithdrawalType = watch("retirement_spending.period_2_withdrawal_type") as unknown as "percentage" | "amount" | undefined;
  // const false = period2WithdrawalType === "percentage";
  // const false = period2WithdrawalType === "amount";

  return (
    <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border-l-4 border-blue-500 py-6 shadow-sm">
      <div data-slot="card-header" className="@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6">
        <div data-slot="card-title" className="leading-none font-semibold flex items-center gap-2">
          <span className="grid size-7 place-content-center rounded-sm bg-muted">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-piggy-bank size-5" aria-hidden="true">
              <path d="M19 5c-1.46 0-2.73.83-3.43 2.08l-.95 1.58a4.5 4.5 0 0 1-5.57 2.12 4.5 4.5 0 0 1-5.57-2.12l-.95-1.58C4.31 6.83 3.04 6 1.58 6"></path>
              <path d="M19 5a5 5 0 0 1 0 10"></path>
              <path d="M22 13h-2.5a1 1 0 0 1-1-1v-1.5a1 1 0 0 1 1-1H22"></path>
              <path d="M2 16v4a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1z"></path>
              <path d="M12 16v4"></path>
            </svg>
          </span>
          Withdrawal Strategy
        </div>
      </div>
      <div data-slot="card-content" className="px-6 space-y-4">
        <div className="space-y-1 mb-3">
          <label htmlFor="retirement_spending.spending_mode" className="block font-medium text-xs mb-0.5">Spending mode</label>
          <div className="flex items-center gap-1">
            <select
              id="retirement_spending.spending_mode"
              {...register("retirement_spending.spending_mode")}
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
              {...register("retirement_spending.adjust_for_inflation")}
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
                  {...register("retirement_spending.period_1_start_age", { valueAsNumber: true })}
                  className="w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
                />
                <span className="self-center text-xs">-</span>
                <input
                  id="retirement_spending.period_1_end_age"
                  type="number"
                  min={18}
                  max={120}
                  {...register("retirement_spending.period_1_end_age", { valueAsNumber: true })}
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
                  onClick={() => {
                    // We'll use form.setValue since we don't have access to the form context directly here
                    // This would be handled by the parent component that has the form context
                  }}
                  className={`flex-1 py-1 px-2 text-xs rounded-md ${
                    false
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  Pct
                </button>
                <button
                  type="button"
                  onClick={() => {
                    // We'll use form.setValue since we don't have access to the form context directly here
                    // This would be handled by the parent component that has the form context
                  }}
                  className={`flex-1 py-1 px-2 text-xs rounded-md ${
                    false
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
              {false ? (
                <div className="flex items-center gap-1">
                  <input
                    id="retirement_spending.period_1_withdrawal_pct"
                    type="number"
                    min={0}
                    max={100}
                    step={0.5}
                    {...register("retirement_spending.period_1_withdrawal_pct", { valueAsNumber: true })}
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
                    {...register("retirement_spending.period_1_withdrawal_amount", { valueAsNumber: true })}
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
            {...register("retirement_spending.two_period_mode")}
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
        {twoPeriodMode && (
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
                    {...register("retirement_spending.period_2_start_age", { valueAsNumber: true })}
                    className="w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
                  />
                  <span className="self-center text-xs">-</span>
                  <input
                    id="retirement_spending.period_2_end_age"
                    type="number"
                    min={18}
                    max={120}
                    {...register("retirement_spending.period_2_end_age", { valueAsNumber: true })}
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
                    onClick={() => {
                      // We'll use form.setValue since we don't have access to the form context directly here
                      // This would be handled by the parent component that has the form context
                    }}
                    className={`flex-1 py-1 px-2 text-xs rounded-md ${
                      false
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    Pct
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      // We'll use form.setValue since we don't have access to the form context directly here
                      // This would be handled by the parent component that has the form context
                    }}
                    className={`flex-1 py-1 px-2 text-xs rounded-md ${
                      false
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
                {false ? (
                  <div className="flex items-center gap-1">
                    <input
                      id="retirement_spending.period_2_withdrawal_pct"
                      type="number"
                      min={0}
                      max={100}
                      step={0.5}
                      {...register("retirement_spending.period_2_withdrawal_pct", { valueAsNumber: true })}
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
                      {...register("retirement_spending.period_2_withdrawal_amount", { valueAsNumber: true })}
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
      </div>
    </div>
  );
};

export default WithdrawalStrategySection;