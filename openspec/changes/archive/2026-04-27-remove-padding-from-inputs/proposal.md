## Why

The retirement dashboard currently has excessive padding in input fields and labels which makes the interface appear bloated and less compact. This change aims to create a tighter, more efficient layout that maximizes usable space while maintaining usability and clarity.

## What Changes

- Remove unnecessary padding from input fields in the retirement dashboard
- Reduce spacing around labels to create a more compact form layout
- Maintain all existing functionality while improving visual density
- Preserve accessibility standards while achieving tighter spacing

## Capabilities

### New Capabilities
- `<retirement-dashboard-padding>`: Defines the reduced padding specifications for retirement dashboard input components

### Modified Capabilities
- `<retirement-dashboard-layout>`: The retirement dashboard layout requirements are modified to include tighter spacing between form elements

## Impact

- Affects frontend styling in `/frontend/src/app/(main)/dashboard/retirement/_components/RetirementForm.tsx`
- No API changes required as this is purely a UI improvement
- No breaking changes to functionality or user experience