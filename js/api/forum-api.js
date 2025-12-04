import api from "./axios.js";

export function getTopics() {
    return api.get("/forum/topics");
}

export function getTopic(id) {
    return api.get(`/forum/topics/${id}`);
}

export function createTopic(topicData) {
    return api.post("/forum/topics", topicData);
}
export function updateTopic(id, topicData) {
    return api.put(`/forum/topics/${id}`, topicData);
}
export function deleteTopic(id) {
    return api.delete(`/forum/topics/${id}`);
}