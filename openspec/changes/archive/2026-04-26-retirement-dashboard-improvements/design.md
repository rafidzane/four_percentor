## Context

The retirement dashboard at http://localhost:3000/dashboard/retirement is not functioning properly due to several issues:

1. The frontend form submits data to an incorrect API endpoint path
2. The frontend contains a duplicate section in the RetirementForm component 
3. The backend calculation logic doesn't properly handle all inputs from the frontend form
4. The UI doesn't properly display results after calculation

## Goals / Non-Goals

**Goals:**
- Fix the retirement dashboard so that users can input data and see retirement projections
- Ensure the frontend properly communicates with the backend API at `/fourpercent/api/v4/retirement`
- Remove duplicate sections from the RetirementForm component
- Implement proper error handling for API calls
- Display calculation results correctly in the UI

**Non-Goals:**
- Changing the fundamental retirement calculation algorithm (this is already implemented)
- Adding new features beyond what's specified in the existing form
- Redesigning the overall dashboard UI (focus on functionality, not aesthetics)

## Decisions

1. **API Endpoint Path**: The frontend will submit to `/fourpercent/api/v4/retirement` which matches the backend endpoint definition in `backend/fourpercent/api/retirement_api.py`.

2. **Frontend Form Fix**: Remove the duplicate Contributions section from the RetirementForm component to ensure clean, functional form.

3. **Backend Calculation Logic**: The existing retirement calculation logic in `backend/fourpercent/calculation/retirement_v4.py` is already comprehensive and should handle all frontend inputs correctly once properly connected.

4. **Error Handling**: Implement proper error handling for API calls with user-friendly messages.

## Risks / Trade-offs

- [Backend API mismatch] → Mitigation: Ensure endpoint paths match exactly between frontend and backend
- [Form validation issues] → Mitigation: Validate that all required fields are being properly sent from frontend to backend
- [Display issues] → Mitigation: Verify results display properly after API call completion