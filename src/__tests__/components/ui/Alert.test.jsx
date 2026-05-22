import { render, screen } from '@testing-library/react';
import Alert from '@/components/ui/Alert';

describe('Alert', () => {
  it('renders children text', () => {
    render(<Alert type="info">This is an alert</Alert>);
    expect(screen.getByText('This is an alert')).toBeInTheDocument();
  });

  it('applies the correct type class', () => {
    render(<Alert type="error">Error message</Alert>);
    expect(document.querySelector('.alert-error')).toBeInTheDocument();
  });

  it('renders with success type', () => {
    render(<Alert type="success">Success!</Alert>);
    expect(document.querySelector('.alert-success')).toBeInTheDocument();
  });
});
