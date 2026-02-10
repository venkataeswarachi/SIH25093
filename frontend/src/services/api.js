// src/services/api.js
import axios from 'axios';

const api = axios.create({
    // Using 127.0.0.1 instead of localhost avoids IPv6 (::1) resolution issues
    baseURL: 'http://127.0.0.1:2008', 
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;