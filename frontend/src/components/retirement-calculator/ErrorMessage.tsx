// Error message components for retirement calculator

import type React from "react";

import { AlertCircle, AlertTriangle, Info, XCircle } from "lucide-react";

export interface ErrorMessageProps {
  message: string;
  type?: "error" | "warning" | "info";
  dismissible?: boolean;
  onDismiss?: () => void;
}

export function ErrorMessage({
  message,
  type = "error",
  dismissible = false,
  onDismiss,
}: ErrorMessageProps) {
  const icons = {
    error: <XCircle className="h-5 w-5 text-red-600" />,
    warning: <AlertTriangle className="h-5 w-5 text-yellow-600" />,
    info: <Info className="h-5 w-5 text-blue-600" />,
  };

  const styles = {
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  return (
    <div
      className={`flex items-start gap-3 rounded-lg border p-4 ${styles[type]}`}
      role="alert"
    >
      <div className="flex-shrink-0">
        {icons[type]}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>
      {dismissible && onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 text-current opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Dismiss error"
        >
          <XCircle className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}

export function ErrorSummary({ errors }: { errors: string[] }) {
  if (errors.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-red-900">Validation Errors</h3>
      {errors.map((error, index) => (
        <ErrorMessage
          key={index}
          message={error}
          type="error"
          dismissible={false}
        />
      ))}
    </div>
  );
}

export function InputError({
  field,
  message,
}: {
  field: string;
  message: string;
}) {
  return (
    <ErrorMessage
      message={`${field}: ${message}`}
      type="error"
      dismissible={false}
    />
  );
}

export function WarningMessage({
  message,
  dismissible = false,
  onDismiss,
}: Omit<ErrorMessageProps, "type">) {
  return <ErrorMessage message={message} type="warning" dismissible={dismissible} onDismiss={onDismiss} />;
}

export function InfoMessage({
  message,
  dismissible = false,
  onDismiss,
}: Omit<ErrorMessageProps, "type">) {
  return <ErrorMessage message={message} type="info" dismissible={dismissible} onDismiss={onDismiss} />;
}