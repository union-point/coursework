//import api from "./axios.js";

function getUserProfile(id) {
    return api.get(`/users/${id}`);
}

function updateProfile(data) {
    return api.put("/users/me", data);
}
function deleteProfile() {
    return api.delete("/users/me");
}
function createComment(postId, commentData) {
    const newComment = {
        data: {
            id: postId,
            text: commentData.text,
            createdAt: new Date().toISOString(),
            author: {
                name: "Գայանե Սարգսյան",
                avatar: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg"
            }
        }
    }

    return newComment//api.post(`/posts/${postId}/comments`, commentData);
}

function createPost(postData) {
    const newpost = {
        data: {
            id: response.data.length + 1,
            title: postData.title,
            content: postData.content,
            category: postData.category,
            createdAt: new Date().toISOString(),
            author: {
                name: "Գայանե Սարգսյան",
                avatar: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg"
            },
            comments: []
        }
    }
    return newpost//api.post("/posts", postData);
}

function getUserPosts(id) {
    return api.get(`/users/${id}/posts`);
}