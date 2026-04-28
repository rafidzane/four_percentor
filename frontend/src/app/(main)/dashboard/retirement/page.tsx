import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RetirementForm } from "./_components/RetirementForm";
import { RetirementCharts } from "./_components/RetirementCharts";

export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Retirement Calculator</h2>
        <p className="text-muted-foreground mt-1">
          Plan your retirement with comprehensive input and projection tools
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
        {/* Left Column - Inputs */}
        <div className="lg:col-span-1 h-full">
          <RetirementForm />
        </div>
        
        {/* Right Column - Charts */}
        <div className="lg:col-span-1 h-full">
          <RetirementCharts />
        </div>
      </div>
    </div>
  );
}