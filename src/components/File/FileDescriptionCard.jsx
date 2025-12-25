import React from 'react';

const FileDescriptionCard = ({ description }) => {
    return (
        <div className="card shadow-sm mb-4">
            <div className="card-body">
                <h5 className="card-title text-primary border-bottom pb-2 mb-3">
                    תיאור הקובץ
                </h5>
                <div className="card-text text-secondary">
                    {description ? (
                        <p>{description}</p>
                    ) : (
                        <p className="text-muted fst-italic">
                            לא נוסף תיאור לקובץ זה.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FileDescriptionCard;