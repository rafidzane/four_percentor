'use client';

import type { PersonInput } from '../types';

interface Props {
  person: PersonInput;
  onChange: (updatedPerson: PersonInput) => void;
}

export default function PersonInputCard({
  person,
  onChange,
}: Props) {
  const handleChange = (field: keyof PersonInput, value: number | string) => {
    onChange({ ...person, [field]: typeof value === 'string' ? value : Number(value) });
  };

  const renderNumberInput = (
    label: string,
    field: keyof PersonInput,
    min?: number,
    max?: number,
    helperText?: string
  ) => (
    <div>
      <label className="mb-1 block font-semibold text-gray-700 text-xs">{label}</label>
      <input
        type="number"
        value={person[field] === '' ? '' : person[field]}
        onChange={(e) => handleChange(field, e.target.value)}
        min={min}
        max={max}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {helperText && <p className="mt-1 text-gray-500 text-xs">{helperText}</p>}
    </div>
  );

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="mb-4 font-semibold text-gray-700">
        {person.id === 'person1' ? 'Person 1' : 'Person 2'}
      </h3>

      {/* Age inputs */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {renderNumberInput('Current Age', 'currentAge', 18, 100)}
        {renderNumberInput('Retirement Age', 'retirementAge', person.currentAge + 1, 100)}
        {renderNumberInput('Life Expectancy', 'lifeExpectancy', person.retirementAge + 1, 120)}
      </div>

      {/* Asset inputs */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {renderNumberInput('Liquid Assets', 'liquidAssets', 0, undefined, 'e.g., $100,000')}
        {renderNumberInput('Monthly Contribution', 'monthlyContribution', 0, undefined)}
      </div>

      {/* Return rate inputs */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {renderNumberInput(
          'Pre-Retirement Return (%)',
          'preRetirementReturnRate',
          0,
          15,
          'e.g., 6%'
        )}
        {renderNumberInput(
          'Post-Retirement Return (%)',
          'postRetirementReturnRate',
          0,
          10,
          'e.g., 4%'
        )}
      </div>

      {/* Social Security inputs */}
      <div className="grid grid-cols-2 gap-4">
        {renderNumberInput('Estimated SS Benefit', 'estimatedSSBenefit', 0, undefined)}
        {renderNumberInput('Claiming Age', 'ssClaimingAge', 62, 70)}
      </div>
    </div>
  );
}
