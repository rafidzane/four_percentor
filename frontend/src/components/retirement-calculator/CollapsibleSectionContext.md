# CollapsibleSectionContext

## Overview

The `CollapsibleSectionContext` provides state management for collapsible sections in the retirement calculator dashboard. It allows users to expand and collapse different sections of the interface, improving usability and reducing cognitive load.

## Features

- **Section State Management**: Tracks the expanded/collapsed state of each section
- **Persistence**: Saves section states to localStorage for persistence across page reloads
- **Toggle Functionality**: Allows users to expand or collapse individual sections
- **Bulk Operations**: Functions to expand or collapse all sections at once
- **Accessibility**: Built-in support for keyboard navigation and ARIA attributes

## Usage

### Provider Setup

Wrap your component tree with the `CollapsibleSectionProvider` to provide context to all child components:

```tsx
import { CollapsibleSectionProvider } from "@/components/retirement-calculator/CollapsibleSectionContext";

function App() {
  return (
    <CollapsibleSectionProvider>
      <YourComponent />
    </CollapsibleSectionProvider>
  );
}
```

### Using the Hook

Access the context using the `useCollapsibleSections` hook:

```tsx
import { useCollapsibleSections } from "@/components/retirement-calculator/CollapsibleSectionContext";

function YourComponent() {
  const {
    sectionStates,
    toggleSection,
    isSectionExpanded,
    expandAllSections,
    collapseAllSections,
  } = useCollapsibleSections();

  // Use the context values
  return <div>{/* Your component code */}</div>;
}
```

### Section IDs

The following section IDs are available:

- `"retirement-parameters"`: The retirement parameters section
- `"scenarios"`: The scenarios section
- `"results"`: The results section

## API Reference

### `CollapsibleSectionProvider`

A React context provider component that manages collapsible section states.

**Props:**
- `children`: React.ReactNode - Child components to be wrapped

**Returns:** JSX.Element

### `useCollapsibleSections`

A custom hook to access the collapsible section context.

**Returns:** `CollapsibleSectionContextType`

**Throws:** Error if used outside of a `CollapsibleSectionProvider`

### `CollapsibleSectionContextType`

The context value interface with the following properties:

#### `sectionStates: SectionState`

An object tracking the expanded/collapsed state of each section.

**Type:** `SectionState`

**Example:**
```tsx
{
  "retirement-parameters": true,
  scenarios: false,
  results: true,
}
```

#### `toggleSection(sectionId: SectionId): void`

Toggles the expanded/collapsed state of a specific section.

**Parameters:**
- `sectionId`: `SectionId` - The ID of the section to toggle

**Example:**
```tsx
toggleSection("retirement-parameters");
```

#### `isSectionExpanded(sectionId: SectionId): boolean`

Checks if a section is currently expanded.

**Parameters:**
- `sectionId`: `SectionId` - The ID of the section to check

**Returns:** `boolean` - True if the section is expanded, false otherwise

**Example:**
```tsx
const isExpanded = isSectionExpanded("scenarios");
```

#### `expandAllSections(): void`

Expands all sections to their default state.

**Example:**
```tsx
expandAllSections();
```

#### `collapseAllSections(): void`

Collapses all sections to their default state.

**Example:**
```tsx
collapseAllSections();
```

## SectionState Interface

```tsx
interface SectionState {
  [key: string]: boolean;
}
```

An object where keys are section IDs and values are boolean flags indicating whether the section is expanded.

## localStorage Key

The context uses `"retirement-calculator-sections"` as the localStorage key to persist section states.

## Best Practices

1. **Always wrap components**: Ensure all components that need to access the context are wrapped by the provider
2. **Use the hook**: Access context through the `useCollapsibleSections` hook for type safety
3. **Handle errors**: The hook will throw an error if used outside the provider
4. **Default state**: Sections default to expanded state on first load if no saved state exists

## Example Integration

```tsx
import { CollapsibleSectionProvider, useCollapsibleSections, SectionId } from "@/components/retirement-calculator/CollapsibleSectionContext";

function RetirementCalculator() {
  return (
    <CollapsibleSectionProvider>
      <CalculatorContent />
    </CollapsibleSectionProvider>
  );
}

function CalculatorContent() {
  const { sectionStates, toggleSection, isSectionExpanded, expandAllSections } = useCollapsibleSections();

  return (
    <div>
      <button onClick={expandAllSections}>Expand All</button>
      <button onClick={() => toggleSection("retirement-parameters")}>
        Toggle Retirement Parameters
      </button>
      <div>
        <h2>Retirement Parameters</h2>
        {isSectionExpanded("retirement-parameters") && <p>Content here...</p>}
      </div>
    </div>
  );
}
```

## Accessibility

The collapsible sections feature includes built-in accessibility support:

- Keyboard navigation (Enter and Space keys)
- ARIA attributes for screen readers
- Clear visual indicators for section state

## Performance Considerations

- Uses React's `useCallback` and `useMemo` hooks for optimal performance
- State updates are batched and efficient
- localStorage operations are minimal and only occur on state changes

## Usage Examples

### Example 1: Basic Toggle

