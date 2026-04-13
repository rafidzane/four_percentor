'use client';

import React, { useState } from 'react';
import { DeepRetirementInput, DeepRetirementProjection } from '@/lib/types/deep-retirement-types';

interface Scenario {
  id: string;
  name: string;
  input: DeepRetirementInput;
  projection: DeepRetirementProjection;
}

interface ScenarioComparisonProps {
  scenarios: Scenario[];
  onAddScenario?: () => void;
  onDeleteScenario?: (id: string) => void;
  onSelectScenario?: (id: string) => void;
}

const ScenarioComparison = ({
  scenarios,
  onAddScenario,
  onDeleteScenario,
  onSelectScenario
}: ScenarioComparisonProps) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null);

  const handleSelectScenario = (id: string) => {
    setSelectedScenarioId(id);
    onSelectScenario?.(id);
  };

  if (scenarios.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <p className="text-gray-500">No scenarios to compare. Add a scenario to get started.</p>
        {onAddScenario && (
          <button
            onClick={onAddScenario}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Add Scenario
          </button>
        )}
      </div>
    );
  }

  // Get comparison metrics from the first scenario to determine which fields to show
  const comparisonMetrics = [
    { key: 'totalSavingsAtRetirement', label: 'Total Savings at Retirement' },
    { key: 'monthlyIncomeAtRetirement', label: 'Monthly Income' },
    { key: 'socialSecurityBenefit', label: 'Social Security' },
    { key: 'safeWithdrawalAmount', label: 'Safe Annual Withdrawal' },
    { key: 'projectedBalanceAtAge90', label: 'Projected Balance at 90' },
    { key: 'yearsToDepletion', label: 'Years to Depletion' },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Scenario Comparison</h2>
      
      {/* Scenario Tabs */}
      <div className="flex overflow-x-auto gap-2 mb-6 pb-2">
        {scenarios.map((scenario) => (
          <button
            key={scenario.id}
            onClick={() => handleSelectScenario(scenario.id)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              selectedScenarioId === scenario.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {scenario.name}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteScenario?.(scenario.id);
              }}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </button>
        ))}
        
        {onAddScenario && (
          <button
            onClick={onAddScenario}
            className="px-4 py-2 bg-green-500 text-white rounded-lg whitespace-nowrap hover:bg-green-600"
          >
            + Add Scenario
          </button>
        )}
      </div>

      {/* Comparison Table */}
      {selectedScenarioId && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left font-semibold">Metric</th>
                {scenarios.map((scenario) => (
                  <th key={scenario.id} className="p-3 text-center font-semibold">
                    {scenario.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonMetrics.map((metric) => (
                <tr key={metric.key} className="border-b hover:bg-gray-50">
                  <td className="p-3 text-gray-700">{metric.label}</td>
                  {scenarios.map((scenario) => {
                    const value = scenario.projection[metric.key as keyof DeepRetirementProjection];
                    return (
                      <td key={scenario.id} className="p-3 text-center font-medium">
                        {typeof value === 'number' ? formatCurrency(value) : value}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {scenarios.map((scenario) => (
          <div
            key={scenario.id}
            onClick={() => handleSelectScenario(scenario.id)}
            className={`p-4 rounded-lg cursor-pointer transition-all ${
              selectedScenarioId === scenario.id
                ? 'bg-blue-50 border-2 border-blue-500'
                : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <h3 className="font-semibold text-lg mb-2">{scenario.name}</h3>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Savings at Retirement</p>
              <p className="font-bold text-green-700">
                {formatCurrency(scenario.projection.totalSavingsAtRetirement)}
              </p>
              <p className="text-sm text-gray-600 mt-2">Monthly Income</p>
              <p className="font-bold text-blue-700">
                {formatCurrency(scenario.projection.monthlyIncomeAtRetirement)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper function to format currency
const formatCurrency = (value: number): string => {
  if (!value && value !== 0) return 'N/A';
  
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  } catch (e) {
    console.error('Currency formatting error:', e);
    return `$${value.toLocaleString()}`;
  }
};

export default ScenarioComparison;
