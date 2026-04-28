# Design: Retirement Projection Chart

## Context

The retirement calculator currently provides numerical results in a tabular format. Users need a visual representation of portfolio progression over time to better understand their retirement planning projections.

## Goals / Non-Goals

**Goals:**
- Display annual portfolio balance progression as a line chart
- Show key metrics (final, average, minimum balance) in the visualization
- Provide interactive features like tooltips and zoom capabilities  
- Maintain responsiveness across device sizes
- Integrate seamlessly with existing dashboard layout

**Non-Goals:**
- Complex financial modeling beyond the existing calculation engine
- Real-time chart updates during form input changes
- Multiple chart types (focus on line chart for now)
- Advanced charting features like annotations or multiple series

## Decisions

1. **Chart Library Selection**: 
   - Use Recharts (already used in project) for consistency
   - Provides good performance and is well-integrated with React
   - Supports tooltips, zoom, and responsive design

2. **Data Structure**:
   - Utilize existing `RetirementResponse` data structure from backend
   - Extract age and portfolio_balance arrays for charting
   - Display key metrics in chart annotations or tooltip

3. **UI Placement**:
   - Place chart below the results section but within the same card 
   - Use 60% of page width for chart, 40% for form elements (as requested)
   - Ensure responsive behavior on mobile devices

4. **Chart Features**:
   - Line chart showing portfolio balance over time
   - Interactive tooltips with year and balance details  
   - X-axis: Age (years), Y-axis: Portfolio Balance ($)
   - Include key metrics as reference lines or annotations

## Chart Specification

```
Data Points: 
- X-Axis: Age (from timeline data)
- Y-Axis: Portfolio Balance ($) 

Chart Features:
- Line showing portfolio balance progression
- Tooltips on hover with year and balance
- Responsive design that adapts to container size
- Clear axis labels and units
- Reference lines for key metrics (final, average, min balances)
```

## Technical Implementation Plan

1. **Frontend**:
   - Create a new chart component using Recharts
   - Integrate with existing retirement results data
   - Add responsive design considerations
   - Implement interactive tooltips and hover effects

2. **Layout**:
   - Modify the results section to show 60% chart + 40% form elements
   - Maintain existing form structure for inputs
   - Ensure chart is positioned below current results display

## Input/Output Structure

```
Input: RetirementResponse object from API call
- age: array of ages (years)
- portfolio_balance: array of portfolio balances ($) 
- final_balance: single value ($)
- avg_balance: single value ($)
- min_balance: single value ($)

Output: Chart visualization with:
- Line showing portfolio balance progression
- Tooltips with year and balance details
- Reference lines for key metrics
```