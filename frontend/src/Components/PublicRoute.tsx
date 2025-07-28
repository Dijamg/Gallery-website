import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";

// Lets only unauthenticated users access the component this component wraps (login and register)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useContext(AuthContext);

  if (token) {
    return <Navigate to="/videos" replace={true} />;
  }

  return <>{children}</>;
};

export default PublicRoute; 