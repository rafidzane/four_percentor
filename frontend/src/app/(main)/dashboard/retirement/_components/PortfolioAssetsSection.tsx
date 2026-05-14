"use client";

import { FC, useMemo } from "react";
import { useFormContext, Controller, useWatch } from "react-hook-form";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { InfoIcon, WalletMinimalIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Import the form data types and validation components
import type { FormData } from "@/app/(main)/dashboard/retirement/_components/RetirementForm";
import { ValidationError } from "@/components/retirement-dashboard/ui/ValidationErrors";

interface PortfolioAssetsSectionProps {
  className?: string;
}

export const PortfolioAssetsSection: FC<PortfolioAssetsSectionProps> = ({ className }) => {
  const { control, register, watch, formState: { errors } } = useFormContext<FormData>();

  // Watch values for conditional rendering and validation
  const equityPct = useWatch({ control, name: "portfolio_allocation.equity_pct" });
  const fixedIncomePct = useWatch({ control, name: "portfolio_allocation.fixed_income_pct" });
  const simulationMode = watch("portfolio_allocation.simulation_mode");
  const spouseAge = watch("timeline.spouse_age");

  // Check if spouse info should be shown
  const showSpouseFields = spouseAge !== undefined && spouseAge > 0;

  // Validate allocation totals using useMemo to prevent recalculations
  const validationErrors = useMemo(() => {
    const newErrors: Record<string, string> = {};

    if (equityPct !== undefined && fixedIncomePct !== undefined) {
      const total = equityPct + fixedIncomePct;
      if (total > 100) {
        newErrors["portfolio_allocation"] = "Total allocation cannot exceed 100%";
      } else if (total < 100 && equityPct > 0 && fixedIncomePct > 0) {
        // Optional: warn if not totaling to 100% when both are set
        newErrors["portfolio_allocation"] = "Total allocation should equal 100%";
      }
    }

    return newErrors;
  }, [equityPct, fixedIncomePct]);

  return (
    <section data-slot="card" className={cn(
      "group relative overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md",
      className
    )}>
      {/* Decorative accent bar */}
      <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500 opacity-80 transition-all group-hover:opacity-100" />

      {/* Header Section */}
      <div className="relative px-4 py-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="grid size-7 place-content-center rounded-md bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-100 dark:border-blue-800/50 shadow-inner">
            <WalletMinimalIcon className="size-4 text-blue-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Portfolio Assets
          </h2>
        </div>
      </div>

      {/* Card Content */}
      <div data-slot="card-content" className="px-4 py-3 space-y-3">
        
        {/* Validation Error Banner for Allocation */}
        {validationErrors["portfolio_allocation"] && (
          <ValidationError field="portfolio_allocation" message={validationErrors["portfolio_allocation"]} />
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <label htmlFor="current_assets.investment_portfolio" className="block font-medium text-xs mb-0.5">Investment portfolio</label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                    <InfoIcon className="h-3 w-3 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-sm px-3 py-1.5 text-xs">
                  Taxable brokerage, ETFs, mutual funds balance. This represents your total non-retirement investment assets.
                </TooltipContent>
              </Tooltip>
            </div>
            <Controller
              name="current_assets.investment_portfolio"
              control={control}
              rules={{
                min: { value: 0, message: "Value cannot be negative" },
              }}
              render={({ field }) => (
                <>
                  <input
                    id="current_assets.investment_portfolio"
                    type="number"
                    {...field}
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                    className={`w-full rounded-md border bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none ${
                      errors.current_assets?.investment_portfolio ? "border-red-500 ring-red-500" : ""
                    }`}
                  />
                  {errors.current_assets?.investment_portfolio && (
                    <ValidationError field="current_assets.investment_portfolio" message={errors.current_assets.investment_portfolio.message ?? "Invalid value"} />
                  )}
                </>
              )}
            />
            <p className="text-xs text-muted-foreground mt-0.5">Taxable brokerage, ETFs, mutual funds</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <label htmlFor="current_assets.your_401k_ira" className="block font-medium text-xs mb-0.5">Your 401(k) / IRA</label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                    <InfoIcon className="h-3 w-3 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs">
                  Individual retirement account balance. This includes your 401(k), IRA, and other tax-advantaged accounts.
                </TooltipContent>
              </Tooltip>
            </div>
            <Controller
              name="current_assets.your_401k_ira"
              control={control}
              rules={{
                min: { value: 0, message: "Value cannot be negative" },
              }}
              render={({ field }) => (
                <>
                  <input
                    id="current_assets.your_401k_ira"
                    type="number"
                    value={field.value ?? ''}
                    onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                    className={`w-full rounded-md border bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none ${
                      errors.current_assets?.your_401k_ira ? "border-red-500 ring-red-500" : ""
                    }`}
                  />
                  {errors.current_assets?.your_401k_ira && (
                    <ValidationError field="current_assets.your_401k_ira" message={errors.current_assets.your_401k_ira.message ?? "Invalid value"} />
                  )}
                </>
              )}
            />
            <p className="text-xs text-muted-foreground mt-0.5">Individual retirement account balance</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <label htmlFor="current_assets.spouse_401k_ira" className="block font-medium text-xs mb-0.5">Spouse 401(k) / IRA</label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                    <InfoIcon className="h-3 w-3 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs">
                  Spouse retirement account balance. This includes spouse's 401(k), IRA, and other tax-advantaged accounts.
                </TooltipContent>
              </Tooltip>
            </div>
            {(showSpouseFields || showSpouseFields === false) && (
              <Controller
                name="current_assets.spouse_401k_ira"
                control={control}
                rules={{
                  min: { value: 0, message: "Value cannot be negative" },
                }}
                render={({ field }) => (
                  <>
                    <input
                      id="current_assets.spouse_401k_ira"
                      type="number"
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                      className={`w-full rounded-md border bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none ${
                        errors.current_assets?.spouse_401k_ira ? "border-red-500 ring-red-500" : ""
                      }`}
                    />
                    {errors.current_assets?.spouse_401k_ira && (
                      <ValidationError field="current_assets.spouse_401k_ira" message={errors.current_assets.spouse_401k_ira.message ?? "Invalid value"} />
                    )}
                  </>
                )}
              />
            )}
            {(showSpouseFields || showSpouseFields === false) && (
              <p className="text-xs text-muted-foreground mt-0.5 animate-in fade-in slide-in-from-top-2 duration-300">Spouse retirement account balance</p>
            )}
          </div>
        </div>

        {/* Contributions Section - moved into Portfolio Assets */}
        <div className="mt-3">
          <h4 className="font-medium mb-2">Contributions</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <label htmlFor="current_assets.yearly_contribution" className="block font-medium text-xs mb-0.5">Yearly contribution</label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                      <InfoIcon className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    Amount contributed to retirement accounts annually. This represents your regular investment into retirement savings.
                  </TooltipContent>
                </Tooltip>
              </div>
              <Controller
                name="current_assets.yearly_contribution"
                control={control}
                rules={{
                  min: { value: 0, message: "Contribution cannot be negative" },
                }}
                render={({ field }) => (
                  <>
                    <input
                      id="current_assets.yearly_contribution"
                      type="number"
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                      className={`w-full rounded-md border bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none ${
                        errors.current_assets?.yearly_contribution ? "border-red-500 ring-red-500" : ""
                      }`}
                    />
                    {errors.current_assets?.yearly_contribution && (
                      <ValidationError field="current_assets.yearly_contribution" message={errors.current_assets.yearly_contribution.message ?? "Invalid value"} />
                    )}
                  </>
                )}
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <label htmlFor="current_assets.yearly_contribution_increase_pct" className="block font-medium text-xs mb-0.5">
                  Contribution increase %
                </label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                      <InfoIcon className="h-3 w-3 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    Annual percentage increase in contributions (e.g., 3% for inflation adjustment). This helps maintain purchasing power.
                  </TooltipContent>
                </Tooltip>
              </div>
              <Controller
                name="current_assets.yearly_contribution_increase_pct"
                control={control}
                rules={{
                  min: { value: 0, message: "Increase percentage cannot be negative" },
                  max: { value: 100, message: "Increase percentage cannot exceed 100%" },
                }}
                render={({ field }) => (
                  <>
                    <input
                      id="current_assets.yearly_contribution_increase_pct"
                      type="number"
                      value={field.value ?? ''}
                      onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                      className={`w-full rounded-md border bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none ${
                        errors.current_assets?.yearly_contribution_increase_pct ? "border-red-500 ring-red-500" : ""
                      }`}
                    />
                    {errors.current_assets?.yearly_contribution_increase_pct && (
                      <ValidationError field="current_assets.yearly_contribution_increase_pct" message={errors.current_assets.yearly_contribution_increase_pct.message ?? "Invalid value"} />
                    )}
                  </>
                )}
              />
            </div>

            <div className="flex items-center space-x-2 mt-3 pt-2">
              <input
                id="current_assets.catch_up_contributions"
                type="checkbox"
                {...register("current_assets.catch_up_contributions")}
                className="h-3 w-3 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="current_assets.catch_up_contributions" className="text-xs">
                Catch-up contrib.
              </label>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                    <InfoIcon className="h-3 w-3 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs">
                  Option for additional contributions after age 50 (e.g., $7,500 instead of $6,500)
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
        <div className="mt-3">
          {/* ReturnsSection will be imported here from the original component */}
        </div>
      </div>
    </section>
  );
};

export default PortfolioAssetsSection;