'use client';

interface SharedRetirementSettingsProps {
  sameRetirementAge: boolean;
  drivingPerson: 'person1' | 'person2';
  onToggleSameRetirementAge: (value: boolean) => void;
}

export default function SharedRetirementSettings({
  sameRetirementAge,
  drivingPerson,
  onToggleSameRetirementAge,
}: SharedRetirementSettingsProps) {
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onToggleSameRetirementAge(e.target.checked);
  };

  return (
    <div className="space-y-2">
      <label className="flex items-center space-x-3 cursor-pointer">
        <input
          type="checkbox"
          checked={sameRetirementAge}
          onChange={handleCheckboxChange}
          className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="text-sm font-medium text-gray-900">Same retirement age for both</span>
      </label>
      
      {sameRetirementAge && (
        <p className="ml-8 text-sm text-gray-600">
          Same retirement age (Driven by Person {drivingPerson === 'person1' ? 1 : 2})
        </p>
      )}
    </div>
  );
}
