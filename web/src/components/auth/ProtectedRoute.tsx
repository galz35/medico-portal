import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('PACIENTE' | 'MEDICO' | 'ADMIN')[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    // Redirect to their default dashboard if they don't have permission
    const defaultPath = user.rol === 'MEDICO' ? '/medico/agenda-citas' : 
                        user.rol === 'PACIENTE' ? '/paciente/dashboard' : 
                        '/admin/dashboard';
    return <Navigate to={defaultPath} replace />;
  }

  return <>{children}</>;
};
