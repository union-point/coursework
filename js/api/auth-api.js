import api from "./axios.js";

export async function login(email, password) {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("accessToken", res.data.accessToken);
    return res.data;
}

export async function registerUser(data) {
    return api.post("/auth/register", data);
}

export async function logout() {
    localStorage.removeItem("accessToken");
    await api.post("/auth/logout");
}
