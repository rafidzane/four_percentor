## Context

The retirement calculator currently has a withdrawal strategy form that lacks clear distinction between spending modes. Users can select between "4% Rule" and "Manual Withdrawal Amount", but when choosing manual, they're not clearly told whether the input should be an amount or percentage.

Additionally, for the two-period spending mode, there's no clear mechanism to specify whether each period uses a percentage or amount-based withdrawal rate, which is important for accurate retirement projections.

## Goals / Non-Goals

**Goals:**
- Clearly distinguish between amount-based and percentage-based spending inputs
- Add inflation adjustment option when using manual withdrawal amounts
- Implement proper configuration for two-period spending with separate inputs for each period
- Set default age ranges (50-62 and 63-end of retirement) for two-period mode
- Maintain backward compatibility with existing functionality
- Improve overall user experience and clarity

**Non-Goals:**
- Changing the core retirement calculation logic or algorithms
- Modifying any backend API endpoints or data models (unless absolutely necessary)
- Adding new features beyond withdrawal strategy configuration improvements
- Changing the overall split-pane structure of the dashboard

## Decisions

1. **Spending Mode Enhancement**: Instead of a simple dropdown, we'll implement a more nuanced approach where:
   - When "4% Rule" is selected, no additional inputs are needed
   - When "Manual Withdrawal Amount" is selected, we'll show an input field for the amount with an inflation adjustment checkbox

2. **Two-Period Configuration**: For two-period mode, we'll implement a clear separation of inputs:
   - Each period will have its own set of age range and withdrawal rate fields
   - Both periods can accept either percentage or amount-based values
   - Default ranges will be 50-62 for the first period and 63-end of retirement for the second

3. **Input Type Handling**: We'll maintain proper input validation to ensure:
   - Amount inputs are numeric with appropriate step sizes
   - Percentage inputs are numeric between 0-100%
   - Age range inputs are within valid ranges (18-120)

## Risks / Trade-offs

- **Risk**: Users might be confused by the additional complexity of the two-period configuration → **Mitigation**: Provide clear labels and explanations for each input field
- **Risk**: Backward compatibility with existing data may require careful handling → **Mitigation**: Ensure all existing values can be properly interpreted
- **Risk**: UI might become cluttered with additional fields → **Mitigation**: Use clear grouping and spacing to maintain usability