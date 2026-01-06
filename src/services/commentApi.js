import api from './api';

export const commentAPI = {
    // שליפת תגובות לקורס
    getComments: (courseId) => api.get(`/courses/course/${courseId}/comments?resourceType=Course`),
    
    // הוספת תגובה חדשה
    addComment: (data) => api.post(`/courses/course/${data.resourceId}/comments`, {
        ...data,
        resourceType: 'Course' // מגדירים קבוע שזה קורס
    }),

    // מחיקת תגובה (לפי הנתיב הכללי שיצרנו ב-index.js)
    deleteComment: (commentId) => api.delete(`/comments/${commentId}`)
};