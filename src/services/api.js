import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api', // לוודא שזה תואם לפורט של השרת!!!!
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
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
            console.warn('Unauthorized access, logging out...');
            localStorage.removeItem('token');
            // כאן אפשר להוסיף הפניה לעמוד התחברות
        }
        
        // שליחת השגיאה להמשך טיפול בקומפוננטה
        const errorMessage = error.response?.data?.message || 'שגיאת שרת כללית';
        return Promise.reject(errorMessage);
    }
);

export default api;