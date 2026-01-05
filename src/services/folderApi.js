import api from './api';

export const folderAPI = {
    // קבלת מידע על תיקייה ספציפית לפי ID
    getFolderById: async (id) => {
        const response = await api.get(`/folders/${id}`);
        return response.data;
    },

    // קבלת תיקיות ראשיות של קורס (שאין להן הורה)
    getFoldersByCourse: async (courseId) => {
        const response = await api.get(`/folders/course/${courseId}`);
        return response.data;
    },

    // קבלת תתי-תיקיות של תיקייה מסוימת
    getSubFolders: async (parentId) => {
        // מניחים שהשרת תומך בנתיב כזה או סינון דומה
        const response = await api.get(`/folders/${parentId}/children`); 
        // הערה: אם הנתיב בשרת שלך שונה (למשל /folders?parent=...), עדכן כאן.
        // ברירת מחדל נפוצה בבנייה שלנו הייתה:
        // const response = await api.get(`/folders?parentFolder=${parentId}`);
        // אבל נלך על הנתיב הישיר הנפוץ יותר בקונטרולרים כאלו:
        return response.data; 
    },

    // קבלת רשימת הקבצים והתיקיות בתוך תיקייה ספציפית (משולב)
    getFolderContent: async (id) => {
        const response = await api.get(`/folders/${id}`);
        return response.data;
    },

    // --- פעולות ADMIN בלבד ---

    // יצירת תיקייה חדשה
    createFolder: async (folderData) => {
        const response = await api.post('/folders', folderData);
        return response.data;
    },

    // שינוי שם התיקייה או העברה שלה
    updateFolder: async (id, data) => {
        const response = await api.put(`/folders/${id}`, data);
        return response.data;
    },

    // מחיקת תיקייה
    deleteFolder: async (id) => {
        const response = await api.delete(`/folders/${id}`);
        return response.data;
    }
};