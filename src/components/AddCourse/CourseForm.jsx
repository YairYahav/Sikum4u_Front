import React, { useState, useEffect } from 'react';
import { courseAPI } from '../../services/courseApi';
import { X } from 'lucide-react';

const CourseForm = ({ show, handleClose, onSuccess, onError }) => {
    const [formData, setFormData] = useState({
        title: '', 
        description: ''
    });
    const [loading, setLoading] = useState(false);

    // איפוס אוטומטי של הטופס בכל פעם שהחלון נסגר
    useEffect(() => {
        if (!show) {
            setFormData({ title: '', description: '' });
        }
    }, [show]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.title.trim()) return;

        setLoading(true);
        try {
            const response = await courseAPI.createCourse(formData);
            onSuccess(response.data);
        } catch (error) {
            console.error(error);
            const errorMsg = error.response?.data?.error || 'אירעה שגיאה ביצירת הקורס';
            onError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100">
                
                {/* כותרת החלון */}
                <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center">
                    <h3 className="text-white text-xl font-bold">הוספת קורס חדש</h3>
                    <button onClick={handleClose} className="text-white/80 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* טופס */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">שם הקורס</label>
                        <input
                            type="text"
                            name="title" 
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="לדוגמה: מבוא למדעי המחשב"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                            required
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">תיאור הקורס</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="כתוב תיאור קצר..."
                            rows="4"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                        />
                    </div>

                    <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium transition-colors"
                        >
                            ביטול
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 font-medium shadow-md shadow-indigo-200 transition-all transform active:scale-95"
                        >
                            {loading ? 'יוצר...' : 'צור קורס'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CourseForm;