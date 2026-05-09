"use client";

import { FC } from "react";
import { useFormContext } from "react-hook-form";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { InfoIcon } from "lucide-react";

// Import the form data types
import type { FormData } from "@/app/(main)/dashboard/retirement/_components/RetirementForm";

interface IncomeSourcesSectionProps {
  className?: string;
}

export const IncomeSourcesSection: FC<IncomeSourcesSectionProps> = ({ className }) => {
  const { control, register, watch } = useFormContext<FormData>();

  return (
    <div data-slot="card" className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
      <div data-slot="card-header" className="@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6">
        <div data-slot="card-title" className="leading-none font-semibold">
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-content-center rounded-sm bg-muted">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-coins size-5" aria-hidden="true">
                <circle cx="8" cy="8" r="6"></circle>
                <path d="M18 8a6 6 0 0 1-6 6"></path>
                <circle cx="8" cy="16" r="6"></circle>
                <path d="M18 16a6 6 0 0 1-6-6"></path>
              </svg>
            </span>
            Income Sources
          </div>
        </div>
      </div>
      <div data-slot="card-content" className="px-6 space-y-6">
        <div className="space-y-6">
          {/* Social Security - You */}
          <div className="space-y-4">
            <h4 className="font-medium text-xs">Social Security (You)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <label htmlFor="income_streams.social_security_you.claim_age" className="block font-medium text-xs mb-0.5">Claim age</label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                        <InfoIcon className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      The age at which you plan to claim Social Security benefits. Claiming earlier reduces monthly payments, while waiting increases them.
                    </TooltipContent>
                  </Tooltip>
                </div>
                <input
                  id="income_streams.social_security_you.claim_age"
                  type="number"
                  min={62}
                  max={70}
                  {...register("income_streams.social_security_you.claim_age", { valueAsNumber: true })}
                  className="w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <label htmlFor="income_streams.social_security_you.yearly_amount_today_dollars" className="block font-medium text-xs mb-0.5">
                    Yearly amount (today's dollars)
                  </label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                        <InfoIcon className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      The annual Social Security benefit amount you expect to receive, adjusted for today's purchasing power.
                    </TooltipContent>
                  </Tooltip>
                </div>
                <input
                  id="income_streams.social_security_you.yearly_amount_today_dollars"
                  type="number"
                  min={0}
                  step={100}
                  {...register("income_streams.social_security_you.yearly_amount_today_dollars", { valueAsNumber: true })}
                  className="w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Social Security - Spouse */}
          <div className="space-y-4">
            <h4 className="font-medium text-xs">Social Security (Spouse)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <label htmlFor="income_streams.social_security_spouse.claim_age" className="block font-medium text-xs mb-0.5">Claim age</label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                        <InfoIcon className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      The age at which your spouse plans to claim Social Security benefits. Claiming earlier reduces monthly payments, while waiting increases them.
                    </TooltipContent>
                  </Tooltip>
                </div>
                <input
                  id="income_streams.social_security_spouse.claim_age"
                  type="number"
                  min={62}
                  max={70}
                  {...register("income_streams.social_security_spouse.claim_age", { valueAsNumber: true })}
                  className="w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <label htmlFor="income_streams.social_security_spouse.yearly_amount_today_dollars" className="block font-medium text-xs mb-0.5">
                    Yearly amount (today's dollars)
                  </label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                        <InfoIcon className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      The annual Social Security benefit amount your spouse expects to receive, adjusted for today's purchasing power.
                    </TooltipContent>
                  </Tooltip>
                </div>
                <input
                  id="income_streams.social_security_spouse.yearly_amount_today_dollars"
                  type="number"
                  min={0}
                  step={100}
                  {...register("income_streams.social_security_spouse.yearly_amount_today_dollars", { valueAsNumber: true })}
                  className="w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Pension 1 */}
          <div className="space-y-4">
            <h4 className="font-medium text-xs">Pension 1</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <label htmlFor="income_streams.pension_1.starting_age" className="block font-medium text-xs mb-0.5">Starting age</label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                        <InfoIcon className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      The age at which your pension benefits begin. This determines when you'll start receiving pension payments.
                    </TooltipContent>
                  </Tooltip>
                </div>
                <input
                  id="income_streams.pension_1.starting_age"
                  type="number"
                  min={18}
                  max={100}
                  {...register("income_streams.pension_1.starting_age", { valueAsNumber: true })}
                  className="w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <label htmlFor="income_streams.pension_1.yearly_amount" className="block font-medium text-xs mb-0.5">Yearly amount</label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                        <InfoIcon className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      The annual pension benefit amount you expect to receive, adjusted for today's purchasing power.
                    </TooltipContent>
                  </Tooltip>
                </div>
                <input
                  id="income_streams.pension_1.yearly_amount"
                  type="number"
                  min={0}
                  step={100}
                  {...register("income_streams.pension_1.yearly_amount", { valueAsNumber: true })}
                  className="w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Pension 2 */}
          <div className="space-y-4">
            <h4 className="font-medium text-xs">Pension 2 (optional)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <label htmlFor="income_streams.pension_2.starting_age" className="block font-medium text-xs mb-0.5">Starting age</label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                        <InfoIcon className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      The age at which your second pension benefits begin. This determines when you'll start receiving pension payments.
                    </TooltipContent>
                  </Tooltip>
                </div>
                <input
                  id="income_streams.pension_2.starting_age"
                  type="number"
                  min={18}
                  max={100}
                  {...register("income_streams.pension_2.starting_age", { valueAsNumber: true })}
                  className="w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <label htmlFor="income_streams.pension_2.yearly_amount" className="block font-medium text-xs mb-0.5">Yearly amount</label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                        <InfoIcon className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      The annual pension benefit amount you expect to receive from your second pension, adjusted for today's purchasing power.
                    </TooltipContent>
                  </Tooltip>
                </div>
                <input
                  id="income_streams.pension_2.yearly_amount"
                  type="number"
                  min={0}
                  step={100}
                  {...register("income_streams.pension_2.yearly_amount", { valueAsNumber: true })}
                  className="w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Rental Properties */}
          <div className="rounded-lg border p-4 space-y-4">
            <h4 className="font-medium text-xs">Rental Income (up to 3 properties)</h4>

            {[0, 1, 2].map((index) => (
              <div key={index} className="space-y-3 border-t pt-4">
                <h5 className="text-xs font-semibold uppercase text-gray-500">Property {index + 1}</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label htmlFor={`income_streams.rental_properties.${index}.property_name`} className="block font-medium text-xs mb-0.5">Name</label>
                    <div className="flex items-center gap-1">
                      <input
                        id={`income_streams.rental_properties.${index}.property_name`}
                        {...register(`income_streams.rental_properties.${index}.property_name`)}
                        className="w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
                        placeholder="Property A"
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
                    <label htmlFor={`income_streams.rental_properties.${index}.net_annual_income`} className="block font-medium text-xs mb-0.5">
                      Net annual income
                    </label>
                    <div className="flex items-center gap-1">
                      <input
                        id={`income_streams.rental_properties.${index}.net_annual_income`}
                        type="number"
                        min={0}
                        step={500}
                        {...register(`income_streams.rental_properties.${index}.net_annual_income`, { valueAsNumber: true })}
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

                  <div className="space-y-1">
                    <label htmlFor={`income_streams.rental_properties.${index}.until_age`} className="block font-medium text-xs mb-0.5">Until age</label>
                    <div className="flex items-center gap-1">
                      <input
                        id={`income_streams.rental_properties.${index}.until_age`}
                        type="number"
                        min={18}
                        max={120}
                        {...register(`income_streams.rental_properties.${index}.until_age`, { valueAsNumber: true })}
                        className="w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
                      />
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                            <InfoIcon className="h-3 w-3 text-muted-foreground" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-xs">
                          Age at which you expect to stop receiving income from this rental property (e.g., when selling the property).
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomeSourcesSection;