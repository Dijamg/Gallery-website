import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { useCookies } from "./useCookies";

export const useToken = () => {
    const { token: contextToken, setToken, isAdmin: contextIsAdmin, setIsAdmin } = useContext(AuthContext);
    const { setItem, removeItem, removeItemFromAllPaths } = useCookies();

    const addToken = (token: string) => {
        setToken(token);
        setItem("TOKEN", token, { maxAge: 360 * 24 });
    };

    const addUsername = (username: string) => {
        setItem("USERNAME", username)
    }

    const addIsAdmin = (isAdmin: boolean) => {
        setIsAdmin(isAdmin);
        setItem("IS_ADMIN", isAdmin.toString(), { maxAge: 360 * 24 });
    }

    const removeIsAdmin = () => {
        setIsAdmin(false);
        removeItemFromAllPaths("IS_ADMIN");
    }

    const removeToken = () => {
        setToken(null);
        // logout from everywhere
        removeItemFromAllPaths("TOKEN");
        removeItemFromAllPaths("USERNAME");
        removeItemFromAllPaths("IS_ADMIN");
    };

    return { contextToken, addToken, addUsername, addIsAdmin, removeToken, setToken, removeIsAdmin };
}; 