```tsx
import { useCollapsibleSections } from "@/components/retirement-calculator/CollapsibleSectionContext";

function MyComponent() {
  const { toggleSection, isSectionExpanded } = useCollapsibleSections();

  return (
    <button
      onClick={() => toggleSection("retirement-parameters")}
      aria-expanded={isSectionExpanded("retirement-parameters")}
    >
      Toggle Section
    </button>
  );
}
```

### Example 2: Conditional Rendering

```tsx
import { useCollapsibleSections } from "@/components/retirement-calculator/CollapsibleSectionContext";

function MyComponent() {
  const { sectionStates, isSectionExpanded } = useCollapsibleSections();

  return (
    <div>
      {isSectionExpanded("results") && (
        <div className="results-content">
          {/* Results content */}
        </div>
      )}
    </div>
  );
}
```

### Example 3: Bulk Operations

```tsx
import { useCollapsibleSections } from "@/components/retirement-calculator/CollapsibleSectionContext";

function MyComponent() {
  const { expandAllSections, collapseAllSections } = useCollapsibleSections();

  return (
    <div className="controls">
      <button onClick={expandAllSections}>Expand All</button>
      <button onClick={collapseAllSections}>Collapse All</button>
    </div>
  );
}
```

### Example 4: Custom Section Component

```tsx
import { useCollapsibleSections, SectionId } from "@/components/retirement-calculator/CollapsibleSectionContext";

interface CollapsibleSectionProps {
  sectionId: SectionId;
  title: string;
  children: React.ReactNode;
}

function CollapsibleSection({ sectionId, title, children }: CollapsibleSectionProps) {
  const { toggleSection, isSectionExpanded } = useCollapsibleSections();

  return (
    <div className="collapsible-section">
      <button
        onClick={() => toggleSection(sectionId)}
        aria-expanded={isSectionExpanded(sectionId)}
        aria-controls={`${sectionId}-content`}
      >
        <h2>{title}</h2>
        <span className="chevron">
          {isSectionExpanded(sectionId) ? "▼" : "▶"}
        </span>
      </button>
      <div
        id={`${sectionId}-content`}
        style={{
          maxHeight: isSectionExpanded(sectionId) ? "1000px" : "0",
          overflow: "hidden",
          transition: "max-height 0.3s ease",
        }}
      >
        {children}
      </div>
    </div>
  );
}
```

### Example 5: Reset Button Integration

```tsx
import { useCollapsibleSections } from "@/components/retirement-calculator/CollapsibleSectionContext";

function ResetButton() {
  const { expandAllSections, collapseAllSections } = useCollapsibleSections();

  const handleReset = () => {
    // Reset form state
    // ...
    // Expand all sections
    expandAllSections();
  };

  return (
    <button onClick={handleReset}>Reset</button>
  );
}
```

### Example 6: Monitoring Section States

```tsx
import { useCollapsibleSections } from "@/components/retirement-calculator/CollapsibleSectionContext";

function SectionMonitor() {
  const { sectionStates } = useCollapsibleSections();

  return (
    <div className="section-monitor">
      <h3>Section States</h3>
      <ul>
        <li>Retirement Parameters: {sectionStates["retirement-parameters"] ? "Expanded" : "Collapsed"}</li>
        <li>Scenarios: {sectionStates.scenarios ? "Expanded" : "Collapsed"}</li>
        <li>Results: {sectionStates.results ? "Expanded" : "Collapsed"}</li>
      </ul>
    </div>
  );
}
```

### Example 7: Dynamic Section Control

```tsx
import { useCollapsibleSections, SectionId } from "@/components/retirement-calculator/CollapsibleSectionContext";

function DynamicSectionControl() {
  const { toggleSection, isSectionExpanded } = useCollapsibleSections();

  const handleKeyPress = (e: React.KeyboardEvent, sectionId: SectionId) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleSection(sectionId);
    }
  };

  return (
    <div className="keyboard-navigable">
      <button
        onClick={() => toggleSection("retirement-parameters")}
        onKeyDown={(e) => handleKeyPress(e, "retirement-parameters")}
        tabIndex={0}
      >
        Toggle with Keyboard
      </button>
    </div>
  );
}
```

### Example 8: Conditional Expansion

```tsx
import { useCollapsibleSections } from "@/components/retirement-calculator/CollapsibleSectionContext";

function ConditionalExpansion() {
  const { sectionStates, toggleSection } = useCollapsibleSections();

  // Only allow collapsing if at least one section is expanded
  const canCollapse = Object.values(sectionStates).some(state => state);

  return (
    <button
      onClick={() => canCollapse && toggleSection("retirement-parameters")}
      disabled={!canCollapse}
    >
      Collapse Section
    </button>
  );
}
```

## Troubleshooting

### "useCollapsibleSections must be used within a CollapsibleSectionProvider"

This error occurs when you try to use the hook outside of a provider. Ensure you've wrapped your component tree with `CollapsibleSectionProvider`.

### Section states not persisting

Check that localStorage is enabled in your browser and that you're using the correct localStorage key: `"retirement-calculator-sections"`.

### Sections not responding to toggle

Verify that you're using the correct section ID and that the component is properly wrapped in the provider.