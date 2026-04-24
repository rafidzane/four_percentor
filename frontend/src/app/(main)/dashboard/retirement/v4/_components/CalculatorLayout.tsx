'use client';

interface Props {
  children: React.ReactNode;
}

export default function CalculatorLayout({ children }: Props) {
  return (
    <div className="flex h-[calc(100vh-2rem)] flex-col gap-4">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Two-Person Retirement Calculator V4</h1>
        <p className="mt-1 text-sm text-gray-500">
          Plan your retirement with comprehensive financial projections
        </p>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* Left Panel - Inputs (30% width on desktop) */}
        <div className="hidden w-[30%] flex-col overflow-y-auto lg:flex xl:w-[25%]">
          {children}
        </div>

        {/* Right Panel - Results (70% width on desktop) */}
        <div className="flex-1 overflow-y-auto rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-700">Results Dashboard</h2>
          <p className="text-gray-500">Enter your information to see projections</p>
        </div>
      </div>

      {/* Footer with Calculate Button */}
      <div className="border-t border-gray-200 pt-4">
        <button
          onClick={() => {
            console.log('Calculate!');
          }}
          className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Calculate Retirement Plan
        </button>
      </div>
    </div>
  );
}
