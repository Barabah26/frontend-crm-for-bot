// LoginService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:9000/api/auth';
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers['Authorization'] = 'Bearer ' + token;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const login = async (username, password) => {
  try {
    console.log('Login attempt with username:', username);
    const response = await axiosInstance.post('/login', { login: username, password });
    console.log('Login response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export default axiosInstance;
