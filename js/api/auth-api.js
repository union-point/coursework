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

export async function forgotPassword(email) {
    return api.post("/auth/forgot-password", { email });
}

export async function verifyCode(email, code) {
    return api.post("/auth/verify-code", { email, code });
}

export async function resetPassword(email, code, newPassword) {
    return api.post("/auth/reset-password", { email, code, newPassword });
}

export async function updateProfile(data) {
    return api.put("/users/profile", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}
