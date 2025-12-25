import api from './api';

export const authAPI = {
    // הרשמה של משתמש חדש
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        if (response.data.success && response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    },

    // התחברות משתמש קיים
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        if (response.data.success && response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    },

    // קבלת פרטי המשתמש המחובר 
    getMe: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    // התנתקות
    logout: () => {
        localStorage.removeItem('token');
    },

    // פונקציית עזר לבדיקה מהירה אם יש Token
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    }
};

export const userAPI = {
    // עדכון פרטי משתמש (למשל שינוי סיסמה או שם)
    updateProfile: async (id, updateData) => {
        const response = await api.put(`/users/${id}`, updateData);
        return response.data;
    },

    // למנהלים בלבד: קבלת כל המשתמשים
    getAllUsers: async () => {
        const response = await api.get('/users');
        return response.data;
    }
};