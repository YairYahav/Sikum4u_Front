import React from 'react';

const LoadingSection = () => {
    return (
        <div className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: '200px' }}>
            <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">טוען נתונים...</span>
            </div>
        </div>
    );
};

export default LoadingSection;