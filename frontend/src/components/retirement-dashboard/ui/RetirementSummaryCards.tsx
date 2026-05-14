"use client";

import { FC } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Inline SVG Icon Components (defined first to be available for use)

interface FinalBalanceIconProps {
  className?: string;
}

const FinalBalanceIcon: FC<FinalBalanceIconProps> = ({ className = "h-4 w-4" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
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

const AverageBalanceIcon: FC<AverageBalanceIconProps> = ({ className = "h-4 w-4" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
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

const MaxBalanceIcon: FC<MaxBalanceIconProps> = ({ className = "h-4 w-4" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
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

const MinBalanceIcon: FC<MinBalanceIconProps> = ({ className = "h-4 w-4" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="m3.5 18.5 17-13L3.5 18.5z" />
  </svg>
);

// Metric Card Component - all one line text
interface MetricCardProps {
  icon: FC<{ className?: string }>;
  label: string;
  value: string;
  description?: string;
  isWarning?: boolean;
}

const MetricCard: FC<MetricCardProps> = ({ icon: Icon, label, value, description, isWarning }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={`group relative flex items-center gap-3 rounded-xl border p-3 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${isWarning ? "border-orange-200 hover:border-orange-300 dark:border-orange-900/50 dark:hover:border-orange-800" : "border-slate-200 hover:border-ring/50 dark:border-slate-700"}`}>
          {/* Decorative accent bar */}
          <div className={`absolute inset-y-0 left-0 w-1 transition-all group-hover:w-1.5 ${isWarning ? "bg-orange-500" : "bg-blue-500"}`} />
          
          {/* Icon and label/value inline */}
          <div className="flex flex-col items-start gap-0.5 pl-2">
            <div className="flex items-center gap-2">
              <Icon className={`h-4 w-4 ${isWarning ? "text-orange-600 dark:text-orange-400" : "text-blue-600 dark:text-blue-400"}`} />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</span>
            </div>
            <p className={`font-mono text-base font-bold tabular-nums leading-none ${isWarning ? "text-orange-700 dark:text-orange-300" : "text-slate-900 dark:text-slate-100"}`}>
              {value}
            </p>
          </div>
          
          {/* Description inline on the right (if present) */}
          {description && (
            <span className="ml-auto text-[10px] leading-none text-muted-foreground opacity-70">{description}</span>
          )}
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
      <MetricCard
        icon={FinalBalanceIcon}
        label="Final Balance"
        value={`$${finalBalance.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
        
      />
      <MetricCard
        icon={AverageBalanceIcon}
        label="Average Balance"
        value={`$${averageBalance.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
        
      />
      <MetricCard
        icon={MaxBalanceIcon}
        label="Max Balance"
        value={`$${maxBalance.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
        description="Peak portfolio value achieved"
      />
      <MetricCard
        icon={MinBalanceIcon}
        label="Min Balance"
        value={`$${minBalance.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
        isWarning={true}
        description="Lowest portfolio stress point"
      />
    </div>
  );
};
