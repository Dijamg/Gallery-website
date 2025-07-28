import { createContext } from "react";

interface AuthContext {
    token: string | null;
    setToken: (token: string | null) => void;
    isAdmin: boolean;
    setIsAdmin: (isAdmin: boolean) => void;
}

export const AuthContext = createContext<AuthContext>({
    token: null,
    setToken: () => {},
    isAdmin: false,
    setIsAdmin: () => {},
}); 