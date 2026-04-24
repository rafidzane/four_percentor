"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  onSelectScenario: (retirementAge: number) => void;
}

export default function ScenarioSelector({ onSelectScenario }: Props) {
  const [customAge, setCustomAge] = useState<string>("");

  const handlePresetClick = (age: number) => {
    onSelectScenario(age);
    setCustomAge("");
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomAge(value);
    
    if (value) {
      const age = parseInt(value, 10);
      if (!isNaN(age)) {
        onSelectScenario(age);
      }
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-center font-semibold text-gray-700">Select Retirement Age Scenario</h3>
      
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {[62, 65, 67, 70].map((age) => (
          <Button
            key={age}
            variant="outline"
            size="sm"
            onClick={() => handlePresetClick(age)}
          >
            {age}
          </Button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Input
          type="number"
          min={62}
          max={100}
          placeholder="Enter retirement age..."
          value={customAge}
          onChange={handleCustomChange}
          className="flex-1"
        />
        <Button variant="outline" size="sm" onClick={() => {
          if (customAge) {
            const age = parseInt(customAge, 10);
            if (!isNaN(age)) {
              onSelectScenario(age);
            }
          }
        }}>
          Set
        </Button>
      </div>
    </div>
  );
}
