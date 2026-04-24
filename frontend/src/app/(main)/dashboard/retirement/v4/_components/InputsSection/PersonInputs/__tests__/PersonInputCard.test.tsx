import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PersonInputCard from '../PersonInputCard';

describe('PersonInputCard', () => {
  const mockOnChange = vi.fn();

  const defaultPerson: any = {
    id: 'person1',
    currentAge: 35,
    retirementAge: 62,
    lifeExpectancy: 90,
    liquidAssets: 100000,
    monthlyContribution: 1500,
    preRetirementReturnRate: 6,
    postRetirementReturnRate: 4,
    estimatedSSBenefit: 2500,
    ssClaimingAge: 67,
  };

  it('renders person name', () => {
    render(<PersonInputCard person={defaultPerson} onChange={mockOnChange} />);
    expect(screen.getByText('Person 1')).toBeInTheDocument();
  });

  it('renders all input fields', () => {
    render(<PersonInputCard person={defaultPerson} onChange={mockOnChange} />);

    const labels = [
      'Current Age',
      'Retirement Age',
      'Life Expectancy',
      'Liquid Assets',
      'Monthly Contribution',
      'Pre-Retirement Return (%)',
      'Post-Retirement Return (%)',
      'Estimated SS Benefit',
      'Claiming Age',
    ];

    labels.forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it('calls onChange when input changes', () => {
    render(<PersonInputCard person={defaultPerson} onChange={mockOnChange} />);

    const currentAgeInput = screen.getByDisplayValue('35');
    fireEvent.change(currentAgeInput, { target: { value: '40' } });

    expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({ currentAge: 40 }));
  });
});
