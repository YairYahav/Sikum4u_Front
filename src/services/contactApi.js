import api from './api';

export const contactAPI = {
    sendMessage: async (messageData) => {
        // הנחת עבודה: יש endpoint בשרת שמקבל הודעות
        // אם אין, זה יחזיר שגיאה, אבל ה-Frontend יהיה מוכן
        const response = await api.post('/contact', messageData);
        return response.data;
    }
};