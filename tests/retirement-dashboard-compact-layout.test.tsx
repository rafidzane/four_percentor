import { render } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { PersonalSection } from '../frontend/src/components/retirement-dashboard/ui/PersonalSection';

// Simple test to verify the component renders without errors
describe('PersonalSection Compact Layout', () => {
  it('should render compact layout without errors', () => {
    const form = useForm();
    
    expect(() => {
      render(
        <FormProvider {...form}>
          <PersonalSection />
        </FormProvider>
      );
    }).not.toThrow();
  });

  it('should contain all required sections', () => {
    const form = useForm();
    const { getByText } = render(
      <FormProvider {...form}>
        <PersonalSection />
      </FormProvider>
    );

    // Check that all expected sections are rendered
    expect(getByText('Personal Information')).toBeInTheDocument();
    expect(getByText('Portfolio Assets')).toBeInTheDocument();
    expect(getByText('Contributions')).toBeInTheDocument();
    expect(getByText('Returns Simulation')).toBeInTheDocument();
  });
});