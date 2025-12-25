import React from 'react';

const CourseDescriptionCard = ({ description }) => {
    return (
        <div className="card shadow-sm mb-4">
            <div className="card-body">
                <h5 className="card-title text-primary border-bottom pb-2 mb-3">
                    אודות הקורס
                </h5>
                <div className="card-text text-secondary">
                    {description ? (
                        <p style={{ whiteSpace: 'pre-line' }}>{description}</p>
                    ) : (
                        <p className="text-muted fst-italic">
                            לא הוזן תיאור לקורס זה.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseDescriptionCard;