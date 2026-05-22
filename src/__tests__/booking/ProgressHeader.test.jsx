import { render, screen } from '@testing-library/react';
import ProgressHeader from '@/booking/ProgressHeader';

const steps = ['Enter Zip', 'Select Vehicle', 'Choose Service', 'Schedule', 'Payment', 'Review', 'Confirmation'];

describe('ProgressHeader', () => {
  it('displays the label for the current step', () => {
    render(<ProgressHeader currentStep={0} steps={steps} />);
    expect(screen.getByText('Enter Zip')).toBeInTheDocument();
  });

  it('updates the label when currentStep changes', () => {
    const { rerender } = render(<ProgressHeader currentStep={0} steps={steps} />);
    rerender(<ProgressHeader currentStep={2} steps={steps} />);
    expect(screen.getByText('Choose Service')).toBeInTheDocument();
  });

  it('renders a progress bar element', () => {
    render(<ProgressHeader currentStep={1} steps={steps} />);
    expect(document.querySelector('.progress-bar')).toBeInTheDocument();
  });

  it('progress bar reflects step position', () => {
    render(<ProgressHeader currentStep={3} steps={steps} />);
    const bar = document.querySelector('.progress-bar');
    expect(bar.style.width).not.toBe('0%');
  });
});
