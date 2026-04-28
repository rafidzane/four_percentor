## Context

The retirement dashboard currently has a layout issue where content in panels is not properly contained within their designated areas. The main problem occurs in the form section that contains personal information, portfolio assets, contributions, withdrawal strategy, income sources, and real estate sections. When users scroll through these panels, the panels don't maintain proper alignment or containment, causing visual confusion.

The current implementation in `/frontend/src/app/(main)/dashboard/retirement/page.tsx` uses fixed height calculations that don't allow content to expand properly. The input form section has `overflow-y-auto max-h-[calc(100vh-300px)]` which causes the inner div to scroll when content exceeds its height, rather than allowing the parent container to grow.

## Goals / Non-Goals

**Goals:**
- Implement proper layout where the parent container expands based on content
- Ensure both columns (inputs and charts) properly fill their parent containers
- Remove the fixed-height scrollable divs from the input form section
- Maintain responsive design across different screen sizes
- Preserve existing functionality while improving layout

**Non-Goals:**
- Changing the core retirement calculation logic or algorithms
- Modifying any backend API endpoints or data models
- Adding new features beyond layout improvements
- Changing the overall split-pane structure (inputs on left, charts on right)

## Decisions

1. **Layout Approach**: Instead of using fixed heights with scroll containers, we'll use flexbox-based layouts that allow containers to grow based on their content.

2. **Container Structure**: The main dashboard container will be a flex column that allows child elements to expand naturally without fixed height constraints.

3. **Input Form Container**: The retirement form component will remove its `overflow-y-auto max-h-[calc(100vh-300px)]` class and let the parent container handle sizing.

4. **Responsive Design**: We'll maintain responsive behavior using Tailwind's utility classes but ensure that flexbox properties properly control layout expansion.

## Risks / Trade-offs

- **Risk**: Content might overflow or create unexpected layouts on very small screens → **Mitigation**: Test thoroughly across mobile, tablet, and desktop views
- **Risk**: Performance impact from dynamic height calculations → **Mitigation**: Keep layout changes minimal and optimized with Tailwind utility classes