import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '@/auth/Login';

describe('Login', () => {
  it('renders the login form', () => {
    render(<Login />);
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
  });

  it('renders email and password inputs', () => {
    render(<Login />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('renders a submit button', () => {
    render(<Login />);
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  it('shows a validation error when submitted with empty fields', async () => {
    render(<Login />);
    await userEvent.click(screen.getByRole('button', { name: /log in/i }));
    expect(screen.getByText(/required/i)).toBeInTheDocument();
  });

  it('calls onSubmit with email and password when form is valid', async () => {
    const onSubmit = jest.fn();
    render(<Login onSubmit={onSubmit} />);
    await userEvent.type(screen.getByLabelText(/email/i), 'user@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /log in/i }));
    expect(onSubmit).toHaveBeenCalledWith({ email: 'user@example.com', password: 'password123' });
  });
});
