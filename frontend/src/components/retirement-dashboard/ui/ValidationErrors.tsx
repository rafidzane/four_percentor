import { FC } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ValidationErrorProps {
  field: string;
  message: string;
}

export const ValidationError: FC<ValidationErrorProps> = ({ field, message }) => {
  return (
    <Alert variant="destructive" className="mt-1 bg-red-50 border-red-200 text-red-800">
      <AlertCircle className="h-4 w-4 mr-2" />
      <AlertTitle>Invalid value</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorBanner: FC<ErrorBannerProps> = ({ message, onRetry }) => {
  return (
    <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
      <AlertCircle className="h-4 w-4 mr-2" />
      <AlertTitle>Calculation Error</AlertTitle>
      <AlertDescription className="flex items-center gap-2">
        {message}
        {onRetry && (
          <button
            onClick={onRetry}
            className="ml-auto px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        )}
      </AlertDescription>
    </Alert>
  );
};
