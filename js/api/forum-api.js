import api from "./axios.js";

export function getTopics() {
    return api.get("/forum/topics");
}

export function getTopic(id) {
    return api.get(`/forum/topics/${id}`);
}
