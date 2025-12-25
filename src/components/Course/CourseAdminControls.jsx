import React, { useState } from 'react';
import { courseAPI } from '../../services/courseApi';
import { useNavigate } from 'react-router-dom';

const CourseAdminControls = ({ course, onCourseUpdate }) => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // שינוי שם הקורס
    const handleRename = async () => {
        const newName = prompt('הכנס שם חדש לקורס:', course.name);
        if (newName && newName !== course.name) {
            setLoading(true);
            try {
                const res = await courseAPI.updateCourse(course._id, { name: newName });
                onCourseUpdate(res.data);
            } catch (error) {
                alert('שגיאה בשינוי השם');
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
    };

    // שינוי סטטוס "מומלץ"
    const handleToggleFeatured = async () => {
        setLoading(true);
        try {
            const res = await courseAPI.updateCourse(course._id, { isFeatured: !course.isFeatured });
            onCourseUpdate(res.data);
        } catch (error) {
            alert('שגיאה בעדכון הסטטוס');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // מחיקת קורס
    const handleDelete = async () => {
        if (window.confirm('זהירות: מחיקת הקורס תמחק גם את כל התיקיות והקבצים שבו! האם להמשיך?')) {
            setLoading(true);
            try {
                await courseAPI.deleteCourse(course._id);
                // ניווט לדף הבית או לרשימת הקורסים אחרי מחיקה
                navigate('/courses');
            } catch (error) {
                alert('שגיאה במחיקת הקורס');
                console.error(error);
                setLoading(false);
            }
        }
    };

    return (
        <div className="card shadow-sm border-danger mb-4">
            <div className="card-header bg-danger text-white">
                <h5 className="mb-0 fs-6">
                    <i className="bi bi-gear-fill me-2"></i>
                    ניהול קורס (Admin)
                </h5>
            </div>
            <div className="card-body d-flex flex-wrap gap-2 justify-content-center">
                <button 
                    className="btn btn-outline-primary" 
                    onClick={handleRename}
                    disabled={loading}
                >
                    <i className="bi bi-pencil me-1"></i> ערוך שם
                </button>

                <button 
                    className={`btn ${course.isFeatured ? 'btn-warning' : 'btn-outline-warning'}`} 
                    onClick={handleToggleFeatured}
                    disabled={loading}
                >
                    <i className={`bi ${course.isFeatured ? 'bi-star-fill' : 'bi-star'} me-1`}></i>
                    {course.isFeatured ? 'בטל המלצה' : 'סמן כמומלץ'}
                </button>

                <button 
                    className="btn btn-outline-danger" 
                    onClick={handleDelete}
                    disabled={loading}
                >
                    <i className="bi bi-trash me-1"></i> מחיקת קורס
                </button>
            </div>
        </div>
    );
};

export default CourseAdminControls;