import React, { useState } from 'react';
import { folderAPI } from '../../services/folderApi';

const FolderForm = ({ show, handleClose, courseId, parentFolderId, onSuccess, onError }) => {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!name.trim()) return;

        setLoading(true);
        try {
            // הכנת הנתונים לשרת
            const folderData = {
                name: name,
                course: courseId,          // חובה לקשר לקורס
                parentFolder: parentFolderId // אופציונלי (אם זו תת-תיקייה)
            };

            const response = await folderAPI.createFolder(folderData);
            
            // איפוס הטופס וקריאה לפונקציית ההצלחה
            setName('');
            onSuccess(response.data);
            
        } catch (error) {
            console.error(error);
            const errorMsg = error.response?.data?.error || 'אירעה שגיאה ביצירת התיקייה';
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
                            <i className="bi bi-folder-plus me-2"></i>
                            יצירת תיקייה חדשה
                        </h5>
                        <button type="button" className="btn-close btn-close-white" onClick={handleClose}></button>
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body py-4">
                            <div className="mb-3">
                                <label htmlFor="folderName" className="form-label fw-bold">שם התיקייה</label>
                                <input 
                                    type="text" 
                                    className="form-control form-control-lg" 
                                    id="folderName" 
                                    placeholder="למשל: סיכומי הרצאות, מבחנים..." 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    autoFocus
                                    required
                                />
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
                                {loading ? 'יוצר...' : 'צור תיקייה'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FolderForm;