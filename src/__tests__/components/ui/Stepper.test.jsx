import { render, screen } from '@testing-library/react';
import Stepper from '@/components/ui/Stepper';

const steps = ['Step 1', 'Step 2', 'Step 3'];

describe('Stepper', () => {
  it('renders all step labels', () => {
    render(<Stepper steps={steps} currentStep={0} />);
    steps.forEach((step) => expect(screen.getByText(step)).toBeInTheDocument());
  });

  it('marks the current step as active', () => {
    render(<Stepper steps={steps} currentStep={1} />);
    const activeStep = document.querySelector('.step.active');
    expect(activeStep).toHaveTextContent('Step 2');
  });

  it('does not mark other steps as active', () => {
    render(<Stepper steps={steps} currentStep={0} />);
    const allActive = document.querySelectorAll('.step.active');
    expect(allActive).toHaveLength(1);
  });
});
