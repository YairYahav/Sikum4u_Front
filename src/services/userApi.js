import api from './api';

export const userAPI = {
    // קבלת הפרופיל של המשתמש הנוכחי
    getProfile: async () => {
        const response = await api.get('/auth/me'); // משתמש בנתיב ה-Auth לקבלת מידע אישי
        return response.data;
    },

    // עדכון פרטים אישיים
    updateProfile: async (userId, updateData) => {
        // updateData יכול להכיל שם, סיסמה חדשה וכו'
        const response = await api.put(`/users/${userId}`, updateData);
        return response.data;
    },

    // --- פונקציות למנהלים (Admin) בלבד ---

    // קבלת כל רשימת המשתמשים באתר
    getAllUsers: async () => {
        const response = await api.get('/users');
        return response.data;
    },

    // מחיקת משתמש (Admin)
    deleteUser: async (userId) => {
        const response = await api.delete(`/users/${userId}`);
        return response.data;
    },

    // שינוי תפקיד משתמש (למשל להפוך מישהו ל-Admin)
    changeUserRole: async (userId, role) => {
        const response = await api.put(`/users/${userId}`, { role });
        return response.data;
    }
};