import api from "./axios.js";

export function search(q) {
    return api.get(`/search?q=${encodeURIComponent(q)}`);
}
