"use client";

import { FC } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MetricCardProps {
  icon: FC<{ className?: string }>;
  label: string;
  value: string;
  description: string;
  isWarning?: boolean;
}

const MetricCard: FC<MetricCardProps> = ({ icon: Icon, label, value, description, isWarning }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={`p-3 rounded-lg border transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 cursor-help ${
            isWarning ? "border-orange-200 dark:border-orange-900" : "border-gray-200 dark:border-gray-700"
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <Icon className={`w-5 h-5 ${isWarning ? "text-orange-600 dark:text-orange-400" : "text-blue-600 dark:text-blue-400"}`} />
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
          <p className={`font-bold ${isWarning ? "text-orange-700 dark:text-orange-300" : ""}`}>
            {value}
          </p>
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs">
        <p>{description}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

interface RetirementSummaryCardsProps {
  finalBalance: number;
  averageBalance: number;
  maxBalance: number;
  minBalance: number;
}

export const RetirementSummaryCards: FC<RetirementSummaryCardsProps> = ({
  finalBalance,
  averageBalance,
  maxBalance,
  minBalance,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      <MetricCard
        icon={FinalBalanceIcon}
        label="Final Balance"
        value={`$${finalBalance.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
        description="Portfolio value at the end of your projection period. This represents your remaining wealth after the full retirement timeline."
      />
      <MetricCard
        icon={AverageBalanceIcon}
        label="Average Balance"
        value={`$${averageBalance.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
        description="Mean portfolio value across all years. Indicates your typical wealth level throughout retirement."
      />
      <MetricCard
        icon={MaxBalanceIcon}
        label="Max Balance"
        value={`$${maxBalance.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
        description="Peak portfolio value achieved during projection. Represents the best-case scenario if market performs optimally."
      />
      <MetricCard
        icon={MinBalanceIcon}
        label="Min Balance"
        value={`$${minBalance.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
        description="Lowest portfolio value reached during projection. Indicates your worst-case stress point and risk exposure."
        isWarning={true}
      />
    </div>
  );
};

// Inline SVG Icon Components

interface FinalBalanceIconProps {
  className?: string;
}

const FinalBalanceIcon: FC<FinalBalanceIconProps> = ({ className = "w-5 h-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

interface AverageBalanceIconProps {
  className?: string;
}

const AverageBalanceIcon: FC<AverageBalanceIconProps> = ({ className = "w-5 h-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M3 3v18h18M18 17V9M13 17V5M8 17v-3" />
  </svg>
);

interface MaxBalanceIconProps {
  className?: string;
}

const MaxBalanceIcon: FC<MaxBalanceIconProps> = ({ className = "w-5 h-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="m18 15-6-6-6 6" />
  </svg>
);

interface MinBalanceIconProps {
  className?: string;
}

const MinBalanceIcon: FC<MinBalanceIconProps> = ({ className = "w-5 h-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="m3.5 18.5 17-13L3.5 18.5z" />
  </svg>
);
