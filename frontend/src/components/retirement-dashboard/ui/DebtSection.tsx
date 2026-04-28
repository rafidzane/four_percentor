import { FC } from "react";
import { useFormContext } from "react-hook-form";
import { FormData } from "./RetirementForm";

interface DebtSectionProps {
  className?: string;
}

export const DebtSection: FC<DebtSectionProps> = ({ className }) => {
  const { register, watch } = useFormContext<FormData>();

  return (
    <section className={`rounded-xl border p-6 ${className}`}>
      <h3 className="text-lg font-semibold mb-4">Debt Obligations</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mortgage */}
        <div className="space-y-2">
          <label htmlFor="debt.mortgage.balance" className="block font-medium text-sm mb-1">
            Mortgage Balance
          </label>
          <input
            id="debt.mortgage.balance"
            type="number"
            min={0}
            step={1000}
            {...register("debt.mortgage.balance", { valueAsNumber: true })}
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="debt.mortgage.interest_rate" className="block font-medium text-sm mb-1">
            Interest Rate (%)
          </label>
          <input
            id="debt.mortgage.interest_rate"
            type="number"
            min={0}
            max={30}
            step={0.1}
            {...register("debt.mortgage.interest_rate", { valueAsNumber: true })}
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="debt.mortgage.remaining_months" className="block font-medium text-sm mb-1">
            Remaining Term (months)
          </label>
          <input
            id="debt.mortgage.remaining_months"
            type="number"
            min={0}
            step={1}
            {...register("debt.mortgage.remaining_months", { valueAsNumber: true })}
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
          />
        </div>

        {/* Auto Loans */}
        <div className="space-y-2">
          <label className="block font-medium text-sm mb-1">
            Auto Loan 1
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="debt.auto_loans.0.balance" className="block text-xs text-muted-foreground mb-1">
                Balance
              </label>
              <input
                id="debt.auto_loans.0.balance"
                type="number"
                min={0}
                step={100}
                {...register("debt.auto_loans.0.balance", { valueAsNumber: true })}
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="debt.auto_loans.0.monthly_payment" className="block text-xs text-muted-foreground mb-1">
                Monthly Payment
              </label>
              <input
                id="debt.auto_loans.0.monthly_payment"
                type="number"
                min={0}
                step={10}
                {...register("debt.auto_loans.0.monthly_payment", { valueAsNumber: true })}
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block font-medium text-sm mb-1">
            Auto Loan 2
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="debt.auto_loans.1.balance" className="block text-xs text-muted-foreground mb-1">
                Balance
              </label>
              <input
                id="debt.auto_loans.1.balance"
                type="number"
                min={0}
                step={100}
                {...register("debt.auto_loans.1.balance", { valueAsNumber: true })}
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="debt.auto_loans.1.monthly_payment" className="block text-xs text-muted-foreground mb-1">
                Monthly Payment
              </label>
              <input
                id="debt.auto_loans.1.monthly_payment"
                type="number"
                min={0}
                step={10}
                {...register("debt.auto_loans.1.monthly_payment", { valueAsNumber: true })}
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Credit Cards */}
        <div className="space-y-2">
          <label htmlFor="debt.credit_cards.total_balance" className="block font-medium text-sm mb-1">
            Credit Card Debt
          </label>
          <input
            id="debt.credit_cards.total_balance"
            type="number"
            min={0}
            step={100}
            {...register("debt.credit_cards.total_balance", { valueAsNumber: true })}
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="debt.credit_cards.avg_apr" className="block font-medium text-sm mb-1">
            Average APR (%)
          </label>
          <input
            id="debt.credit_cards.avg_apr"
            type="number"
            min={0}
            max={50}
            step={0.1}
            {...register("debt.credit_cards.avg_apr", { valueAsNumber: true })}
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
          />
        </div>

        {/* Student Loans */}
        <div className="space-y-2">
          <label htmlFor="debt.student_loans.balance" className="block font-medium text-sm mb-1">
            Student Loan Debt
          </label>
          <input
            id="debt.student_loans.balance"
            type="number"
            min={0}
            step={1000}
            {...register("debt.student_loans.balance", { valueAsNumber: true })}
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="debt.student_loans.monthly_payment" className="block font-medium text-sm mb-1">
            Monthly Payment
          </label>
          <input
            id="debt.student_loans.monthly_payment"
            type="number"
            min={0}
            step={10}
            {...register("debt.student_loans.monthly_payment", { valueAsNumber: true })}
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus:border-ring focus:ring-ring/50 outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center space-x-3 cursor-pointer mt-6">
            <input
              id="debt.student_loans.income_driven_plan"
              type="checkbox"
              {...register("debt.student_loans.income_driven_plan")}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span>Income-driven repayment plan</span>
          </label>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t">
        <p className="text-sm text-muted-foreground">
          This section helps calculate your net worth and debt-free timeline for retirement planning.
        </p>
      </div>
    </section>
  );
};