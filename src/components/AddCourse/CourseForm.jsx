import React, { useState } from 'react';
import { courseAPI } from '../../services/courseApi';

const CourseForm = ({ show, handleClose, onSuccess, onError }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name.trim()) return;

        setLoading(true);
        try {
            const response = await courseAPI.createCourse(formData);
            
            // איפוס הטופס
            setFormData({ name: '', description: '' });
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
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content shadow-lg border-0">
                    <div className="modal-header bg-primary text-white">
                        <h5 className="modal-title">
                            <i className="bi bi-journal-plus me-2"></i>
                            הוספת קורס חדש למערכת
                        </h5>
                        <button type="button" className="btn-close btn-close-white" onClick={handleClose}></button>
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body py-4">
                            {/* שם הקורס */}
                            <div className="mb-3">
                                <label htmlFor="courseName" className="form-label fw-bold">שם הקורס <span className="text-danger">*</span></label>
                                <input 
                                    type="text" 
                                    className="form-control form-control-lg" 
                                    id="courseName" 
                                    name="name"
                                    placeholder="למשל: אינפי 1, מבוא למדמ''ח..." 
                                    value={formData.name}
                                    onChange={handleChange}
                                    maxLength="100"
                                    required
                                    autoFocus
                                />
                                <div className="form-text">השם שיופיע בכרטיסיות ובחיפוש.</div>
                            </div>

                            {/* תיאור */}
                            <div className="mb-3">
                                <label htmlFor="courseDesc" className="form-label fw-bold">תיאור הקורס</label>
                                <textarea 
                                    className="form-control" 
                                    id="courseDesc" 
                                    name="description"
                                    rows="4"
                                    placeholder="כתוב כמה מילים על הקורס, למי הוא מיועד ומה לומדים בו..."
                                    value={formData.description}
                                    onChange={handleChange}
                                    maxLength="500"
                                ></textarea>
                                <div className="form-text text-end">
                                    {formData.description.length}/500 תווים
                                </div>
                            </div>
                        </div>
                        
                        <div className="modal-footer bg-light border-0">
                            <button 
                                type="button" 
                                className="btn btn-secondary px-4" 
                                onClick={handleClose}
                                disabled={loading}
                            >
                                ביטול
                            </button>
                            <button 
                                type="submit" 
                                className="btn btn-success px-4 fw-bold"
                                disabled={loading}
                            >
                                {loading ? 'יוצר קורס...' : 'צור קורס'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CourseForm;