## Context

The backend already has a `HistoricalYearInput` model with validation for years 1871-2025, and the frontend's `PortfolioAllocationInput` includes `simulation_mode: "single_year"`. However, when users select single_year mode, there is no input field to specify which year to simulate.

## Goals / Non-Goals

**Goals:**
- Add interactive historical year selector visible only in "single_year" simulation mode
- Display helpful context about selected historical year (market events)
- Allow quick selection of notable years (1929, 1974, 2008, 2020) via preset buttons

**Non-Goals:**
- Adding new historical data sources
- Modifying the retirement calculation engine's handling of historical data

## Decisions

1. **Conditional rendering**: Historical year input only shows when `simulation_mode === "single_year"`

2. **Preset buttons for notable years**: Add quick-select buttons for historically significant years:
   - 1929 (Great Depression / Crash)
   - 1974 (Stagflation / Oil crisis)  
   - 2000 (Dot-com bubble burst)
   - 2008 (Financial Crisis)
   - 2020 (Pandemic crash)

3. **Freeform year entry**: Allow any year in range via number input

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Users selecting years with insufficient historical data | Document available data range clearly (1871-2025) |
| Confusion about what "single_year" simulation means | Add help tooltip explaining the concept |
