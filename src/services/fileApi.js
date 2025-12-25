import api from './api';

export const fileAPI = {
    // שליפת כל הקבצים (למשל לצורך חיפוש גלובלי)
    getAllFiles: async () => {
        const response = await api.get('/files');
        return response.data;
    },

    // שליפת מידע על קובץ ספציפי
    getFileById: async (id) => {
        const response = await api.get(`/files/${id}`);
        return response.data;
    },

    // קבלת לינק ישיר לצפייה בקובץ ברזולוציה מלאה
    getFullResFile: async (id) => {
        const response = await api.get(`/files/${id}/full`);
        return response.data;
    },

    // --- פעולות ADMIN בלבד ---

    /**
     * העלאת קובץ חדש
     * @param {File} fileObject - אובייקט הקובץ מה-Input
     * @param {Object} metadata - שם הקובץ, התיקייה אליה הוא שייך וכו'
     */
    createFile: async (fileObject, metadata) => {
        const formData = new FormData();
        formData.append('file', fileObject); // השם 'file' חייב להתאים ל-upload.single('file') ב-Backend
        
        // הוספת שאר הנתונים (שם הקובץ, ID של התיקייה וכו')
        Object.keys(metadata).forEach(key => {
            formData.append(key, metadata[key]);
        });

        const response = await api.post('/files', formData, {
            headers: {
                'Content-Type': 'multipart/form-data' // חובה לצורך העלאת קבצים
            }
        });
        return response.data;
    },

    // עדכון פרטי קובץ (שם בלבד, ללא העלאה מחדש)
    updateFile: async (id, updateData) => {
        const response = await api.put(`/files/${id}`, updateData);
        return response.data;
    },

    // מחיקת קובץ מהשרת ומענן האחסון
    deleteFile: async (id) => {
        const response = await api.delete(`/files/${id}`);
        return response.data;
    }
};