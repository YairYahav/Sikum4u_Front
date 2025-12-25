import React from 'react';
import { Link } from 'react-router-dom';

const FileMetadataCard = ({ file }) => {
    // פירמוט תאריך לתצוגה ישראלית
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
                <h5 className="mb-0 fs-6">פרטי קובץ</h5>
            </div>
            <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                    <strong>תאריך העלאה:</strong>
                    <span>{formatDate(file.createdAt)}</span>
                </li>
                
                <li className="list-group-item d-flex justify-content-between align-items-center">
                    <strong>הועלה ע"י:</strong>
                    <span>
                        {/* בדיקה אם האובייקט מאוכלס או שזה רק ID */}
                        {file.uploadedBy?.username || file.uploadedBy?.firstName || 'משתמש לא ידוע'}
                    </span>
                </li>

                {file.course && (
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                        <strong>קורס:</strong>
                        {typeof file.course === 'object' ? (
                            <Link to={`/course/${file.course._id}`} className="text-decoration-none">
                                {file.course.name}
                            </Link>
                        ) : (
                            <span className="text-muted">טוען...</span>
                        )}
                    </li>
                )}

                {file.parentFolder && (
                    <li className="list-group-item d-flex justify-content-between align-items-center">
                        <strong>תיקייה:</strong>
                        {typeof file.parentFolder === 'object' ? (
                            <Link to={`/folder/${file.parentFolder._id}`} className="text-decoration-none">
                                {file.parentFolder.name}
                            </Link>
                        ) : (
                            <span className="text-muted">תיקייה פנימית</span>
                        )}
                    </li>
                )}
            </ul>
        </div>
    );
};

export default FileMetadataCard;