import React from 'react';

const CreateCourseStatusModal = ({ show, status, message, onClose }) => {
    if (!show) return null;

    const isSuccess = status === 'success';

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered modal-sm">
                <div className="modal-content text-center border-0 shadow">
                    <div className={`modal-header justify-content-center text-white ${isSuccess ? 'bg-success' : 'bg-danger'}`}>
                        <h5 className="modal-title">
                            {isSuccess ? 'הצלחה' : 'שגיאה'}
                        </h5>
                    </div>
                    <div className="modal-body py-4">
                        <div className={`mb-3 ${isSuccess ? 'text-success' : 'text-danger'}`}>
                            <i className={`bi ${isSuccess ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'}`} style={{ fontSize: '3rem' }}></i>
                        </div>
                        <p className="mb-0 fw-bold">{message}</p>
                    </div>
                    <div className="modal-footer justify-content-center border-0 p-2">
                        <button type="button" className="btn btn-secondary btn-sm px-4" onClick={onClose}>
                            סגור
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateCourseStatusModal;