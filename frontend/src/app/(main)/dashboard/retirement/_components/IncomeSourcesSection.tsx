"use client";

import { FC, useMemo } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { InfoIcon, CoinsIcon, WalletIcon, BuildingIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Import the form data types and validation components
import type { FormData } from "@/app/(main)/dashboard/retirement/_components/RetirementForm";
import { ValidationError } from "@/components/retirement-dashboard/ui/ValidationErrors";

interface IncomeSourcesSectionProps {
  className?: string;
}

export const IncomeSourcesSection: FC<IncomeSourcesSectionProps> = ({ className }) => {
  const { control, register, watch, formState: { errors } } = useFormContext<FormData>();

  // Watch values for conditional rendering
  const spouseAge = watch("timeline.spouse_age");

  // Check if spouse info should be shown
  const showSpouseFields = spouseAge !== undefined && spouseAge > 0;

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
      <div data-slot="card-content" className="px-4 py-3 space-y-6">

        {/* Social Security - You and Spouse on same line */}
        <div className="border-t border-slate-100 dark:border-slate-700 pt-4 first:border-0">
          <div className="flex items-center gap-2 mb-3">
            <CoinsIcon className="size-5 text-emerald-600 dark:text-teal-400" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">Social Security</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Claim Age - You */}
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <label htmlFor="income_streams.social_security_you.claim_age" className="block font-medium text-xs mb-0.5">Claim Age (You)</label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                      <InfoIcon className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-sm px-3 py-1.5 text-xs bg-slate-900 dark:bg-slate-800">
                    The age at which you plan to claim Social Security benefits. Claiming earlier reduces monthly payments, while waiting increases them.
                  </TooltipContent>
                </Tooltip>
              </div>
              <Controller
                name="income_streams.social_security_you.claim_age"
                control={control}
                rules={{
                  min: { value: 62, message: "Claim age must be between 62 and 70" },
                  max: { value: 70, message: "Claim age must be between 62 and 70" },
                }}
                render={({ field }) => (
                  <>
                    <input
                      id="income_streams.social_security_you.claim_age"
                      type="number"
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                      className={`w-full rounded-md border bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none ${
                        errors.income_streams?.social_security_you?.claim_age ? "border-red-500 ring-red-500" : ""
                      }`}
                    />
                    {errors.income_streams?.social_security_you?.claim_age && (
                      <ValidationError field="income_streams.social_security_you.claim_age" message={errors.income_streams.social_security_you.claim_age.message ?? "Invalid value"} />
                    )}
                  </>
                )}
              />
              <p className="text-xs text-muted-foreground mt-0.5">ages 62-70</p>
            </div>

            {/* Yearly Amount - You */}
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <label htmlFor="income_streams.social_security_you.yearly_amount_today_dollars" className="block font-medium text-xs mb-0.5">Yearly Amount (Today's $)</label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                      <InfoIcon className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-sm px-3 py-1.5 text-xs bg-slate-900 dark:bg-slate-800">
                    The annual Social Security benefit amount you expect to receive, adjusted for today's purchasing power.
                  </TooltipContent>
                </Tooltip>
              </div>
              <Controller
                name="income_streams.social_security_you.yearly_amount_today_dollars"
                control={control}
                rules={{
                  min: { value: 0, message: "Yearly amount cannot be negative" },
                }}
                render={({ field }) => (
                  <>
                    <input
                      id="income_streams.social_security_you.yearly_amount_today_dollars"
                      type="number"
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                      className={`w-full rounded-md border bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none ${
                        errors.income_streams?.social_security_you?.yearly_amount_today_dollars ? "border-red-500 ring-red-500" : ""
                      }`}
                    />
                    {errors.income_streams?.social_security_you?.yearly_amount_today_dollars && (
                      <ValidationError field="income_streams.social_security_you.yearly_amount_today_dollars" message={errors.income_streams.social_security_you.yearly_amount_today_dollars.message ?? "Invalid value"} />
                    )}
                  </>
                )}
              />
              <p className="text-xs text-muted-foreground mt-0.5">Annual benefit amount</p>
            </div>

            {/* Claim Age - Spouse */}
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <label htmlFor="income_streams.social_security_spouse.claim_age" className="block font-medium text-xs mb-0.5">Claim Age (Spouse)</label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                      <InfoIcon className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-sm px-3 py-1.5 text-xs bg-slate-900 dark:bg-slate-800">
                    The age at which your spouse plans to claim Social Security benefits.
                  </TooltipContent>
                </Tooltip>
              </div>
              <Controller
                name="income_streams.social_security_spouse.claim_age"
                control={control}
                rules={{
                  min: { value: 62, message: "Claim age must be between 62 and 70" },
                  max: { value: 70, message: "Claim age must be between 62 and 70" },
                }}
                render={({ field }) => (
                  <>
                    <input
                      id="income_streams.social_security_spouse.claim_age"
                      type="number"
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                      className={`w-full rounded-md border bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none ${
                        errors.income_streams?.social_security_spouse?.claim_age ? "border-red-500 ring-red-500" : ""
                      }`}
                    />
                    {errors.income_streams?.social_security_spouse?.claim_age && (
                      <ValidationError field="income_streams.social_security_spouse.claim_age" message={errors.income_streams.social_security_spouse.claim_age.message ?? "Invalid value"} />
                    )}
                  </>
                )}
              />
              <p className="text-xs text-muted-foreground mt-0.5">ages 62-70</p>
            </div>

            {/* Yearly Amount - Spouse */}
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <label htmlFor="income_streams.social_security_spouse.yearly_amount_today_dollars" className="block font-medium text-xs mb-0.5">Yearly Amount (Today's $)</label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                      <InfoIcon className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-sm px-3 py-1.5 text-xs bg-slate-900 dark:bg-slate-800">
                    The annual Social Security benefit amount your spouse expects to receive.
                  </TooltipContent>
                </Tooltip>
              </div>
              <Controller
                name="income_streams.social_security_spouse.yearly_amount_today_dollars"
                control={control}
                rules={{
                  min: { value: 0, message: "Yearly amount cannot be negative" },
                }}
                render={({ field }) => (
                  <>
                    <input
                      id="income_streams.social_security_spouse.yearly_amount_today_dollars"
                      type="number"
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                      className={`w-full rounded-md border bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none ${
                        errors.income_streams?.social_security_spouse?.yearly_amount_today_dollars ? "border-red-500 ring-red-500" : ""
                      }`}
                    />
                    {errors.income_streams?.social_security_spouse?.yearly_amount_today_dollars && (
                      <ValidationError field="income_streams.social_security_spouse.yearly_amount_today_dollars" message={errors.income_streams.social_security_spouse.yearly_amount_today_dollars.message ?? "Invalid value"} />
                    )}
                  </>
                )}
              />
              <p className="text-xs text-muted-foreground mt-0.5">Annual benefit amount</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />

        {/* Pension 1 */}
        <div className="border-t border-slate-100 dark:border-slate-700 pt-4 first:border-0">
          <div className="flex items-center gap-2 mb-3">
            <BuildingIcon className="size-5 text-teal-600 dark:text-emerald-400" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">Pension 1</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Starting Age */}
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <label htmlFor="income_streams.pension_1.starting_age" className="block font-medium text-xs mb-0.5">Starting Age</label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                      <InfoIcon className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-sm px-3 py-1.5 text-xs bg-slate-900 dark:bg-slate-800">
                    The age at which your pension benefits begin.
                  </TooltipContent>
                </Tooltip>
              </div>
              <Controller
                name="income_streams.pension_1.starting_age"
                control={control}
                rules={{
                  min: { value: 18, message: "Starting age must be between 18 and 100" },
                  max: { value: 100, message: "Starting age must be between 18 and 100" },
                }}
                render={({ field }) => (
                  <>
                    <input
                      id="income_streams.pension_1.starting_age"
                      type="number"
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                      className={`w-full rounded-md border bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none ${
                        errors.income_streams?.pension_1?.starting_age ? "border-red-500 ring-red-500" : ""
                      }`}
                    />
                    {errors.income_streams?.pension_1?.starting_age && (
                      <ValidationError field="income_streams.pension_1.starting_age" message={errors.income_streams.pension_1.starting_age.message ?? "Invalid value"} />
                    )}
                  </>
                )}
              />
              <p className="text-xs text-muted-foreground mt-0.5">Age when benefits begin</p>
            </div>

            {/* Yearly Amount */}
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <label htmlFor="income_streams.pension_1.yearly_amount" className="block font-medium text-xs mb-0.5">Yearly Amount</label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                      <InfoIcon className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-sm px-3 py-1.5 text-xs bg-slate-900 dark:bg-slate-800">
                    The annual pension benefit amount you expect to receive, adjusted for today's purchasing power.
                  </TooltipContent>
                </Tooltip>
              </div>
              <Controller
                name="income_streams.pension_1.yearly_amount"
                control={control}
                rules={{
                  min: { value: 0, message: "Yearly amount cannot be negative" },
                }}
                render={({ field }) => (
                  <>
                    <input
                      id="income_streams.pension_1.yearly_amount"
                      type="number"
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                      className={`w-full rounded-md border bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none ${
                        errors.income_streams?.pension_1?.yearly_amount ? "border-red-500 ring-red-500" : ""
                      }`}
                    />
                    {errors.income_streams?.pension_1?.yearly_amount && (
                      <ValidationError field="income_streams.pension_1.yearly_amount" message={errors.income_streams.pension_1.yearly_amount.message ?? "Invalid value"} />
                    )}
                  </>
                )}
              />
              <p className="text-xs text-muted-foreground mt-0.5">Annual pension amount</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />

        {/* Pension 2 */}
        <div className="border-t border-slate-100 dark:border-slate-700 pt-4 first:border-0">
          <div className="flex items-center gap-2 mb-3">
            <BuildingIcon className="size-5 text-teal-600 dark:text-emerald-400" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">Pension 2 (optional)</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Starting Age */}
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <label htmlFor="income_streams.pension_2.starting_age" className="block font-medium text-xs mb-0.5">Starting Age</label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                      <InfoIcon className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-sm px-3 py-1.5 text-xs bg-slate-900 dark:bg-slate-800">
                    The age at which your second pension benefits begin.
                  </TooltipContent>
                </Tooltip>
              </div>
              <Controller
                name="income_streams.pension_2.starting_age"
                control={control}
                rules={{
                  min: { value: 18, message: "Starting age must be between 18 and 100" },
                  max: { value: 100, message: "Starting age must be between 18 and 100" },
                }}
                render={({ field }) => (
                  <>
                    <input
                      id="income_streams.pension_2.starting_age"
                      type="number"
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                      className={`w-full rounded-md border bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none ${
                        errors.income_streams?.pension_2?.starting_age ? "border-red-500 ring-red-500" : ""
                      }`}
                    />
                    {errors.income_streams?.pension_2?.starting_age && (
                      <ValidationError field="income_streams.pension_2.starting_age" message={errors.income_streams.pension_2.starting_age.message ?? "Invalid value"} />
                    )}
                  </>
                )}
              />
              <p className="text-xs text-muted-foreground mt-0.5">Age when benefits begin</p>
            </div>

            {/* Yearly Amount */}
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <label htmlFor="income_streams.pension_2.yearly_amount" className="block font-medium text-xs mb-0.5">Yearly Amount</label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                      <InfoIcon className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-sm px-3 py-1.5 text-xs bg-slate-900 dark:bg-slate-800">
                    The annual pension benefit amount you expect to receive from your second pension.
                  </TooltipContent>
                </Tooltip>
              </div>
              <Controller
                name="income_streams.pension_2.yearly_amount"
                control={control}
                rules={{
                  min: { value: 0, message: "Yearly amount cannot be negative" },
                }}
                render={({ field }) => (
                  <>
                    <input
                      id="income_streams.pension_2.yearly_amount"
                      type="number"
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                      className={`w-full rounded-md border bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none ${
                        errors.income_streams?.pension_2?.yearly_amount ? "border-red-500 ring-red-500" : ""
                      }`}
                    />
                    {errors.income_streams?.pension_2?.yearly_amount && (
                      <ValidationError field="income_streams.pension_2.yearly_amount" message={errors.income_streams.pension_2.yearly_amount.message ?? "Invalid value"} />
                    )}
                  </>
                )}
              />
              <p className="text-xs text-muted-foreground mt-0.5">Annual pension amount</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />

        {/* Rental Properties */}
        <div className="border-t border-slate-100 dark:border-slate-700 pt-4 first:border-0">
          <div className="flex items-center gap-2 mb-3">
            <BuildingIcon className="size-5 text-teal-600 dark:text-emerald-400" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">Rental Income (up to 3 properties)</h3>
          </div>

          {[0, 1, 2].map((index) => (
            <div key={index} className="border-t border-slate-100 dark:border-slate-700 pt-4 space-y-2 first:border-0">
              <h4 className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400">Property {index + 1}</h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Property Name */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <label htmlFor={`income_streams.rental_properties.${index}.property_name`} className="block font-medium text-xs mb-0.5">Property Name</label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                          <InfoIcon className="h-3 w-3 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-sm px-3 py-1.5 text-xs bg-slate-900 dark:bg-slate-800">
                        Name or identifier for this rental property.
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Controller
                    name={`income_streams.rental_properties.${index}.property_name`}
                    control={control}
                    rules={{
                      minLength: { value: 1, message: "Property name is required" },
                    }}
                    render={({ field }) => (
                      <>
                        <input
                          id={`income_streams.rental_properties.${index}.property_name`}
                          type="text"
                          value={field.value ?? ''}
                          onChange={(e) => field.onChange(e.target.value)}
                          className={`w-full rounded-md border bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none ${
                            errors.income_streams?.rental_properties?.[index]?.property_name ? "border-red-500 ring-red-500" : ""
                          }`}
                        />
                        {errors.income_streams?.rental_properties?.[index]?.property_name && (
                          <ValidationError field={`income_streams.rental_properties.${index}.property_name`} message={errors.income_streams.rental_properties[index].property_name.message ?? "Invalid value"} />
                        )}
                      </>
                    )}
                  />
                </div>

                {/* Net Annual Income */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <label htmlFor={`income_streams.rental_properties.${index}.net_annual_income`} className="block font-medium text-xs mb-0.5">Net Annual Income</label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                          <InfoIcon className="h-3 w-3 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-sm px-3 py-1.5 text-xs bg-slate-900 dark:bg-slate-800">
                        Net annual income from this rental property after all expenses (taxes, maintenance, vacancies).
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Controller
                    name={`income_streams.rental_properties.${index}.net_annual_income`}
                    control={control}
                    rules={{
                      min: { value: 0, message: "Net annual income cannot be negative" },
                    }}
                    render={({ field }) => (
                      <>
                        <input
                          id={`income_streams.rental_properties.${index}.net_annual_income`}
                          type="number"
                          value={field.value ?? ''}
                          onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                          className={`w-full rounded-md border bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none ${
                            errors.income_streams?.rental_properties?.[index]?.net_annual_income ? "border-red-500 ring-red-500" : ""
                          }`}
                        />
                        {errors.income_streams?.rental_properties?.[index]?.net_annual_income && (
                          <ValidationError field={`income_streams.rental_properties.${index}.net_annual_income`} message={errors.income_streams.rental_properties[index].net_annual_income.message ?? "Invalid value"} />
                        )}
                      </>
                    )}
                  />
                </div>

                {/* Until Age */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <label htmlFor={`income_streams.rental_properties.${index}.until_age`} className="block font-medium text-xs mb-0.5">Until Age</label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                          <InfoIcon className="h-3 w-3 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-sm px-3 py-1.5 text-xs bg-slate-900 dark:bg-slate-800">
                        Age at which you expect to stop receiving income from this rental property (e.g., when selling the property).
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Controller
                    name={`income_streams.rental_properties.${index}.until_age`}
                    control={control}
                    rules={{
                      min: { value: 18, message: "Age must be between 18 and 120" },
                      max: { value: 120, message: "Age must be between 18 and 120" },
                    }}
                    render={({ field }) => (
                      <>
                        <input
                          id={`income_streams.rental_properties.${index}.until_age`}
                          type="number"
                          value={field.value ?? ''}
                          onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                          className={`w-full rounded-md border bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none ${
                            errors.income_streams?.rental_properties?.[index]?.until_age ? "border-red-500 ring-red-500" : ""
                          }`}
                        />
                        {errors.income_streams?.rental_properties?.[index]?.until_age && (
                          <ValidationError field={`income_streams.rental_properties.${index}.until_age`} message={errors.income_streams.rental_properties[index].until_age.message ?? "Invalid value"} />
                        )}
                      </>
                    )}
                  />
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
