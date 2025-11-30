import api from "./axios.js";

export async function getPosts() {
    return api.get("/posts");
}

export async function likePost(id) {
    return api.post(`/posts/${id}/like`);
}
