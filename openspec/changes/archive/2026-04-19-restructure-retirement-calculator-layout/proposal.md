## Why

The current two-person retirement calculator layout has inputs and results displayed in a suboptimal format. Users need better visual hierarchy with inputs taking less space (1/3) and results taking more space (2/3). Additionally, the font sizes are too large for inputs, currency values aren't clearly formatted, and related fields like current age and retirement age should be side-by-side for better UX.

## What Changes

- **Layout restructuring**: Inputs section takes 1/3 of page width, results take 2/3
- **Font sizing**: Reduce font sizes for inputs section while maintaining readability
- **Currency formatting**: Ensure all monetary values display with proper currency symbols and formatting
- **Field arrangement**: Place current age and retirement age side-by-side for each person
- **Conditional spouse section**: Hide spouse info when husband and spouse data are identical

## Capabilities

### New Capabilities
- `ui-layout-adjustments`: Adjust responsive layout grid to 1/3 inputs / 2/3 results ratio with optimized spacing
- `currency-formatting-improvements`: Ensure all monetary fields display with proper currency symbols, thousands separators, and consistent formatting
- `side-by-side-field-grouping`: Group related input fields (age pairs) horizontally for better space utilization

### Modified Capabilities
- None - new capability without modifying existing spec behavior

## Impact

**Frontend:**
- Update `TwoPersonRetirementCalculator.tsx` component layout with new CSS grid/flex configuration
- Add conditional rendering logic to hide spouse section when data matches husband's
- Implement currency formatting utility for monetary fields
- Adjust font sizes in input sections
