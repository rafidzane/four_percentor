## ADDED Requirements

### Requirement: Navigation update
The sidebar navigation SHALL point "Retirement" link to `/dashboard/retirement/two-person` route.

#### Scenario: Sidebar retirement item
- **WHEN** user views sidebar navigation
- **THEN** Retirement menu item links to `/dashboard/retirement/two-person`

## REMOVED Requirements

### Requirement: Legacy single-person retirement calculator at default route
**Reason**: Replaced by two-person calculator as primary experience  
**Migration**: Single-person planning should use the two-person form with identical inputs for both persons, or visit `/dashboard/retirement/single-person` if needed

#### Scenario: Default retirement page
- **FROM**: `/dashboard/retirement` displayed single-person calculator
- **TO**: `/dashboard/retirement` displays two-person calculator as primary
- **Migration path**: Users can access legacy behavior via `/dashboard/retirement/two-person`

## Modified Requirements

### Requirement: Retirement dashboard structure
**MODIFIED**: Dashboard now supports both single and dual-person modes with clear routing

#### Scenario: Route organization
- **WHEN** user visits `/dashboard/retirement`
- **THEN** system redirects to `/dashboard/retirement/two-person` (primary mode)

#### Scenario: Single-person route
- **WHEN** user visits `/dashboard/retirement/single-person`
- **THEN** system shows legacy single-person calculator for backward compatibility
