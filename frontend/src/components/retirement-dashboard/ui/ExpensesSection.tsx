"use client";

import { FC } from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { FormItem, FormLabel, FormDescription, FormControl, FormMessage } from "@/components/ui/form";

interface ExpensesSectionProps {
  className?: string;
}

export const ExpensesSection: FC<ExpensesSectionProps> = ({ className }) => {
  const { register } = useFormContext();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Essential vs Discretionary Split */}
      <div className="rounded-lg border p-4">
        <FormLabel className="text-lg font-semibold">Expense Split</FormLabel>
        <div className="mt-4 space-y-4">
          <FormItem>
            <FormLabel htmlFor="expenses.essential_pct">Essential spending %</FormLabel>
            <FormControl>
              <Input
                id="expenses.essential_pct"
                type="number"
                min={0}
                max={100}
                step={5}
                {...register("expenses.essential_pct", { valueAsNumber: true })}
                placeholder="70"
              />
            </FormControl>
            <FormDescription>Percentage of spending on essentials (housing, food, healthcare)</FormDescription>
            <FormMessage />
          </FormItem>

          <div className="flex items-end gap-2">
            <span className="text-sm text-muted-foreground">Discretionary spending:</span>
            <span className="text-lg font-bold text-primary">
              {100 - (register("expenses.essential_pct", { valueAsNumber: true }).value || 0)}%
            </span>
          </div>
        </div>
      </div>

      {/* Housing Costs */}
      <div className="rounded-lg border p-4 space-y-4">
        <FormLabel className="text-lg font-semibold">Housing</FormLabel>

        <FormItem>
          <FormLabel htmlFor="expenses.housing_monthly">Monthly housing cost</FormLabel>
          <FormControl>
            <Input
              id="expenses.housing_monthly"
              type="number"
              min={0}
              step={100}
              {...register("expenses.housing_monthly", { valueAsNumber: true })}
              placeholder="$1,500"
            />
          </FormControl>
          <FormDescription>Mortgage or rent payment</FormDescription>
          <FormMessage />
        </FormItem>

        <FormItem>
          <FormLabel htmlFor="expenses.mortgage_payoff_age">Mortgage payoff age</FormLabel>
          <FormControl>
            <Input
              id="expenses.mortgage_payoff_age"
              type="number"
              min={18}
              max={120}
              {...register("expenses.mortgage_payoff_age", { valueAsNumber: true })}
              placeholder="65"
            />
          </FormControl>
          <FormDescription>Age when mortgage will be paid off (if applicable)</FormDescription>
          <FormMessage />
        </FormItem>
      </div>

      {/* Healthcare Costs */}
      <div className="rounded-lg border p-4 space-y-4">
        <FormLabel className="text-lg font-semibold">Healthcare</FormLabel>

        <FormItem>
          <FormLabel htmlFor="expenses.healthcare_premie_pre_medicare">
            Pre-Medicare premiums (age {register("timeline.current_age", { valueAsNumber: true }).value || 35} to 65)
          </FormLabel>
          <FormControl>
            <Input
              id="expenses.healthcare_premie_pre_medicare"
              type="number"
              min={0}
              step={100}
              {...register("expenses.healthcare_premie_pre_medicare", { valueAsNumber: true })}
              placeholder="$5,000"
            />
          </FormControl>
          <FormDescription>Health insurance premiums before Medicare</FormDescription>
          <FormMessage />
        </FormItem>

        <FormItem>
          <FormLabel htmlFor="expenses.healthcare_out_of_pocket_pre_medicare">
            Pre-Medicare out-of-pocket
          </FormLabel>
          <FormControl>
            <Input
              id="expenses.healthcare_out_of_pocket_pre_medicare"
              type="number"
              min={0}
              step={100}
              {...register("expenses.healthcare_out_of_pocket_pre_medicare", { valueAsNumber: true })}
              placeholder="$3,000"
            />
          </FormControl>
          <FormDescription>Deductibles, copays, prescriptions</FormDescription>
          <FormMessage />
        </FormItem>

        <FormItem>
          <FormLabel htmlFor="expenses.medicare_part_b_premium">Medicare Part B premium (post-65)</FormLabel>
          <FormControl>
            <Input
              id="expenses.medicare_part_b_premium"
              type="number"
              min={0}
              step={10}
              {...register("expenses.medicare_part_b_premium", { valueAsNumber: true })}
              placeholder="$170.10"
            />
          </FormControl>
          <FormDescription>Monthly Part B premium</FormDescription>
          <FormMessage />
        </FormItem>

        <FormItem>
          <FormLabel htmlFor="expenses.medicare_part_d_premium">Medicare Part D premium (post-65)</FormLabel>
          <FormControl>
            <Input
              id="expenses.medicare_part_d_premium"
              type="number"
              min={0}
              step={10}
              {...register("expenses.medicare_part_d_premium", { valueAsNumber: true })}
              placeholder="$35"
            />
          </FormControl>
          <FormDescription>Monthly Part D (prescription) premium</FormDescription>
          <FormMessage />
        </FormItem>

        <FormItem>
          <FormLabel htmlFor="expenses.long_term_care_annual">Long-term care annual cost</FormLabel>
          <FormControl>
            <Input
              id="expenses.long_term_care_annual"
              type="number"
              min={0}
              step={1000}
              {...register("expenses.long_term_care_annual", { valueAsNumber: true })}
              placeholder="$10,000"
            />
          </FormControl>
          <FormDescription>Annual cost if long-term care needed</FormDescription>
          <FormMessage />
        </FormItem>
      </div>

      {/* Education Expenses */}
      <div className="rounded-lg border p-4 space-y-4">
        <FormLabel className="text-lg font-semibold">Education (children)</FormLabel>

 {[0, 1, 2].map((index) => (
          <div key={index} className="space-y-3 border-t pt-4">
            <h4 className="font-medium text-sm">Child {index + 1}</h4>
            <div className="grid grid-cols-3 gap-4">
              <FormItem>
                <FormLabel htmlFor={`expenses.children.${index}.start_age`}>Start age</FormLabel>
                <FormControl>
                  <Input
                    id={`expenses.children.${index}.start_age`}
                    type="number"
                    min={0}
                    max={18}
                    {...register(`expenses.children.${index}.start_age`, { valueAsNumber: true })}
                    placeholder="5"
                  />
                </FormControl>
              </FormItem>

              <FormItem>
                <FormLabel htmlFor={`expenses.children.${index}.annual_tuition`}>Annual tuition</FormLabel>
                <FormControl>
                  <Input
                    id={`expenses.children.${index}.annual_tuition`}
                    type="number"
                    min={0}
                    step={1000}
                    {...register(`expenses.children.${index}.annual_tuition`, { valueAsNumber: true })}
                    placeholder="$20,000"
                  />
                </FormControl>
              </FormItem>

              <FormItem>
                <FormLabel htmlFor={`expenses.children.${index}.years`}>Years</FormLabel>
                <FormControl>
                  <Input
                    id={`expenses.children.${index}.years`}
                    type="number"
                    min={1}
                    max={10}
                    {...register(`expenses.children.${index}.years`, { valueAsNumber: true })}
                    placeholder="4"
                  />
                </FormControl>
              </FormItem>
            </div>
          </div>
        ))}
      </div>

      {/* Travel / Lifestyle */}
      <div className="rounded-lg border p-4 space-y-4">
        <FormLabel className="text-lg font-semibold">Travel & Lifestyle</FormLabel>

        <FormItem>
          <FormLabel htmlFor="expenses.travel_annual">Annual travel budget</FormLabel>
          <FormControl>
            <Input
              id="expenses.travel_annual"
              type="number"
              min={0}
              step={500}
              {...register("expenses.travel_annual", { valueAsNumber: true })}
              placeholder="$3,000"
            />
          </FormControl>
          <FormDescription>Annual travel and entertainment budget</FormDescription>
          <FormMessage />
        </FormItem>

        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
          <FormControl>
            <input
              id="expenses.increase_travel_early_retirement"
              type="checkbox"
              {...register("expenses.increase_travel_early_retirement")}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel htmlFor="expenses.increase_travel_early_retirement">Higher spending early retirement</FormLabel>
            <FormDescription>Travel and lifestyle expenses increase by 2% annually in first 5 years</FormDescription>
          </div>
        </FormItem>
      </div>
    </div>
  );
};

export default ExpensesSection;
