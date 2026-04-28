"use client";

import { FC } from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { FormItem, FormLabel, FormDescription, FormControl, FormMessage } from "@/components/ui/form";

interface IncomeSourcesSectionProps {
  className?: string;
}

export const IncomeSourcesSection: FC<IncomeSourcesSectionProps> = ({ className }) => {
  const { register } = useFormContext();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Social Security - You */}
      <div className="rounded-lg border p-4 space-y-4">
        <FormLabel className="text-lg font-semibold">Social Security (You)</FormLabel>

        <FormItem>
          <FormLabel htmlFor="income_streams.social_security_you.claim_age">Claim age</FormLabel>
          <FormControl>
            <Input
              id="income_streams.social_security_you.claim_age"
              type="number"
              min={62}
              max={70}
              {...register("income_streams.social_security_you.claim_age", { valueAsNumber: true })}
              placeholder="62"
            />
          </FormControl>
          <FormDescription>Age to start receiving benefits</FormDescription>
          <FormMessage />
        </FormItem>

        <FormItem>
          <FormLabel htmlFor="income_streams.social_security_you.yearly_amount_today_dollars">
            Yearly amount (today's dollars)
          </FormLabel>
          <FormControl>
            <Input
              id="income_streams.social_security_you.yearly_amount_today_dollars"
              type="number"
              min={0}
              step={100}
              {...register("income_streams.social_security_you.yearly_amount_today_dollars", { valueAsNumber: true })}
              placeholder="20000"
            />
          </FormControl>
          <FormDescription>Estimated annual benefit at claimed age</FormDescription>
          <FormMessage />
        </FormItem>

        <FormItem>
          <FormLabel htmlFor="income_streams.social_security_you.cola_adjustment">COLA adjustment</FormLabel>
          <FormControl>
            <Select
              value={register("income_streams.social_security_you.cola_adjustment").value || "inflation"}
              onValueChange={(value) => register("income_streams.social_security_you.cola_adjustment").onChange(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inflation">Based on inflation</SelectItem>
                <SelectItem value="fixed">Fixed percentage</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormDescription>How benefits are adjusted each year</FormDescription>
          <FormMessage />
        </FormItem>
      </div>

      {/* Social Security - Spouse */}
      <div className="rounded-lg border p-4 space-y-4">
        <FormLabel className="text-lg font-semibold">Social Security (Spouse)</FormLabel>

        <FormItem>
          <FormLabel htmlFor="income_streams.social_security_spouse.claim_age">Claim age</FormLabel>
          <FormControl>
            <Input
              id="income_streams.social_security_spouse.claim_age"
              type="number"
              min={62}
              max={70}
              {...register("income_streams.social_security_spouse.claim_age", { valueAsNumber: true })}
              placeholder="62"
            />
          </FormControl>
          <FormDescription>Age to start receiving benefits</FormDescription>
          <FormMessage />
        </FormItem>

        <FormItem>
          <FormLabel htmlFor="income_streams.social_security_spouse.yearly_amount_today_dollars">
            Yearly amount (today's dollars)
          </FormLabel>
          <FormControl>
            <Input
              id="income_streams.social_security_spouse.yearly_amount_today_dollars"
              type="number"
              min={0}
              step={100}
              {...register("income_streams.social_security_spouse.yearly_amount_today_dollars", { valueAsNumber: true })}
              placeholder="15000"
            />
          </FormControl>
          <FormDescription>Estimated annual benefit at claimed age</FormDescription>
          <FormMessage />
        </FormItem>
      </div>

      {/* Pension 1 */}
      <div className="rounded-lg border p-4 space-y-4">
        <FormLabel className="text-lg font-semibold">Pension 1</FormLabel>

        <FormItem>
          <FormLabel htmlFor="income_streams.pension_1.starting_age">Starting age</FormLabel>
          <FormControl>
            <Input
              id="income_streams.pension_1.starting_age"
              type="number"
              min={18}
              max={100}
              {...register("income_streams.pension_1.starting_age", { valueAsNumber: true })}
              placeholder="65"
            />
          </FormControl>
          <FormDescription>Age pension begins</FormDescription>
          <FormMessage />
        </FormItem>

        <FormItem>
          <FormLabel htmlFor="income_streams.pension_1.yearly_amount">Yearly amount</FormLabel>
          <FormControl>
            <Input
              id="income_streams.pension_1.yearly_amount"
              type="number"
              min={0}
              step={100}
              {...register("income_streams.pension_1.yearly_amount", { valueAsNumber: true })}
              placeholder="30000"
            />
          </FormControl>
          <FormDescription>Annual pension payment</FormDescription>
          <FormMessage />
        </FormItem>

        <FormItem>
          <FormLabel htmlFor="income_streams.pension_1.annual_cola_pct">COLA %</FormLabel>
          <FormControl>
            <Input
              id="income_streams.pension_1.annual_cola_pct"
              type="number"
              min={0}
              max={20}
              step={0.5}
              {...register("income_streams.pension_1.annual_cola_pct", { valueAsNumber: true })}
              placeholder="2.5"
            />
          </FormControl>
          <FormDescription>Annual cost-of-living adjustment</FormDescription>
          <FormMessage />
        </FormItem>
      </div>

      {/* Pension 2 */}
      <div className="rounded-lg border p-4 space-y-4">
        <FormLabel className="text-lg font-semibold">Pension 2 (optional)</FormLabel>

        <FormItem>
          <FormLabel htmlFor="income_streams.pension_2.starting_age">Starting age</FormLabel>
          <FormControl>
            <Input
              id="income_streams.pension_2.starting_age"
              type="number"
              min={18}
              max={100}
              {...register("income_streams.pension_2.starting_age", { valueAsNumber: true })}
              placeholder="70"
            />
          </FormControl>
          <FormDescription>Age pension begins</FormDescription>
          <FormMessage />
        </FormItem>

        <FormItem>
          <FormLabel htmlFor="income_streams.pension_2.yearly_amount">Yearly amount</FormLabel>
          <FormControl>
            <Input
              id="income_streams.pension_2.yearly_amount"
              type="number"
              min={0}
              step={100}
              {...register("income_streams.pension_2.yearly_amount", { valueAsNumber: true })}
              placeholder="15000"
            />
          </FormControl>
          <FormDescription>Annual pension payment</FormDescription>
          <FormMessage />
        </FormItem>
      </div>

      {/* One-time Benefits */}
      <div className="rounded-lg border p-4 space-y-4">
        <FormLabel className="text-lg font-semibold">One-time Cash Benefits (up to 2)</FormLabel>

        {[0, 1].map((index) => (
          <div key={index} className="space-y-3 border-t pt-4">
            <h4 className="font-medium text-sm">Benefit {index + 1}</h4>
            <div className="grid grid-cols-2 gap-4">
              <FormItem>
                <FormLabel htmlFor={`income_streams.one_time_benefits.${index}.age_received`}>
                  Age received
                </FormLabel>
                <FormControl>
                  <Input
                    id={`income_streams.one_time_benefits.${index}.age_received`}
                    type="number"
                    min={18}
                    max={100}
                    {...register(`income_streams.one_time_benefits.${index}.age_received`, { valueAsNumber: true })}
                    placeholder="55"
                  />
                </FormControl>
              </FormItem>

              <FormItem>
                <FormLabel htmlFor={`income_streams.one_time_benefits.${index}.amount`}>Amount</FormLabel>
                <FormControl>
                  <Input
                    id={`income_streams.one_time_benefits.${index}.amount`}
                    type="number"
                    min={0}
                    step={5000}
                    {...register(`income_streams.one_time_benefits.${index}.amount`, { valueAsNumber: true })}
                    placeholder="10000"
                  />
                </FormControl>
              </FormItem>
            </div>
          </div>
        ))}
      </div>

      {/* Rental Properties */}
      <div className="rounded-lg border p-4 space-y-4">
        <FormLabel className="text-lg font-semibold">Rental Income (up to 3)</FormLabel>

 {[0, 1, 2].map((index) => (
          <div key={index} className="space-y-3 border-t pt-4">
            <h4 className="font-medium text-sm">Rental Property {index + 1}</h4>
            <div className="grid grid-cols-2 gap-4">
              <FormItem className="col-span-2">
                <FormLabel htmlFor={`income_streams.rental_properties.${index}.property_name`}>Property name</FormLabel>
                <FormControl>
                  <Input
                    id={`income_streams.rental_properties.${index}.property_name`}
                    {...register(`income_streams.rental_properties.${index}.property_name`)}
                    placeholder="Property A"
                  />
                </FormControl>
              </FormItem>

              <FormItem>
                <FormLabel htmlFor={`income_streams.rental_properties.${index}.net_annual_income`}>
                  Net annual income
                </FormLabel>
                <FormControl>
                  <Input
                    id={`income_streams.rental_properties.${index}.net_annual_income`}
                    type="number"
                    min={0}
                    step={500}
                    {...register(`income_streams.rental_properties.${index}.net_annual_income`, { valueAsNumber: true })}
                    placeholder="5000"
                  />
                </FormControl>
              </FormItem>

              <FormItem>
                <FormLabel htmlFor={`income_streams.rental_properties.${index}.until_age`}>Until age</FormLabel>
                <FormControl>
                  <Input
                    id={`income_streams.rental_properties.${index}.until_age`}
                    type="number"
                    min={18}
                    max={120}
                    {...register(`income_streams.rental_properties.${index}.until_age`, { valueAsNumber: true })}
                    placeholder="80"
                  />
                </FormControl>
              </FormItem>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IncomeSourcesSection;
