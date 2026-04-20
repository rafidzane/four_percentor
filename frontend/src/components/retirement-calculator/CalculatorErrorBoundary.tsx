"use client";

import type React from "react";

import { AlertCircle } from "lucide-react";

interface Props {
  children: React.ReactElement;
  fallback?: React.ReactNode;
}

interface FallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

function ErrorFallback({ error }: FallbackProps) {
  return (
    <div className="flex min-h-[400px] items-center justify-center rounded-lg bg-red-50 p-8 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-red-900">Something went wrong</h2>
          <p className="text-sm text-red-700">
            There was an error in the retirement calculator. Please try again or contact support.
          </p>
          <p className="text-xs text-red-600">
            Error: {error.message}
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export function CalculatorErrorBoundary({ children, fallback }: Props) {
  return (
    <div>
      {children}
    </div>
  );
}

export default CalculatorErrorBoundary;