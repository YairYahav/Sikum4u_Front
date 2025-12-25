import React from 'react';

const CourseTagsCard = ({ tags }) => {
    if (!tags || tags.length === 0) {
        return null;
    }

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-body">
                <h5 className="card-title text-success fs-6 mb-3">
                    <i className="bi bi-tags-fill me-2"></i> נושאים ותגיות
                </h5>
                <div className="d-flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                        <span key={index} className="badge bg-light text-success border border-success">
                            #{tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CourseTagsCard;