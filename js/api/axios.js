const API_URL = 'http://localhost:3004';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

// access token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// auto refresh token logic for 401 responses
api.interceptors.response.use(
    (res) => res,
    async (error) => {
        if (error.response.status === 401) {
            try {
                const refreshRes = await axios.post(
                    API_URL + "/auth/refresh",
                    {},
                    { withCredentials: true }
                );
                const newToken = refreshRes.data.accessToken;
                localStorage.setItem("accessToken", newToken);

                error.config.headers.Authorization = `Bearer ${newToken}`;
                return api(error.config);

            } catch {
                localStorage.removeItem("accessToken");
                window.location.href = "/login.html";
            }
        }
        throw error;
    }
);

//export default api;
