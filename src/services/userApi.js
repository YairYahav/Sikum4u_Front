import api from './api';

export const userAPI = {
    // קבלת פרופיל המשתמש
    getProfile: async () => {
        const response = await api.get('/users/me');
        return response.data; 
    },

    // קבלת מועדפים
    getFavorites: async () => {
        try {
            const response = await api.get('/users/me/favorites');
            return response.data;
        } catch (error) {
            console.warn("Could not fetch favorites", error);
            return { data: { courses: [], files: [] } };
        }
    },

    // עדכון תמונת פרופיל
    updateProfilePicture: async (imageUrl) => {
        const response = await api.put('/users/me/profilePicture', { profilePictureUrl: imageUrl });
        return response.data;
    },

    // --- עדכון פרטים (פונקציות שהיו חסרות) ---
    
    updateFirstName: async (firstName) => {
        const response = await api.put('/users/me/firstname', { firstName });
        return response.data;
    },

    updateLastName: async (lastName) => {
        const response = await api.put('/users/me/lastname', { lastName });
        return response.data;
    },

    updateUsername: async (username) => {
        const response = await api.put('/users/me/username', { username });
        return response.data;
    },

    updatePassword: async (currentPassword, newPassword) => {
        const response = await api.put('/users/me/password', { currentPassword, newPassword });
        return response.data;
    }
};