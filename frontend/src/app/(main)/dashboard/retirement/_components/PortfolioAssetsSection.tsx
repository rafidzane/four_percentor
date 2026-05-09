"use client";

import { FC } from "react";
import { useFormContext } from "react-hook-form";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { InfoIcon } from "lucide-react";

// Import the form data types
import type { FormData } from "@/app/(main)/dashboard/retirement/_components/RetirementForm";

interface PortfolioAssetsSectionProps {
  className?: string;
}

export const PortfolioAssetsSection: FC<PortfolioAssetsSectionProps> = ({ className }) => {
  const { control, register, watch } = useFormContext<FormData>();
  
  // Watch values for conditional rendering
  const equityPct = watch("portfolio_allocation.equity_pct");
  const simulationMode = watch("portfolio_allocation.simulation_mode");

  return (
    <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm mt-3">
      <div data-slot="card-header" className="@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6">
        <div data-slot="card-title" className="leading-none font-semibold">
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-content-center rounded-sm bg-muted">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-wallet-minimal size-5" aria-hidden="true">
                <path d="M17 14h.01"></path>
                <path d="M7 7h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14"></path>
              </svg>
            </span>
            Portfolio Assets
          </div>
        </div>
      </div>
      <div data-slot="card-content" className="px-6 space-y-4">
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
            <div className="flex items-center gap-1">
              <input
                id="current_assets.investment_portfolio"
                type="number"
                min={0}
                step={1000}
                {...register("current_assets.investment_portfolio", { valueAsNumber: true })}
                className="w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
              />
            </div>
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
            <div className="flex items-center gap-1">
              <input
                id="current_assets.your_401k_ira"
                type="number"
                min={0}
                step={1000}
                {...register("current_assets.your_401k_ira", { valueAsNumber: true })}
                className="w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
              />
            </div>
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
            <div className="flex items-center gap-1">
              <input
                id="current_assets.spouse_401k_ira"
                type="number"
                min={0}
                step={1000}
                {...register("current_assets.spouse_401k_ira", { valueAsNumber: true })}
                className="w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
              />
            </div>
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
              <div className="flex items-center gap-1">
                <input
                  id="current_assets.yearly_contribution"
                  type="number"
                  min={0}
                  step={500}
                  {...register("current_assets.yearly_contribution", { valueAsNumber: true })}
                  className="w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
                />
              </div>
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
              <div className="flex items-center gap-1">
                <input
                  id="current_assets.yearly_contribution_increase_pct"
                  type="number"
                  min={0}
                  max={100}
                  step={0.5}
                  {...register("current_assets.yearly_contribution_increase_pct", { valueAsNumber: true })}
                  className="w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
                />
              </div>
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