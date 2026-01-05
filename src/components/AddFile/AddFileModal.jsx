import React, { useState, useRef, useEffect } from 'react';
import { X, UploadCloud, FileText, Check, AlertCircle } from 'lucide-react';

const AddFileModal = ({ isOpen, onClose, onUpload, isLoading }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // איפוס המודל בכל פעם שהוא נסגר
  useEffect(() => {
    if (!isOpen) {
        setFile(null);
        setFileName('');
        setError('');
        setIsDragging(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // --- לוגיקת גרירה ---
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  // --- בדיקת קובץ ---
  const validateAndSetFile = (selectedFile) => {
    setError('');
    if (selectedFile.type !== 'application/pdf') {
      setError('ניתן להעלות קבצי PDF בלבד');
      return;
    }
    setFile(selectedFile);
    // הסרת הסיומת מהשם המוצע
    const nameWithoutExt = selectedFile.name.replace(/\.pdf$/i, '');
    setFileName(nameWithoutExt);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file || !fileName) return;
    onUpload(file, fileName);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform scale-100 transition-all">
        
        {/* כותרת */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-gray-800">הוספת קובץ חדש</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* אזור הגרירה */}
          {!file ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current.click()}
              className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 group
                ${isDragging 
                  ? 'border-indigo-500 bg-indigo-50 scale-[1.02]' 
                  : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
                }
                ${error ? 'border-red-300 bg-red-50' : ''}
              `}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="application/pdf"
                onChange={handleFileSelect}
              />
              
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-colors
                ${isDragging ? 'bg-indigo-200 text-indigo-600' : 'bg-indigo-50 text-indigo-500 group-hover:bg-indigo-100'}
              `}>
                <UploadCloud size={32} />
              </div>
              
              <p className="text-gray-700 font-medium mb-1">לחץ או גרור קובץ לכאן</p>
              <p className="text-xs text-gray-400">קבצי PDF בלבד (עד 20MB)</p>
              
              {error && (
                <div className="mt-3 text-red-500 text-sm flex items-center gap-1 bg-red-100 px-3 py-1 rounded-full">
                  <AlertCircle size={14} />
                  {error}
                </div>
              )}
            </div>
          ) : (
            // תצוגת קובץ שנבחר
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-center gap-3 relative animate-in fade-in zoom-in duration-200">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 shrink-0">
                    <FileText size={20} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate text-sm" dir="ltr">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button 
                    onClick={() => { setFile(null); setError(''); }}
                    className="p-1 hover:bg-indigo-200 rounded-full text-indigo-400 hover:text-indigo-700 transition-colors"
                >
                    <X size={16} />
                </button>
            </div>
          )}

          {/* טופס פרטים (מופיע רק אחרי בחירת קובץ) */}
          {file && (
            <div className="animate-in slide-in-from-bottom-2 duration-300">
                <label className="block text-sm font-medium text-gray-700 mb-1">שם התצוגה של הקובץ</label>
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="למשל: סיכום שיעור 1"
                  autoFocus
                />
            </div>
          )}

          {/* כפתורי פעולה */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-colors"
              disabled={isLoading}
            >
              ביטול
            </button>
            <button
              onClick={handleSubmit}
              disabled={!file || !fileName || isLoading}
              className={`flex-1 px-4 py-2 rounded-xl font-medium flex items-center justify-center gap-2 transition-all shadow-lg
                ${(!file || !fileName || isLoading) 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none' 
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
                }
              `}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  מעלה...
                </>
              ) : (
                <>
                  <Check size={18} />
                  העלה קובץ
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFileModal;