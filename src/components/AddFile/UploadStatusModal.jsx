import React from 'react';

const UploadStatusModal = ({ show, status, message, onClose }) => {
    if (!show) return null;

    // סגנונות לפי סטטוס
    const isSuccess = status === 'success';
    const isError = status === 'error';
    const isLoading = status === 'uploading';

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg">
                    <div className={`modal-header ${isSuccess ? 'bg-success' : isError ? 'bg-danger' : 'bg-primary'} text-white`}>
                        <h5 className="modal-title">
                            {isLoading && 'מעלה קובץ...'}
                            {isSuccess && 'הצלחה!'}
                            {isError && 'שגיאה'}
                        </h5>
                    </div>
                    
                    <div className="modal-body text-center py-5">
                        {isLoading && (
                            <div className="spinner-border text-primary" style={{ width: '4rem', height: '4rem' }} role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        )}

                        {isSuccess && (
                            <div className="text-success mb-3">
                                <i className="bi bi-check-circle-fill" style={{ fontSize: '4rem' }}></i>
                            </div>
                        )}

                        {isError && (
                            <div className="text-danger mb-3">
                                <i className="bi bi-x-circle-fill" style={{ fontSize: '4rem' }}></i>
                            </div>
                        )}

                        <h5 className="mt-3">{message}</h5>
                    </div>

                    <div className="modal-footer justify-content-center border-0 pb-4">
                        {!isLoading && (
                            <button 
                                type="button" 
                                className={`btn ${isSuccess ? 'btn-success' : 'btn-secondary'} px-4`} 
                                onClick={onClose}
                            >
                                {isSuccess ? 'סגור ורענן' : 'סגור'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadStatusModal;