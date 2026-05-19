## 1. Update RetirementForm.tsx

- [ ] 1.1 Remove Calculate button from bottom of form (after Real Estate section)
- [ ] 1.2 Remove loading indicator div that appears below button
- [ ] 1.3 Remove error banner div that appears after loading indicator

## 2. Update page.tsx - Right Column Header

- [ ] 2.1 Add Calculate button to right column header (above summary cards)
- [ ] 2.2 Position button with appropriate spacing from summary cards
- [ ] 2.3 Make button full-width in right column
- [ ] 2.4 Wire button onClick to trigger calculateNow() function

## 3. Verify Button Functionality

- [ ] 3.1 Test button triggers calculation correctly
- [ ] 3.2 Verify disabled state during calculation
- [ ] 3.3 Check loading spinner appears when calculating
- [ ] 3.4 Confirm results display after successful calculation

## 4. Responsive Behavior Testing

- [ ] 4.1 Test desktop layout (>1024px) - button in right column header
- [ ] 4.2 Test tablet layout (768-1023px) - button at top of screen
- [ ] 4.3 Test mobile layout (<768px) - button at top, full width

## 5. Visual Verification

- [ ] 5.1 Confirm no duplicate calculate buttons exist in DOM
- [ ] 5.2 Verify form sections remain below all inputs
- [ ] 5.3 Check results section is visually separated from form
- [ ] 5.4 Validate dark mode button styling matches light mode

## 6. Build Verification

- [ ] 6.1 Run frontend build (npm run build) in frontend directory
- [ ] 6.2 Verify no TypeScript errors
- [ ] 6.3 Confirm all imports resolve correctly
- [ ] 6.4 Check for any console warnings during development
