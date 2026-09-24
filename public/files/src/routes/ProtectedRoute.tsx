import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, authState } = useAuth();
  const location = useLocation();

  if (authState === 'loading') {
    return <div className="flex min-h-[40vh] items-center justify-center text-sm uppercase tracking-[0.2em] text-[#4e4540]">Loading session…</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
