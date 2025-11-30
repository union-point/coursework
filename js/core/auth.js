import api from "../api/axios.js";

let currentUser = null;

export async function loadUser() {
    try {
        const res = await api.get("/auth/me");
        currentUser = res.data;
        return currentUser;
    } catch {
        return null;
    }
}

export function getUser() {
    return currentUser;
}
