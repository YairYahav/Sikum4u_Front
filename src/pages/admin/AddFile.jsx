import React, { useState, useRef } from 'react';
import { fileAPI } from '../../services/fileApi';
import { Upload, File, X, CheckCircle } from 'lucide-react';

const AddFile = ({ folderId }) => {
    const [file, setFile] = useState(null);
    const [name, setName] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [status, setStatus] = useState(null); // 'success' | 'error'
    const fileInputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            setFile(droppedFile);
            if (!name) setName(droppedFile.name.split('.')[0]);
        }
    };

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            if (!name) setName(selectedFile.name.split('.')[0]);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file || !name) return alert('נא לבחור קובץ ולהזין שם');

        setUploading(true);
        setStatus(null);

        try {
            const formData = new FormData();
            formData.append('file', file); // תואם ל-middleware/upload.js ב-Back
            formData.append('name', name);
            formData.append('folder', folderId);

            await fileAPI.createFile(file, { name, folder: folderId });
            setStatus('success');
            setFile(null);
            setName('');
        } catch (err) {
            console.error(err);
            setStatus('error');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="card" style={{ maxWidth: '500px', margin: '1rem auto', textAlign: 'right' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>העלאת קובץ חדש</h3>
            
            <form onSubmit={handleUpload}>
                <div 
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current.click()}
                    style={{
                        border: `2px dashed ${isDragging ? 'var(--primary-color)' : 'var(--border-color)'}`,
                        borderRadius: '12px',
                        padding: '2rem',
                        textAlign: 'center',
                        cursor: 'pointer',
                        backgroundColor: isDragging ? 'var(--secondary-bg)' : 'transparent',
                        transition: 'all 0.3s ease',
                        marginBottom: '1.5rem'
                    }}
                >
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                        accept=".pdf,.doc,.docx"
                    />
                    
                    {!file ? (
                        <>
                            <Upload size={48} style={{ color: 'var(--primary-color)', marginBottom: '1rem' }} />
                            <p>גרור קובץ לכאן או לחץ לבחירה מהמחשב</p>
                            <small style={{ opacity: 0.6 }}>תומך ב-PDF וסיכומי וורד</small>
                        </>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                            <File size={32} color="var(--primary-color)" />
                            <span style={{ fontWeight: 'bold' }}>{file.name}</span>
                            <button 
                                type="button" 
                                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                                style={{ background: 'none', border: 'none', color: 'var(--accent-color)' }}
                            >
                                <X size={20} />
                            </button>
                        </div>
                    )}
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>שם הקובץ לתצוגה:</label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        placeholder="למשל: סיכום הרצאה 1"
                        style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '8px',
                            border: '1px solid var(--border-color)',
                            backgroundColor: 'var(--secondary-bg)',
                            color: 'var(--text-color)'
                        }}
                    />
                </div>

                {status === 'success' && (
                    <div style={{ color: 'var(--success-color)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <CheckCircle size={18} /> הקובץ נשמר בהצלחה בשרת!
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={uploading || !file}
                    style={{
                        width: '100%',
                        backgroundColor: 'var(--primary-color)',
                        color: 'white',
                        padding: '12px',
                        opacity: (uploading || !file) ? 0.6 : 1
                    }}
                >
                    {uploading ? 'מעלה קובץ...' : 'התחל העלאה'}
                </button>
            </form>
        </div>
    );
};

export default AddFile;