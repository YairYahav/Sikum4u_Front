import React from 'react';

const FileTagsCard = ({ tags }) => {
    // אם אין תגיות או שהמערך ריק, לא נציג את הקומפוננטה בכלל
    if (!tags || tags.length === 0) {
        return null;
    }

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-body">
                <h5 className="card-title text-success fs-6 mb-3">
                    <i className="bi bi-tags me-2"></i> תגיות
                </h5>
                <div className="d-flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                        <span key={index} className="badge bg-light text-dark border">
                            #{tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FileTagsCard;