
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedRoute() {
  const location = useLocation();

  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  // Not logged in
  if (!token || !storedUser) {
    return (
      <Navigate
        to="/student"
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
}

