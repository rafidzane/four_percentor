"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface ChartContainerProps {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export function ChartContainer({ children, title, description, className }: ChartContainerProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {(title || description) && (
        <div className="space-y-1">
          {title && <h3 className="font-semibold text-gray-900 dark:text-gray-100">{title}</h3>}
          {description && <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>}
        </div>
      )}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        {children}
      </div>
    </div>
  );
}

export default ChartContainer;
