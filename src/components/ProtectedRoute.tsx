import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { PageLoader } from '@/components/PageLoader';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  // Allow disabling auth checks in development when VITE_DISABLE_AUTH=1
  const DISABLE_AUTH = (import.meta.env.VITE_DISABLE_AUTH === '1' || import.meta.env.VITE_DISABLE_AUTH === 'true');
  if (DISABLE_AUTH) return <>{children}</>;
  const { user, loading, isAdmin } = useAuth();
  
  if (loading) {
    return <PageLoader />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user.role.toLowerCase() !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};