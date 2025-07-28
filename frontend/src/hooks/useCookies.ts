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
        cookies.remove(key, { path: '/' });
        setValue(null);
    };

    return { value, setItem, getItem, removeItem };
}; 