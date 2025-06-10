import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  // Default: empty array (any authenticated user)
  const location = useLocation();
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    const validateToken = () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setIsValid(false);
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          localStorage.removeItem("accessToken");
          setIsValid(false);
          return;
        }

        // If no allowedRoles are specified, any valid token is accepted
        const hasValidRole =
          allowedRoles.length === 0 || allowedRoles.includes(decodedToken.role);
        setIsValid(hasValidRole);
      } catch (error) {
        console.error("Token validation error:", error);
        localStorage.removeItem("accessToken");
        setIsValid(false);
      }
    };

    validateToken();

    // Listen for storage changes (e.g., login/logout from another tab)
    const handleStorageChange = () => validateToken();
    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, [location, allowedRoles]);

  if (isValid === null) {
    return <div>Loading...</div>; // Show loader while validating
  }

  return isValid ? (
    children
  ) : (
    <Navigate to="/auth/login" state={{ from: location }} replace />
  );
};

export default PrivateRoute;
