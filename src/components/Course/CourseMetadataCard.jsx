import React from 'react';

const CourseMetadataCard = ({ course }) => {
    const formatDate = (dateString) => {
        if (!dateString) return 'לא ידוע';
        return new Date(dateString).toLocaleDateString('he-IL', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-header bg-light">
                <h5 className="mb-0 fs-6">פרטי הקורס</h5>
            </div>
            <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                    <strong>נוצר ב:</strong>
                    <span>{formatDate(course.createdAt)}</span>
                </li>
                
                <li className="list-group-item d-flex justify-content-between align-items-center">
                    <strong>מנהל הקורס:</strong>
                    <span>
                        {/* בדיקה אם השדה admin מאוכלס באובייקט או שהוא רק ID */}
                        {course.admin?.firstName 
                            ? `${course.admin.firstName} ${course.admin.lastName}` 
                            : 'מערכת'}
                    </span>
                </li>

                <li className="list-group-item d-flex justify-content-between align-items-center">
                    <strong>דירוג ממוצע:</strong>
                    <span className="badge bg-warning text-dark rounded-pill">
                        {course.averageRating || 0} / 5
                    </span>
                </li>
                
                <li className="list-group-item d-flex justify-content-between align-items-center">
                    <strong>מספר תיקיות:</strong>
                    <span>{course.folders?.length || 0}</span>
                </li>
            </ul>
        </div>
    );
};

export default CourseMetadataCard;