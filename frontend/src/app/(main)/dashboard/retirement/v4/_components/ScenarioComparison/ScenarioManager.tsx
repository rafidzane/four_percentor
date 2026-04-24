'use client';

import { useState } from 'react';
import type { CalculatorInputsV4, ScenarioV4 } from '../types';

interface Props {
  currentInputs: CalculatorInputsV4;
  scenarios: ScenarioV4[];
  onAddScenario: (name: string) => void;
  onSelectScenario: (scenarioId: string) => void;
  onDeleteScenario: (scenarioId: string) => void;
}

export default function ScenarioManager({
  currentInputs,
  scenarios,
  onAddScenario,
  onSelectScenario,
  onDeleteScenario,
}: Props) {
  const [newScenarioName, setNewScenarioName] = useState('');
  const [showInput, setShowInput] = useState(false);

  const handleAddScenario = () => {
    if (newScenarioName.trim()) {
      onAddScenario(newScenarioName);
      setNewScenarioName('');
      setShowInput(false);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-gray-700">Saved Scenarios</h3>

        {showInput ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={newScenarioName}
              onChange={(e) => setNewScenarioName(e.target.value)}
              placeholder="Scenario name..."
              className="w-32 rounded-lg border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddScenario}
              className="rounded-lg bg-green-600 px-3 py-1 text-white hover:bg-green-700"
            >
              Save
            </button>
            <button
              onClick={() => setShowInput(false)}
              className="rounded-lg bg-gray-400 px-3 py-1 text-white hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowInput(true)}
            className="rounded-lg border border-blue-600 px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50"
          >
            + Save Current
          </button>
        )}
      </div>

      {scenarios.length > 0 ? (
        <div className="space-y-2">
          {scenarios.map((scenario) => (
            <div
              key={scenario.id}
              className={`flex items-center justify-between rounded-lg border p-3 transition-colors ${
                scenario.isBaseline ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex flex-col">
                <span className={`font-medium ${scenario.isBaseline ? 'text-blue-700' : 'text-gray-900'}`}>
                  {scenario.name}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(scenario.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {!scenario.isBaseline && (
                  <button
                    onClick={() => onSelectScenario(scenario.id)}
                    className="rounded px-2 py-1 text-xs font-medium bg-gray-100 hover:bg-gray-200"
                  >
                    Compare
                  </button>
                )}

                <button
                  onClick={() => onDeleteScenario(scenario.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No saved scenarios yet</p>
      )}
    </div>
  );
}
