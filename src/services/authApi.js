import api from './api';

export const authAPI = {
  // הרשמה
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data; // מחזירים ישירות את המידע (data)
  },

  // התחברות
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data; // מחזירים ישירות את המידע
  },

  // קבלת פרטי משתמש מחובר
  getMe: async () => {
    const response = await api.get('/auth/check');
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