"use client";

import { FC, useMemo } from "react";
import { useFormContext, Controller, FieldErrorsImpl } from "react-hook-form";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { InfoIcon } from "lucide-react";

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
  const yearsInRetirement = watch("timeline.years_in_retirement");

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

  return (
    <section className={`rounded-xl border-l-4 border-blue-500 p-6 min-h-[200px] shadow-sm transition-all duration-300 hover:shadow-md`}>
      {/* Error Banner for Section-level Validation Errors */}
      {Object.keys(validationErrors).length > 0 && (
        <div className="mb-4">
          <ErrorBanner message={validationErrors["retirement_age"] || validationErrors["spouse_age"]} />
        </div>
      )}

      <div data-slot="card-header" className="@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6">
        <div data-slot="card-title" className="leading-none font-semibold flex items-center gap-2">
          <span className="grid size-7 place-content-center rounded-sm bg-muted">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user size-5" aria-hidden="true">
              <path d="M12 12c2.236 0 4.2-1.964 4.2-4.2 0-2.236-1.964-4.2-4.2-4.2-2.236 0-4.2 1.964-4.2 4.2 0 2.236 1.964 4.2 4.2 4.2z"></path>
              <path d="M12 12c2.236 0 4.2-1.964 4.2-4.2 0-2.236-1.964-4.2-4.2-4.2-2.236 0-4.2 1.964-4.2 4.2 0 2.236 1.964 4.2 4.2 4.2z"></path>
            </svg>
          </span>
          Personal Information
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Current Age Field */}
        <div className="space-y-1">
          <label htmlFor="timeline.current_age" className="block font-medium text-xs mb-0.5 text-gray-700 dark:text-gray-300 flex items-center gap-1">
            Age
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-4 w-auto p-0 hover:bg-transparent">
                  <InfoIcon className="h-3 w-3 text-muted-foreground cursor-pointer" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-xs">
                Your current age. This is used to calculate how many years until retirement and to determine the appropriate investment allocation.
              </TooltipContent>
            </Tooltip>
          </label>
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
                  {...field}
                  className={`w-full rounded-md border bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none transition-all duration-200 ${
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
          <label htmlFor="timeline.retirement_age" className="block font-medium text-xs mb-0.5 text-gray-700 dark:text-gray-300 flex items-center gap-1">
            Retire age
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-4 w-auto p-0 hover:bg-transparent">
                  <InfoIcon className="h-3 w-3 text-muted-foreground cursor-pointer" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-xs">
                The age at which you plan to retire. This determines when your portfolio will transition from growth to withdrawal mode.
              </TooltipContent>
            </Tooltip>
          </label>
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
                  {...field}
                  className={`w-full rounded-md border bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none transition-all duration-200 ${
                    errors.timeline?.retirement_age || validationErrors["retirement_age"] ? "border-red-500 ring-red-500" : ""
                  }`}
                />
                {errors.timeline?.retirement_age && (
                  <ValidationError field="timeline.retirement_age" message={errors.timeline.retirement_age.message ?? "Invalid value"} />
                )}
              </>
            )}
          />
        </div>

        {/* Spouse Age Field */}
        <div className="space-y-1">
          <label htmlFor="timeline.spouse_age" className="block font-medium text-xs mb-0.5 text-gray-700 dark:text-gray-300 flex items-center gap-1">
            Spouse age
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-4 w-auto p-0 hover:bg-transparent">
                  <InfoIcon className="h-3 w-3 text-muted-foreground cursor-pointer" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-xs">
                Your spouse's current age. This is used to calculate spousal benefits and retirement planning for joint portfolios.
              </TooltipContent>
            </Tooltip>
          </label>
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
                  {...field}
                  className={`w-full rounded-md border bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none transition-all duration-200 ${
                    errors.timeline?.spouse_age || validationErrors["spouse_age"] ? "border-red-500 ring-red-500" : ""
                  }`}
                />
                {errors.timeline?.spouse_age && (
                  <ValidationError field="timeline.spouse_age" message={errors.timeline.spouse_age.message ?? "Invalid value"} />
                )}
              </>
            )}
          />
        </div>

        {/* Years in Retirement Field */}
        <div className="space-y-1">
          <label htmlFor="timeline.years_in_retirement" className="block font-medium text-xs mb-0.5 text-gray-700 dark:text-gray-300 flex items-center gap-1">
            Retirement years
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-4 w-auto p-0 hover:bg-transparent">
                  <InfoIcon className="h-3 w-3 text-muted-foreground cursor-pointer" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-xs">
                The number of years you expect to spend in retirement. This helps determine how long your portfolio needs to last.
              </TooltipContent>
            </Tooltip>
          </label>
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
                  {...field}
                  className={`w-full rounded-md border bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none transition-all duration-200 ${
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
      </div>

      {/* <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-info">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          Timeline Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-200 hover:shadow-md">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Current Age</p>
            <p className="font-medium text-gray-900 dark:text-white">35 years old</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-200 hover:shadow-md">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Retirement Age</p>
            <p className="font-medium text-gray-900 dark:text-white">65 years old</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border border-gray-100 dark:border-gray-700 transition-all duration-200 hover:shadow-md">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Retirement Years</p>
            <p className="font-medium text-gray-900 dark:text-white">30 years</p>
          </div>
        </div>
      </div> */}
    </section>
  );
};

export default PersonalInformationSection;