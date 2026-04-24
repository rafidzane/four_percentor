"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import type { TwoPersonCalculationResults } from "../PrimaryMetrics";

interface ChartDataPoint {
  years: number;
  person1: number;
  person2: number;
  household: number;
}

interface Props {
  results: TwoPersonCalculationResults | null;
}

export default function ProjectionGrowthChart({ results }: Props) {
  if (!results) {
    return (
      <div className="flex h-80 w-full items-center justify-center rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-gray-500">Loading chart...</p>
      </div>
    );
  }

  const { projection1, projection2, householdProjection } = results;

  const generateChartData = (): ChartDataPoint[] => {
    const yearsToRetirement = householdProjection.yearsToRetirement;
    const data: ChartDataPoint[] = [];

    for (let year = 0; year <= yearsToRetirement; year++) {
      data.push({
        years: year,
        person1: projection1?.totalLiquidSavingsAtRetirement ?? 0,
        person2: projection2?.totalLiquidSavingsAtRetirement ?? 0,
        household: householdProjection.totalLiquidSavingsAtRetirement,
      });
    }

    return data;
  };

  const chartData = generateChartData();

  return (
    <div className="h-80 w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="mb-4 text-center font-semibold text-gray-700">
        Projection Growth
      </h3>
      <div className="w-full h-full">
        <LineChart data={chartData} width="100%" height="100%">
          <XAxis
            dataKey="years"
            label={{ value: "Years Until Retirement", position: "insideBottom", offset: -5 }}
          />
          <YAxis
            domain={[0, "auto"]}
            tickFormatter={(value) => `$${value}`}
            label={{ value: "Liquid Savings ($)", angle: -90, position: "insideLeft" }}
          />
          <Tooltip formatter={(value) => `$${value}`} />
          <Legend />
          <Line
            type="monotone"
            dataKey="person1"
            name="Person 1"
            stroke="#8884d8"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="person2"
            name="Person 2"
            stroke="#82ca9d"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="household"
            name="Household Total"
            stroke="#ffc658"
            strokeWidth={3}
            dot={{ r: 4 }}
          />
        </LineChart>
      </div>
    </div>
  );
}
