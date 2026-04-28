"use client";

import { FC } from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormItem, FormLabel, FormDescription, FormControl, FormMessage } from "@/components/ui/form";

interface PersonalSectionProps {
  className?: string;
}

export const PersonalSection: FC<PersonalSectionProps> = ({ className }) => {
  const { register } = useFormContext();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Current Age */}
      <FormItem>
        <FormLabel htmlFor="timeline.current_age">Current age</FormLabel>
        <FormControl>
          <Input
            id="timeline.current_age"
            type="number"
            min={18}
            max={100}
            {...register("timeline.current_age", { valueAsNumber: true })}
          />
        </FormControl>
        <FormDescription>Enter your current age in years</FormDescription>
        <FormMessage />
      </FormItem>

      {/* Retirement Age */}
      <FormItem>
        <FormLabel htmlFor="timeline.retirement_age">Retirement age</FormLabel>
        <FormControl>
          <Input
            id="timeline.retirement_age"
            type="number"
            min={18}
            max={100}
            {...register("timeline.retirement_age", { valueAsNumber: true })}
          />
        </FormControl>
        <FormDescription>At what age do you plan to retire?</FormDescription>
        <FormMessage />
      </FormItem>

      {/* Spouse Age (Optional) */}
      <FormItem>
        <FormLabel htmlFor="timeline.spouse_age">Spouse age (optional)</FormLabel>
        <FormControl>
          <Input
            id="timeline.spouse_age"
            type="number"
            min={18}
            max={100}
            {...register("timeline.spouse_age", { valueAsNumber: true })}
          />
        </FormControl>
        <FormDescription>Enter your spouse's current age if applicable</FormDescription>
        <FormMessage />
      </FormItem>
    </div>
  );
};

export default PersonalSection;
