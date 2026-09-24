import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, authState } = useAuth();

  if (authState === 'loading') {
    return <div className="flex min-h-[40vh] items-center justify-center text-sm uppercase tracking-[0.2em] text-[#4e4540]">Loading session…</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/account" replace />;
  }

  return <>{children}</>;
}
