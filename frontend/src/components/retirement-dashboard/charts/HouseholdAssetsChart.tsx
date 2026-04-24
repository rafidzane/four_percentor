"use client";

import { useMemo } from "react";

import {
  CategoryScale,
  type ChartData,
  Chart as ChartJS,
  type ChartOptions,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

import { formatCurrency } from "@/lib/utils";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

interface YearlyProjection {
  age: number;
  person1LiquidSavings: number;
  person2LiquidSavings: number;
  householdTotalLiquidSavings: number;
}

const COLORS = {
  person1: {
    light: "#3b82f6",
    dark: "#60a5fa",
  },
  person2: {
    light: "#f97316",
    dark: "#fb923c",
  },
  household: {
    light: "#7c3aed",
    dark: "#a78bfa",
  },
};

const HouseholdAssetsChart = ({
  yearlyProjections,
  className,
}: {
  yearlyProjections: YearlyProjection[];
  className?: string;
}) => {
  const isDarkMode = useMemo(() => {
    if (typeof window === "undefined") return false;
    return document.documentElement.classList.contains("dark");
  }, [yearlyProjections]);

  const chartData: ChartData<"line", number[], string> = useMemo(() => {
    const getChartColor = (lightColor: string, darkColor: string) => (isDarkMode ? darkColor : lightColor);

    const person1Color = getChartColor(COLORS.person1.light, COLORS.person1.dark);
    const person2Color = getChartColor(COLORS.person2.light, COLORS.person2.dark);
    const householdColor = getChartColor(COLORS.household.light, COLORS.household.dark);

    const labels = yearlyProjections.map((d) => d.age.toString());

    const datasets: ChartLineData[] = [
      {
        label: "Person 1",
        data: yearlyProjections.map((d) => d.person1LiquidSavings),
        borderColor: person1Color,
        backgroundColor: person1Color,
        pointRadius: 2,
        pointHoverRadius: 5,
        borderWidth: 2,
      },
      {
        label: "Person 2",
        data: yearlyProjections.map((d) => d.person2LiquidSavings),
        borderColor: person2Color,
        backgroundColor: person2Color,
        pointRadius: 2,
        pointHoverRadius: 5,
        borderWidth: 2,
      },
      {
        label: "Household Total",
        data: yearlyProjections.map((d) => d.householdTotalLiquidSavings),
        borderColor: householdColor,
        backgroundColor: householdColor,
        pointRadius: 3,
        pointHoverRadius: 6,
        borderWidth: 3,
      },
    ];

    return {
      labels,
      datasets,
    };
  }, [yearlyProjections, isDarkMode]);

  const chartOptions: ChartOptions<"line"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false,
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: isDarkMode ? "#1f2937" : "#fff",
          titleColor: isDarkMode ? "#f3f4f6" : "#1f2937",
          bodyColor: isDarkMode ? "#e5e7eb" : "#374151",
          borderColor: isDarkMode ? "#374151" : "#d1d5db",
          borderWidth: 1,
          padding: 10,
          displayColors: false,
          callbacks: {
            label: (context) => {
              const value = Number(context.raw);
              return formatCurrency(value);
            },
            title: (context) => `Age ${context[0].label}`,
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            maxTicksLimit: 15,
            color: isDarkMode ? "#d1d5db" : "#6b7280",
            font: {
              size: 11,
            },
          },
        },
        y: {
          grid: {
            color: isDarkMode ? "#374151" : "#e5e7eb",
          },
          ticks: {
            callback: (value) => {
              const numValue = Number(value);
              if (!value) return "";
              if (numValue >= 1000000) return `$${(numValue / 1000000).toFixed(1)}M`;
              if (numValue >= 1000) return `$${(numValue / 1000).toFixed(0)}k`;
              return `$${value}`;
            },
            color: isDarkMode ? "#d1d5db" : "#6b7280",
            font: {
              size: 11,
            },
          },
        },
      },
    }),
    [isDarkMode],
  );

  if (!yearlyProjections || yearlyProjections.length === 0) {
    return (
      <div className={`flex h-96 items-center justify-center rounded-lg border border-dashed ${className}`}>
        <p className="text-gray-500 dark:text-gray-400">No data available</p>
      </div>
    );
  }

  return (
    <div className={`h-[400px] w-full ${className}`}>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

interface ChartLineData {
  label: string;
  data: number[];
  borderColor: string;
  backgroundColor: string;
  pointRadius: number;
  pointHoverRadius: number;
  borderWidth: number;
}

export default HouseholdAssetsChart;
