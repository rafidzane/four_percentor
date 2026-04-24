import { render, screen, fireEvent } from '@testing-library/react';
import PersonToggle from '../PersonToggle';

describe('PersonToggle', () => {
  test('renders checkbox with "Include Person 2" label', () => {
    const onToggle = vi.fn();
    render(<PersonToggle visible={true} onToggle={onToggle} />);

    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByText('Include Person 2')).toBeInTheDocument();
  });

  test('calls onToggle with new value when checkbox is clicked', () => {
    const onToggle = vi.fn();
    render(<PersonToggle visible={true} onToggle={onToggle} />);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(onToggle).toHaveBeenCalledWith(false);
  });

  test('handles visible=false correctly', () => {
    const onToggle = vi.fn();
    render(<PersonToggle visible={false} onToggle={onToggle} />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);
    expect(onToggle).toHaveBeenCalledWith(true);
  });
});
