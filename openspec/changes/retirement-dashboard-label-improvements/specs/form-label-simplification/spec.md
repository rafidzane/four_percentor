# Form Label Simplification Specification

## Overview

This specification defines the simplification of form labels in the retirement dashboard UI by removing redundant "Yearly" terminology from contribution-related fields.

## Requirements

### Functional Requirements

1. **Label Reduction**: Remove "Yearly" prefix from contribution-related form labels to create cleaner, more concise interfaces.
2. **Semantic Preservation**: Maintain clear meaning and context of each label despite simplification.
3. **Consistency**: Apply the same simplification pattern across all related fields.

### Non-Functional Requirements

1. **Backward Compatibility**: No changes to underlying data models or API contracts.
2. **User Experience**: Improvements should enhance clarity and reduce cognitive load.
3. **Accessibility**: All labels must remain accessible and properly associated with their form controls.

## Implementation Details

### Label Changes

1. **Contribution Fields**:
   - "Yearly contribution" → "Contribution"
   - "Yearly contribution increase %" → "Contribution increase %"

### Data Flow

1. Form field names and data binding remain unchanged
2. All validation rules are preserved
3. No changes to backend API contracts or data models

## Success Criteria

1. All specified labels have been updated as requested
2. Labels remain clear and unambiguous in context
3. No functional changes to form behavior
4. All existing tests continue to pass

## Acceptance Criteria

1. The simplified labels improve UI clarity without losing meaning
2. Users can still easily understand what each field represents
3. The changes create a cleaner, more modern interface
4. All existing functionality remains intact