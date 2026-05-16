# Retirement Calculator: Annual Cash Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor `_calculate_yearly_income` in retirement_v4.py to compute annual cash flow (returns + contributions - withdrawals) instead of just non-withdrawal income sources.

**Architecture:** Update the function signature to accept portfolio balance and retirement status, calculate returns based on phase, then integrate into the main projection loop. Rename output from `income` to `net_cash_flow`.

**Tech Stack:** Python 3.x, Pydantic models, pytest for unit tests

---

## File Structure Map

| File | Action | Reason |
|------|--------|--------|
| `backend/fourpercent/calculation/retirement_v4.py` | Modify | Update `_calculate_yearly_income` signature and logic |
| `tests/unit/calculation/test_retirement_cash_flow.py` | Create | Unit tests for new cash flow calculation |
| `backend/fourpercent/models/root.py` | Check | Verify RetirementResponse has correct field names |

---

## Task 1: Write unit test for pre-retirement cash flow

**Files:**
- Create: `tests/unit/calculation/test_retirement_cash_flow.py`
- Test target: `_calculate_yearly_income` in `backend/fourpercent/calculation/retirement_v4.py`

- [ ] **Step 1.1: Create test file with boilerplate**

Write the initial test file structure:

```python
"""
Unit tests for retirement cash flow calculations.
Tests _calculate_yearly_income function behavior.
"""

import pytest

from fourpercent.models.root import RetirementInput, Timeline, CurrentAssets, PortfolioAllocation


class TestPreRetirementCashFlow:
    """Test cash flow calculations during pre-retirement years."""

    def test_pre_retirement_cash_flow_returns_plus_contributions(self):
        """Verify cash flow = portfolio returns + contributions."""
        # Setup: Create input with known values
        input_data = {
            "timeline": {
                "current_age": 35,
                "retirement_age": 65,
                "years_in_retirement": 30
            },
            "current_assets": {
                "investment_portfolio": 100000,
                "your_401k_ira": 50000,
                "spouse_401k_ira": 0,
                "yearly_contribution": 10000,
                "yearly_contribution_increase_pct": 0.0,
                "catch_up_eligible": False
            },
            "portfolio_allocation": {
                "equity_pct": 70.0,
                "fixed_income_pct": 30.0,
                "equity_return_pre_retirement_pct": 8.0,
                "fixed_income_return_pct": 3.0,
                "equity_return_post_retirement_pct": 5.0,
                "inflation_rate_pct": 2.5
            },
            "retirement_spending": {
                "spending_strategy": "four_pct_rule",
                "annual_inflation_rate": 2.5,
                "two_period_mode": False
            }
        }

        # Calculate expected returns: (100k * 70% * 8%) + (100k * 30% * 3%) = 5600 + 900 = 6500
        expected_return = 6500.0
        expected_contribution = 10000.0
        expected_cash_flow = expected_return + expected_contribution

        # Create input model (convert dict to model)
        retirement_input = RetirementInput(**input_data)

        # TODO: Call _calculate_yearly_income and verify result
        # This test will initially fail - we'll implement the function next


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
```

- [ ] **Step 1.2: Run test to verify it fails (no implementation yet)**

```bash
cd /home/rafid/devel/four_percentor && python -m pytest tests/unit/calculation/test_retirement_cash_flow.py::TestPreRetirementCashFlow::test_pre_retirement_cash_flow_returns_plus_contributions -v
```

Expected output: `FAILED` with error about missing implementation or assertion failure.

---

## Task 2: Write unit test for post-retirement cash flow

- [ ] **Step 2.1: Add post-retirement test to same file**

Add this class after the existing test class:

```python


class TestPostRetirementCashFlow:
    """Test cash flow calculations during post-retirement years."""

    def test_post_retirement_cash_flow_returns_minus_withdrawals(self):
        """Verify cash flow = portfolio returns - withdrawals."""
        # Setup: Create input in retirement phase
        input_data = {
            "timeline": {
                "current_age": 65,
                "retirement_age": 65,
                "years_in_retirement": 30
            },
            "current_assets": {
                "investment_portfolio": 1000000,
                "your_401k_ira": 0,
                "spouse_401k_ira": 0,
                "yearly_contribution": 0,
                "yearly_contribution_increase_pct": 0.0,
                "catch_up_eligible": False
            },
            "portfolio_allocation": {
                "equity_pct": 60.0,
                "fixed_income_pct": 40.0,
                "equity_return_pre_retirement_pct": 7.0,
                "fixed_income_return_pct": 3.0,
                "equity_return_post_retirement_pct": 5.0,
                "inflation_rate_pct": 2.5
            },
            "retirement_spending": {
                "spending_strategy": "four_pct_rule",
                "annual_inflation_rate": 2.5,
                "two_period_mode": False
            }
        }

        retirement_input = RetirementInput(**input_data)
        calculator = RetirementCalculator(retirement_input)

        # For age 65 (retirement start), with $1M balance:
        # Returns: (1M * 60% * 5%) + (1M * 40% * 3%) = 30,000 + 12,000 = 42,000
        # Withdrawal (4% rule): 1M * 4% = 40,000
        # Cash flow: 42,000 - 40,000 = 2,000

        starting_balance = 1000000.0
        cash_flow = calculator._calculate_yearly_income(65, starting_balance, is_retired=True)

        # TODO: Add assertion once implementation exists
```

