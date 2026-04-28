"use client";

import { FC } from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormItem, FormLabel, FormDescription, FormControl, FormMessage } from "@/components/ui/form";

interface ContributionsSectionProps {
  className?: string;
}

export const ContributionsSection: FC<ContributionsSectionProps> = ({ className }) => {
  const { register, watch } = useFormContext();

  // Watch current age to determine catch-up eligibility
  const currentAge = watch("timeline.current_age", 35);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Yearly Contribution */}
      <FormItem>
        <FormLabel htmlFor="current_assets.yearly_contribution">Yearly contribution</FormLabel>
        <FormControl>
          <Input
            id="current_assets.yearly_contribution"
            type="number"
            min={0}
            step={500}
            {...register("current_assets.yearly_contribution", { valueAsNumber: true })}
            placeholder="0"
          />
        </FormControl>
        <FormDescription>Amount you contribute to retirement accounts each year</FormDescription>
        <FormMessage />
      </FormItem>

      {/* Yearly Contribution Increase */}
      <FormItem>
        <FormLabel htmlFor="current_assets.yearly_contribution_increase_pct">
          Yearly contribution increase %
        </FormLabel>
        <FormControl>
          <Input
            id="current_assets.yearly_contribution_increase_pct"
            type="number"
            min={0}
            max={100}
            step={0.5}
            {...register("current_assets.yearly_contribution_increase_pct", { valueAsNumber: true })}
            placeholder="0"
          />
        </FormControl>
        <FormDescription>Expected annual increase in contributions (e.g., 3% for raises)</FormDescription>
        <FormMessage />
      </FormItem>

      {/* Employer Match */}
      <FormItem>
        <FormLabel htmlFor="current_assets.employer_match_pct">Employer match %</FormLabel>
        <FormControl>
          <Input
            id="current_assets.employer_match_pct"
            type="number"
            min={0}
            max={100}
            step={0.5}
            {...register("current_assets.employer_match_pct", { valueAsNumber: true })}
            placeholder="0"
          />
        </FormControl>
        <FormDescription>Percentage of salary matched by employer (if applicable)</FormDescription>
        <FormMessage />
      </FormItem>

      {/* Roth vs Traditional Split */}
      <div className="space-y-3 rounded-lg border p-4">
        <FormLabel>Roth vs Traditional Split</FormLabel>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <FormLabel htmlFor="current_assets.roth_split_pct">Roth %</FormLabel>
            <Input
              id="current_assets.roth_split_pct"
              type="number"
              min={0}
              max={100}
              step={5}
              {...register("current_assets.roth_split_pct", { valueAsNumber: true })}
              placeholder="50"
            />
          </div>
          <div className="flex items-end">
            <span className="text-lg font-bold text-primary">
              {100 - (watch("current_assets.roth_split_pct", 50))}% Traditional
            </span>
          </div>
        </div>
        <FormDescription>Allocation between Roth and Traditional retirement accounts</FormDescription>
      </div>

      {/* Catch-up Contributions */}
      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
        <FormControl>
          <input
            id="current_assets.catch_up_contributions"
            type="checkbox"
            {...register("current_assets.catch_up_contributions")}
            disabled={currentAge < 50}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary disabled:opacity-50"
          />
        </FormControl>
        <div className="space-y-1 leading-none">
          <FormLabel htmlFor="current_assets.catch_up_contributions">Catch-up contributions (age 50+)</FormLabel>
          <FormDescription>
            {currentAge >= 50
              ? "Eligible to make additional catch-up contributions"
              : "Not eligible until age 50"}
          </FormDescription>
        </div>
      </FormItem>
    </div>
  );
};

export default ContributionsSection;
