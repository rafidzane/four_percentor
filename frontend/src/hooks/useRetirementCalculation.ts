import { useCallback, useEffect, useState, useRef } from 'react';
import { useDebounce } from './useDebounce';

/**
 * Response structure returned from the retirement calculation API.
 */
export interface RetirementResponse {
  age: number[];
  portfolio_balance: number[];
  net_cash_flows: number[];
  expenses: number[];
  success: boolean;
  final_balance: number;
  avg_balance: number;
  max_balance: number;
  min_balance: number;
}

/**
 * Error structure for calculation failures.
 */
export interface CalculationError {
  message: string;
  code?: string;
}

interface FormData {
  timeline: {
    current_age: number;
    retirement_age: number;
    spouse_age?: number;
    years_in_retirement: number;
  };
  current_assets: {
    investment_portfolio: number;
    your_401k_ira: number;
    spouse_401k_ira: number;
    yearly_contribution: number;
    yearly_contribution_increase_pct: number;
    catch_up_eligible: boolean;
  };
  portfolio_allocation: {
    equity_pct: number;
    fixed_income_pct: number;
    equity_return_pre_retirement_pct: number;
    equity_return_post_retirement_pct: number;
    fixed_income_return_pct: number;
    inflation_rate_pct: number;
    simulation_mode: "historical_all" | "single_year" | "manual";
    historical_year?: number;
  };
  retirement_spending: {
    spending_mode: "four_pct_rule" | "manual_withdrawal";
    first_year_expenses: number;
    withdrawal_pct: number;
    age_range_start: number;
    age_range_end: number;
    adjust_for_inflation: boolean;
    two_period_mode: boolean;
    period_1_start_age?: number;
    period_1_end_age?: number;
    period_1_withdrawal_pct?: number;
    period_2_start_age?: number;
    period_2_end_age?: number;
    period_2_withdrawal_pct?: number;
  };
  income_streams?: {
    social_security_you?: { claim_age: number; yearly_amount_today_dollars: number };
    social_security_spouse?: { claim_age: number; yearly_amount_today_dollars: number };
    pension_1?: { starting_age: number; yearly_amount: number };
    pension_2?: { starting_age: number; yearly_amount: number };
    rental_properties?: Array<{ property_name: string; net_annual_income: number; until_age: number }>;
  };
  real_estate?: {
    total_property_value: number;
    total_outstanding_mortgages: number;
    annual_appreciation_pct: number;
    model_property_sale?: boolean;
    age_of_sale?: number;
    amount_rolled_into_portfolio?: number;
    rental_properties?: Array<{ value: number; net_annual_income: number; until_age: number }>;
  };
}

interface UseRetirementCalculationResult {
  results: RetirementResponse | null;
  isLoading: boolean;
  isError: boolean;
  error: CalculationError | null;
  calculateNow: () => void;
}

/**
 * Configuration options for the retirement calculation hook.
 */
export interface UseRetirementCalculationConfig {
  /** Enable or disable automatic recalculation on form data changes (default: true) */
  enabled?: boolean;
  /** Debounce delay in milliseconds - how long to wait after user stops typing before calculating (default: 1000) */
  debounceMs?: number;
}

/**
 * Custom hook for automatic retirement calculation with debounced triggering.
 * Automatically recalculates when form values change, with debounce to prevent excessive processing.
 *
 * @param formData - The form data object containing all retirement configuration parameters
 * @param configOrDebounce - Either a number (debounceMs) or an object with enabled/debounceMs options for flexibility
 * @returns Object containing results, loading state, error state, and helper functions
 *
 * @example
 * ```typescript
 * // Simple usage with debounce in milliseconds
 * const { results, isLoading, isError, error } = useRetirementCalculation(formValues, 1000);
 *
 * // Advanced usage with config object
 * const { results, isLoading, isError, error } = useRetirementCalculation(formValues, {
 *   enabled: true,
 *   debounceMs: 1500
 * });
 *
 * if (isLoading) return <LoadingSpinner />;
 * if (isError) return <ErrorBanner message={error.message} onRetry={retryCalculation} />;
 * if (!results) return null;
 *
 * return <ResultsDisplay result={results} />;
 * ```
 *
 * @remarks
 * This hook implements:
 * - Automatic recalculation when form values change (when enabled)
 * - Debounced triggers to prevent excessive API calls during rapid input
 * - Error handling with user-friendly messages
 * - Performance monitoring (logs calculation duration to console)
 * - Manual trigger capability for on-demand calculations
 */
