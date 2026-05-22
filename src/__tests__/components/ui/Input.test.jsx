import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from '@/components/ui/Input';

describe('Input', () => {
  it('renders an input element', () => {
    render(<Input />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('accepts a placeholder prop', () => {
    render(<Input placeholder="Enter value" />);
    expect(screen.getByPlaceholderText('Enter value')).toBeInTheDocument();
  });

  it('accepts typed input', async () => {
    render(<Input defaultValue="" />);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'Hello');
    expect(input).toHaveValue('Hello');
  });
});
