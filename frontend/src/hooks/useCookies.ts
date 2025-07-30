import { useState } from "react";
import Cookies, { CookieSetOptions } from "universal-cookie";

const cookies = new Cookies();

export const useCookies = () => {
    const [value, setValue] = useState<string | null>(null);

    const setItem = (
        key: string,
        value: string,
        options?: CookieSetOptions,
    ) => {
        cookies.set(key, value, options);
        setValue(value);
    };

    const getItem = (key: string) => {
        const value = cookies.get(key);
        setValue(value);
        return value;
    };

    const removeItem = (key: string) => {
        // Get the current path to determine cookie path
        const currentPath = window.location.pathname;
        const cookiePath = currentPath.startsWith('/gallery') ? '/gallery' : '/';
        
        cookies.remove(key, { path: cookiePath });
        setValue(null);
    };

    return { value, setItem, getItem, removeItem };
}; 