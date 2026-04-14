import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../features/auth/context/auth.context";
import Loader from "../components/Loader";

export default function PublicRoute() {
  const { token, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

