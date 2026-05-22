export default function ProtectedRoute({ children, isAuthenticated, isLoading }) {
  if (isLoading) {
    return <div role="status">Loading...</div>;
  }
  if (!isAuthenticated) {
    return null;
  }
  return <>{children}</>;
}
