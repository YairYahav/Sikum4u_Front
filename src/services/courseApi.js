import api from './api';

export const courseAPI = {
    // קבלת כל הקורסים הקיימים במערכת
    getAllCourses: async () => {
        const response = await api.get('/courses');
        return response.data;
    },

    // קבלת הקורסים המומלצים עבור ה-Carousel בדף הבית
    getFeaturedCourses: async () => {
        // מנסים לנתיב הייעודי (אם קיים), אחרת רגיל
        try {
            const response = await api.get('/courses/featured');
            return response.data;
        } catch (error) {
            console.warn("Featured endpoint not found, fetching all");
            const response = await api.get('/courses');
            return response.data;
        }
    },

    // קבלת מידע מלא על קורס ספציפי לפי ה-ID שלו
    getCourseById: async (id) => {
        const response = await api.get(`/courses/${id}`);
        return response.data;
    },

    // --- פעולות ADMIN ---
    
    // יצירת קורס חדש
    createCourse: async (courseData) => {
        const response = await api.post('/courses', courseData);
        return response.data;
    },

    // עדכון פרטי קורס קיים
    updateCourse: async (id, courseData) => {
        const response = await api.put(`/courses/${id}`, courseData);
        return response.data;
    },

    // מחיקת קורס מהמערכת
    deleteCourse: async (id) => {
        const response = await api.delete(`/courses/${id}`);
        return response.data;
    },

    // --- פונקציות עזר למומלצים (חובה עבור ה-FeaturedSection שיצרנו) ---
    updateFeaturedOrder: async (courses) => {
        // שולחים מערך של IDs או אובייקטים
        const response = await api.put('/courses/featured/reorder', { courses });
        return response.data;
    },

    toggleFeatured: async (id, isFeatured) => {
        const response = await api.put(`/courses/${id}`, { isFeatured });
        return response.data;
    }
};