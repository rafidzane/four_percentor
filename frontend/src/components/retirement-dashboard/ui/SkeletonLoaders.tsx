import { FC } from "react";

interface SkeletonStatCardProps {
  title?: string;
}

export const SkeletonStatCard: FC<SkeletonStatCardProps> = ({ title }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
      {title && (
        <p className="text-xs text-muted-foreground mb-2">{title}</p>
      )}
      <div className="animate-pulse space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        {title && <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>}
      </div>
    </div>
  );
};

interface SkeletonResultsSectionProps {
  variant?: "compact" | "full";
}

export const SkeletonResultsSection: FC<SkeletonResultsSectionProps> = ({ variant = "compact" }) => {
  return (
    <div data-pct="retirement-results-section" className="mb-6 rounded-xl border p-4">
      <h3 className="text-xl font-semibold mb-4 animate-pulse bg-gray-200 dark:bg-gray-700 h-6 w-1/3 rounded"></h3>

      {variant === "full" && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <p className="text-xs text-muted-foreground mb-2 animate-pulse bg-gray-200 dark:bg-gray-700 h-3 w-full rounded"></p>
              <div className="animate-pulse space-y-1">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center space-x-4 mb-4">
        <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-6 w-32 rounded-full"></div>
      </div>

      <div className="animate-pulse space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
      </div>
    </div>
  );
};

interface SkeletonInlineSpinnerProps {
  size?: "sm" | "md" | "lg";
}

export const SkeletonInlineSpinner: FC<SkeletonInlineSpinnerProps> = ({ size = "md" }) => {
  const sizeClasses = {
    sm: "w-3 h-3 border-2",
    md: "w-5 h-5 border-3",
    lg: "w-8 h-8 border-4",
  };

  return (
    <div className={`animate-spin rounded-full border-gray-300 dark:border-gray-600 ${sizeClasses[size]}`}>
      <span className="sr-only">Loading...</span>
    </div>
  );
};
