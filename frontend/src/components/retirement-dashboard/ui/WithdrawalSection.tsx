"use client";

import { FC, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { FormItem, FormLabel, FormDescription, FormControl, FormMessage } from "@/components/ui/form";

interface WithdrawalSectionProps {
  className?: string;
}

export const WithdrawalSection: FC<WithdrawalSectionProps> = ({ className }) => {
  const [spendingMode, setSpendingMode] = useState<string>("four_pct_rule");
  const { register, watch, setValue } = useFormContext();

  const currentSpendingMode = watch("retirement_spending.spending_mode", "four_pct_rule");

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Spending Mode */}
      <FormItem>
        <FormLabel htmlFor="retirement_spending.spending_mode">Withdrawal strategy</FormLabel>
        <FormControl>
          <Select
            value={currentSpendingMode}
            onValueChange={(value) => setValue("retirement_spending.spending_mode", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="four_pct_rule">4% Rule (safe withdrawal rate)</SelectItem>
              <SelectItem value="manual_withdrawal">Manual Withdrawal Amount</SelectItem>
            </SelectContent>
          </Select>
        </FormControl>
        <FormDescription>How you'll withdraw money during retirement</FormDescription>
        <FormMessage />
      </FormItem>

      {/* Manual Withdrawal Inputs */}
      {currentSpendingMode === "manual_withdrawal" && (
        <>
          <FormItem>
            <FormLabel htmlFor="retirement_spending.first_year_expenses">First year expenses</FormLabel>
            <FormControl>
              <Input
                id="retirement_spending.first_year_expenses"
                type="number"
                min={0}
                step={1000}
                {...register("retirement_spending.first_year_expenses", { valueAsNumber: true })}
                placeholder="0"
              />
            </FormControl>
            <FormDescription>Annual spending in first year of retirement (today's dollars)</FormDescription>
            <FormMessage />
          </FormItem>

          <FormItem>
            <FormLabel htmlFor="retirement_spending.withdrawal_pct">Withdrawal %</FormLabel>
            <FormControl>
              <Input
                id="retirement_spending.withdrawal_pct"
                type="number"
                min={0}
                max={100}
                step={0.5}
                {...register("retirement_spending.withdrawal_pct", { valueAsNumber: true })}
                placeholder="4.0"
              />
            </FormControl>
            <FormDescription>Percentage of portfolio to withdraw annually</FormDescription>
            <FormMessage />
          </FormItem>
        </>
      )}

      {/* Inflation Adjustment */}
      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
        <FormControl>
          <input
            id="retirement_spending.adjust_for_inflation"
            type="checkbox"
            {...register("retirement_spending.adjust_for_inflation")}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
        </FormControl>
        <div className="space-y-1 leading-none">
          <FormLabel htmlFor="retirement_spending.adjust_for_inflation">Adjust for inflation</FormLabel>
          <FormDescription>Increases withdrawals each year to keep pace with inflation</FormDescription>
        </div>
      </FormItem>

      {/* Two-Period Mode */}
      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
        <FormControl>
          <input
            id="retirement_spending.two_period_mode"
            type="checkbox"
            {...register("retirement_spending.two_period_mode")}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
        </FormControl>
        <div className="space-y-1 leading-none">
          <FormLabel htmlFor="retirement_spending.two_period_mode">Two-period spending mode</FormLabel>
          <FormDescription>Different spending before and after age 65</FormDescription>
        </div>
      </FormItem>

      {/* Age Range */}
      <div className="grid grid-cols-2 gap-4">
        <FormItem>
          <FormLabel htmlFor="retirement_spending.age_range_start">Age range start</FormLabel>
          <FormControl>
            <Input
              id="retirement_spending.age_range_start"
              type="number"
              min={18}
              max={100}
              {...register("retirement_spending.age_range_start", { valueAsNumber: true })}
              placeholder="62"
            />
          </FormControl>
        </FormItem>

        <FormItem>
          <FormLabel htmlFor="retirement_spending.age_range_end">Age range end</FormLabel>
          <FormControl>
            <Input
              id="retirement_spending.age_range_end"
              type="number"
              min={18}
              max={120}
              {...register("retirement_spending.age_range_end", { valueAsNumber: true })}
              placeholder="92"
            />
          </FormControl>
        </FormItem>
      </div>
    </div>
  );
};

export default WithdrawalSection;
