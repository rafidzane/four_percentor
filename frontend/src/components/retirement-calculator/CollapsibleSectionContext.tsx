"use client";

import React from "react";

/**
 * Type definition for section IDs in the collapsible sections feature
 * @typedef {"retirement-parameters" | "scenarios" | "results"} SectionId
 */
export type SectionId = "retirement-parameters" | "scenarios" | "results";

/**
 * Interface for section state tracking
 * @interface SectionState
 * @property {boolean} [key] - Boolean flag indicating if a section is expanded
 */
export interface SectionState {
  [key: string]: boolean;
}

/**
 * Interface for the collapsible section context
 * @interface CollapsibleSectionContextType
 * @property {SectionState} sectionStates - Object tracking expanded/collapsed state of each section
 * @property {(sectionId: SectionId) => void} toggleSection - Function to toggle a specific section's state
 * @property {(sectionId: SectionId) => boolean} isSectionExpanded - Function to check if a section is expanded
 * @property {() => void} expandAllSections - Function to expand all sections
 * @property {() => void} collapseAllSections - Function to collapse all sections
 */
export interface CollapsibleSectionContextType {
  sectionStates: SectionState;
  toggleSection: (sectionId: SectionId) => void;
  isSectionExpanded: (sectionId: SectionId) => boolean;
  expandAllSections: () => void;
  collapseAllSections: () => void;
}

export const CollapsibleSectionContext = React.createContext<
  CollapsibleSectionContextType | undefined
>(undefined);

/**
 * Custom hook to access the collapsible section context
 * @returns {CollapsibleSectionContextType} The context value with section state management functions
 * @throws {Error} If used outside of a CollapsibleSectionProvider
 */
export function useCollapsibleSections(): CollapsibleSectionContextType {
  const context = React.useContext(CollapsibleSectionContext);
  if (context === undefined) {
    throw new Error(
      "useCollapsibleSections must be used within a CollapsibleSectionProvider"
    );
  }
  return context;
}

export interface CollapsibleSectionProviderProps {
  children: React.ReactNode;
}

/**
 * Provider component for managing collapsible section states
 * @param {CollapsibleSectionProviderProps} props - Component props
 * @param {React.ReactNode} props.children - Child components to be wrapped
 * @returns {JSX.Element} The provider with context value
 */
export function CollapsibleSectionProvider({
  children,
}: CollapsibleSectionProviderProps) {
  /**
   * Initialize section states from localStorage or use defaults
   * @type {[SectionState, React.Dispatch<React.SetStateAction<SectionState>>]}
   */
  const [sectionStates, setSectionStates] = React.useState<SectionState>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("retirement-calculator-sections");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return {};
        }
      }
    }
    return {
      "retirement-parameters": true,
      scenarios: true,
      results: true,
    };
  });

  /**
   * Toggle the expanded/collapsed state of a specific section
   * @param {SectionId} sectionId - The ID of the section to toggle
   */
  const toggleSection = React.useCallback(
    (sectionId: SectionId) => {
      setSectionStates((prev) => {
        // Create new state with toggled value for the specified section
        const newState = {
          ...prev,
          [sectionId]: !prev[sectionId],
        };
        // Persist the new state to localStorage for persistence across page reloads
        if (typeof window !== "undefined") {
          localStorage.setItem("retirement-calculator-sections", JSON.stringify(newState));
        }
        return newState;
      });
    },
    []
  );

  /**
   * Check if a section is currently expanded
   * @param {SectionId} sectionId - The ID of the section to check
   * @returns {boolean} True if the section is expanded, false otherwise
   */
  const isSectionExpanded = React.useCallback(
    (sectionId: SectionId) => {
      return sectionStates[sectionId] ?? true;
    },
    [sectionStates]
  );

  /**
   * Expand all sections to their default state
   */
  const expandAllSections = React.useCallback(() => {
    // Set all sections to expanded state
    const allExpanded: SectionState = {
      "retirement-parameters": true,
      scenarios: true,
      results: true,
    };
    setSectionStates(allExpanded);
    if (typeof window !== "undefined") {
      localStorage.setItem("retirement-calculator-sections", JSON.stringify(allExpanded));
    }
  }, []);

  /**
   * Collapse all sections to their default state
   */
  const collapseAllSections = React.useCallback(() => {
    // Set all sections to collapsed state
    const allCollapsed: SectionState = {
      "retirement-parameters": false,
      scenarios: false,
      results: false,
    };
    setSectionStates(allCollapsed);
    if (typeof window !== "undefined") {
      localStorage.setItem("retirement-calculator-sections", JSON.stringify(allCollapsed));
    }
  }, []);

  const value = React.useMemo(
    () => ({
      sectionStates,
      toggleSection,
      isSectionExpanded,
      expandAllSections,
      collapseAllSections,
    }),
    [sectionStates, toggleSection, isSectionExpanded, expandAllSections, collapseAllSections]
  );

  return (
    <CollapsibleSectionContext.Provider value={value}>
      {children}
    </CollapsibleSectionContext.Provider>
  );
}