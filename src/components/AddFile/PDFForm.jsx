import React from 'react';

const PDFForm = ({ formData, setFormData }) => {
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-header bg-primary text-white">
                <h5 className="mb-0">פרטי הקובץ</h5>
            </div>
            <div className="card-body">
                {/* שם הקובץ */}
                <div className="mb-3">
                    <label htmlFor="fileName" className="form-label fw-bold">שם הקובץ (לתצוגה באתר)</label>
                    <input
                        type="text"
                        className="form-control"
                        id="fileName"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="למשל: סיכום שיעור 1 - מבוא"
                        required
                    />
                    <div className="form-text">שם זה יוצג לסטודנטים ברשימת הקבצים.</div>
                </div>

                {/* תיאור (אופציונלי - הכנה לעתיד אם תוסיף ב-Backend) */}
                <div className="mb-3">
                    <label htmlFor="fileDescription" className="form-label fw-bold">תיאור (אופציונלי)</label>
                    <textarea
                        className="form-control"
                        id="fileDescription"
                        name="description"
                        rows="3"
                        value={formData.description || ''}
                        onChange={handleChange}
                        placeholder="תיאור קצר על תוכן הקובץ..."
                    ></textarea>
                </div>
            </div>
        </div>
    );
};

export default PDFForm;