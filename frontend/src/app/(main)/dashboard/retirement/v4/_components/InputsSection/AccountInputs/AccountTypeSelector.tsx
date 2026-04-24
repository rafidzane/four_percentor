'use client';

import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

type AccountType = '401k' | '403b' | 'traditional_ira' | 'roth_ira' | 'brokerage';

const accountTypes: { id: AccountType; name: string; description: string }[] = [
  { id: '401k', name: '401(k)', description: 'Employer-sponsored retirement plan' },
  { id: '403b', name: '403(b)', description: 'Tax-sheltered annuity plan' },
  { id: 'traditional_ira', name: 'Traditional IRA', description: 'Pre-tax contributions, taxed in retirement' },
  { id: 'roth_ira', name: 'Roth IRA', description: 'After-tax contributions, tax-free withdrawals' },
  { id: 'brokerage', name: 'Brokerage', description: 'Taxable investment account' },
];

interface Props {
  value: AccountType;
  onChange: (type: AccountType) => void;
}

export default function AccountTypeSelector({ value, onChange }: Props) {
  return (
    <div className="w-full">
      <Listbox value={value} onChange={onChange}>
        {({ open }) => (
          <>
            <Listbox.Label className="mb-1 block text-sm font-medium text-gray-700">
              Account Type
            </Listbox.Label>
            <div className="relative mt-1">
              <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                <span className="block truncate">{accountTypes.find((t) => t.id === value)?.name}</span>
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
                  {accountTypes.map((type) => (
                    <Listbox.Option
                      key={type.id}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
                        }`
                      }
                      value={type.id}
                    >
                      {({ selected }) => (
                        <>
                          <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                            {type.name}
                          </span>
                          <span className="block truncate text-xs text-gray-500">{type.description}</span>
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
    </div>
  );
}
