'use client';

import type { PersonInput } from '../types';

interface Props {
  person: PersonInput;
}

export default function PersonSummary({ person }: Props) {
  const yearsToRetirement = person.retirementAge - person.currentAge;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 font-semibold text-gray-700">
        {person.id === 'person1' ? 'Person 1 Summary' : 'Person 2 Summary'}
      </h3>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="rounded bg-blue-50 p-2">
          <p className="text-xs text-gray-500">Current Age</p>
          <p className="font-bold text-blue-700">{person.currentAge}</p>
        </div>

        <div className="rounded bg-purple-50 p-2">
          <p className="text-xs text-gray-500">Retirement Age</p>
          <p className="font-bold text-purple-700">{person.retirementAge}</p>
        </div>

        <div className="rounded bg-green-50 p-2">
          <p className="text-xs text-gray-500">Years to Retire</p>
          <p className="font-bold text-green-700">{yearsToRetirement}</p>
        </div>
      </div>

      <div className="mt-3 border-t pt-3">
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-gray-500">Liquid Assets:</span>
            <span className="ml-2 font-semibold text-gray-700">
              ${person.liquidAssets.toLocaleString()}
            </span>
          </div>

          <div>
            <span className="text-gray-500">Monthly Contrib:</span>
            <span className="ml-2 font-semibold text-gray-700">
              ${person.monthlyContribution.toLocaleString()}
            </span>
          </div>

          <div>
            <span className="text-gray-500">SS Benefit:</span>
            <span className="ml-2 font-semibold text-teal-700">
              ${person.estimatedSSBenefit.toLocaleString()}/mo
            </span>
          </div>

          <div>
            <span className="text-gray-500">Claiming Age:</span>
            <span className="ml-2 font-semibold text-gray-700">{person.ssClaimingAge}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
