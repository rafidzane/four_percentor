## Context

The retirement dashboard at http://localhost:3000/dashboard/retirement is failing because the frontend form attempts to submit data to `/fourpercent/api/v4/retirement` but this endpoint doesn't exist. The error logs show "404 Not Found" when trying to access this route.

The current backend setup has routing issues that prevent proper API endpoint registration for retirement calculations.

## Goals / Non-Goals

**Goals:**
- Fix the missing API endpoint at `/fourpercent/api/v4/retirement`
- Ensure proper routing between frontend and backend components
- Implement correct error handling for API communication failures
- Verify all retirement calculation functionality works end-to-end

**Non-Goals:**
- Changing the fundamental retirement calculation algorithm (already implemented)
- Adding new features beyond what's already defined in the existing form
- Redesigning the overall dashboard UI (focus on fixing functional issues)

## Decisions

1. **API Endpoint Structure**: The retirement API should be mounted at `/fourpercent/api/v4/retirement` as specified in both frontend and backend code.

2. **Backend Integration**: The retirement API router is correctly defined but may not be properly included in the main application routing.

3. **Error Handling**: Improved error handling for cases where API endpoints aren't found or fail to respond.

## Risks / Trade-offs

- [API endpoint misconfiguration] → Mitigation: Verify all routes are correctly mounted and accessible
- [Frontend-backend integration issues] → Mitigation: Ensure consistent URL paths between frontend and backend 
- [Regression in existing functionality] → Mitigation: Run all existing tests after changes