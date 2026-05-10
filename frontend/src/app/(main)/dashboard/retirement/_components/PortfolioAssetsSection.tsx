"use client";

import { FC, useMemo } from "react";
import { useFormContext, Controller, useWatch } from "react-hook-form";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { InfoIcon } from "lucide-react";

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
    <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border-l-4 border-blue-500 py-6 shadow-sm mt-3">
      <div data-slot="card-header" className="@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6">
        <div data-slot="card-title" className="leading-none font-semibold flex items-center gap-2">
          <span className="grid size-7 place-content-center rounded-sm bg-muted">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-wallet-minimal size-5" aria-hidden="true">
              <path d="M17 14h.01"></path>
              <path d="M7 7h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14"></path>
            </svg>
          </span>
          Portfolio Assets
        </div>
      </div>
      <div data-slot="card-content" className="px-6 space-y-4">
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
                    {...field}
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
                    {...field}
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
            <p className="text-xs text-muted-foreground mt-0.5">Spouse retirement account balance</p>
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
                      {...field}
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
                      {...field}
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
    </div>
  );
};

export default PortfolioAssetsSection;