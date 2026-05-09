"use client";

import { FC } from "react";
import { useFormContext } from "react-hook-form";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { InfoIcon } from "lucide-react";

// Import the form data types
import type { FormData } from "@/app/(main)/dashboard/retirement/_components/RetirementForm";

interface PersonalInformationSectionProps {
  className?: string;
}

export const PersonalInformationSection: FC<PersonalInformationSectionProps> = ({ className }) => {
  const { control, register, watch } = useFormContext<FormData>();
  
  // Watch values for conditional rendering
  const currentAge = watch("timeline.current_age");
  const retirementAge = watch("timeline.retirement_age");
  const spouseAge = watch("timeline.spouse_age");
  const yearsInRetirement = watch("timeline.years_in_retirement");

  return (
    <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
      <div data-slot="card-header" className="@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6">
        <div data-slot="card-title" className="leading-none font-semibold">
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-content-center rounded-sm bg-muted">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user size-5" aria-hidden="true">
                <path d="M12 12c2.236 0 4.2-1.964 4.2-4.2 0-2.236-1.964-4.2-4.2-4.2-2.236 0-4.2 1.964-4.2 4.2 0 2.236 1.964 4.2 4.2 4.2z"></path>
                <path d="M12 12c2.236 0 4.2-1.964 4.2-4.2 0-2.236-1.964-4.2-4.2-4.2-2.236 0-4.2 1.964-4.2 4.2 0 2.236 1.964 4.2 4.2 4.2z"></path>
              </svg>
            </span>
            Personal Information
          </div>
        </div>
      </div>
      <div data-slot="card-content" className="px-6 space-y-4">
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
                  {...register("timeline.current_age", { valueAsNumber: true })}
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
                  {...register("timeline.retirement_age", { valueAsNumber: true })}
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
                  {...register("timeline.spouse_age", { valueAsNumber: true })}
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
                  {...register("timeline.years_in_retirement", { valueAsNumber: true })}
                  className="w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInformationSection;