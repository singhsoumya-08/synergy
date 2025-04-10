
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/providers/auth-provider';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated && location.pathname !== '/login' && location.pathname !== '/signup') {
      navigate('/login', { replace: true });
    }
    
    if (isAuthenticated && (location.pathname === '/login' || location.pathname === '/signup')) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate, location.pathname]);

  return <>{children}</>;
};

export default AuthGuard;
