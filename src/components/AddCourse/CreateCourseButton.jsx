import React, { useState } from 'react';
import CourseForm from './CourseForm';
import CreateCourseStatusModal from './CreateCourseStatusModal';

const CreateCourseButton = ({ onCourseCreated }) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [statusModal, setStatusModal] = useState({ show: false, status: '', message: '' });

    const handleSuccess = (newCourse) => {
        setIsFormOpen(false);
        setStatusModal({
            show: true,
            status: 'success',
            message: `הקורס "${newCourse.name}" נוצר בהצלחה!`
        });
        
        // עדכון הרשימה בדף האב
        if (onCourseCreated) {
            onCourseCreated(newCourse);
        }
    };

    const handleError = (errorMsg) => {
        setStatusModal({
            show: true,
            status: 'error',
            message: errorMsg || 'שגיאה ביצירת הקורס'
        });
    };

    return (
        <>
            <button 
                className="btn btn-primary btn-lg d-flex align-items-center gap-2 shadow hover-effect"
                onClick={() => setIsFormOpen(true)}
            >
                <i className="bi bi-journal-plus fs-4"></i>
                <span className="fw-bold">יצירת קורס חדש</span>
            </button>

            {/* טופס היצירה */}
            <CourseForm 
                show={isFormOpen} 
                handleClose={() => setIsFormOpen(false)} 
                onSuccess={handleSuccess}
                onError={handleError}
            />

            {/* מודל סטטוס */}
            <CreateCourseStatusModal 
                show={statusModal.show}
                status={statusModal.status}
                message={statusModal.message}
                onClose={() => setStatusModal({ ...statusModal, show: false })}
            />
        </>
    );
};

export default CreateCourseButton;