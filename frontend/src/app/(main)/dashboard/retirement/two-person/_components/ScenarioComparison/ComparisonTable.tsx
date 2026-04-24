import { type CalculationResults } from "@/app/(main)/dashboard/retirement/_components/types";

export interface Scenario {
  id: string;
  name: string;
  results: CalculationResults;
}

interface Props {
  scenarios: Scenario[];
}

const formatCurrency = (value: number): string => {
  if (!value && value !== 0) return "N/A";
  
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  } catch (e) {
    console.error("Currency formatting error:", e);
    return `$${value.toLocaleString()}`;
  }
};

export default function ComparisonTable({ scenarios }: Props) {
  if (scenarios.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
        <p className="text-gray-500">No scenarios to compare</p>
      </div>
    );
  }

  const metricNames = [
    { key: "totalNetWorthAtRetirement", label: "Total Net Worth" },
    { key: "totalLiquidSavingsAtRetirement", label: "Liquid Savings" },
    { key: "monthlyIncomeAtRetirement", label: "Monthly Income" },
    { key: "socialSecurityBenefit", label: "Social Security" },
    { key: "yearsToRetirement", label: "Years to Retirement" },
  ];

  const getBestValue = (metricKey: keyof CalculationResults): number | null => {
    const values = scenarios.map((s) => s.results[metricKey]);
    if (values.length === 0) return null;
    
    // For metrics where higher is better
    if (
      metricKey === "totalNetWorthAtRetirement" ||
      metricKey === "totalLiquidSavingsAtRetirement" ||
      metricKey === "monthlyIncomeAtRetirement" ||
      metricKey === "socialSecurityBenefit"
    ) {
      return Math.max(...(values as number[]));
    }
    
    // For years to retirement, lower is better
    if (metricKey === "yearsToRetirement") {
      return Math.min(...(values as number[]));
    }
    
    return null;
  };

  const getBestValueForMetric = (value: number | undefined, metricKey: keyof CalculationResults): boolean => {
    if (value === undefined) return false;
    
    // For metrics where higher is better
    if (
      metricKey === "totalNetWorthAtRetirement" ||
      metricKey === "totalLiquidSavingsAtRetirement" ||
      metricKey === "monthlyIncomeAtRetirement" ||
      metricKey === "socialSecurityBenefit"
    ) {
      const best = getBestValue(metricKey);
      return best !== null && value >= best;
    }
    
    // For years to retirement, lower is better
    if (metricKey === "yearsToRetirement") {
      const best = getBestValue(metricKey);
      return best !== null && value <= best;
    }
    
    return false;
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-6 py-4 font-semibold text-gray-700">Metric</th>
            {scenarios.map((scenario) => (
              <th key={scenario.id} className="px-6 py-4 font-semibold text-gray-700">
                {scenario.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {metricNames.map((metric) => (
            <tr key={metric.key} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-gray-600">{metric.label}</td>
              {scenarios.map((scenario) => {
                const value = scenario.results[metric.key];
                const isBest = getBestValueForMetric(value, metric.key);
                
                let formattedValue: string;
                if (value === undefined || value === null) {
                  formattedValue = "N/A";
                } else if (
                  metric.key === "totalNetWorthAtRetirement" ||
                  metric.key === "totalLiquidSavingsAtRetirement" ||
                  metric.key === "monthlyIncomeAtRetirement" ||
                  metric.key === "socialSecurityBenefit"
                ) {
                  formattedValue = formatCurrency(value);
                } else if (metric.key === "yearsToRetirement") {
                  formattedValue = `${value} years`;
                } else {
                  formattedValue = value.toString();
                }

                return (
                  <td
                    key={`${scenario.id}-${metric.key}`}
                    className={`px-6 py-4 font-medium ${isBest ? "text-green-600" : "text-gray-900"}`}
                  >
                    {formattedValue}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
