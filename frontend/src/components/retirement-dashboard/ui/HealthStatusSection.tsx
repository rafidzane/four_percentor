import { FC } from "react";
import { useFormContext } from "react-hook-form";
import { FormData } from "./RetirementForm";

interface HealthStatusSectionProps {
  className?: string;
}

export const HealthStatusSection: FC<HealthStatusSectionProps> = ({ className }) => {
  const { register, watch } = useFormContext<FormData>();

  // Watch health status to conditionally show lifespan override
  const healthStatus = watch("health_status");

  return (
    <section className={`rounded-xl border p-6 ${className}`}>
      <h3 className="text-lg font-semibold mb-4">Health & Longevity</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Health Status Dropdown */}
        <div className="space-y-2">
          <label htmlFor="health_status" className="block font-medium text-sm mb-1">
            Overall Health Status
          </label>
          <select
            id="health_status"
            {...register("health_status")}
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
          >
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="average">Average</option>
            <option value="fair">Fair</option>
            <option value="poor">Poor</option>
          </select>
          <p className="text-xs text-muted-foreground mt-1">
            This affects longevity estimates and healthcare cost projections
          </p>
        </div>

        {/* Chronic Conditions Checklist */}
        <div className="space-y-2">
          <label className="block font-medium text-sm mb-1">
            Chronic Conditions (select all that apply)
          </label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                id="chronic_conditions.diabetes"
                type="checkbox"
                {...register("chronic_conditions.diabetes")}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="chronic_conditions.diabetes" className="text-sm">
                Diabetes
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                id="chronic_conditions.heart_disease"
                type="checkbox"
                {...register("chronic_conditions.heart_disease")}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="chronic_conditions.heart_disease" className="text-sm">
                Heart Disease
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                id="chronic_conditions.cancer_history"
                type="checkbox"
                {...register("chronic_conditions.cancer_history")}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="chronic_conditions.cancer_history" className="text-sm">
                Cancer History
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                id="chronic_conditions.cognitive_decline"
                type="checkbox"
                {...register("chronic_conditions.cognitive_decline")}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="chronic_conditions.cognitive_decline" className="text-sm">
                Cognitive Decline Concerns
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                id="chronic_conditions.mobility_limitations"
                type="checkbox"
                {...register("chronic_conditions.mobility_limitations")}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="chronic_conditions.mobility_limitations" className="text-sm">
                Mobility Limitations
              </label>
            </div>
          </div>
        </div>

        {/* Lifespan Override */}
        <div className="space-y-2">
          <label htmlFor="expected_lifespan" className="block font-medium text-sm mb-1">
            Expected Lifespan (optional)
          </label>
          <input
            id="expected_lifespan"
            type="number"
            min={65}
            max={120}
            {...register("expected_lifespan", { valueAsNumber: true })}
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Override default longevity estimate based on your health or family history
          </p>
        </div>

        {/* Healthcare Cost Escalation */}
        <div className="space-y-2">
          <label htmlFor="healthcare_cost_escalation" className="block font-medium text-sm mb-1">
            Healthcare Cost Escalation Rate
          </label>
          <select
            id="healthcare_cost_escalation"
            {...register("healthcare_cost_escalation")}
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
          >
            <option value="normal">Normal (inflation + 1.5%)</option>
            <option value="high">High (inflation + 3%)</option>
            <option value="very_high">Very High (inflation + 5%)</option>
          </select>
          <p className="text-xs text-muted-foreground mt-1">
            Adjusts healthcare cost projections based on your health profile
          </p>
        </div>
      </div>
    </section>
  );
};