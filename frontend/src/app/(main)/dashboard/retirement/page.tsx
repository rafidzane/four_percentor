import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RetirementForm } from "./_components/RetirementForm";
import { RetirementCharts } from "./_components/RetirementCharts";
import { RetirementResultsSummary } from "@/components/retirement-dashboard/ui/RetirementResultsSummary";
import { useState } from "react";

export default function Page() {
  // We'll need to pass the result data to our component
  // For now, we'll create a placeholder - in a real implementation this would be passed down
  const [result, setResult] = useState(null);
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Retirement Calculator</h2>
        <p className="text-muted-foreground mt-1">
          Plan your retirement with comprehensive input and projection tools
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Inputs */}
        <div className="lg:col-span-1 flex flex-col">
          <RetirementForm setResult={setResult} />
        </div>

        {/* Right Column - Charts */}
        <div className="lg:col-span-1 flex flex-col">
          {result && <RetirementResultsSummary result={result} />}
          <RetirementCharts />
        </div>
      </div>
    </div>
  );
}
