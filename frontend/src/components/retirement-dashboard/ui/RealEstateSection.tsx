"use client";

import { FC } from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { FormItem, FormLabel, FormDescription, FormControl, FormMessage } from "@/components/ui/form";

interface RealEstateSectionProps {
  className?: string;
}

export const RealEstateSection: FC<RealEstateSectionProps> = ({ className }) => {
  const { register, watch } = useFormContext();

  // Watch property sale toggle
  const modelPropertySale = watch("real_estate.model_property_sale", false);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Primary Home */}
      <div className="rounded-lg border p-4 space-y-4">
        <FormLabel className="text-lg font-semibold">Primary Home</FormLabel>

        <FormItem>
          <FormLabel htmlFor="real_estate.total_property_value">Total property value</FormLabel>
          <FormControl>
            <Input
              id="real_estate.total_property_value"
              type="number"
              min={0}
              step={5000}
              {...register("real_estate.total_property_value", { valueAsNumber: true })}
              placeholder="$400,000"
            />
          </FormControl>
          <FormDescription>Current market value of primary residence</FormDescription>
          <FormMessage />
        </FormItem>

        <FormItem>
          <FormLabel htmlFor="real_estate.total_outstanding_mortgages">Outstanding mortgage(s)</FormLabel>
          <FormControl>
            <Input
              id="real_estate.total_outstanding_mortgages"
              type="number"
              min={0}
              step={1000}
              {...register("real_estate.total_outstanding_mortgages", { valueAsNumber: true })}
              placeholder="$250,000"
            />
          </FormControl>
          <FormDescription>Remaining loan balance</FormDescription>
          <FormMessage />
        </FormItem>

        <FormItem>
          <FormLabel htmlFor="real_estate.annual_appreciation_pct">Annual appreciation %</FormLabel>
          <FormControl>
            <Input
              id="real_estate.annual_appreciation_pct"
              type="number"
              min={0}
              max={20}
              step={0.1}
              {...register("real_estate.annual_appreciation_pct", { valueAsNumber: true })}
              placeholder="3.0"
            />
          </FormControl>
          <FormDescription>Expected annual home value increase</FormDescription>
          <FormMessage />
        </FormItem>

        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
          <FormControl>
            <input
              id="real_estate.include_in_net_worth"
              type="checkbox"
              {...register("real_estate.include_in_net_worth")}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel htmlFor="real_estate.include_in_net_worth">Include in net worth projection</FormLabel>
            <FormDescription>Include home equity in portfolio balance calculations</FormDescription>
          </div>
        </FormItem>
      </div>

      {/* Rental Properties */}
      <div className="rounded-lg border p-4 space-y-4">
        <FormLabel className="text-lg font-semibold">Rental Properties (up to 3)</FormLabel>

 {[0, 1, 2].map((index) => (
          <div key={index} className="space-y-3 border-t pt-4">
            <h4 className="font-medium text-sm">Rental Property {index + 1}</h4>
            <div className="grid grid-cols-2 gap-4">
              <FormItem className="col-span-2">
                <FormLabel htmlFor={`real_estate.rental_properties.${index}.property_name`}>Property name</FormLabel>
                <FormControl>
                  <Input
                    id={`real_estate.rental_properties.${index}.property_name`}
                    {...register(`real_estate.rental_properties.${index}.property_name`)}
                    placeholder="Rental A"
                  />
                </FormControl>
              </FormItem>

              <FormItem>
                <FormLabel htmlFor={`real_estate.rental_properties.${index}.value`}>Property value</FormLabel>
                <FormControl>
                  <Input
                    id={`real_estate.rental_properties.${index}.value`}
                    type="number"
                    min={0}
                    step={5000}
                    {...register(`real_estate.rental_properties.${index}.value`, { valueAsNumber: true })}
                    placeholder="$250,000"
                  />
                </FormControl>
              </FormItem>

              <FormItem>
                <FormLabel htmlFor={`real_estate.rental_properties.${index}.net_annual_income`}>
                  Net annual income
                </FormLabel>
                <FormControl>
                  <Input
                    id={`real_estate.rental_properties.${index}.net_annual_income`}
                    type="number"
                    min={0}
                    step={500}
                    {...register(`real_estate.rental_properties.${index}.net_annual_income`, { valueAsNumber: true })}
                    placeholder="$12,000"
                  />
                </FormControl>
              </FormItem>

              <FormItem>
                <FormLabel htmlFor={`real_estate.rental_properties.${index}.annual_appreciation_pct`}>
                  Appreciation %
                </FormLabel>
                <FormControl>
                  <Input
                    id={`real_estate.rental_properties.${index}.annual_appreciation_pct`}
                    type="number"
                    min={0}
                    max={20}
                    step={0.5}
                    {...register(`real_estate.rental_properties.${index}.annual_appreciation_pct`, { valueAsNumber: true })}
                    placeholder="3.0"
                  />
                </FormControl>
              </FormItem>
            </div>
          </div>
        ))}
      </div>

      {/* Downsizing Plan */}
      <div className="rounded-lg border p-4 space-y-4">
        <FormLabel className="text-lg font-semibold">Downsizing Plan (optional)</FormLabel>

        <div className="space-y-4">
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <input
                id="real_estate.model_property_sale"
                type="checkbox"
                {...register("real_estate.model_property_sale")}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel htmlFor="real_estate.model_property_sale">Model planned property sale</FormLabel>
              <FormDescription>Sell primary home and downsize in retirement</FormDescription>
            </div>
          </FormItem>

          {modelPropertySale && (
            <>
              <FormItem>
                <FormLabel htmlFor="real_estate.age_of_sale">Age of sale</FormLabel>
                <FormControl>
                  <Input
                    id="real_estate.age_of_sale"
                    type="number"
                    min={18}
                    max={100}
                    {...register("real_estate.age_of_sale", { valueAsNumber: true })}
                    placeholder="70"
                  />
                </FormControl>
                <FormDescription>Age when property will be sold</FormDescription>
                <FormMessage />
              </FormItem>

              <FormItem>
                <FormLabel htmlFor="real_estate.amount_rolled_into_portfolio">
                  Amount rolled into portfolio
                </FormLabel>
                <FormControl>
                  <Input
                    id="real_estate.amount_rolled_into_portfolio"
                    type="number"
                    min={0}
                    step={5000}
                    {...register("real_estate.amount_rolled_into_portfolio", { valueAsNumber: true })}
                    placeholder="$300,000"
                  />
                </FormControl>
                <FormDescription>Net proceeds added to retirement portfolio</FormDescription>
                <FormMessage />
              </FormItem>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RealEstateSection;
