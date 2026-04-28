"use client";

import { FC } from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { FormItem, FormLabel, FormDescription, FormControl, FormMessage } from "@/components/ui/form";

interface PortfolioSectionProps {
  className?: string;
}

export const PortfolioSection: FC<PortfolioSectionProps> = ({ className }) => {
  const { watch, register, setValue } = useFormContext();

  // Watch equity percentage to auto-update fixed income
  const equityPct = watch("portfolio_allocation.equity_pct", 70);
  const fixedIncomePct = 100 - equityPct;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Portfolio Assets in Single Line */}
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
              placeholder="0"
            />
          </FormControl>
          <FormDescription className="text-xs">Taxable brokerage, ETFs, mutual funds</FormDescription>
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
              placeholder="0"
            />
          </FormControl>
          <FormDescription className="text-xs">Individual retirement account balance</FormDescription>
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
              placeholder="0"
            />
          </FormControl>
          <FormDescription className="text-xs">Spouse retirement account balance</FormDescription>
          <FormMessage />
        </FormItem>
      </div>

      {/* Asset Allocation - Equity % with Slider */}
      <div className="space-y-4 rounded-lg border p-4">
        <FormLabel>Asset allocation (must sum to 100%)</FormLabel>

        <div className="grid grid-cols-2 gap-4 items-center">
          <div className="space-y-2">
            <FormLabel htmlFor="portfolio_allocation.equity_pct">Equities</FormLabel>
            <Input
              id="portfolio_allocation.equity_pct"
              type="number"
              min={0}
              max={100}
              {...register("portfolio_allocation.equity_pct", { valueAsNumber: true })}
              className="text-center font-semibold"
            />
          </div>

          <div className="flex flex-col items-start justify-center">
            <span className="text-sm text-muted-foreground">= Fixed Income</span>
            <span className="text-lg font-bold">{fixedIncomePct}%</span>
          </div>
        </div>

        <FormControl>
          <Slider
            id="portfolio_allocation.equity_pct"
            min={0}
            max={100}
            step={1}
            value={[equityPct]}
            onValueChange={(value) => setValue("portfolio_allocation.equity_pct", value[0], { shouldValidate: true })}
          />
        </FormControl>

        <FormDescription>
          Current allocation: {equityPct}% equities / {fixedIncomePct}% fixed income
        </FormDescription>
      </div>

      {/* Catch-up Eligible */}
      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
        <FormControl>
          <input
            id="current_assets.catch_up_eligible"
            type="checkbox"
            {...register("current_assets.catch_up_eligible")}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
        </FormControl>
        <div className="space-y-1 leading-none">
          <FormLabel htmlFor="current_assets.catch_up_eligible">Catch-up eligible (age 50+)</FormLabel>
          <FormDescription>Eligible to make additional catch-up contributions</FormDescription>
        </div>
      </FormItem>
    </div>
  );
};

export default PortfolioSection;
