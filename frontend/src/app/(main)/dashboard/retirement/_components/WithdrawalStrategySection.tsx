"use client";

import { FC, useMemo, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { InfoIcon, PiggyBankIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Import the form data types and validation components
import type { FormData } from "@/app/(main)/dashboard/retirement/_components/RetirementForm";
import { ValidationError, ErrorBanner } from "@/components/retirement-dashboard/ui/ValidationErrors";

interface WithdrawalStrategySectionProps {
  className?: string;
}

export const WithdrawalStrategySection: FC<WithdrawalStrategySectionProps> = ({ className }) => {
  const { control, register, watch, formState: { errors } } = useFormContext<FormData>();

  // Track withdrawal type for each period
  const [period1WithdrawalType, setPeriod1WithdrawalType] = useState<"amount" | "percentage">("amount");
  const [period2WithdrawalType, setPeriod2WithdrawalType] = useState<"amount" | "percentage">("amount");

  // Get two_period_mode value
  const twoPeriodMode = watch("retirement_spending.two_period_mode");

  const handlePeriod1Toggle = () => {
    setPeriod1WithdrawalType((prev) => (prev === "amount" ? "percentage" : "amount"));
  };

  const handlePeriod2Toggle = () => {
    setPeriod2WithdrawalType((prev) => (prev === "amount" ? "percentage" : "amount"));
  };

  return (
    <section data-slot="card" className={cn(
      "group relative overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md",
      className
    )}>
      {/* Decorative accent bar */}
      <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-purple-600 via-indigo-600 to-blue-600 opacity-80 transition-all group-hover:opacity-100" />

      {/* Header Section */}
      <div className="relative px-4 py-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="grid size-7 place-content-center rounded-md bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 border border-purple-100 dark:border-purple-800/50 shadow-inner">
            <PiggyBankIcon className="size-4 text-purple-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Withdrawal Strategy
          </h2>
        </div>
      </div>

      {/* Card Content */}
      <div data-slot="card-content" className="px-4 py-3 space-y-3">

        {/* Inflation checkbox */}
        <div className="flex items-center space-x-2 mb-2">
          <Controller
            name="retirement_spending.adjust_for_inflation"
            control={control}
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <input
                  id="retirement_spending.adjust_for_inflation"
                  type="checkbox"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-600 transition-colors"
                />
                <label htmlFor="retirement_spending.adjust_for_inflation" className="text-xs font-medium cursor-pointer">
                  Adjust for inflation
                </label>
              </div>
            )}
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                <InfoIcon className="h-3 w-3 text-muted-foreground" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-sm px-3 py-1.5 text-xs">
              Whether to adjust spending for inflation over time. This helps maintain purchasing power throughout retirement.
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Period 1 Configuration - Always visible */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Period 1</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {/* Period 1 Start Age */}
            <div className="space-y-1">
              <label htmlFor="retirement_spending.period_1_start_age" className="block font-medium text-xs mb-0.5">Start Age</label>
              <Controller
                name="retirement_spending.period_1_start_age"
                control={control}
                rules={{
                  min: { value: 18, message: "Age must be at least 18" },
                  max: { value: 100, message: "Age cannot exceed 100" },
                }}
                render={({ field }) => (
                  <>
                    <input
                      id="retirement_spending.period_1_start_age"
                      type="number"
                      {...field}
                      className={`w-full rounded-md border bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none ${
                        errors.retirement_spending?.period_1_start_age ? "border-red-500 ring-red-500" : ""
                      }`}
                    />
                    {errors.retirement_spending?.period_1_start_age && (
                      <ValidationError field="retirement_spending.period_1_start_age" message={errors.retirement_spending.period_1_start_age.message ?? "Invalid value"} />
                    )}
                  </>
                )}
              />
            </div>

            {/* Period 1 End Age */}
            <div className="space-y-1">
              <label htmlFor="retirement_spending.period_1_end_age" className="block font-medium text-xs mb-0.5">End Age</label>
              <Controller
                name="retirement_spending.period_1_end_age"
                control={control}
                rules={{
                  min: { value: 18, message: "Age must be at least 18" },
                  max: { value: 120, message: "Age cannot exceed 120" },
                }}
                render={({ field }) => (
                  <>
                    <input
                      id="retirement_spending.period_1_end_age"
                      type="number"
                      {...field}
                      className={`w-full rounded-md border bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none ${
                        errors.retirement_spending?.period_1_end_age ? "border-red-500 ring-red-500" : ""
                      }`}
                    />
                    {errors.retirement_spending?.period_1_end_age && (
                      <ValidationError field="retirement_spending.period_1_end_age" message={errors.retirement_spending.period_1_end_age.message ?? "Invalid value"} />
                    )}
                  </>
                )}
              />
            </div>

            {/* Period 1 Type */}
            <div className="space-y-1">
              <label htmlFor="retirement_spending.period_1_withdrawal_type" className="block font-medium text-xs mb-0.5">Type</label>
              <Controller
                name="retirement_spending.period_1_withdrawal_type"
                control={control}
                render={() => (
                  <>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handlePeriod1Toggle}
                        className={`text-xs px-3 py-1.5 rounded-md transition-colors ${
                          period1WithdrawalType === "amount"
                            ? "bg-purple-600 text-white hover:bg-purple-700"
                            : "border border-slate-300 dark:border-slate-600 text-muted-foreground hover:text-gray-700 dark:hover:text-gray-300 bg-white dark:bg-slate-900"
                        }`}
                      >
                        Amount
                      </button>
                      <div className="w-[2px] h-5 bg-border rounded-full"></div>
                      <button
                        type="button"
                        onClick={handlePeriod1Toggle}
                        className={`text-xs px-3 py-1.5 rounded-md transition-colors ${
                          period1WithdrawalType === "percentage"
                            ? "bg-purple-600 text-white hover:bg-purple-700"
                            : "border border-slate-300 dark:border-slate-600 text-muted-foreground hover:text-gray-700 dark:hover:text-gray-300 bg-white dark:bg-slate-900"
                        }`}
                      >
                        Percentage
                      </button>
                    </div>
                  </>
                )}
              />
            </div>

            {/* Period 1 Value */}
            <div className="space-y-1 md:col-span-3">
              <label htmlFor="retirement_spending.period_1_withdrawal_value" className="block font-medium text-xs mb-0.5">Value</label>
              {period1WithdrawalType === "percentage" ? (
                <Controller
                  name="retirement_spending.period_1_withdrawal_pct"
                  control={control}
                  rules={{
                    min: { value: 0, message: "Percentage cannot be negative" },
                    max: { value: 100, message: "Percentage cannot exceed 100" },
                  }}
                  render={({ field }) => (
                    <>
                      <div className="flex items-center gap-2">
                        <input
                          id="retirement_spending.period_1_withdrawal_pct"
                          type="number"
                          min={0}
                          max={100}
                          step={0.5}
                          {...field}
                          className={`w-full rounded-md border bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none ${
                            errors.retirement_spending?.period_1_withdrawal_pct ? "border-red-500 ring-red-500" : ""
                          }`}
                        />
                        <span className="text-xs text-muted-foreground">%</span>
                      </div>
                      {errors.retirement_spending?.period_1_withdrawal_pct && (
                        <ValidationError field="retirement_spending.period_1_withdrawal_pct" message={errors.retirement_spending.period_1_withdrawal_pct.message ?? "Invalid value"} />
                      )}
                    </>
                  )}
                />
              ) : (
                <Controller
                  name="retirement_spending.period_1_withdrawal_amount"
                  control={control}
                  rules={{
                    min: { value: 0, message: "Amount cannot be negative" },
                  }}
                  render={({ field }) => (
                    <>
                      <input
                        id="retirement_spending.period_1_withdrawal_amount"
                        type="number"
                        min={0}
                        step={100}
                        {...field}
                        className={`w-full rounded-md border bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none ${
                          errors.retirement_spending?.period_1_withdrawal_amount ? "border-red-500 ring-red-500" : ""
                        }`}
                      />
                      {errors.retirement_spending?.period_1_withdrawal_amount && (
                        <ValidationError field="retirement_spending.period_1_withdrawal_amount" message={errors.retirement_spending.period_1_withdrawal_amount.message ?? "Invalid value"} />
                      )}
                    </>
                  )}
                />
              )}
            </div>
          </div>
        </div>

        {/* Toggle for Period 2 */}
        <div className="flex items-center space-x-2 mb-2">
          <Controller
            name="retirement_spending.two_period_mode"
            control={control}
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <input
                  id="retirement_spending.two_period_mode"
                  type="checkbox"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-600 transition-colors"
                />
                <label htmlFor="retirement_spending.two_period_mode" className="text-xs font-medium cursor-pointer">
                  Configure Period 2 spending
                </label>
              </div>
            )}
          />
        </div>

        {/* Period 2 Configuration - Only shown when enabled */}
        {twoPeriodMode && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Period 2</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {/* Period 2 Start Age */}
              <div className="space-y-1">
                <label htmlFor="retirement_spending.period_2_start_age" className="block font-medium text-xs mb-0.5">Start Age</label>
                <Controller
                  name="retirement_spending.period_2_start_age"
                  control={control}
                  rules={{
                    min: { value: 18, message: "Age must be at least 18" },
                    max: { value: 120, message: "Age cannot exceed 120" },
                  }}
                  render={({ field }) => (
                    <>
                      <input
                        id="retirement_spending.period_2_start_age"
                        type="number"
                        {...field}
                        className={`w-full rounded-md border bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none ${
                          errors.retirement_spending?.period_2_start_age ? "border-red-500 ring-red-500" : ""
                        }`}
                      />
                      {errors.retirement_spending?.period_2_start_age && (
                        <ValidationError field="retirement_spending.period_2_start_age" message={errors.retirement_spending.period_2_start_age.message ?? "Invalid value"} />
                      )}
                    </>
                  )}
                />
              </div>

              {/* Period 2 End Age */}
              <div className="space-y-1">
                <label htmlFor="retirement_spending.period_2_end_age" className="block font-medium text-xs mb-0.5">End Age</label>
                <Controller
                  name="retirement_spending.period_2_end_age"
                  control={control}
                  rules={{
                    min: { value: 18, message: "Age must be at least 18" },
                    max: { value: 120, message: "Age cannot exceed 120" },
                  }}
                  render={({ field }) => (
                    <>
                      <input
                        id="retirement_spending.period_2_end_age"
                        type="number"
                        {...field}
                        className={`w-full rounded-md border bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none ${
                          errors.retirement_spending?.period_2_end_age ? "border-red-500 ring-red-500" : ""
                        }`}
                      />
                      {errors.retirement_spending?.period_2_end_age && (
                        <ValidationError field="retirement_spending.period_2_end_age" message={errors.retirement_spending.period_2_end_age.message ?? "Invalid value"} />
                      )}
                    </>
                  )}
                />
              </div>

              {/* Period 2 Type */}
              <div className="space-y-1">
                <label htmlFor="retirement_spending.period_2_withdrawal_type" className="block font-medium text-xs mb-0.5">Type</label>
                <Controller
                  name="retirement_spending.period_2_withdrawal_type"
                  control={control}
                  render={() => (
                    <>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handlePeriod2Toggle}
                          className={`text-xs px-3 py-1.5 rounded-md transition-colors ${
                            period2WithdrawalType === "amount"
                              ? "bg-purple-600 text-white hover:bg-purple-700"
                              : "border border-slate-300 dark:border-slate-600 text-muted-foreground hover:text-gray-700 dark:hover:text-gray-300 bg-white dark:bg-slate-900"
                          }`}
                        >
                          Amount
                        </button>
                        <div className="w-[2px] h-5 bg-border rounded-full"></div>
                        <button
                          type="button"
                          onClick={handlePeriod2Toggle}
                          className={`text-xs px-3 py-1.5 rounded-md transition-colors ${
                            period2WithdrawalType === "percentage"
                              ? "bg-purple-600 text-white hover:bg-purple-700"
                              : "border border-slate-300 dark:border-slate-600 text-muted-foreground hover:text-gray-700 dark:hover:text-gray-300 bg-white dark:bg-slate-900"
                          }`}
                        >
                          Percentage
                        </button>
                      </div>
                    </>
                  )}
                />
              </div>

              {/* Period 2 Value */}
              <div className="space-y-1 md:col-span-3">
                <label htmlFor="retirement_spending.period_2_withdrawal_value" className="block font-medium text-xs mb-0.5">Value</label>
                {period2WithdrawalType === "percentage" ? (
                  <Controller
                    name="retirement_spending.period_2_withdrawal_pct"
                    control={control}
                    rules={{
                      min: { value: 0, message: "Percentage cannot be negative" },
                      max: { value: 100, message: "Percentage cannot exceed 100" },
                    }}
                    render={({ field }) => (
                      <>
                        <div className="flex items-center gap-2">
                          <input
                            id="retirement_spending.period_2_withdrawal_pct"
                            type="number"
                            min={0}
                            max={100}
                            step={0.5}
                            {...field}
                            className={`w-full rounded-md border bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none ${
                              errors.retirement_spending?.period_2_withdrawal_pct ? "border-red-500 ring-red-500" : ""
                            }`}
                          />
                          <span className="text-xs text-muted-foreground">%</span>
                        </div>
                        {errors.retirement_spending?.period_2_withdrawal_pct && (
                          <ValidationError field="retirement_spending.period_2_withdrawal_pct" message={errors.retirement_spending.period_2_withdrawal_pct.message ?? "Invalid value"} />
                        )}
                      </>
                    )}
                  />
                ) : (
                  <Controller
                    name="retirement_spending.period_2_withdrawal_amount"
                    control={control}
                    rules={{
                      min: { value: 0, message: "Amount cannot be negative" },
                    }}
                    render={({ field }) => (
                      <>
                        <input
                          id="retirement_spending.period_2_withdrawal_amount"
                          type="number"
                          min={0}
                          step={100}
                          {...field}
                          className={`w-full rounded-md border bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none ${
                            errors.retirement_spending?.period_2_withdrawal_amount ? "border-red-500 ring-red-500" : ""
                          }`}
                        />
                        {errors.retirement_spending?.period_2_withdrawal_amount && (
                          <ValidationError field="retirement_spending.period_2_withdrawal_amount" message={errors.retirement_spending.period_2_withdrawal_amount.message ?? "Invalid value"} />
                        )}
                      </>
                    )}
                  />
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default WithdrawalStrategySection;
