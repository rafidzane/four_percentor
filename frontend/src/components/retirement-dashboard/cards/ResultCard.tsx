"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface ResultCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  color?: "blue" | "green" | "purple" | "orange" | "teal" | "yellow";
  className?: string;
}

const getColorStyles = (color: ResultCardProps["color"]) => {
  const styles = {
    blue: {
      bg: "bg-blue-50 dark:bg-blue-900/20",
      border: "border-blue-200 dark:border-blue-800",
      text: "text-blue-600 dark:text-blue-400",
      value: "text-blue-700 dark:text-blue-300 font-bold",
    },
    green: {
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      border: "border-emerald-200 dark:border-emerald-800",
      text: "text-emerald-600 dark:text-emerald-400",
      value: "text-emerald-700 dark:text-emerald-300 font-bold",
    },
    purple: {
      bg: "bg-purple-50 dark:bg-purple-900/20",
      border: "border-purple-200 dark:border-purple-800",
      text: "text-purple-600 dark:text-purple-400",
      value: "text-purple-700 dark:text-purple-300 font-bold",
    },
    orange: {
      bg: "bg-orange-50 dark:bg-orange-900/20",
      border: "border-orange-200 dark:border-orange-800",
      text: "text-orange-600 dark:text-orange-400",
      value: "text-orange-700 dark:text-orange-300 font-bold",
    },
    teal: {
      bg: "bg-teal-50 dark:bg-teal-900/20",
      border: "border-teal-200 dark:border-teal-800",
      text: "text-teal-600 dark:text-teal-400",
      value: "text-teal-700 dark:text-teal-300 font-bold",
    },
    yellow: {
      bg: "bg-yellow-50 dark:bg-yellow-900/20",
      border: "border-yellow-200 dark:border-yellow-800",
      text: "text-yellow-600 dark:text-yellow-400",
      value: "text-yellow-700 dark:text-yellow-300 font-bold",
    },
  };

  return styles[color || "blue"];
};

export function ResultCard({ title, value, subtitle, icon, color = "blue", className }: ResultCardProps) {
  const styles = getColorStyles(color);

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800",
        className,
      )}
    >
      <div
        className={`${styles.bg} absolute top-0 right-0 h-16 w-16 opacity-50 group-hover:scale-110 transition-transform duration-200`}
      />

      <div className="relative flex items-start gap-3">
        {icon && (
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${styles.bg}`}>{icon}</div>
        )}

        <div className="flex-1 space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">{title}</p>

          <div className={styles.value}>{value}</div>

          {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}

export default ResultCard;
