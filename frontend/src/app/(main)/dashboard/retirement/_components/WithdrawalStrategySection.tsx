"use client";

import { FC, useEffect } from "react";
import { useFormContext, Controller, useWatch } from "react-hook-form";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { InfoIcon, PiggyBankIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

// Import the form data types and validation components
import type { FormData } from "@/app/(main)/dashboard/retirement/_components/RetirementForm";
import { ValidationError, ErrorBanner } from "@/components/retirement-dashboard/ui/ValidationErrors";

interface WithdrawalStrategySectionProps {
  className?: string;
}

export const WithdrawalStrategySection: FC<WithdrawalStrategySectionProps> = ({ className }) => {
  const { control, watch, formState: { errors }, setValue } = useFormContext<FormData>();

  // Track withdrawal type for each period from form values
  const period1Type = watch("retirement_spending.period_1_withdrawal_type") || "amount";
  const period2Type = watch("retirement_spending.period_2_withdrawal_type") || "amount";

  // Get two_period_mode value
  const twoPeriodMode = watch("retirement_spending.two_period_mode");

  // Watch Period 2 ages for cross-field validation
  const period2StartAge = watch("retirement_spending.period_2_start_age");
  const period2EndAge = watch("retirement_spending.period_2_end_age");

  // Display validation error message for Period 2 end age
  const getPeriod2EndAgeError = () => {
    if (twoPeriodMode && period2StartAge !== undefined && period2EndAge !== undefined) {
      if (period2EndAge <= period2StartAge) {
        return "End age must be greater than start age";
      }
    }
    return errors.retirement_spending?.period_2_end_age?.message;
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
      <div data-slot="card-content" className="px-4 py-3 space-y-6">

        {/* Inflation checkbox */}
        <div className="flex items-center gap-3">
          <Controller
            name="retirement_spending.adjust_for_inflation"
            control={control}
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <input
                  id="retirement_spending.adjust_for_inflation"
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
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
          
          {/* All inputs on one line using flexbox */}
          <div className="flex flex-wrap gap-3 items-end">
            {/* Period 1 Start Age */}
            <div className="space-y-1 min-w-[80px] flex-1">
              <label htmlFor="retirement_spending.period_1_start_age" className="block font-medium text-xs">Start</label>
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
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                      className={`w-full rounded-md border bg-transparent px-2 py-1.5 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none transition-colors ${
                        errors.retirement_spending?.period_1_start_age ? "border-red-500 ring-red-500" : "border-slate-300 dark:border-slate-700"
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
            <div className="space-y-1 min-w-[80px] flex-1">
              <label htmlFor="retirement_spending.period_1_end_age" className="block font-medium text-xs">End</label>
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
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                      className={`w-full rounded-md border bg-transparent px-2 py-1.5 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none transition-colors ${
                        errors.retirement_spending?.period_1_end_age ? "border-red-500 ring-red-500" : "border-slate-300 dark:border-slate-700"
                      }`}
                    />
                    {errors.retirement_spending?.period_1_end_age && (
                      <ValidationError field="retirement_spending.period_1_end_age" message={errors.retirement_spending.period_1_end_age.message ?? "Invalid value"} />
                    )}
                  </>
                )}
              />
            </div>

            {/* Period 1 Type - Switch toggle */}
            <div className="space-y-2 min-w-[140px]">
              <label className="block font-medium text-xs">Type</label>
              <Controller
                name="retirement_spending.period_1_withdrawal_type"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center justify-between gap-2 bg-slate-50 dark:bg-slate-900/50 rounded-lg p-1 border border-slate-200 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => field.onChange("amount")}
                      className={`
                        flex-1 py-1 px-2 text-xs font-medium rounded-md transition-all duration-200 ease-out
                        ${field.value === "amount" 
                          ? "bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-400 shadow-sm ring-1 ring-black/5" 
                          : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"}
                      `}
                    >
                      Amount
                    </button>
                    <Switch
                      checked={field.value === "percentage"}
                      onCheckedChange={(checked) => field.onChange(checked ? "percentage" : "amount")}
                      className="data-[state=unchecked]:bg-slate-300 data-[state=checked]:bg-purple-600"
                    />
                    <button
                      type="button"
                      onClick={() => field.onChange("percentage")}
                      className={`
                        flex-1 py-1 px-2 text-xs font-medium rounded-md transition-all duration-200 ease-out text-center
                        ${field.value === "percentage" 
                          ? "bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-400 shadow-sm ring-1 ring-black/5" 
                          : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"}
                      `}
                    >
                      Percent
                    </button>
                  </div>
                )}
              />
            </div>

            {/* Period 1 Value */}
            <div className="space-y-1 flex-1 min-w-[120px]">
              <label htmlFor="retirement_spending.period_1_withdrawal_value" className="block font-medium text-xs">Value</label>
              {period1Type === "percentage" ? (
                <Controller
                  name="retirement_spending.period_1_withdrawal_pct"
                  control={control}
                  rules={{
                    min: { value: 0, message: "Percentage cannot be negative" },
                    max: { value: 100, message: "Percentage cannot exceed 100" },
                  }}
                  render={({ field }) => (
                    <>
                      <div className="flex items-center rounded-md border bg-transparent px-2 py-1.5 shadow-xs focus-within:border-ring focus-within:ring-ring/50 outline-none transition-colors">
                        <input
                          id="retirement_spending.period_1_withdrawal_pct"
                          type="number"
                          min={0}
                          max={100}
                          step={0.5}
                          value={field.value ?? ''}
                          onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                          className="flex-1 bg-transparent text-xs outline-none"
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
                      <div className="flex items-center rounded-md border bg-transparent px-2 py-1.5 shadow-xs focus-within:border-ring focus-within:ring-ring/50 outline-none transition-colors">
                        <span className="text-xs text-muted-foreground mr-1">$</span>
                        <input
                          id="retirement_spending.period_1_withdrawal_amount"
                          type="number"
                          min={0}
                          step={100}
                          value={field.value ?? ''}
                          onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                          className="flex-1 bg-transparent text-xs outline-none"
                        />
                      </div>
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
        <div className="flex items-center gap-3 border-t pt-4 dark:border-slate-800">
          <div className="flex items-center space-x-2 w-full justify-between cursor-pointer" onClick={() => setValue("retirement_spending.two_period_mode", !twoPeriodMode, { shouldDirty: true })}>
            <input
              id="retirement_spending.two_period_mode"
              type="checkbox"
              checked={twoPeriodMode}
              className="h-3 w-3 rounded border-gray-300 text-purple-600 focus:ring-purple-600 transition-colors cursor-pointer"
              onChange={(e) => setValue("retirement_spending.two_period_mode", e.target.checked, { shouldDirty: true })}
            />
            <label htmlFor="retirement_spending.two_period_mode" className="text-xs font-medium cursor-pointer">
              Configure Period 2 spending
            </label>
          </div>
        </div>

        {/* Period 2 Configuration - Only shown when enabled */}
        {twoPeriodMode && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Period 2</h3>
            
            {/* All inputs on one line using flexbox */}
            <div className="flex flex-wrap gap-3 items-end">
              {/* Period 2 Start Age */}
              <div className="space-y-1 min-w-[80px] flex-1">
                <label htmlFor="retirement_spending.period_2_start_age" className="block font-medium text-xs">Start</label>
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
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                        className={`w-full rounded-md border bg-transparent px-2 py-1.5 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none transition-colors ${
                          errors.retirement_spending?.period_2_start_age ? "border-red-500 ring-red-500" : "border-slate-300 dark:border-slate-700"
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
              <div className="space-y-1 min-w-[80px] flex-1">
                <label htmlFor="retirement_spending.period_2_end_age" className="block font-medium text-xs">End</label>
                <Controller
                  name="retirement_spending.period_2_end_age"
                  control={control}
                  rules={{
                    min: { value: 18, message: "Age must be at least 18" },
                    max: { value: 120, message: "Age cannot exceed 120" },
                  }}
                  render={({ field }) => {
                    const error = getPeriod2EndAgeError();
                    return (
                      <>
                        <input
                          id="retirement_spending.period_2_end_age"
                          type="number"
                          value={field.value ?? ''}
                          onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                          className={`w-full rounded-md border bg-transparent px-2 py-1.5 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none transition-colors ${
                            error ? "border-red-500 ring-red-500" : "border-slate-300 dark:border-slate-700"
                          }`}
                        />
                        {error && (
                          <ValidationError field="retirement_spending.period_2_end_age" message={error} />
                        )}
                      </>
                    );
                  }}
                />
              </div>

              {/* Period 2 Type - Switch toggle */}
              <div className="space-y-2 min-w-[140px]">
                <label className="block font-medium text-xs">Type</label>
                <Controller
                  name="retirement_spending.period_2_withdrawal_type"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center justify-between gap-2 bg-slate-50 dark:bg-slate-900/50 rounded-lg p-1 border border-slate-200 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={() => field.onChange("amount")}
                        className={`
                          flex-1 py-1 px-2 text-xs font-medium rounded-md transition-all duration-200 ease-out
                          ${field.value === "amount" 
                            ? "bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-400 shadow-sm ring-1 ring-black/5" 
                            : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"}
                        `}
                      >
                        Amount
                      </button>
                      <Switch
                        checked={field.value === "percentage"}
                        onCheckedChange={(checked) => field.onChange(checked ? "percentage" : "amount")}
                        className="data-[state=unchecked]:bg-slate-300 data-[state=checked]:bg-purple-600"
                      />
                      <button
                        type="button"
                        onClick={() => field.onChange("percentage")}
                        className={`
                          flex-1 py-1 px-2 text-xs font-medium rounded-md transition-all duration-200 ease-out text-center
                          ${field.value === "percentage" 
                            ? "bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-400 shadow-sm ring-1 ring-black/5" 
                            : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"}
                        `}
                      >
                        Percent
                      </button>
                    </div>
                  )}
                />
              </div>

              {/* Period 2 Value */}
              <div className="space-y-1 flex-1 min-w-[120px]">
                <label htmlFor="retirement_spending.period_2_withdrawal_value" className="block font-medium text-xs">Value</label>
                {period2Type === "percentage" ? (
                  <Controller
                    name="retirement_spending.period_2_withdrawal_pct"
                    control={control}
                    rules={{
                      min: { value: 0, message: "Percentage cannot be negative" },
                      max: { value: 100, message: "Percentage cannot exceed 100" },
                    }}
                    render={({ field }) => (
                      <>
                        <div className="flex items-center rounded-md border bg-transparent px-2 py-1.5 shadow-xs focus-within:border-ring focus-within:ring-ring/50 outline-none transition-colors">
                          <input
                            id="retirement_spending.period_2_withdrawal_pct"
                            type="number"
                            min={0}
                            max={100}
                            step={0.5}
                            value={field.value ?? ''}
                            onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                            className="flex-1 bg-transparent text-xs outline-none"
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
                        <div className="flex items-center rounded-md border bg-transparent px-2 py-1.5 shadow-xs focus-within:border-ring focus-within:ring-ring/50 outline-none transition-colors">
                          <span className="text-xs text-muted-foreground mr-1">$</span>
                          <input
                            id="retirement_spending.period_2_withdrawal_amount"
                            type="number"
                            min={0}
                            step={100}
                            value={field.value ?? ''}
                            onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                            className="flex-1 bg-transparent text-xs outline-none"
                          />
                        </div>
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
