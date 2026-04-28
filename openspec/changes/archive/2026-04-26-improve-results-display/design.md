## Context

The backend `RetirementResponse` model already includes `success_probability` and `year_of_depletion` as optional fields, but the frontend only displays basic balance metrics. The calculation engine produces time-series data that can be visualized effectively.

## Goals / Non-Goals

**Goals:**
- Add interactive chart showing portfolio balance over retirement years
- Display success probability (chance of money lasting throughout retirement)
- Show year of depletion when portfolio runs out
- Visualize income vs expenses timeline
- Provide breakdown by account type if available

**Non-Goals:**
- Adding predictive analytics or Monte Carlo simulation (existing engine handles this)
- Implementing custom charting library (use existing Recharts in project)

## Decisions

1. **Use existing Recharts**: The project already has Recharts installed - use LineChart and BarChart components
2. **Responsive charts**: Charts resize with container width for mobile/tablet views
3. **Hover tooltips**: Show exact values on hover for detailed inspection
4. **Color scheme**: Green for positive outcomes, red for depletion scenarios

## Chart Specifications

**Portfolio Balance Chart:**
- X-axis: Age (from current age to end of retirement)
- Y-axis: Portfolio balance in dollars
- Line color: Primary blue
- Gradient fill under line (green if success, red if depleted)

**Income vs Expenses Chart:**
- X-axis: Age
- Y-axis: Annual amount in dollars
- Two bars per year: income (green), expenses (red/orange)
- Shows cash flow dynamics throughout retirement

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Charts look cluttered with long retirement periods | Add zoom/scroll for detailed view, summary stats above chart |
| Performance with 50+ year projections | Render charts efficiently using Recharts' optimized components |