- [ ] **Step 2.2: Run all tests to verify both fail**

```bash
cd /home/rafid/devel/four_percentor && python -m pytest tests/unit/calculation/test_retirement_cash_flow.py -v
```

Expected: Both test methods show `FAILED` or `ERROR`.

---

## Task 3: Implement `_calculate_yearly_income` refactoring

**Files:**
- Modify: `backend/fourpercent/calculation/retirement_v4.py:150-180`

- [ ] **Step 3.1: Read current implementation**

```bash
cd /home/rafid/devel/four_percentor && sed -n '150,210p' backend/fourpercent/calculation/retirement_v4.py
```

Note the current function and surrounding code.

- [ ] **Step 3.2: Update `_calculate_yearly_income` signature and implementation**

Replace the entire `_calculate_yearly_income` method (around line 150+) with:

```python
    def _calculate_yearly_income(
        self, age: int, portfolio_balance: float, is_retired: bool
    ) -> float:
        """Calculate net cash flow for a given year.

        Pre-retirement: returns + contributions
        Post-retirement: returns - withdrawals

        Args:
            age: Current age
            portfolio_balance: Starting balance for this year
            is_retired: Whether we're in retirement phase

        Returns:
            Net cash flow (positive = net gain, negative = net loss)
        """
        if portfolio_balance <= 0:
            return 0.0

        timeline = self.input.timeline
        assets = self.input.current_assets
        portfolio = self.input.portfolio_allocation

        # Calculate pre-retirement return rate
        pre_retirement_return = (
            (portfolio.equity_pct / 100) * (portfolio.equity_return_pre_retirement_pct / 100)
            + (portfolio.fixed_income_pct / 100) * (portfolio.fixed_income_return_pct / 100)
        )

        # Calculate post-retirement return rate
        post_retirement_return = (
            (portfolio.equity_pct / 100) * (portfolio.equity_return_post_retirement_pct / 100)
            + (portfolio.fixed_income_pct / 100) * (portfolio.fixed_income_return_pct / 100)
        )

        # Calculate returns on portfolio
        if is_retired:
            return_rate = post_retirement_return
        else:
            return_rate = pre_retirement_return

        returns = portfolio_balance * return_rate

        if not is_retired:
            # Pre-retirement: add contributions
            contribution = assets.yearly_contribution
            cash_flow = returns + contribution
        else:
            # Post-retirement: subtract withdrawals based on spending config
            withdrawal = self._calculate_withdrawal(age, portfolio_balance)
            cash_flow = returns - withdrawal

        return cash_flow

    def _calculate_withdrawal(self, age: int, portfolio_balance: float) -> float:
        """Calculate withdrawal amount for a given year."""
        spending = self.input.retirement_spending

        if spending.two_period_mode:
            # Determine which period we're in
            if (spending.period_1_start_age is not None and spending.period_1_end_age is not None
                and age >= spending.period_1_start_age and age <= spending.period_1_end_age):
                withdrawal_pct = spending.period_1_withdrawal_pct
            elif (spending.period_2_start_age is not None and spending.period_2_end_age is not None
                  and age >= spending.period_2_start_age and age <= spending.period_2_end_age):
                withdrawal_pct = spending.period_2_withdrawal_pct
            else:
                # Fallback to standard calculation
                withdrawal_pct = spending.withdrawal_pct if hasattr(spending, 'withdrawal_pct') else 4.0
        else:
            # Single period spending
            if spending.spending_strategy == "four_pct_rule":
                withdrawal_pct = 4.0
            elif hasattr(spending, 'withdrawal_pct') and spending.withdrawal_pct is not None:
                withdrawal_pct = spending.withdrawal_pct
            else:
                # Fallback: use first_year_expenses as dollar amount or percentage
                if hasattr(spending, 'first_year_expenses') and spending.first_year_expenses is not None:
                    # If first_year_expenses is set, we need to convert to percentage
                    withdrawal_pct = (spending.first_year_expenses / portfolio_balance) * 100
                else:
                    withdrawal_pct = 4.0

        return portfolio_balance * (withdrawal_pct / 100)
```

- [ ] **Step 3.3: Run tests to verify they pass**

```bash
cd /home/rafid/devel/four_percentor && python -m pytest tests/unit/calculation/test_retirement_cash_flow.py -v
```

Expected: Both test methods now show `PASSED` (after adding assertions).

---

## Task 4: Update `calculate_projection` to use new function signature

