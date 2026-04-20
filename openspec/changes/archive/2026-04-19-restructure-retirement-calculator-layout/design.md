## Context

The current two-person retirement calculator component (`TwoPersonRetirementCalculator.tsx`) displays inputs and results in a vertical layout that doesn't make optimal use of available screen real estate. The existing implementation has:
- Inputs and results stacked vertically
- Large font sizes for input fields
- Monetary values displayed without proper currency formatting
- Current age and retirement age fields in separate rows

## Goals / Non-Goals

**Goals:**
1. Restructure layout to use 1/3 of page for inputs, 2/3 for results
2. Reduce font size in input section while maintaining readability
3. Ensure all currency values display with proper formatting ($, commas)
4. Place current age and retirement age side-by-side per person
5. Hide spouse section when data matches husband's

**Non-Goals:**
1. Change calculation logic or API integration
2. Add new features beyond layout/formatting improvements
3. Refactor state management or component architecture

## Decisions

**1. Layout Grid Strategy**
*Decision:* Use CSS grid with `grid-template-columns: repeat(4, 1fr)` for a 1:3 ratio (1 column inputs, 3 columns results)
*Rationale:* Grid provides precise control over column width ratios and responsive behavior

**2. Font Size Reduction**
*Decision:* Reduce all input field labels from text-lg to text-sm, and inputs from text-base to text-sm
*Rationale:* Inputs need less visual weight than results; smaller fonts fit more data in less space

**3. Currency Formatting**
*Decision:* Use `Intl.NumberFormat` with currency: "USD" for all monetary values
*Rationale:* Native JavaScript API provides consistent formatting with proper locale support

**4. Side-by-Side Age Fields**
*Decision:* Group current age and retirement age in same row using flex layout
*Rationale:* Users naturally think of these as a pair; side-by-side reduces vertical scrolling

**5. Conditional Spouse Section**
*Decision:* Add "Same as husband" checkbox that hides spouse inputs when checked
*Rationale:* Many couples have identical retirement plans; conditional display reduces cognitive load

**6. Responsive Behavior**
*Decision:* Stack vertically on mobile (< 768px), use grid layout on desktop
*Rationale:* Mobile screens need vertical stacking regardless of ratio goals

## Risks / Trade-offs

**Risk:** Users may find side-by-side age fields cramped on small screens → Mitigation: Add media queries to revert to stacked layout below 600px width

**Risk:** Reduced font sizes may impact accessibility for users with visual impairments → Mitigation: Ensure contrast ratios meet WCAG AA standards; provide zoom capability

**Trade-off:** Hiding spouse section reduces visibility of spouse data → Mitigation: Add "Show spouse details" toggle if user needs to view/edit spouse inputs after initial setup
