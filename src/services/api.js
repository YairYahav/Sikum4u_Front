import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 120000,
    headers: {
        'Content-Type': 'application/json',
    }
});



// Interceptor עבור הבקשות (Requests) - הזרקת ה-Token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor עבור התגובות (Responses) - טיפול גלובלי בשגיאות
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        }
        
        return Promise.reject(error);
    }
);

api.createLink = (data) => api.post('/important-links', data);
api.updateLink = (id, data) => api.put(`/important-links/${id}`, data);
api.deleteLink = (id) => api.delete(`/important-links/${id}`);
api.updateLinksOrder = (links) => api.put('/important-links/reorder', { links });


export default api;