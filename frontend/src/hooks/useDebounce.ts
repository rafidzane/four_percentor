import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Creates a debounced version of a value that only updates after the specified delay.
 * Useful for preventing excessive calculations during rapid input changes.
 *
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 500)
 * @returns Debounced value and function to cancel pending updates
 *
 * @example
 * const debouncedValue = useDebounce(formValues, 300);
 */
export function useDebounce<T>(value: T, delay: number = 500): [T, () => void] {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [debouncedValue, setDebouncedValue] = useState(value);

  // Cleanup on unmount or value change
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay]);

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  return [debouncedValue, cancel];
}
