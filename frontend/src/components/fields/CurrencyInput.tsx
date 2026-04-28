"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface CurrencyInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, label, error, ...props }, ref) => {
    const [focused, setFocused] = React.useState(false)
    const [value, setValue] = React.useState<string>("")

    React.useEffect(() => {
      if (props.value !== undefined && props.value !== null && !focused) {
        const numValue = typeof props.value === "number" ? props.value : parseFloat(props.value as string)
        setValue(!isNaN(numValue) ? numValue.toLocaleString("en-US", { style: "currency", currency: "USD" }) : "")
      }
    }, [props.value, focused])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputVal = e.target.value.replace(/[^\d.-]/g, "")
      setValue(inputVal)
      
      if (props.onChange) {
        const numValue = parseFloat(inputVal)
        props.onChange({
          ...e,
          target: { ...e.target, value: isNaN(numValue) ? "" : String(numValue) }
        })
      }
    }

    const handleBlur = () => {
      setFocused(false)
      if (value) {
        const numValue = parseFloat(value.replace(/[^\d.-]/g, ""))
        setValue(!isNaN(numValue) ? numValue.toLocaleString("en-US", { style: "currency", currency: "USD" }) : "")
      }
    }

    const handleFocus = () => {
      setFocused(true)
      setValue(value.replace(/[$.,]/g, ""))
    }

    return (
      <div className="space-y-1">
        {label && <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{label}</label>}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">$</span>
          <input
            ref={ref}
            type="text"
            inputMode="decimal"
            className={cn(
              "flex h-9 w-full rounded-md border border-input bg-transparent px-8 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              error && "focus-visible:ring-destructive border-destructive",
              className
            )}
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    )
  }
)
CurrencyInput.displayName = "CurrencyInput"

export { CurrencyInput }
