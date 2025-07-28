import React, { useState, useEffect } from "react";
import { AuthContext } from "./authContext";        
import Cookies from "universal-cookie";

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const cookies = new Cookies();
  
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token") || cookies.get("TOKEN");
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    const localStorageAdmin = localStorage.getItem("isAdmin") === "true";
    const cookieAdmin = cookies.get("IS_ADMIN") === "true";
    return localStorageAdmin || cookieAdmin;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    if (isAdmin) {
      localStorage.setItem("isAdmin", "true");
    } else {
      localStorage.removeItem("isAdmin");
    }
  }, [isAdmin]);

  return (
    <AuthContext.Provider value={{ token, setToken, isAdmin, setIsAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider; 