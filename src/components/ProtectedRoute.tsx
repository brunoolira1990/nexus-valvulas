import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PageLoader } from "@/components/PageLoader";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false,
}) => {
  const { user, loading, isAdmin } = useAuth();

  // Allow disabling auth checks in development when VITE_DISABLE_AUTH=1
  const DISABLE_AUTH =
    import.meta.env.VITE_DISABLE_AUTH === "1" || import.meta.env.VITE_DISABLE_AUTH === "true";
  if (DISABLE_AUTH) return <>{children}</>;

  console.log("ProtectedRoute - user:", user);
  console.log("ProtectedRoute - isAdmin:", isAdmin);
  console.log("ProtectedRoute - requireAdmin:", requireAdmin);

  if (loading) {
    return <PageLoader />;
  }

  if (!user) {
    console.log("ProtectedRoute - No user, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    console.log("ProtectedRoute - User is not admin, redirecting to home");
    return <Navigate to="/" replace />;
  }

  console.log("ProtectedRoute - Access granted");
  return <>{children}</>;
};
