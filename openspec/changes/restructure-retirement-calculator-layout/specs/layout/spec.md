# Field Layout Spec

## Overview
Define horizontal grouping for related fields and conditional rendering logic.

## Requirements

### 1. Age Fields Grouping
**Current Requirements:**
- Current age and retirement age appear side-by-side
- Each person's age pair in a single row

**Implementation:**
```tsx
<div className="flex gap-4">
  <div className="flex-1">
    <label>Current Age</label>
    <input type="number" />
  </div>
  <div className="flex-1">
    <label>Retirement Age</label>
    <input type="number" />
  </div>
</div>
```

### 2. Spouse Section Visibility
**Requirements:**
- "Same as husband" checkbox to hide spouse inputs
- Checkbox checked by default when values match
- Manual override allows editing spouse data

**Implementation:**
```tsx
<div className="flex items-center gap-2">
  <input 
    type="checkbox" 
    checked={sameInputs}
    onChange={(e) => setSameInputs(e.target.checked)}
  />
  <span>Same as husband</span>
</div>

{!sameInputs && (
  <SpouseInputsSection />
)}
```

### 3. Grouping by Person
- Husband section: All husband inputs together
- Spouse section: All spouse inputs together (conditional)
- Each person's fields grouped logically

## Acceptance Criteria
1. Current age and retirement age appear in same row for each person
2. "Same as husband" checkbox properly toggles spouse visibility
3. Spouse section hidden when checkbox checked
4. Manual override possible to edit spouse data separately
