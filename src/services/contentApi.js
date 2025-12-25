import api from './api';

export const folderAPI = {
    // קבלת תוכן התיקייה (קבצים ותתי-תיקיות בתוכה)
    getFolderContent: (id) => api.get(`/folders/${id}`),
    
    // יצירת תיקייה חדשה (Admin)
    createFolder: (folderData) => api.post('/folders', folderData),
    
    updateFolder: (id, data) => api.put(`/folders/${id}`, data),
    
    deleteFolder: (id) => api.delete(`/folders/${id}`)
};

export const fileAPI = {
    // קבלת קבצים מומלצים/כלליים
    getFiles: () => api.get('/files'),
    
    getFileById: (id) => api.get(`/files/${id}`),
    
    // צפייה בקובץ ברזולוציה מלאה (PDF)
    getFullResFile: (id) => api.get(`/files/${id}/full`),

    // העלאת קובץ (Admin) - משתמש ב-FormData עבור multer ב-Backend
    createFile: (formData) => api.post('/files', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    
    deleteFile: (id) => api.delete(`/files/${id}`)
};