"use client";

import { useMemo } from "react";

import {
  BarController,
  BarElement,
  CategoryScale,
  type ChartData,
  Chart as ChartJS,
  type ChartOptions,
  DoughnutController,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  BarController,
  DoughnutController,
  Legend,
  Tooltip,
  Filler,
);

interface StackedAreaData {
  label: string;
  data: number[];
}

interface StackedAreaChartProps {
  labels: string[];
  datasets: StackedAreaData[];
  className?: string;
  title?: string;
}

const COLORS = [
  { light: "#3b82f6", dark: "#60a5fa" },
  { light: "#f97316", dark: "#fb923c" },
  { light: "#7c3aed", dark: "#a78bfa" },
  { light: "#10b981", dark: "#34d399" },
  { light: "#ec4899", dark: "#f472b6" },
];

export function StackedAreaChart({ datasets, className }: StackedAreaChartProps) {
  const isDarkMode = useMemo(() => {
    if (typeof window === "undefined") return false;
    return document.documentElement.classList.contains("dark");
  }, []);

  const chartData: ChartData<"line", number[], string> = useMemo(() => {
    const getChartColor = (lightColor: string, darkColor: string) => (isDarkMode ? darkColor : lightColor);

    const backgroundColors = datasets.map((_, i) => {
      const baseColor = COLORS[i % COLORS.length];
      return getChartColor(baseColor.light, baseColor.dark);
    });

    const borderColorColors = datasets.map((_, i) => {
      const baseColor = COLORS[i % COLORS.length];
      return getChartColor(baseColor.light, baseColor.dark);
    });

    const datasetObjects = datasets.map((dataset, index) => ({
      label: dataset.label,
      data: dataset.data,
      backgroundColor: backgroundColors[index],
      borderColor: borderColorColors[index],
      borderWidth: 2,
      fill: true,
      tension: 0.4,
      stack: "stack1",
    }));

    return {
      labels: datasets[0]?.data.map((_, idx) => (idx + 1).toString()) || [],
      datasets: datasetObjects,
    };
  }, [datasets, isDarkMode]);

  const chartOptions: ChartOptions<"line"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: isDarkMode ? "#1f2937" : "#fff",
          titleColor: isDarkMode ? "#f3f4f6" : "#1f2937",
          bodyColor: isDarkMode ? "#e5e7eb" : "#374151",
          borderColor: isDarkMode ? "#374151" : "#d1d5db",
          borderWidth: 1,
          padding: 10,
          displayColors: false,
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { maxTicksLimit: 10, color: isDarkMode ? "#d1d5db" : "#6b7280", font: { size: 11 } },
        },
        y: {
          stacked: true,
          grid: { color: isDarkMode ? "#374151" : "#e5e7eb" },
          ticks: {
            callback: (value) => {
              const numValue = Number(value);
              if (!numValue) return "";
              if (numValue >= 1000000) return `$${(numValue / 1000000).toFixed(1)}M`;
              if (numValue >= 1000) return `$${(numValue / 1000).toFixed(0)}k`;
              return `$${numValue}`;
            },
            color: isDarkMode ? "#d1d5db" : "#6b7280",
            font: { size: 11 },
          },
        },
      },
    }),
    [isDarkMode],
  );

  if (datasets.length === 0) {
    return (
      <div className={`flex h-64 items-center justify-center rounded-lg border border-dashed ${className}`}>
        <p className="text-gray-500 dark:text-gray-400">No data available</p>
      </div>
    );
  }

  return (
    <div className={`h-[350px] w-full ${className}`}>
      <Line data={chartData} options={chartOptions} />
    </div>
  );
}

