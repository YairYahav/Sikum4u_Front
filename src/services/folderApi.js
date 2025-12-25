import api from './api';

export const folderAPI = {
    // קבלת רשימת הקבצים והתיקיות בתוך תיקייה ספציפית
    getFolderContent: async (id) => {
        const response = await api.get(`/folders/${id}`);
        return response.data;
    },

    // --- פעולות ADMIN בלבד ---

    // יצירת תיקייה חדשה (משויכת לקורס או לתיקיית אב)
    createFolder: async (folderData) => {
        const response = await api.post('/folders', folderData);
        return response.data;
    },

    // שינוי שם התיקייה או העברה שלה
    updateFolder: async (id, data) => {
        const response = await api.put(`/folders/${id}`, data);
        return response.data;
    },

    // מחיקת תיקייה (שימוש בזהירות!)
    deleteFolder: async (id) => {
        const response = await api.delete(`/folders/${id}`);
        return response.data;
    }
};