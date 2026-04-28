## Why

The current retirement page at `/dashboard/retirement` is a placeholder with only basic stat cards. Users need a comprehensive, interactive calculator to model their retirement strategy with detailed inputs across personal, financial, and income/expense categories.

This change implements a complete retirement planning system with:
- Multi-section input forms for all key retirement variables
- Mock backend API endpoints that return computed projections
- A projection tab showing results based on user inputs

## What Changes

- **New UI**: Comprehensive input form organized into categories (Personal, Portfolio, Contributions, Returns, Withdrawal Strategy, Income Sources, Expenses, Real Estate)
- **New Tab**: Enable and implement "Projection" tab to display retirement forecasts
- **Mock Backend API**: Create FastAPI endpoints that accept user inputs and return computed retirement projections

## Capabilities

### New Capabilities
- `retirement-input-form`: Multi-section form for collecting comprehensive retirement planning data including personal demographics, portfolio breakdowns, contribution details, return assumptions, withdrawal strategies, income sources, expenses, and real estate holdings
- `retirement-computation-api`: Backend API endpoint that accepts retirement inputs and returns computed projections including projected portfolio growth, sustainable withdrawal amounts, and scenario analysis

### Modified Capabilities
<!-- None - this is a new feature -->

## Impact

**Frontend:**
- New page structure at `/dashboard/retirement` with tab navigation
- Multiple form components organized by category
- State management for form data using Zustand
- Results display components for projection output

**Backend:**
- New API endpoints in `backend/fourpercent/api/`:
  - `POST /api/v1/retirement/compute` - Accept retirement inputs, return projections
- Pydantic models for request/response schemas
- Mock calculation engine with realistic assumptions

**Dependencies:**
- No new dependencies required (can use existing UI component library)
