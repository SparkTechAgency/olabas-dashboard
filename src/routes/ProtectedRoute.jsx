import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useProfileQuery } from "../redux/apiSlices/authApi";

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem("accessToken");

  // Redirect immediately if no token
  if (!token) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  try {
    // Decode and validate the token
    const decodedToken = jwtDecode(token);

    // Check if token is expired
    const currentTime = Date.now() / 1000;
    if (decodedToken.exp < currentTime) {
      // Token is expired, remove it and redirect
      localStorage.removeItem("accessToken");
      return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }

    const { role } = decodedToken;

    if (role === "ADMIN") {
      return children;
    } else {
      // User doesn't have admin role, redirect to login
      return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }
  } catch (error) {
    // Invalid token, remove it and redirect
    localStorage.removeItem("accessToken");
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }
};

export default PrivateRoute;
