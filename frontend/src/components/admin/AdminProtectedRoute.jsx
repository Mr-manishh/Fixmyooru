import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import LoadingSpinner from '../LoadingSpinner';

const AdminProtectedRoute = ({ children }) => {
  const { admin, loading } = useAdminAuth();

  if (loading) return <LoadingSpinner text="Authenticating admin..." />;
  if (!admin) return <Navigate to="/admin/login" replace />;

  return children;
};

export default AdminProtectedRoute;
