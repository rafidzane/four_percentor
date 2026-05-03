"use client";

import { FC, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormItem, FormLabel, FormDescription, FormControl, FormMessage } from "@/components/ui/form";

interface PersonalSectionProps {
  className?: string;
}

export const PersonalSection: FC<PersonalSectionProps> = ({ className }) => {
  const { register, watch } = useFormContext();
  
  // Watch current age to determine catch-up eligibility
  const currentAge = watch("timeline.current_age", 35);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Personal Information */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
      </div>

      {/* Portfolio Assets */}
      <div>
        <h4 className="font-medium mb-3">Portfolio Assets</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormItem>
            <FormLabel htmlFor="current_assets.investment_portfolio">Investment portfolio</FormLabel>
            <FormControl>
              <Input
                id="current_assets.investment_portfolio"
                type="number"
                min={0}
                step={1000}
                {...register("current_assets.investment_portfolio", { valueAsNumber: true })}
              />
            </FormControl>
            <FormDescription>Taxable brokerage, ETFs, mutual funds</FormDescription>
            <FormMessage />
          </FormItem>

          <FormItem>
            <FormLabel htmlFor="current_assets.your_401k_ira">Your 401(k) / IRA</FormLabel>
            <FormControl>
              <Input
                id="current_assets.your_401k_ira"
                type="number"
                min={0}
                step={1000}
                {...register("current_assets.your_401k_ira", { valueAsNumber: true })}
              />
            </FormControl>
            <FormDescription>Individual retirement account balance</FormDescription>
            <FormMessage />
          </FormItem>

          <FormItem>
            <FormLabel htmlFor="current_assets.spouse_401k_ira">Spouse 401(k) / IRA</FormLabel>
            <FormControl>
              <Input
                id="current_assets.spouse_401k_ira"
                type="number"
                min={0}
                step={1000}
                {...register("current_assets.spouse_401k_ira", { valueAsNumber: true })}
              />
            </FormControl>
            <FormDescription>Spouse retirement account balance</FormDescription>
            <FormMessage />
          </FormItem>
        </div>
      </div>

      {/* Contributions Section */}
      <div className="border rounded-lg p-4">
        <h4 className="font-medium mb-3">Contributions</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
      </div>
    </div>
  );
};

export default PersonalSection;
