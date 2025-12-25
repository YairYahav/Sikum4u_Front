import React, { useRef } from 'react';

const FileUpload = ({ onFileSelect, selectedFile }) => {
    const fileInputRef = useRef();

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            onFileSelect(e.target.files[0]);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onFileSelect(e.dataTransfer.files[0]);
        }
    };

    return (
        <div className="mb-4">
            <label className="form-label fw-bold">קובץ הסיכום (PDF)</label>
            <div 
                className={`border rounded-3 p-5 text-center ${selectedFile ? 'bg-light border-success' : 'bg-white border-secondary'}`}
                style={{ borderStyle: 'dashed', cursor: 'pointer', transition: 'all 0.3s' }}
                onClick={() => fileInputRef.current.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
            >
                <input 
                    type="file" 
                    accept=".pdf,application/pdf" 
                    className="d-none" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                />
                
                {selectedFile ? (
                    <div className="text-success fade-in">
                        <i className="bi bi-file-earmark-pdf-fill display-4 mb-2"></i>
                        <h5 className="mb-0">{selectedFile.name}</h5>
                        <small className="text-muted">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</small>
                        <div className="mt-2">
                            <span className="badge bg-success">קובץ נבחר</span>
                        </div>
                    </div>
                ) : (
                    <div className="text-muted">
                        <i className="bi bi-cloud-arrow-up display-4 mb-2"></i>
                        <h5>לחץ לבחירה או גרור קובץ לכאן</h5>
                        <small>קבצי PDF בלבד</small>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileUpload;