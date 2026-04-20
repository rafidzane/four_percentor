# UI Layout Adjustments Spec

## Overview
Define the layout structure for the two-person retirement calculator with optimized space utilization.

## Requirements

### 1. Column Width Ratio
- Inputs section: 25% of available width (1/3 rounded)
- Results section: 75% of available width (2/3 rounded)
- Must use CSS Grid or Flexbox for precise control

### 2. Font Sizing
**Input Section:**
- Labels: `text-sm` (14px)
- Input fields: `text-sm` (14px)  
- Buttons: `text-base` (16px)

**Results Section:**
- Section headers: `text-lg` (18px)
- Value displays: `text-xl` to `text-2xl` (20-24px)
- Descriptive text: `text-sm` (14px)

### 3. Responsive Behavior
- **Desktop (> 768px):** Use grid layout with 1/3 - 2/3 ratio
- **Mobile (≤ 768px):** Stack vertically, inputs first

### 4. Spacing
- Input fields: `gap-y-3` vertical spacing
- Section padding: `p-6` for both sections
- Card borders: consistent border width and color

## Acceptance Criteria

1. Layout maintains 1/3 - 2/3 ratio on all desktop screen sizes
2. Font sizes match specification (no larger than defined)
3. Mobile view stacks inputs above results without horizontal overflow
4. No visual clutter or cramped elements
