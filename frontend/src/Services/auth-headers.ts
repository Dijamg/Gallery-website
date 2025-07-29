import { getToken } from "./auth";

export default function authHeader() {
    const token = getToken();
    if (token) {
        return {
            Authorization: `${token}`,
        };
    } else {
        return {
            Authorization: `${null}`,
        };
    }
}