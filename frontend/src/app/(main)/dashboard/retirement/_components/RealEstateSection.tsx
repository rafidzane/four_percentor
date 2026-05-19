"use client";

import { FC } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { InfoIcon, HomeIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Import the form data types
import type { FormData } from "@/app/(main)/dashboard/retirement/_components/RetirementForm";

interface RealEstateSectionProps {
  className?: string;
}

export const RealEstateSection: FC<RealEstateSectionProps> = ({ className }) => {
  const { control, register, watch } = useFormContext<FormData>();

  return (
    <section data-slot="card" className={cn(
      "group relative overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md",
      className
    )}>
      {/* Decorative accent bar */}
      <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500 opacity-80 transition-all group-hover:opacity-100" />

      {/* Header Section */}
      <div data-slot="card-header" className="relative px-4 py-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="grid size-7 place-content-center rounded-md bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-100 dark:border-blue-800/50 shadow-inner">
            <HomeIcon className="size-4 text-blue-600 dark:text-indigo-400" />
          </div>
          <h2 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Real Estate
          </h2>
        </div>
      </div>

      {/* Card Content */}
      <div data-slot="card-content" className="px-4 py-3 space-y-6">

      {/* Primary Home */}
      <div className="space-y-4 mb-6">
        <h4 className="font-medium text-xs">Primary Home</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label htmlFor="real_estate.total_property_value" className="block font-medium text-xs mb-0.5">Total property value</label>
            <div className="flex items-center gap-1">
              <input
                id="real_estate.total_property_value"
                type="number"
                min={0}
                step={5000}
                {...register("real_estate.total_property_value", { valueAsNumber: true })}
                className="w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                    <InfoIcon className="h-3 w-3 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs">
                  Total value of your primary home, including land and improvements.
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="real_estate.total_outstanding_mortgages" className="block font-medium text-xs mb-0.5">Outstanding mortgage(s)</label>
            <div className="flex items-center gap-1">
              <input
                id="real_estate.total_outstanding_mortgages"
                type="number"
                min={0}
                step={1000}
                {...register("real_estate.total_outstanding_mortgages", { valueAsNumber: true })}
                className="w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                    <InfoIcon className="h-3 w-3 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs">
                  Total outstanding balance on all mortgages secured by your primary home.
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="real_estate.annual_appreciation_pct" className="block font-medium text-xs mb-0.5">Annual appreciation %</label>
            <div className="flex items-center gap-1">
              <input
                id="real_estate.annual_appreciation_pct"
                type="number"
                min={0}
                max={20}
                step={0.1}
                {...register("real_estate.annual_appreciation_pct", { valueAsNumber: true })}
                className="w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                    <InfoIcon className="h-3 w-3 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs">
                  Expected annual appreciation rate of your primary home's value. Historical average is ~3%.
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>

      {/* Rental Properties */}
      <div className="space-y-4 mb-6">
        <h4 className="font-medium text-xs">Rental Properties (up to 3)</h4>

        {[0, 1, 2].map((index) => (
          <div key={index} className="space-y-3 border-t pt-4">
            <h5 className="text-xs font-semibold uppercase text-gray-500">Property {index + 1}</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label htmlFor={`real_estate.rental_properties.${index}.property_name`} className="block font-medium text-xs mb-0.5">Name</label>
                <div className="flex items-center gap-1">
                  <input
                    id={`real_estate.rental_properties.${index}.property_name`}
                    {...register(`real_estate.rental_properties.${index}.property_name` as any)}
                    className="w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
                    placeholder="Rental A"
                  />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                        <InfoIcon className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      Name or identifier for this rental property.
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor={`real_estate.rental_properties.${index}.value`} className="block font-medium text-xs mb-0.5">Property value</label>
                <div className="flex items-center gap-1">
                  <input
                    id={`real_estate.rental_properties.${index}.value`}
                    type="number"
                    min={0}
                    step={5000}
                    {...register(`real_estate.rental_properties.${index}.value`, { valueAsNumber: true })}
                    className="w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
                  />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                        <InfoIcon className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      Total value of this rental property including land and improvements.
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor={`real_estate.rental_properties.${index}.net_annual_income`} className="block font-medium text-xs mb-0.5">
                  Net annual income
                </label>
                <div className="flex items-center gap-1">
                  <input
                    id={`real_estate.rental_properties.${index}.net_annual_income`}
                    type="number"
                    min={0}
                    step={500}
                    {...register(`real_estate.rental_properties.${index}.net_annual_income`, { valueAsNumber: true })}
                    className="w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
                  />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                        <InfoIcon className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      Net annual income from this rental property after all expenses (taxes, maintenance, vacancies).
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Downsizing Plan */}
      <div className="space-y-4">
        <h4 className="font-medium text-xs">Downsizing Plan</h4>

        <label className="flex items-center space-x-3 cursor-pointer mb-4">
          <input
            id="real_estate.model_property_sale"
            type="checkbox"
            {...register("real_estate.model_property_sale")}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <span>Model planned property sale (downsizing in retirement)</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                <InfoIcon className="h-3 w-3 text-muted-foreground" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-xs">
              Check if you plan to sell a property during retirement to supplement income.
            </TooltipContent>
          </Tooltip>
        </label>

        {watch("real_estate.model_property_sale") && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="real_estate.age_of_sale" className="block font-medium text-xs mb-0.5">Age of sale</label>
                <div className="flex items-center gap-1">
                  <input
                    id="real_estate.age_of_sale"
                    type="number"
                    min={18}
                    max={100}
                    {...register("real_estate.age_of_sale", { valueAsNumber: true })}
                    className="w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
                  />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                        <InfoIcon className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      Age at which you plan to sell the property. This affects your retirement timeline and income planning.
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="real_estate.amount_rolled_into_portfolio" className="block font-medium text-xs mb-0.5">
                  Amount rolled into portfolio
                </label>
                <div className="flex items-center gap-1">
                  <input
                    id="real_estate.amount_rolled_into_portfolio"
                    type="number"
                    min={0}
                    step={5000}
                    {...register("real_estate.amount_rolled_into_portfolio", { valueAsNumber: true })}
                    className="w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
                  />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                        <InfoIcon className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      Amount from the property sale that will be added to your investment portfolio.
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      </div>
    </section>
  );
};

export default RealEstateSection;