import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StepFooter from '@/booking/StepFooter';

describe('StepFooter', () => {
  it('renders Back and Next buttons', () => {
    render(<StepFooter onNext={() => {}} onBack={() => {}} />);
    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
  });

  it('calls onNext when Next is clicked', async () => {
    const onNext = jest.fn();
    render(<StepFooter onNext={onNext} onBack={() => {}} />);
    await userEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it('calls onBack when Back is clicked', async () => {
    const onBack = jest.fn();
    render(<StepFooter onNext={() => {}} onBack={onBack} />);
    await userEvent.click(screen.getByRole('button', { name: /back/i }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('does not call onNext when Back is clicked', async () => {
    const onNext = jest.fn();
    render(<StepFooter onNext={onNext} onBack={() => {}} />);
    await userEvent.click(screen.getByRole('button', { name: /back/i }));
    expect(onNext).not.toHaveBeenCalled();
  });
});
