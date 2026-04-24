## 1. Cleanup existing files

- [ ] 1.1 Delete `/frontend/src/app/(main)/dashboard/retirement/_components/RetirementCalculator.tsx`
- [ ] 1.2 Delete all files in `/frontend/src/components/retirement-calculator/` directory
- [ ] 1.3 Verify no imports reference deleted components

## 2. Create new module structure

- [ ] 2.1 Create `/frontend/src/app/(main)/dashboard/retirement/_components/RetirementForm.tsx`
- [ ] 2.2 Create `/frontend/src/app/(main)/dashboard/retirement/_components/ResultsDisplay.tsx`
- [ ] 2.3 Create `/frontend/src/app/(main)/dashboard/retirement/_components/calculateRetirement.ts`

## 3. Implement calculation engine

- [ ] 3.1 Implement compound interest calculation function
- [ ] 3.2 Implement retirement projection calculations
- [ ] 3.3 Implement social security benefit estimation
- [ ] 3.4 Implement withdrawal rate and safe withdrawal amount calculations
- [ ] 3.5 Add input validation function returning structured errors

## 4. Implement RetirementForm component

- [ ] 4.1 Create form fields for all retirement parameters
- [ ] 4.2 Add real-time validation with error display
- [ ] 4.3 Implement submit handler that calls calculateRetirement
- [ ] 4.4 Add loading state management

## 5. Implement ResultsDisplay component

- [ ] 5.1 Create result cards for net worth, liquid savings, monthly income
- [ ] 5.2 Display social security benefit and safe withdrawal amount
- [ ] 5.3 Format all currency values using Intl.NumberFormat
- [ ] 5.4 Handle loading state with spinner

## 6. Integrate components in page files

- [ ] 6.1 Update two-person page to use new component structure
- [ ] 6.2 Update single-person page to use new component structure  
- [ ] 6.3 Verify API integration works end-to-end

## 7. Testing

- [ ] 7.1 Write unit tests for calculateRetirement functions
- [ ] 7.2 Write component tests for RetirementForm validation
- [ ] 7.3 Run full e2e test of calculator flow
