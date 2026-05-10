## Why

The retirement calculator currently requires users to click a "Calculate" button after making any change to trigger recalculation. This creates friction in the user experience—users must anticipate when calculation is needed and manually trigger it. In modern web applications, immediate feedback on input changes is expected behavior that improves discoverability and reduces cognitive load.

## What Changes

- **Real-time recalculation**: All form inputs will automatically trigger recalculation on change
- **Debounced updates**: Calculations will be debounced to prevent excessive processing during rapid typing
- **Loading state feedback**: Visual indicator when recalculation is in progress
- **Optimized rendering**: Only affected components re-render, not the entire page

## Capabilities

### New Capabilities
- `real-time-calculations`: Automatic recalculation on form input changes with debouncing and loading states
- `calculation-optimization`: Efficient state management to minimize unnecessary recalculations

### Modified Capabilities
None (existing calculation logic remains unchanged, only trigger mechanism differs)

## Impact

**Frontend:**
- `/frontend/src/app/(main)/dashboard/retirement/_components/RetirementForm.tsx` - Add automatic recalculation hooks
- Component state management updated to support reactive calculations
- New loading states and visual feedback for users

**Backend:**
- No API changes required (same calculation endpoints, just called more frequently)
- May benefit from caching optimization if debounce window is short

**User Experience:**
- Immediate feedback on all inputs
- Reduced steps to see results
- Potential performance considerations during rapid typing addressed via debouncing

**Assumptions:**
- Debounce delay of 300-500ms provides good balance between responsiveness and performance
- Calculation can complete within 100ms for typical portfolio sizes (under 20 assets)
- Users prefer immediate feedback over manual control in this context
