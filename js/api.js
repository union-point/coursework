//All interactions with the backend

import axios from 'axios';
const API_BASE = 'http://localhost:3004';

const api = axios.create({
  baseURL: API_BASE,
});



// all functions for API
export const apiService = {
    //  examples
  // posts
  getPosts: () => api.get('/posts?_expand=user&_sort=date&_order=desc'),
  createPost: (postData) => api.post('/posts', postData),
  deletePost: (id) => api.delete(`/posts/${id}`),

  // users
  getUser: (id) => api.get(`/users/${id}`),
  login: (credentials) => api.post('/login', credentials), 

  // messages
  getMessages: (chatId) => api.get(`/messages?chatId=${chatId}&_sort=timestamp&_order=asc`),
  sendMessage: (messageData) => api.post('/messages', messageData),

  // forum
  getThreads: () => api.get('/forumThreads?_expand=user'),
};