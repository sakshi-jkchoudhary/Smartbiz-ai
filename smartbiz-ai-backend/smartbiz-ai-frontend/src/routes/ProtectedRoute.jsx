import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/common/Loader';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <Loader full label="Loading SmartBiz AI..." />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
}
