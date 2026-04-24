'use client';

import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import type { WithdrawalStrategyType } from '../types';

const strategies: { id: WithdrawalStrategyType; name: string; description: string }[] = [
  {
    id: 'fixed_percentage',
    name: 'Fixed Percentage (4% Rule)',
    description: 'Withdraw 4% of portfolio each year, adjusted for inflation',
  },
  {
    id: 'dynamic_withdrawal',
    name: 'Dynamic Withdrawal',
    description: 'Adjust withdrawals based on market performance and remaining balance',
  },
  {
    id: 'bucket_strategy',
    name: 'Bucket Strategy',
    description: 'Separate assets into short-term (1-3yr), mid-term (4-10yr), long-term buckets',
  },
  {
    id: 'rmd_approach',
    name: 'RMD Approach',
    description: 'Follow Required Minimum Distribution tables for withdrawals',
  },
];

interface Props {
  value: WithdrawalStrategyType;
  onChange: (strategy: WithdrawalStrategyType) => void;
}

export default function StrategySelector({ value, onChange }: Props) {
  return (
    <div className="w-full">
      <Listbox value={value} onChange={onChange}>
        {({ open }) => (
          <>
            <Listbox.Label className="mb-1 block text-sm font-medium text-gray-700">
              Withdrawal Strategy
            </Listbox.Label>
            <div className="relative mt-1">
              <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                <span className="block truncate">{strategies.find((s) => s.id === value)?.name}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
                </span>
              </Listbox.Button>

              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                  {strategies.map((strategy) => (
                    <Listbox.Option
                      key={strategy.id}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                        }`
                      }
                      value={strategy.id}
                    >
                      {({ selected }) => (
                        <>
                          <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                            {strategy.name}
                          </span>
                          <span className="block truncate text-xs text-gray-500">{strategy.description}</span>
                          {selected ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </>
        )}
      </Listbox>

      {value === 'fixed_percentage' && (
        <div className="mt-3 rounded-lg border-l-4 border-yellow-500 bg-yellow-50 p-3">
          <p className="text-xs font-semibold text-yellow-700">About the 4% Rule</p>
          <p className="text-sm text-yellow-800 mt-1">
            The 4% rule suggests withdrawing 4% of your retirement portfolio in the first year, then adjusting for inflation each subsequent year. Historically, this has a high success rate.
          </p>
        </div>
      )}
    </div>
  );
}
