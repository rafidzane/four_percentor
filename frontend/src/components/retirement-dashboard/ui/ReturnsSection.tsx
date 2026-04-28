"use client";

import { FC, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";
import { FormItem, FormLabel, FormDescription, FormControl, FormMessage } from "@/components/ui/form";

interface ReturnsSectionProps {
  className?: string;
}

const NOTABLE_YEARS = [
  { year: 1929, label: "1929 - Stock Market Crash" },
  { year: 1974, label: "1974 - Stagflation / Oil Crisis" },
  { year: 2000, label: "2000 - Dot-com Bubble Burst" },
  { year: 2008, label: "2008 - Financial Crisis" },
  { year: 2020, label: "2020 - Pandemic Crash" },
] as const;

const YEAR_RANGE = { min: 1871, max: 2025 } as const;

export const ReturnsSection: FC<ReturnsSectionProps> = ({ className }) => {
  const { register, watch, setValue } = useFormContext();

  const currentMode = watch("portfolio_allocation.simulation_mode", "historical_all");
  const historicalYear = watch("portfolio_allocation.historical_year", 1929);

  const handlePresetSelect = (year: number) => {
    setValue("portfolio_allocation.historical_year", year, { shouldValidate: true });
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Simulation Mode */}
      <FormItem>
        <FormLabel htmlFor="portfolio_allocation.simulation_mode">Returns simulation mode</FormLabel>
        <FormControl>
          <Select
            value={currentMode}
            onValueChange={(value) => setValue("portfolio_allocation.simulation_mode", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="historical_all">Historical (S&P since 1871)</SelectItem>
              <SelectItem value="single_year">
                <div className="flex items-center gap-2">
                  Single historical year
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                        <InfoIcon className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      Simulate retirement using a specific historical year's market data (e.g., 1929 for Great Depression, 2008 for Financial Crisis).
                    </TooltipContent>
                  </Tooltip>
                </div>
              </SelectItem>
              <SelectItem value="manual">Manual inputs</SelectItem>
            </SelectContent>
          </Select>
        </FormControl>
        <FormDescription>Choose how returns are calculated</FormDescription>
        <FormMessage />
      </FormItem>

      {/* Manual Inputs - shown when mode is "manual" */}
      {currentMode === "manual" && (
        <>
          {/* Pre-retirement Equity Return */}
          <FormItem>
            <FormLabel htmlFor="portfolio_allocation.equity_return_pre_retirement_pct">
              Pre-retirement equity return %
            </FormLabel>
            <FormControl>
              <Input
                id="portfolio_allocation.equity_return_pre_retirement_pct"
                type="number"
                min={0}
                max={100}
                step={0.5}
                {...register("portfolio_allocation.equity_return_pre_retirement_pct", { valueAsNumber: true })}
                placeholder="7.0"
              />
            </FormControl>
            <FormDescription>Expected equity return before retirement</FormDescription>
            <FormMessage />
          </FormItem>

          {/* Post-retirement Equity Return */}
          <FormItem>
            <FormLabel htmlFor="portfolio_allocation.equity_return_post_retirement_pct">
              Post-retirement equity return %
            </FormLabel>
            <FormControl>
              <Input
                id="portfolio_allocation.equity_return_post_retirement_pct"
                type="number"
                min={0}
                max={100}
                step={0.5}
                {...register("portfolio_allocation.equity_return_post_retirement_pct", { valueAsNumber: true })}
                placeholder="5.5"
              />
            </FormControl>
            <FormDescription>Expected equity return during retirement</FormDescription>
            <FormMessage />
          </FormItem>

          {/* Fixed Income Return */}
          <FormItem>
            <FormLabel htmlFor="portfolio_allocation.fixed_income_return_pct">Fixed income return %</FormLabel>
            <FormControl>
              <Input
                id="portfolio_allocation.fixed_income_return_pct"
                type="number"
                min={0}
                max={100}
                step={0.5}
                {...register("portfolio_allocation.fixed_income_return_pct", { valueAsNumber: true })}
                placeholder="3.5"
              />
            </FormControl>
            <FormDescription>Expected fixed income return (bonds, CDs)</FormDescription>
            <FormMessage />
          </FormItem>

          {/* Inflation Rate */}
          <FormItem>
            <FormLabel htmlFor="portfolio_allocation.inflation_rate_pct">Inflation rate %</FormLabel>
            <FormControl>
              <Input
                id="portfolio_allocation.inflation_rate_pct"
                type="number"
                min={0}
                max={100}
                step={0.1}
                {...register("portfolio_allocation.inflation_rate_pct", { valueAsNumber: true })}
                placeholder="3.0"
              />
            </FormControl>
            <FormDescription>Annual inflation rate for expense projections</FormDescription>
            <FormMessage />
          </FormItem>
        </>
      )}

      {/* Single Year Mode - shown when mode is "single_year" */}
      {currentMode === "single_year" && (
        <>
          {/* Preset Buttons */}
          <div className="flex flex-wrap gap-2">
            {NOTABLE_YEARS.map(({ year, label }) => (
              <Button
                key={year}
                type="button"
                variant={historicalYear === year ? "default" : "outline"}
                size="sm"
                onClick={() => handlePresetSelect(year)}
              >
                {label.split(" - ")[0]}
              </Button>
            ))}
          </div>

          {/* Historical Year Input */}
          <FormItem>
            <FormLabel htmlFor="portfolio_allocation.historical_year">Historical year</FormLabel>
            <FormControl>
              <Input
                id="portfolio_allocation.historical_year"
                type="number"
                min={YEAR_RANGE.min}
                max={YEAR_RANGE.max}
                {...register("portfolio_allocation.historical_year", {
                  valueAsNumber: true,
                  required: "Year is required",
                  validate: (value) => {
                    if (value < YEAR_RANGE.min) return `Year must be between ${YEAR_RANGE.min} and ${YEAR_RANGE.max}`;
                    if (value > YEAR_RANGE.max) return `Year must be between ${YEAR_RANGE.min} and ${YEAR_RANGE.max}`;
                    return true;
                  },
                })}
                placeholder="Enter year (e.g., 1929)"
              />
            </FormControl>
            <FormDescription>Select a specific year to simulate (range: {YEAR_RANGE.min}-{YEAR_RANGE.max})</FormDescription>
            <FormMessage />
          </FormItem>

          {/* Historical Context */}
          <div className="rounded-md bg-muted/50 p-3 text-sm">
            <p className="font-medium">Historical context:</p>
            <p className="mt-1">
              {historicalYear === 1929 && "The Great Depression began after the 1929 Stock Market Crash. Unemployment reached 25% and GDP fell by nearly 30%."}
              {historicalYear === 1974 && "1974 saw stagflation - high inflation combined with high unemployment. The Oil Crisis of 1973 caused oil prices to quadruple."}
              {historicalYear === 2000 && "The Dot-com Bubble burst in 2000, wiping out nearly 50% of the stock market value. Many internet companies failed."}
              {historicalYear === 2008 && "The Financial Crisis triggered by subprime mortgage defaults. The S&P 500 fell by nearly 40% from its peak."}
              {historicalYear === 2020 && "The COVID-19 pandemic caused a sharp market crash in March 2020, but markets recovered quickly with government stimulus."}
              {![1929, 1974, 2000, 2008, 2020].includes(historicalYear) && "Select one of the notable years above to see historical context."}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default ReturnsSection;
