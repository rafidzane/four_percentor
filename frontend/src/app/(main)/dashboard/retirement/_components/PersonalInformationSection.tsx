"use client";

import { FC, useMemo } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { InfoIcon, UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Import the form data types and validation components
import type { FormData } from "@/app/(main)/dashboard/retirement/_components/RetirementForm";
import { ValidationError, ErrorBanner } from "@/components/retirement-dashboard/ui/ValidationErrors";

interface PersonalInformationSectionProps {
  className?: string;
}

export const PersonalInformationSection: FC<PersonalInformationSectionProps> = ({ className }) => {
  const { control, register, watch, formState: { errors } } = useFormContext<FormData>();

  // Watch values for conditional rendering
  const currentAge = watch("timeline.current_age");
  const retirementAge = watch("timeline.retirement_age");
  const spouseAge = watch("timeline.spouse_age");

  // Validate age ranges using useMemo to prevent recalculations
  const validationErrors = useMemo(() => {
    const newErrors: Record<string, string> = {};

    if (currentAge && retirementAge && currentAge >= retirementAge) {
      newErrors["retirement_age"] = "Retirement age must be greater than current age";
    }

    if (spouseAge && currentAge && spouseAge < 18) {
      newErrors["spouse_age"] = "Spouse age cannot be less than 18";
    }

    return newErrors;
  }, [currentAge, retirementAge, spouseAge]);

  // Check if spouse info should be shown
  const showSpouseFields = spouseAge !== undefined && spouseAge > 0;

  return (
    <section className={cn(
      "group relative overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md",
      className
    )}>
      {/* Decorative accent bar */}
      <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500 opacity-80 transition-all group-hover:opacity-100" />

      {/* Header Section */}
      <div className="relative px-4 py-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="grid size-7 place-content-center rounded-md bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-100 dark:border-blue-800/50 shadow-inner">
            <UserIcon className="size-4 text-blue-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Personal Info
          </h2>
        </div>
      </div>

      {/* Card Content */}
      <div className="px-4 py-3 space-y-3">

        {/* Error Banner for Section-level Validation Errors */}
        {Object.keys(validationErrors).length > 0 && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <ErrorBanner message={validationErrors["retirement_age"] || validationErrors["spouse_age"]} />
          </div>
        )}

        {/* Main Input Grid - matching PortfolioAssetsSection layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">

          {/* Current Age Field */}
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <label htmlFor="timeline.current_age" className="block font-medium text-xs mb-0.5">Current Age</label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                    <InfoIcon className="h-3 w-3 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-sm px-3 py-1.5 text-xs">
                  Your current age in years
                </TooltipContent>
              </Tooltip>
            </div>
            <Controller
              name="timeline.current_age"
              control={control}
              rules={{
                min: { value: 18, message: "Age must be at least 18" },
                max: { value: 100, message: "Age cannot exceed 100" },
              }}
              render={({ field }) => (
                <>
                  <input
                    id="timeline.current_age"
                    type="number"
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                    className={`w-full rounded-md border bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none ${
                      errors.timeline?.current_age ? "border-red-500 ring-red-500" : ""
                    }`}
                  />
                  {errors.timeline?.current_age && (
                    <ValidationError field="timeline.current_age" message={errors.timeline.current_age.message ?? "Invalid value"} />
                  )}
                </>
              )}
            />
          </div>

          {/* Retirement Age Field */}
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <label htmlFor="timeline.retirement_age" className="block font-medium text-xs mb-0.5">Retirement Age</label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                    <InfoIcon className="h-3 w-3 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-sm px-3 py-1.5 text-xs">
                  The age you plan to retire and stop working
                </TooltipContent>
              </Tooltip>
            </div>
            <Controller
              name="timeline.retirement_age"
              control={control}
              rules={{
                min: { value: 18, message: "Retirement age must be at least 18" },
                max: { value: 100, message: "Retirement age cannot exceed 100" },
              }}
              render={({ field }) => (
                <>
                  <input
                    id="timeline.retirement_age"
                    type="number"
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                    className={`w-full rounded-md border bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none ${
                      errors.timeline?.retirement_age ? "border-red-500 ring-red-500" : ""
                    }`}
                  />
                  {errors.timeline?.retirement_age && (
                    <ValidationError field="timeline.retirement_age" message={errors.timeline.retirement_age.message ?? "Invalid value"} />
                  )}
                </>
              )}
            />
          </div>

          {/* Spouse Age Field - Only show when spouse info provided */}
          {(showSpouseFields || showSpouseFields === false) && (
            <div className="space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center gap-1">
                <label htmlFor="timeline.spouse_age" className="block font-medium text-xs mb-0.5">Spouse Age</label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                      <InfoIcon className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-sm px-3 py-1.5 text-xs">
                    Your spouse's current age in years
                  </TooltipContent>
                </Tooltip>
              </div>
              <Controller
                name="timeline.spouse_age"
                control={control}
                rules={{
                  min: { value: 18, message: "Spouse age must be at least 18" },
                  max: { value: 100, message: "Spouse age cannot exceed 100" },
                }}
                render={({ field }) => (
                  <>
                    <input
                      id="timeline.spouse_age"
                      type="number"
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                      className={`w-full rounded-md border bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none ${
                        errors.timeline?.spouse_age ? "border-red-500 ring-red-500" : ""
                      }`}
                    />
                    {errors.timeline?.spouse_age && (
                      <ValidationError field="timeline.spouse_age" message={errors.timeline.spouse_age.message ?? "Invalid value"} />
                    )}
                  </>
                )}
              />
            </div>
          )}

          {/* Years in Retirement Field - Only show when spouse info provided */}
          {(showSpouseFields || showSpouseFields === false) && (
            <div className="space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center gap-1">
                <label htmlFor="timeline.years_in_retirement" className="block font-medium text-xs mb-0.5">Retirement Years</label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                      <InfoIcon className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-sm px-3 py-1.5 text-xs">
                    Number of years you expect to be in retirement
                  </TooltipContent>
                </Tooltip>
              </div>
              <Controller
                name="timeline.years_in_retirement"
                control={control}
                rules={{
                  min: { value: 1, message: "Years in retirement must be at least 1" },
                  max: { value: 50, message: "Years in retirement cannot exceed 50" },
                }}
                render={({ field }) => (
                  <>
                    <input
                      id="timeline.years_in_retirement"
                      type="number"
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                      className={`w-full rounded-md border bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none ${
                        errors.timeline?.years_in_retirement ? "border-red-500 ring-red-500" : ""
                      }`}
                    />
                    {errors.timeline?.years_in_retirement && (
                      <ValidationError field="timeline.years_in_retirement" message={errors.timeline.years_in_retirement.message ?? "Invalid value"} />
                    )}
                  </>
                )}
              />
            </div>
          )}

        </div>

      </div>
    </section>
  );
};

export default PersonalInformationSection;
