import axios from 'axios';

const API_BASE_URL = 'http://localhost:9000/api/auth'; // Adjust URL as per your setup

// Create an instance of axios
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
});

// Add a request interceptor to include the token in all requests
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Add a response interceptor to handle token refresh
axiosInstance.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const refreshToken = localStorage.getItem('refreshToken');
        try {
            const response = await axiosInstance.post('/token', { refreshToken });
            localStorage.setItem('accessToken', response.data.accessToken);
            originalRequest.headers['Authorization'] = 'Bearer ' + response.data.accessToken;
            return axiosInstance(originalRequest);
        } catch (e) {
            console.error('Refresh token failed', e);
        }
    }
    return Promise.reject(error);
});

export default axiosInstance;
