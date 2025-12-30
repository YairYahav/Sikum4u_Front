import api from './api'; // שימוש ב-instance של axios שכבר מוגדר אצלך

export class BaseApi {
    /**
     * @param {string} resourceEndpoint - הכתובת בשרת, למשל '/courses' או '/files'
     */
    constructor(resourceEndpoint) {
        this.resourceEndpoint = resourceEndpoint;
    }

    // GET /resource - קבלת כל הרשומות (תומך בחיפוש ופילטור)
    async getAll(params = {}) {
        try {
            const response = await api.get(this.resourceEndpoint, { params });
            return response.data;
        } catch (error) {
            this.handleError(error, 'fetching all resources');
        }
    }

    // GET /resource/featured - קבלת מומלצים (עבור קורסים)
    async getFeatured(limit = 5) {
        try {
            const response = await api.get(`${this.resourceEndpoint}/featured`, {
                params: { limit }
            });
            return response.data;
        } catch (error) {
            // אם ה-Endpoint לא קיים, נחזיר מערך ריק במקום לקרוס
            if (error.response && error.response.status === 404) return [];
            this.handleError(error, 'fetching featured resources');
        }
    }

    // GET /resource/:id - קבלת רשומה לפי מזהה
    async getById(id) {
        try {
            const response = await api.get(`${this.resourceEndpoint}/${id}`);
            return response.data;
        } catch (error) {
            this.handleError(error, `fetching resource ${id}`);
        }
    }

    // POST /resource - יצירת רשומה חדשה (תומך גם ב-FormData לקבצים ותמונות)
    async create(data) {
        try {
            const config = {};
            
            // בדיקה אם המידע הוא FormData (למשל העלאת קובץ או תמונה לקורס)
            if (data instanceof FormData) {
                config.headers = { 'Content-Type': 'multipart/form-data' };
            }

            const response = await api.post(this.resourceEndpoint, data, config);
            return response.data;
        } catch (error) {
            this.handleError(error, 'creating resource');
        }
    }

    // PUT /resource/:id - עדכון רשומה
    async update(id, data) {
        try {
            const config = {};
            if (data instanceof FormData) {
                config.headers = { 'Content-Type': 'multipart/form-data' };
            }

            const response = await api.put(`${this.resourceEndpoint}/${id}`, data, config);
            return response.data;
        } catch (error) {
            this.handleError(error, `updating resource ${id}`);
        }
    }

    // DELETE /resource/:id - מחיקת רשומה
    async delete(id) {
        try {
            const response = await api.delete(`${this.resourceEndpoint}/${id}`);
            return response.data;
        } catch (error) {
            this.handleError(error, `deleting resource ${id}`);
        }
    }

    // פונקציית עזר לטיפול בשגיאות בצורה אחידה
    handleError(error, action) {
        console.error(`Error ${action}:`, error);
        
        // שליפת הודעת השגיאה מהשרת אם קיימת
        const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
        throw new Error(message);
    }
}