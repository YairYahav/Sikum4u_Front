import React, { useState } from 'react';
import FolderForm from './FolderForm';
import CreateFolderStatusModal from './CreateFolderStatusModal';

const CreateFolderButton = ({ courseId, parentFolderId, onFolderCreated }) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [statusModal, setStatusModal] = useState({ show: false, status: '', message: '' });

    // טיפול בסיום יצירת התיקייה (מועבר ל-FolderForm)
    const handleSuccess = (newFolder) => {
        setIsFormOpen(false); // סגירת הטופס
        setStatusModal({
            show: true,
            status: 'success',
            message: `התיקייה "${newFolder.name}" נוצרה בהצלחה!`
        });
        
        // עדכון הרשימה בדף ההורה (אם הועברה פונקציה)
        if (onFolderCreated) {
            onFolderCreated(newFolder);
        }
    };

    const handleError = (errorMsg) => {
        // לא סוגרים את הטופס כדי לאפשר תיקון, אבל אפשר להציג שגיאה
        // במקרה הזה נבחר להציג מודל שגיאה
        setStatusModal({
            show: true,
            status: 'error',
            message: errorMsg || 'שגיאה ביצירת התיקייה'
        });
    };

    return (
        <>
            <button 
                className="btn btn-primary d-flex align-items-center gap-2 shadow-sm"
                onClick={() => setIsFormOpen(true)}
            >
                <i className="bi bi-folder-plus fs-5"></i>
                <span className="fw-bold">תיקייה חדשה</span>
            </button>

            {/* טופס יצירת התיקייה (מודל) */}
            <FolderForm 
                show={isFormOpen} 
                handleClose={() => setIsFormOpen(false)} 
                courseId={courseId}
                parentFolderId={parentFolderId}
                onSuccess={handleSuccess}
                onError={handleError}
            />

            {/* מודל סטטוס (הצלחה/כישלון) */}
            <CreateFolderStatusModal 
                show={statusModal.show}
                status={statusModal.status}
                message={statusModal.message}
                onClose={() => setStatusModal({ ...statusModal, show: false })}
            />
        </>
    );
};

export default CreateFolderButton;