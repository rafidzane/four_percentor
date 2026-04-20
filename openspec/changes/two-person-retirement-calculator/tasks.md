## 5. Navigation & Cleanup

- [x] 5.1 Update `frontend/src/navigation/sidebar/sidebar-items.ts` to change Retirement URL from `/dashboard/retirement` to `/dashboard/retirement/two-person`
- [x] 5.2 Create new route file at `frontend/src/app/(main)/dashboard/retirement/two-person/page.tsx` that imports TwoPersonRetirementCalculator
- [x] 5.3 Move legacy single-person calculator component to `frontend/src/app/(main)/dashboard/retirement/single-person/_components/SinglePersonRetirementCalculator.tsx`
- [x] 5.4 Create backward compatibility route at `/dashboard/retirement/single-person` pointing to old calculator
- [x] 5.5 Update main retirement page to redirect to two-person version

## 6. Testing

- [ ] 6.1 Write unit tests for dual-person calculation logic
- [ ] 6.2 Test API endpoint with valid husband/spouse data
- [ ] 6.3 Test error handling for missing fields and invalid values
- [ ] 6.4 Verify backward compatibility with v1/v2 endpoints

## 7. Documentation

- [ ] 7.1 Update API documentation with new v3 endpoint schema
- [ ] 7.2 Create user guide explaining two-person calculator differences
- [ ] 7.3 Add migration notes for existing users moving to dual-person
