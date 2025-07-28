import axios from "axios";
import Cookies from "universal-cookie";
import { FormData } from "../types/auth";

const cookies = new Cookies();

// Configure axios to point to TPX-remaster backend
// Uses environment variable VITE_AUTH_API_BASE_URL from .env file
const API_BASE_URL = import.meta.env.VITE_AUTH_API_BASE_URL || "http://localhost:7800";

export const register = async (data: FormData) => {
    const request = axios.post(`${API_BASE_URL}/api/auth/register`, data);
    const response = await request;
    return response;
};

export const login = async (data: FormData) => {
    const request = axios.post(`${API_BASE_URL}/api/auth/login`, data);
    const response = await request;
    return response;
};

export const getToken = () => cookies.get("TOKEN") ?? null;

export const getUsername = () => cookies.get("USERNAME") ?? null;

export const isAuthenticated = () => !!getToken();

export default { register, login, isAuthenticated, getUsername }; 