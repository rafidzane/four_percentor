import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import SharedRetirementSettings from '../SharedRetirementSettings';

describe('SharedRetirementSettings', () => {
  it('renders a checkbox labeled "Same retirement age for both"', () => {
    render(
      <SharedRetirementSettings
        sameRetirementAge={false}
        drivingPerson="person1"
        onToggleSameRetirementAge={() => {}}
      />
    );

    expect(screen.getByRole('checkbox', { name: 'Same retirement age for both' })).toBeInTheDocument();
  });

  it('shows "Same retirement age (Driven by Person 1)" when sameRetirementAge is true', () => {
    render(
      <SharedRetirementSettings
        sameRetirementAge={true}
        drivingPerson="person1"
        onToggleSameRetirementAge={() => {}}
      />
    );

    expect(screen.getByText('Same retirement age (Driven by Person 1)')).toBeInTheDocument();
  });

  it('shows "Same retirement age (Driven by Person 2)" when sameRetirementAge is true and drivingPerson is person2', () => {
    render(
      <SharedRetirementSettings
        sameRetirementAge={true}
        drivingPerson="person2"
        onToggleSameRetirementAge={() => {}}
      />
    );

    expect(screen.getByText('Same retirement age (Driven by Person 2)')).toBeInTheDocument();
  });

  it('calls onToggleSameRetirementAge when checkbox is clicked', () => {
    const onToggle = vitest.fn();

    render(
      <SharedRetirementSettings
        sameRetirementAge={false}
        drivingPerson="person1"
        onToggleSameRetirementAge={onToggle}
      />
    );

    fireEvent.click(screen.getByRole('checkbox'));

    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
