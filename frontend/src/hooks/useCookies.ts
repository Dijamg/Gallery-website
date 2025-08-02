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
        // Default to domain-wide cookies (path: '/') to ensure accessibility across all paths
        const defaultOptions: CookieSetOptions = {
            path: '/',
            ...options
        };
        
        cookies.set(key, value, defaultOptions);
        setValue(value);
    };

    const getItem = (key: string) => {
        const value = cookies.get(key);
        setValue(value);
        return value;
    };

    const removeItem = (key: string) => {
        // Remove from all common paths to ensure cleanup
        const pathsToTry = ['/', '/gallery']; 
        
        pathsToTry.forEach(path => {
            cookies.remove(key, { path });
        });
        
        // Also try removing without path specification (uses current path)
        cookies.remove(key);
        
        setValue(null);
    };

    const removeItemFromAllPaths = (key: string) => {
        // More comprehensive removal - tries multiple combinations
        const pathsToTry = ['/', '/gallery']; 
        const domainsToTry = [
            window.location.hostname,
            `.${window.location.hostname}`, // dot prefix for subdomain inclusion
        ];
        
        // Try removing from all path and domain combinations
        pathsToTry.forEach(path => {
            // Remove with path only
            cookies.remove(key, { path });
            
            // Remove with path and domain combinations
            domainsToTry.forEach(domain => {
                cookies.remove(key, { path, domain });
            });
        });
        
        // Also try removing without any options (fallback)
        cookies.remove(key);
        
        setValue(null);
    };

    return { value, setItem, getItem, removeItem, removeItemFromAllPaths };
}; 