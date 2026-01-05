import api from './api';

export const fileAPI = {
    // העלאת קובץ חדש
    uploadFile: async (formData) => {
        const response = await api.post('/files', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // --- הפונקציה שהייתה חסרה לך ---
    getFileById: async (id) => {
        const response = await api.get(`/files/${id}`);
        return response.data;
    },
    // -----------------------------

    getFilesByFolder: async (folderId) => {
        const response = await api.get(`/files/folder/${folderId}`);
        return response.data;
    },

    getFilesByCourse: async (courseId) => {
        const response = await api.get(`/files/course/${courseId}`);
        return response.data;
    },

    deleteFile: async (id) => {
        const response = await api.delete(`/files/${id}`);
        return response.data;
    },
    
    updateFile: async (id, data) => {
        const response = await api.put(`/files/${id}`, data);
        return response.data;
    }
};