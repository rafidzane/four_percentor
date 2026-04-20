## 1. Layout Restructuring

- [ ] 1.1 Update CSS grid container to use 4-column layout (1 inputs, 3 results)
- [ ] 1.2 Add responsive media query for mobile (< 768px) that stacks vertically
- [ ] 1.3 Implement spacing system: p-6 for sections, gap-y-3 for inputs

## 2. Font Size Adjustments

- [ ] 2.1 Reduce input labels from text-lg to text-sm (14px)
- [ ] 2.2 Reduce input fields from text-base to text-sm (14px)
- [ ] 2.3 Keep result headers at text-lg (18px) or larger
- [ ] 2.4 Verify contrast ratios meet WCAG AA standards

## 3. Currency Formatting Implementation

- [ ] 3.1 Create currencyFormatter utility function using Intl.NumberFormat
- [ ] 3.2 Format all monetary inputs: liquid assets, illiquid assets
- [ ] 3.3 Format all result values: total savings, net worth, income, etc.
- [ ] 3.4 Test formatting with edge cases: $0, large numbers

## 4. Side-by-Side Age Fields

- [ ] 4.1 Group current age and retirement age in flex container
- [ ] 4.2 Update input labels to show both fields clearly
- [ ] 4.3 Maintain validation for each age field independently

## 5. Spouse Section Conditional Display

- [ ] 5.1 Add "Same as husband" checkbox to spouse section header
- [ ] 5.2 Implement state management: sameInputs boolean
- [ ] 5.3 Conditionally render spouse inputs only when !sameInputs
- [ ] 5.4 Auto-populate spouse values from husband when checkbox checked

## 6. Testing & Validation

- [ ] 6.1 Test layout at various screen sizes (desktop, tablet, mobile)
- [ ] 6.2 Verify all currency fields format correctly with Intl.NumberFormat
- [ ] 6.3 Validate age field grouping works as expected
- [ ] 6.4 Test spouse conditional display toggle functionality
- [ ] 6.5 Run accessibility audit for font size contrast ratios
