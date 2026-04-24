"use client";

import type { ReactNode } from "react";

interface InputGroupProps {
  htmlFor?: string;
  label: string;
  children: ReactNode;
  helperText?: string;
  error?: string;
}

const InputGroup = ({ htmlFor, label, children, helperText, error }: InputGroupProps) => (
  <div className="space-y-2">
    {htmlFor ? (
      <label htmlFor={htmlFor} className="block font-semibold text-gray-700 dark:text-gray-300">
        {label}
      </label>
    ) : (
      <span className="block font-semibold text-gray-700 dark:text-gray-300">{label}</span>
    )}
    {children}
    {error && <p className="text-sm text-red-600 dark:text-red-400 animate-pulse">{error}</p>}
    {!error && helperText && <p className="text-sm text-gray-500 dark:text-gray-400">{helperText}</p>}
  </div>
);

export default InputGroup;
