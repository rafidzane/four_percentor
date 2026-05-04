## Why

The retirement dashboard UI has several opportunities for improvement to enhance user experience and reduce cognitive load. Currently, form labels contain redundant "Yearly" terminology that can be simplified for cleaner, more intuitive interfaces. Additionally, the Returns Simulation section appears as a separate card from Contributions, which creates visual fragmentation.

## What Changes

- Move the Returns Simulation section directly under Contributions within the Personal Information section
- Simplify form field labels by removing redundant "Yearly" terminology from contribution fields
- Reduce visual clutter and improve logical grouping of related configuration parameters
- Maintain all existing functionality while improving UI clarity

## Capabilities

### New Capabilities
- `retirement-ui-layout`: Specification for improved retirement dashboard layout and field organization
- `form-label-simplification`: Specification for cleaner form labels in retirement inputs

### Modified Capabilities
- `retirement-dashboard`: The retirement dashboard UI component will be modified to incorporate the new layout and label improvements

## Impact

- **Frontend**: Modifications to `frontend/src/components/retirement-dashboard/ui/RetirementForm.tsx`
- **User Experience**: Improved logical flow for configuring retirement parameters
- **Visual Design**: Reduced number of rounded boxes, cleaner UI organization
- **Functionality**: No breaking changes - all existing behavior preserved

The changes will affect the Personal Information section of the retirement dashboard, specifically:
1. The Returns Simulation section will be moved to appear directly after Contributions
2. Form labels for contributions will be simplified (e.g., "Yearly contribution" → "Contribution")