**Files:**
- Modify: `backend/fourpercent/calculation/retirement_v4.py:60-120`

- [ ] **Step 4.1: Read the calculate_projection method**

```bash
cd /home/rafid/devel/four_percentor && sed -n '35,145p' backend/fourpercent/calculation/retirement_v4.py
```

- [ ] **Step 4.2: Update the projection loop to call new function**

In the main loop, we need to:
1. Capture starting balance before any calculations
2. Call `_calculate_yearly_income` with the new signature
3. Store result in `net_cash_flows` instead of `incomes`

Find this section (around line 75-105) and replace:

**OLD CODE:**
```python
            balances.append(portfolio_balance)

            # Calculate income and expenses
            annual_income = self._calculate_yearly_income(year)
            annual_expenses = current_spending

            incomes.append(annual_income)
            expenses_list.append(annual_expenses)
            net_incomes.append(annual_income - annual_expenses)
```

**NEW CODE:**
```python
            balances.append(portfolio_balance)

            # Calculate cash flow using STARTING balance for this year
            starting_balance = portfolio_balance - current_contribution if year < retirement_age else portfolio_balance + current_spending
            
            annual_cash_flow = self._calculate_yearly_income(year, starting_balance, year >= retirement_age)
            annual_expenses = current_spending

            net_cash_flows.append(annual_cash_flow)
            expenses_list.append(annual_expenses)
```

Also update the output field names in the return statement:

**OLD:**
```python
            incomes=incomes,
            expenses=expenses_list,
            net_income=net_incomes,
```

**NEW:**
```python
            net_cash_flows=net_cash_flows,
            expenses=expenses_list,
```

- [ ] **Step 4.3: Add missing variable initialization**

Add `net_cash_flows = []` before the loop (with the other array initializations like `ages = []`, `balances = []`, etc.)

- [ ] **Step 4.4: Run tests to verify integration works**

```bash
cd /home/rafid/devel/four_percentor && python -m pytest tests/unit/calculation/test_retirement_cash_flow.py -v
```

Expected: Tests pass with new implementation.

---

## Task 5: Update RetirementResponse model (if needed)

**Files:**
- Check: `backend/fourpercent/models/root.py`

- [ ] **Step 5.1: Verify the response model**

```bash
cd /home/rafid/devel/four_percentor && grep -A 30 "class RetirementResponse" backend/fourpercent/models/root.py
```

Check if the model has `income` field that needs to be renamed to `net_cash_flows`.

- [ ] **Step 5.2: Update model if necessary**

If the model still uses `income`, update it:

```python
# OLD:
income: List[float]

# NEW:
net_cash_flows: List[float]
```

---

## Task 6: Verify existing tests still pass

- [ ] **Step 6.1: Run all retirement-related tests**

```bash
cd /home/rafid/devel/four_percentor && python -m pytest tests/test_retirement_validation.py -v
```

Expected: All tests pass (existing validation logic shouldn't break).

---

## Task 7: Commit the changes

- [ ] **Step 7.1: Review all changes**

```bash
cd /home/rafid/devel/four_percentor && git status
cd /home/rafid/devel/four_percentor && git diff backend/
```

- [ ] **Step 7.2: Stage and commit**

```bash
cd /home/rafid/devel/four_percentor && \
git add tests/unit/calculation/test_retirement_cash_flow.py && \
git add backend/fourpercent/calculation/retirement_v4.py && \
git commit -m "refactor: implement annual cash flow calculation in retirement calculator"
```

---

## Task 8: Final verification

- [ ] **Step 8.1: Run a quick sanity check**

```bash
cd /home/rafid/devel/four_percentor && python -c "
from fourpercent.models.root import RetirementInput
from fourpercent.calculation.retirement_v4 import calculate_retirement

# Quick test
data = {
    'timeline': {'current_age': 35, 'retirement_age': 65, 'years_in_retirement': 30},
    'current_assets': {
        'investment_portfolio': 100000, 'your_401k_ira': 50000,
        'spouse_401k_ira': 0, 'yearly_contribution': 10000,
        'yearly_contribution_increase_pct': 3.0, 'catch_up_eligible': False
    },
    'portfolio_allocation': {
        'equity_pct': 70.0, 'fixed_income_pct': 30.0,
        'equity_return_pre_retirement_pct': 8.0, 'fixed_income_return_pct': 3.0,
        'equity_return_post_retirement_pct': 5.0, 'inflation_rate_pct': 2.5
    },
    'retirement_spending': {
        'spending_strategy': 'four_pct_rule', 'annual_inflation_rate': 2.5, 'two_period_mode': False
    }
}
result = calculate_retirement(RetirementInput(**data))
print('Success:', result.success)
print('Final balance:', result.final_balance)
print('Cash flows calculated for', len(result.net_cash_flows), 'years')
"
```

Expected: No errors, output shows success status and cash flow data.
