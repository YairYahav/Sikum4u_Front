import api from './api';

export const reviewAPI = {
    /**
     * שליפת תגובות
     * @param {string} resourceId - ה-ID של הקורס או הקובץ עליו מדברים
     */
    getReviews: async (resourceId) => {
        const response = await api.get(`/reviews?resourceId=${resourceId}`);
        return response.data;
    },

    // הוספת תגובה ודירוג (1-5 כוכבים)
    addReview: async (reviewData) => {
        // reviewData צריך להכיל: resourceId, text, rating
        const response = await api.post('/reviews', reviewData);
        return response.data;
    },

    // מחיקת תגובה (רק למי שכתב אותה או לאדמין)
    deleteReview: async (id) => {
        const response = await api.delete(`/reviews/${id}`);
        return response.data;
    }
};