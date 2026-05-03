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
    <div className={`space-y-4 ${className}`}>
      {/* Personal Information */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
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

          <FormItem>
            <FormLabel htmlFor="timeline.years_in_retirement">Years in retirement</FormLabel>
            <FormControl>
              <Input
                id="timeline.years_in_retirement"
                type="number"
                min={1}
                max={50}
                {...register("timeline.years_in_retirement", { valueAsNumber: true })}
              />
            </FormControl>
            <FormDescription>How many years do you expect to be retired?</FormDescription>
            <FormMessage />
          </FormItem>
        </div>
      </div>

      {/* Portfolio Assets */}
      <div className="border rounded-lg p-3">
        <h4 className="font-medium mb-3">Portfolio Assets</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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

        {/* Contributions Section - moved into Portfolio Assets */}
        <div className="mt-4">
          <h4 className="font-medium mb-3">Contributions</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
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

            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3">
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

      {/* Returns Section - Now integrated with Personal section */}
      <div className="border rounded-lg p-3">
        <h4 className="font-medium mb-3">Returns Simulation</h4>
        <div className="grid grid-cols-1 gap-3">
          <FormItem>
            <FormLabel htmlFor="portfolio_allocation.simulation_mode">Returns simulation mode</FormLabel>
            <FormControl>
              <select
                id="portfolio_allocation.simulation_mode"
                {...register("portfolio_allocation.simulation_mode")}
                className="w-full rounded-md border border-input bg-transparent px-2 py-1 text-sm shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
              >
                <option value="historical_all">Historical (S&P since 1871)</option>
                <option value="single_year">Single historical year</option>
                <option value="manual">Manual inputs</option>
              </select>
            </FormControl>
            <FormDescription>Choose how returns are calculated</FormDescription>
            <FormMessage />
          </FormItem>

          {/* Manual Inputs - shown when mode is "manual" */}
          {watch("portfolio_allocation.simulation_mode") === "manual" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
              </div>
            </>
          )}

          {/* Single Year Mode - shown when mode is "single_year" */}
          {watch("portfolio_allocation.simulation_mode") === "single_year" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex flex-wrap gap-2">
                  {[1929, 1974, 2000, 2008, 2020].map((year) => (
                    <button
                      key={year}
                      type="button"
                      className={`px-3 py-1 text-xs rounded-md ${
                        watch("portfolio_allocation.historical_year") === year
                          ? "bg-primary text-white"
                          : "bg-gray-200 dark:bg-gray-700"
                      }`}
                      onClick={() => {
                        const form = useFormContext();
                        form.setValue("portfolio_allocation.historical_year", year);
                      }}
                    >
                      {year}
                    </button>
                  ))}
                </div>

                <FormItem>
                  <FormLabel htmlFor="portfolio_allocation.historical_year">Historical year</FormLabel>
                  <FormControl>
                    <Input
                      id="portfolio_allocation.historical_year"
                      type="number"
                      min={1871}
                      max={2025}
                      {...register("portfolio_allocation.historical_year", {
                        valueAsNumber: true,
                        required: "Year is required",
                        validate: (value) => {
                          if (value < 1871) return `Year must be between 1871 and 2025`;
                          if (value > 2025) return `Year must be between 1871 and 2025`;
                          return true;
                        },
                      })}
                      placeholder="Enter year (e.g., 1929)"
                    />
                  </FormControl>
                  <FormDescription>Select a specific year to simulate (range: 1871-2025)</FormDescription>
                  <FormMessage />
                </FormItem>
              </div>

              <div className="rounded-md bg-muted/50 p-3 text-sm">
                <p className="font-medium">Historical context:</p>
                <p className="mt-1">
                  {watch("portfolio_allocation.historical_year") === 1929 && "The Great Depression began after the 1929 Stock Market Crash. Unemployment reached 25% and GDP fell by nearly 30%."}
                  {watch("portfolio_allocation.historical_year") === 1974 && "1974 saw stagflation - high inflation combined with high unemployment. The Oil Crisis of 1973 caused oil prices to quadruple."}
                  {watch("portfolio_allocation.historical_year") === 2000 && "The Dot-com Bubble burst in 2000, wiping out nearly 50% of the stock market value. Many internet companies failed."}
                  {watch("portfolio_allocation.historical_year") === 2008 && "The Financial Crisis triggered by subprime mortgage defaults. The S&P 500 fell by nearly 40% from its peak."}
                  {watch("portfolio_allocation.historical_year") === 2020 && "The COVID-19 pandemic caused a sharp market crash in March 2020, but markets recovered quickly with government stimulus."}
                  {![1929, 1974, 2000, 2008, 2020].includes(watch("portfolio_allocation.historical_year")) && "Select one of the notable years above to see historical context."}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalSection;
