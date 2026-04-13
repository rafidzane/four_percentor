'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import RetirementCalculator from "./_components/RetirementCalculator";

export default function RetirementPage() {
  return (
    <div>
      <Tabs className="gap-4" defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger disabled value="activity">
            Activity
          </TabsTrigger>
          <TabsTrigger disabled value="insights">
            Insights
          </TabsTrigger>
          <TabsTrigger disabled value="utilities">
            Utilities
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="flex flex-col gap-4 w-full">
            <div className="w-full">
              <div data-slot="card" className="w-full">
                <RetirementCalculator />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}