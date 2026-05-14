"use client";

import { FC, useMemo } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { InfoIcon, CoinsIcon, WalletIcon, BuildingIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Import the form data types and validation components
import type { FormData } from "@/app/(main)/dashboard/retirement/_components/RetirementForm";
import { ValidationError, ErrorBanner } from "@/components/retirement-dashboard/ui/ValidationErrors";

interface IncomeSourcesSectionProps {
  className?: string;
}

export const IncomeSourcesSection: FC<IncomeSourcesSectionProps> = ({ className }) => {
  const { control, register, watch, formState: { errors } } = useFormContext<FormData>();

  // Helper to render input field with tooltip and validation
  const renderInput = (
    name: string,
    label: string,
    type: "number" | "text" = "number",
    min?: number,
    max?: number,
    step?: number,
    tooltip: string = "",
    placeholder?: string
  ) => {
    return (
      <Controller
        name={name}
        control={control}
        rules={{
          min: min !== undefined ? { value: min, message: `Value must be at least ${min}` } : undefined,
          max: max !== undefined ? { value: max, message: `Value cannot exceed ${max}` } : undefined,
          minLength: placeholder ? { value: 1, message: "This field is required" } : undefined,
        }}
        render={({ field }) => (
          <>
            <input
              id={name}
              type={type}
              step={step}
              placeholder={placeholder}
              {...field}
              className={`w-full rounded-md border bg-transparent px-2 py-1.5 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none transition-colors ${
                errors.income_streams?.[name.split(".")[1]] ? "border-red-300 dark:border-red-800" : ""
              }`}
            />
            {errors.income_streams?.[name.split(".")[1]] && (
              <ValidationError field={name} message={errors.income_streams[name.split(".")[1]]?.message ?? "Invalid value"} />
            )}
          </>
        )}
      />
    );
  };

  return (
    <section data-slot="card" className={cn(
      "group relative overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md",
      className
    )}>
      {/* Decorative accent bar */}
      <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-emerald-500 via-teal-500 to-cyan-500 opacity-80 transition-all group-hover:opacity-100" />

      {/* Header Section */}
      <div className="relative px-4 py-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="grid size-7 place-content-center rounded-md bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-100 dark:border-emerald-800/50 shadow-inner">
            <CoinsIcon className="size-4 text-emerald-600 dark:text-teal-400" />
          </div>
          <h2 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Income Sources
          </h2>
        </div>
      </div>

      {/* Card Content */}
      <div data-slot="card-content" className="px-4 py-3 space-y-4">

        {/* Social Security - You */}
        <div className="rounded-xl border border-emerald-100 dark:border-emerald-900/30 bg-white dark:bg-slate-800/50 p-4 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center gap-2 mb-3">
            <CoinsIcon className="size-5 text-emerald-600 dark:text-teal-400" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">Social Security (You)</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Claim Age */}
            <div className="space-y-2">
              <label htmlFor="income_streams.social_security_you.claim_age" className="block font-medium text-xs mb-0.5 flex items-center gap-1">
                Claim Age
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-4 w-4 p-0 hover:bg-transparent">
                      <InfoIcon className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-sm px-3 py-1.5 text-xs bg-slate-900 dark:bg-slate-800">
                    The age at which you plan to claim Social Security benefits. Claiming earlier reduces monthly payments, while waiting increases them.
                  </TooltipContent>
                </Tooltip>
              </label>
              <div className="relative">
                {renderInput(
                  "income_streams.social_security_you.claim_age",
                  "",
                  "number",
                  62,
                  70,
                  undefined,
                  "Claim age must be between 62 and 70"
                )}
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">ages 62-70</span>
              </div>
            </div>

            {/* Yearly Amount */}
            <div className="space-y-2">
              <label htmlFor="income_streams.social_security_you.yearly_amount_today_dollars" className="block font-medium text-xs mb-0.5 flex items-center gap-1">
                Yearly Amount (Today's $)
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-4 w-4 p-0 hover:bg-transparent">
                      <InfoIcon className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-sm px-3 py-1.5 text-xs bg-slate-900 dark:bg-slate-800">
                    The annual Social Security benefit amount you expect to receive, adjusted for today's purchasing power.
                  </TooltipContent>
                </Tooltip>
              </label>
              <div className="relative">
                {renderInput(
                  "income_streams.social_security_you.yearly_amount_today_dollars",
                  "",
                  "number",
                  0,
                  undefined,
                  100,
                  "Yearly amount cannot be negative"
                )}
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">$</span>
              </div>
            </div>
          </div>
        </div>

        {/* Social Security - Spouse */}
        <div className="rounded-xl border border-emerald-100 dark:border-emerald-900/30 bg-white dark:bg-slate-800/50 p-4 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center gap-2 mb-3">
            <WalletIcon className="size-5 text-teal-600 dark:text-emerald-400" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">Social Security (Spouse)</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Claim Age */}
            <div className="space-y-2">
              <label htmlFor="income_streams.social_security_spouse.claim_age" className="block font-medium text-xs mb-0.5 flex items-center gap-1">
                Claim Age
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-4 w-4 p-0 hover:bg-transparent">
                      <InfoIcon className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-sm px-3 py-1.5 text-xs bg-slate-900 dark:bg-slate-800">
                    The age at which your spouse plans to claim Social Security benefits.
                  </TooltipContent>
                </Tooltip>
              </label>
              <div className="relative">
                {renderInput(
                  "income_streams.social_security_spouse.claim_age",
                  "",
                  "number",
                  62,
                  70,
                  undefined,
                  "Claim age must be between 62 and 70"
                )}
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">ages 62-70</span>
              </div>
            </div>

            {/* Yearly Amount */}
            <div className="space-y-2">
              <label htmlFor="income_streams.social_security_spouse.yearly_amount_today_dollars" className="block font-medium text-xs mb-0.5 flex items-center gap-1">
                Yearly Amount (Today's $)
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-4 w-4 p-0 hover:bg-transparent">
                      <InfoIcon className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-sm px-3 py-1.5 text-xs bg-slate-900 dark:bg-slate-800">
                    The annual Social Security benefit amount your spouse expects to receive.
                  </TooltipContent>
                </Tooltip>
              </label>
              <div className="relative">
                {renderInput(
                  "income_streams.social_security_spouse.yearly_amount_today_dollars",
                  "",
                  "number",
                  0,
                  undefined,
                  100,
                  "Yearly amount cannot be negative"
                )}
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">$</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pension 1 */}
        <div className="rounded-xl border border-emerald-100 dark:border-emerald-900/30 bg-white dark:bg-slate-800/50 p-4 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center gap-2 mb-3">
            <BuildingIcon className="size-5 text-teal-600 dark:text-emerald-400" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">Pension 1</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Starting Age */}
            <div className="space-y-2">
              <label htmlFor="income_streams.pension_1.starting_age" className="block font-medium text-xs mb-0.5 flex items-center gap-1">
                Starting Age
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-4 w-4 p-0 hover:bg-transparent">
                      <InfoIcon className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-sm px-3 py-1.5 text-xs bg-slate-900 dark:bg-slate-800">
                    The age at which your pension benefits begin.
                  </TooltipContent>
                </Tooltip>
              </label>
              <div className="relative">
                {renderInput(
                  "income_streams.pension_1.starting_age",
                  "",
                  "number",
                  18,
                  100,
                  undefined,
                  "Starting age must be between 18 and 100"
                )}
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">age</span>
              </div>
            </div>

            {/* Yearly Amount */}
            <div className="space-y-2">
              <label htmlFor="income_streams.pension_1.yearly_amount" className="block font-medium text-xs mb-0.5 flex items-center gap-1">
                Yearly Amount
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-4 w-4 p-0 hover:bg-transparent">
                      <InfoIcon className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-sm px-3 py-1.5 text-xs bg-slate-900 dark:bg-slate-800">
                    The annual pension benefit amount you expect to receive, adjusted for today's purchasing power.
                  </TooltipContent>
                </Tooltip>
              </label>
              <div className="relative">
                {renderInput(
                  "income_streams.pension_1.yearly_amount",
                  "",
                  "number",
                  0,
                  undefined,
                  100,
                  "Yearly amount cannot be negative"
                )}
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">$</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pension 2 */}
        <div className="rounded-xl border border-emerald-100 dark:border-emerald-900/30 bg-white dark:bg-slate-800/50 p-4 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center gap-2 mb-3">
            <BuildingIcon className="size-5 text-teal-600 dark:text-emerald-400" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">Pension 2 (optional)</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Starting Age */}
            <div className="space-y-2">
              <label htmlFor="income_streams.pension_2.starting_age" className="block font-medium text-xs mb-0.5 flex items-center gap-1">
                Starting Age
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-4 w-4 p-0 hover:bg-transparent">
                      <InfoIcon className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-sm px-3 py-1.5 text-xs bg-slate-900 dark:bg-slate-800">
                    The age at which your second pension benefits begin.
                  </TooltipContent>
                </Tooltip>
              </label>
              <div className="relative">
                {renderInput(
                  "income_streams.pension_2.starting_age",
                  "",
                  "number",
                  18,
                  100,
                  undefined,
                  "Starting age must be between 18 and 100"
                )}
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">age</span>
              </div>
            </div>

            {/* Yearly Amount */}
            <div className="space-y-2">
              <label htmlFor="income_streams.pension_2.yearly_amount" className="block font-medium text-xs mb-0.5 flex items-center gap-1">
                Yearly Amount
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-4 w-4 p-0 hover:bg-transparent">
                      <InfoIcon className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-sm px-3 py-1.5 text-xs bg-slate-900 dark:bg-slate-800">
                    The annual pension benefit amount you expect to receive from your second pension.
                  </TooltipContent>
                </Tooltip>
              </label>
              <div className="relative">
                {renderInput(
                  "income_streams.pension_2.yearly_amount",
                  "",
                  "number",
                  0,
                  undefined,
                  100,
                  "Yearly amount cannot be negative"
                )}
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">$</span>
              </div>
            </div>
          </div>
        </div>

        {/* Rental Properties */}
        <div className="rounded-xl border border-emerald-100 dark:border-emerald-900/30 bg-white dark:bg-slate-800/50 p-4 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center gap-2 mb-3">
            <BuildingIcon className="size-5 text-teal-600 dark:text-emerald-400" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">Rental Income (up to 3 properties)</h3>
          </div>

          {[0, 1, 2].map((index) => (
            <div key={index} className="border-t border-slate-100 dark:border-slate-700 pt-4 space-y-3 first:border-0">
              <h4 className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400">Property {index + 1}</h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Property Name */}
                <div className="space-y-2">
                  <label htmlFor={`income_streams.rental_properties.${index}.property_name`} className="block font-medium text-xs mb-0.5 flex items-center gap-1">
                    Property Name
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-4 w-4 p-0 hover:bg-transparent">
                          <InfoIcon className="h-3 w-3 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-sm px-3 py-1.5 text-xs bg-slate-900 dark:bg-slate-800">
                        Name or identifier for this rental property.
                      </TooltipContent>
                    </Tooltip>
                  </label>
                  {renderInput(
                    `income_streams.rental_properties.${index}.property_name`,
                    "",
                    "text",
                    undefined,
                    undefined,
                    undefined,
                    "Property name is required"
                  )}
                </div>

                {/* Net Annual Income */}
                <div className="space-y-2">
                  <label htmlFor={`income_streams.rental_properties.${index}.net_annual_income`} className="block font-medium text-xs mb-0.5 flex items-center gap-1">
                    Net Annual Income
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-4 w-4 p-0 hover:bg-transparent">
                          <InfoIcon className="h-3 w-3 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-sm px-3 py-1.5 text-xs bg-slate-900 dark:bg-slate-800">
                        Net annual income from this rental property after all expenses (taxes, maintenance, vacancies).
                      </TooltipContent>
                    </Tooltip>
                  </label>
                  <div className="relative">
                    {renderInput(
                      `income_streams.rental_properties.${index}.net_annual_income`,
                      "",
                      "number",
                      0,
                      undefined,
                      500,
                      "Net annual income cannot be negative"
                    )}
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">$</span>
                  </div>
                </div>

                {/* Until Age */}
                <div className="space-y-2">
                  <label htmlFor={`income_streams.rental_properties.${index}.until_age`} className="block font-medium text-xs mb-0.5 flex items-center gap-1">
                    Until Age
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-4 w-4 p-0 hover:bg-transparent">
                          <InfoIcon className="h-3 w-3 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-sm px-3 py-1.5 text-xs bg-slate-900 dark:bg-slate-800">
                        Age at which you expect to stop receiving income from this rental property (e.g., when selling the property).
                      </TooltipContent>
                    </Tooltip>
                  </label>
                  <div className="relative">
                    {renderInput(
                      `income_streams.rental_properties.${index}.until_age`,
                      "",
                      "number",
                      18,
                      120,
                      undefined,
                      "Age must be between 18 and 120"
                    )}
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">age</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default IncomeSourcesSection;
