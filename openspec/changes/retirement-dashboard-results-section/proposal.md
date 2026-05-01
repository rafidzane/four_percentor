## Why

The retirement dashboard currently displays charts without providing a clear summary of key financial metrics. Users need immediate access to important results like final balance, average balance, and success probability to quickly understand their retirement projections. This change will add a results section above the charts that presents these essential metrics in a clear, accessible format.

## What Changes

- Add a results section above the charts on the right side of the retirement dashboard
- Display key financial metrics including:
  - Final Balance
  - Average Balance
  - Max Balance
  - Min Balance
  - Success indicator
- Include explanatory text about the assumptions and limitations of the projections
- Maintain the existing chart visualizations without modification

## Capabilities

### New Capabilities
- `retirement-results-summary`: A new capability to display key financial metrics for retirement projections in a clear, structured format

### Modified Capabilities
- None

## Impact

This change will affect the frontend of the retirement dashboard page at `/dashboard/retirement`. The implementation will involve:
- Modifying the React component structure in the frontend
- Potentially updating the data flow between components to ensure results are available for display
- No API changes required as all data is already being calculated and displayed in charts

The change is frontend-only and maintains backward compatibility with existing functionality.