import { useEffect } from "react";
import { useToken } from "./useToken";
import { useCookies } from "./useCookies";
import { FormData } from "../types/auth";
import AuthService from "../Services/auth";

export const useAuth = () => {
    const { contextToken: token, addToken, addUsername, addIsAdmin, removeToken, setToken, removeIsAdmin } = useToken();

    const login = async (user: FormData) => {
        const response = await AuthService.login(user);
        if (response.data.token) {
            addToken(response.data.token);
            addUsername(response.data.username);
            addIsAdmin(response.data.isAdmin);
        }
        return response;
    };

    const logout = () => {
        removeToken();
        removeIsAdmin();
    };

    return { token, login, logout, setToken };
}; 