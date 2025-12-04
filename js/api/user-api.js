import api from "./axios.js";

export function getUserProfile(id) {
    return api.get(`/users/${id}`);
}

export function updateProfile(data) {
    return api.put("/users/me", data);
}
export function deleteProfile() {
    return api.delete("/users/me");
}   