export function useRetirementCalculation(
  formData: FormData | null,
  configOrDebounce: UseRetirementCalculationConfig | number = { enabled: true, debounceMs: 1000 }
): UseRetirementCalculationResult & { calculateNow: () => void } {
  const [results, setResults] = useState<RetirementResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<CalculationError | null>(null);

  // Normalize config parameter to handle both number and object forms for backward compatibility
  const config: UseRetirementCalculationConfig = 
    typeof configOrDebounce === 'number' 
      ? { enabled: true, debounceMs: configOrDebounce }
      : { enabled: true, debounceMs: 1000, ...configOrDebounce };

  // Track previous form data to avoid recalculating on identical values (not just references)
  const prevFormDataRef = useRef<FormData | null>(null);

  // Debounce the form data to prevent excessive calculations during typing
  const [debouncedFormData] = useDebounce(formData, config.debounceMs);

  // Only calculate if auto-calculation is enabled and we have valid debounced data
  useEffect(() => {
    if (!config.enabled || !debouncedFormData) return;

    // Check if actual values changed (not just reference)
    const prevString = prevFormDataRef.current ? JSON.stringify(prevFormDataRef.current) : null;
    const currentString = JSON.stringify(debouncedFormData);
    
    if (prevString === currentString) {
      return; // Values unchanged, skip recalculation
    }

    prevFormDataRef.current = debouncedFormData;

    const performCalculation = async () => {
      setIsLoading(true);
      setError(null);
      setIsError(false);

      try {
        const startTime = performance.now();

        // Clean up data to remove undefined values
        const cleanData = JSON.parse(JSON.stringify(debouncedFormData));
        const finalData = processOptionalFields(cleanData);

        const response = await fetch("http://localhost:8000/fourpercent/api/v4/retirement", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(finalData),
        });

        if (!response.ok) {
          let errorMessage = `API error: ${response.statusText}`;
          try {
            const errorData = await response.json();
            errorMessage = errorData.detail || errorData.message || errorMessage;
          } catch (e) {
            // Keep default message if JSON parsing fails
          }

          throw new Error(errorMessage);
        }

        const apiResult: RetirementResponse = await response.json();

        // Log calculation performance for monitoring
        const duration = performance.now() - startTime;
        console.log(`Calculation completed in ${duration.toFixed(2)}ms`);

        setResults(apiResult);
      } catch (err: any) {
        console.error("Error calculating retirement:", err);

        // Provide user-friendly error messages
        let errorMessage = "Failed to calculate retirement projection. Please try again.";
        if (err.message.includes('Failed to fetch')) {
          errorMessage = "Failed to connect to the calculator. Please check that the backend server is running.";
        } else if (err.message) {
          errorMessage = err.message;
        }

        setError({ message: errorMessage });
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    performCalculation();
  }, [debouncedFormData]);

  /**
   * Manually trigger recalculation (useful for immediate feedback without waiting for debounce)
   */
  const calculateNow = useCallback(async () => {
    if (!formData) return;

    setIsLoading(true);
    setError(null);
    setIsError(false);

    try {
      const startTime = performance.now();

      const cleanData = JSON.parse(JSON.stringify(formData));
      const finalData = processOptionalFields(cleanData);

      const response = await fetch("http://localhost:8000/fourpercent/api/v4/retirement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });

      if (!response.ok) {
        let errorMessage = `API error: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorData.message || errorMessage;
        } catch (e) {
          // Keep default message
        }
        throw new Error(errorMessage);
      }

      const apiResult: RetirementResponse = await response.json();
      
      const duration = performance.now() - startTime;
      console.log(`Manual calculation completed in ${duration.toFixed(2)}ms`);

      setResults(apiResult);
    } catch (err: any) {
      let errorMessage = "Failed to calculate retirement projection. Please try again.";
      if (err.message.includes('Failed to fetch')) {
        errorMessage = "Failed to connect to the calculator. Please check that the backend server is running.";
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError({ message: errorMessage });
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [formData]);

  /**
   * Retry calculation after an error
   */
  const retryCalculation = useCallback(() => {
    setIsError(false);
    setError(null);
  }, []);

  return { results, isLoading, isError, error, calculateNow };
}

/**
 * Helper function to clean optional fields from form data
 */
function processOptionalFields(obj: any): any {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === 'object' && !Array.isArray(obj)) {
    const cleanedObj: any = {};
    Object.keys(obj).forEach(key => {
      if (obj[key] !== null && obj[key] !== undefined) {
        if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
          const hasValidValues = Object.values(obj[key]).some(val => val !== null && val !== undefined);
          if (hasValidValues) {
            cleanedObj[key] = processOptionalFields(obj[key]);
          }
        } else {
          cleanedObj[key] = obj[key];
        }
      }
    });
    return cleanedObj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => processOptionalFields(item));
  }

  return obj;
}
