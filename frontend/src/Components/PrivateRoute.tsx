import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";

// Lets only authenticated users access the component this component wraps
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useContext(AuthContext);

  if (!token) {
    return <Navigate to="/videos" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute; 