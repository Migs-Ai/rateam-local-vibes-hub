
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireVendor?: boolean;
  requireUser?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false,
  requireVendor = false,
  requireUser = false
}) => {
  const { user, loading, isAdmin, isVendor, userRoles } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Role-based redirects to appropriate dashboards
  const isRegularUser = userRoles.includes('user') && !isAdmin && !isVendor;

  // Auto-redirect users to their appropriate dashboards
  if (location.pathname === '/user-profile' && isAdmin) {
    return <Navigate to="/admin-dashboard" replace />;
  }

  if (location.pathname === '/user-profile' && isVendor) {
    return <Navigate to="/vendor-dashboard" replace />;
  }

  // Prevent access to wrong dashboard types
  if (location.pathname.startsWith('/admin') && !isAdmin) {
    if (isVendor) {
      return <Navigate to="/vendor-dashboard" replace />;
    }
    return <Navigate to="/user-dashboard" replace />;
  }

  if (location.pathname.startsWith('/vendor') && !isVendor) {
    if (isAdmin) {
      return <Navigate to="/admin-dashboard" replace />;
    }
    return <Navigate to="/user-dashboard" replace />;
  }

  if (location.pathname.startsWith('/user') && (isAdmin || isVendor)) {
    if (isAdmin) {
      return <Navigate to="/admin-dashboard" replace />;
    }
    return <Navigate to="/vendor-dashboard" replace />;
  }

  // Check specific role requirements
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (requireVendor && !isVendor) {
    return <Navigate to="/" replace />;
  }

  if (requireUser && !isRegularUser) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
