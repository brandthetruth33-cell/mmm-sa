import Spinner from '@/components/ui/Spinner';

export default function ProtectedRoute({ children, isAuthenticated, isLoading }) {
  if (isLoading) return <Spinner />;
  if (!isAuthenticated) {
    // In a real app this would redirect; for now just show nothing
    return null;
  }
  return <>{children}</>;
}
