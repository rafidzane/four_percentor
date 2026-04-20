# Fix Two-Person Retirement Calculator Key Mismatch

> **For agentic workers:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Update React component property access from snake_case to camelCase to match API response format after interceptor conversion

**Architecture:** The backend returns snake_case keys, but the frontend API client's interceptor converts them to camelCase. The component must use camelCase to access properties correctly.

**Tech Stack:** TypeScript, React, FastAPI backend

---

## Files to Modify

- `frontend/src/app/(main)/dashboard/retirement/two-person/_components/TwoPersonRetirementCalculator.tsx`

### Change Summary:

1. **State type definition (lines 60-64):** Update property names from snake_case to camelCase
2. **Household projection properties:** Convert all snake_case keys in property access
3. **Individual projection properties:** Convert husband_projection and spouse_projection accesses

---

## Implementation Tasks

### Task N: Update results state type definition

**File:** `frontend/src/app/(main)/dashboard/retirement/two-person/_components/TwoPersonRetirementCalculator.tsx`

- [ ] **Step 1: Replace lines 60-64**

Replace:
```tsx
const [results, setResults] = useState<{
  husband_projection: any;
  spouse_projection: any;
  household_projection: any;
} | null>(null);
```

With:
```tsx
const [results, setResults] = useState<{
  husbandProjection: any;
  spouseProjection: any;
  householdProjection: any;
} | null>(null);
```

---

### Task N+1: Update household projection property accesses

**File:** `frontend/src/app/(main)/dashboard/retirement/two-person/_components/TwoPersonRetirementCalculator.tsx`

- [ ] **Step 2: Replace lines 420, 428, 436, 444, 52, 60**

Replace all `household_projection?.` accesses with camelCase:

| Line | Before | After |
|------|--------|-------|
| 420 | `total_net_worth_at_retirement` | `totalNetWorthAtRetirement` |
| 428 | `total_liquid_savings_at_retirement` | `totalLiquidSavingsAtRetirement` |
| 436 | `monthly_income_at_retirement` | `monthlyIncomeAtRetirement` |
| 444 | `combined_social_security_benefit` | `combinedSocialSecurityBenefit` |
| 452 | `safe_withdrawal_amount` | `safeWithdrawalAmount` |
| 460 | `years_to_retirement` | `yearsToRetirement` |

---

### Task N+2: Update husband projection property accesses

**File:** `frontend/src/app/(main)/dashboard/retirement/two-person/_components/TwoPersonRetirementCalculator.tsx`

- [ ] **Step 3: Replace lines 465, 468, 469, 470**

Replace all `husband_projection?.` accesses:

| Line | Before | After |
|------|--------|-------|
| 465 | `{results.husband_projection && (` | `{results.husbandProjection && (` |
| 468 | `retirement_age` | `retirementAge` |
| 469 | `total_liquid_savings_at_retirement` | `totalLiquidSavingsAtRetirement` |
| 470 | `social_security_benefit` | `socialSecurityBenefit` |

---

### Task N+3: Update spouse projection property accesses

**File:** `frontend/src/app/(main)/dashboard/retirement/two-person/_components/TwoPersonRetirementCalculator.tsx`

- [ ] **Step 4: Replace lines 475, 478, 479, 480**

Replace all `spouse_projection?.` accesses:

| Line | Before | After |
|------|--------|-------|
| 475 | `{results.spouse_projection && (`` | `{results.spouseProjection && (`` |
| 478 | `retirement_age` | `retirementAge` |
| 479 | `total_liquid_savings_at_retirement` | `totalLiquidSavingsAtRetirement` |
| 480 | `social_security_benefit` | `socialSecurityBenefit` |

---

## Testing

- [ ] **Step 5: Run frontend**

```bash
cd /home/rafid/devel/four_percentor/frontend
npm run dev
```

- [ ] **Step 6: Verify results display**

Navigate to `/dashboard/retirement/two-person` and confirm:
1. Results display without "undefined" values
2. All numeric fields show proper dollar amounts
3. No console errors

- [ ] **Step 7: Commit changes**

```bash
git add frontend/src/app/(main)/dashboard/retirement/two-person/_components/TwoPersonRetirementCalculator.tsx
git commit -m "fix: use camelCase property keys matching API response format"
```
