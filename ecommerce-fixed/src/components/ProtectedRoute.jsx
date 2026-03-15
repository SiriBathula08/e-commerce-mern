import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { token, user, loading } = useAuth();

  if (loading) return (
    <div className="loading-spinner">
      <span>⏳</span> Loading...
    </div>
  );

  if (!token) return <Navigate to="/login" />;
  if (adminOnly && user && !user.isAdmin) return <Navigate to="/" />;

  return children;
}
