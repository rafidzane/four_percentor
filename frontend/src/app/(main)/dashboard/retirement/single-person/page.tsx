"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import SinglePersonRetirementCalculator from "./_components/SinglePersonRetirementCalculator";

export default function SinglePersonRetirementPage() {
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
          <div className="flex w-full flex-col gap-4">
            <div className="w-full">
              <div data-slot="card" className="w-full">
                <SinglePersonRetirementCalculator />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
