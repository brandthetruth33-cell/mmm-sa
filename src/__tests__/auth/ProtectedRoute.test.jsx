import { render, screen } from '@testing-library/react';
import ProtectedRoute from '@/auth/ProtectedRoute';

describe('ProtectedRoute', () => {
  it('renders children when user is authenticated', () => {
    render(
      <ProtectedRoute isAuthenticated={true}>
        <div>Protected Content</div>
      </ProtectedRoute>
    );
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('does not render children when user is unauthenticated', () => {
    render(
      <ProtectedRoute isAuthenticated={false}>
        <div>Protected Content</div>
      </ProtectedRoute>
    );
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('renders a loading spinner while auth state is loading', () => {
    render(
      <ProtectedRoute isAuthenticated={false} isLoading={true}>
        <div>Protected Content</div>
      </ProtectedRoute>
    );
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});
