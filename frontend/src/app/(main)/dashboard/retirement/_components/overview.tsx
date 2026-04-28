import { RetirementStatCard } from "./card-retirement-stat";

export function Overview() {
  return (
    <div className="flex flex-col gap-4 **:data-[slot=card]:shadow-xs">
      <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:gap-2 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
        <RetirementStatCard
          title="Current Age"
          value="35"
          description="Your current age"
        />
        <RetirementStatCard
          title="Target Retirement Age"
          value="65"
          description="Planned retirement year"
        />
        <RetirementStatCard
          title="Estimated Savings"
          value="$250,000"
        />
        <RetirementStatCard
          title="Years to Retirement"
          value="30"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <div className="flex flex-col gap-4">
          <RetirementStatCard
            title="Monthly Contribution"
            value="$1,500"
          />
          <RetirementStatCard
            title="Expected Return"
            value="7%"
          />
        </div>

        <RetirementStatCard
          title="Projected Portfolio"
          value="$3.2M"
        />
      </div>
    </div>
  );
}
