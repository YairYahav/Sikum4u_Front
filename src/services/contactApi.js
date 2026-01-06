import api from './api';

export const contactAPI = {
    // שליחת הודעה (פומבי)
    sendMessage: (data) => api.post('/contact', data),
    
    // קבלת כל ההודעות (אדמין)
    getAllMessages: () => api.get('/contact'),
    
    // מחיקת הודעה (אדמין)
    deleteMessage: (id) => api.delete(`/contact/${id}`),
    
    // עדכון סטטוס (אדמין) - אופציונלי
    markAsRead: (id) => api.put(`/contact/${id}`, { status: 'read' })
};