import api from "./axios.js";

export async function getPosts() {
    return api.get("/posts");
}