export function DonutChart({ labels, dataValues }: { labels: string[]; dataValues: number[] }) {
  const isDarkMode = useMemo(() => {
    if (typeof window === "undefined") return false;
    return document.documentElement.classList.contains("dark");
  }, []);

  const chartData: ChartData<"doughnut", number[], string> = useMemo(() => {
    const backgroundColors = dataValues.map((_, i) => {
      const baseColor = COLORS[i % COLORS.length];
      return isDarkMode ? baseColor.dark : baseColor.light;
    });

    return {
      labels,
      datasets: [
        {
          data: dataValues,
          backgroundColor: backgroundColors,
          borderWidth: 0,
          hoverOffset: 4,
        },
      ],
    };
  }, [labels, dataValues, isDarkMode]);

  const chartOptions: ChartOptions<"doughnut"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: isDarkMode ? "#1f2937" : "#fff",
          titleColor: isDarkMode ? "#f3f4f6" : "#1f2937",
          bodyColor: isDarkMode ? "#e5e7eb" : "#374151",
          borderColor: isDarkMode ? "#374151" : "#d1d5db",
          borderWidth: 1,
          padding: 8,
          displayColors: true,
        },
      },
    }),
    [isDarkMode],
  );

  return (
    <div className="h-[250px] w-full">
      <Doughnut data={chartData} options={chartOptions} />
    </div>
  );
}

export function BarChart({ labels, datasets }: { labels: string[]; datasets: { label: string; data: number[] }[] }) {
  const isDarkMode = useMemo(() => {
    if (typeof window === "undefined") return false;
    return document.documentElement.classList.contains("dark");
  }, []);

  const chartData: ChartData<"bar", number[], string> = useMemo(() => {
    const getChartColor = (lightColor: string, darkColor: string) => (isDarkMode ? darkColor : lightColor);

    const datasetObjects = datasets.map((dataset, index) => ({
      label: dataset.label,
      data: dataset.data,
      backgroundColor: getChartColor(COLORS[index % COLORS.length].light, COLORS[index % COLORS.length].dark),
      borderWidth: 1,
      barPercentage: 0.7,
    }));

    return {
      labels,
      datasets: datasetObjects,
    };
  }, [labels, datasets, isDarkMode]);

  const chartOptions: ChartOptions<"bar"> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: isDarkMode ? "#1f2937" : "#fff",
          titleColor: isDarkMode ? "#f3f4f6" : "#1f2937",
          bodyColor: isDarkMode ? "#e5e7eb" : "#374151",
          borderColor: isDarkMode ? "#374151" : "#d1d5db",
          borderWidth: 1,
          padding: 8,
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { maxTicksLimit: 10, color: isDarkMode ? "#d1d5db" : "#6b7280", font: { size: 10 } },
        },
        y: {
          grid: { color: isDarkMode ? "#374151" : "#e5e7eb" },
          ticks: {
            callback: (value) => {
              const numValue = Number(value);
              if (!numValue) return "";
              if (numValue >= 1000000) return `$${(numValue / 1000000).toFixed(1)}M`;
              if (numValue >= 1000) return `$${(numValue / 1000).toFixed(0)}k`;
              return `$${numValue}`;
            },
            color: isDarkMode ? "#d1d5db" : "#6b7280",
            font: { size: 11 },
          },
        },
      },
    }),
    [isDarkMode],
  );

  if (datasets.length === 0) {
    return (
      <div className={`flex h-64 items-center justify-center rounded-lg border border-dashed`}>
        <p className="text-gray-500 dark:text-gray-400">No data available</p>
      </div>
    );
  }

  return (
    <div className="h-[350px] w-full">
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
}

export function ProgressBars({ items }: { items: { label: string; value: number; max: number; color?: string }[] }) {
  const isDarkMode = useMemo(() => {
    if (typeof window === "undefined") return false;
    return document.documentElement.classList.contains("dark");
  }, []);

  const getColor = (customColor?: string) => {
    if (customColor) return customColor;

    const baseColors = [
      { light: "#10b981", dark: "#34d399" },
      { light: "#3b82f6", dark: "#60a5fa" },
      { light: "#f59e0b", dark: "#fbbf24" },
    ];

    const defaultColor = isDarkMode
      ? baseColors[items.length > 1 ? 1 : 0].dark
      : baseColors[items.length > 1 ? 1 : 0].light;

    return defaultColor;
  };

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const percentage = Math.min(100, Math.round((item.value / item.max) * 100));
        return (
          <div key={item.label} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
              <span className="text-gray-500 dark:text-gray-400">{percentage}%</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className={`h-2.5 rounded-full transition-all duration-500 ease-out ${item.color || getColor()}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
