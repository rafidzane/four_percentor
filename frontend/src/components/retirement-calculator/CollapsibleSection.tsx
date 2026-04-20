"use client";

import React from "react";
import { useCollapsibleSections, SectionId } from "./CollapsibleSectionContext";

export interface CollapsibleSectionProps {
  sectionId: SectionId;
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export default function CollapsibleSection({
  sectionId,
  title,
  children,
  defaultExpanded = true,
}: CollapsibleSectionProps) {
  const { isSectionExpanded, toggleSection } = useCollapsibleSections();
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);

  const handleToggle = React.useCallback(() => {
    setIsExpanded(!isExpanded);
    toggleSection(sectionId);
  }, [isExpanded, toggleSection, sectionId]);

  return (
    <div className="collapsible-section">
      <button
        onClick={handleToggle}
        className="collapsible-header"
        aria-expanded={isExpanded}
        aria-controls={`${sectionId}-content`}
      >
        <h2 className="collapsible-title">{title}</h2>
        <span className="collapsible-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </button>
      <div
        id={`${sectionId}-content`}
        className={`collapsible-content ${isExpanded ? "expanded" : "collapsed"}`}
      >
        {children}
      </div>
    </div>
  );
}