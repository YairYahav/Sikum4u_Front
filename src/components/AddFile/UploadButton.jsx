import React from 'react';

const UploadButton = ({ onClick, disabled, loading }) => {
    return (
        <div className="d-grid gap-2">
            <button 
                className="btn btn-primary btn-lg py-3 shadow-sm" 
                onClick={onClick}
                disabled={disabled || loading}
            >
                {loading ? (
                    <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        מעלה קובץ לשרת...
                    </>
                ) : (
                    <>
                        <i className="bi bi-cloud-upload me-2"></i>
                        העלה קובץ כעת
                    </>
                )}
            </button>
        </div>
    );
};

export default UploadButton;