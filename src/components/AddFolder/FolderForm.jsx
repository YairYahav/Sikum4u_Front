import React, { useState } from 'react';
import { folderAPI } from '../../services/folderApi';
import { X, FolderPlus, Loader2 } from 'lucide-react';

const FolderForm = ({ show, handleClose, parentId, parentType, onSuccess }) => {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!show) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!name.trim()) {
            setError('נא להזין שם לתיקייה');
            return;
        }

        try {
            setLoading(true);
            setError('');
            
            // שליחה לשרת (השרת החדש ידע לטפל בזה)
            await folderAPI.createFolder({
                name,
                parentId,
                parentType 
            });

            setName('');
            onSuccess();
            handleClose();

        } catch (err) {
            console.error("Error creating folder:", err);
            setError(err.response?.data?.message || 'שגיאה ביצירת התיקייה');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div 
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100 animate-in zoom-in-95 duration-200 border border-gray-100"
                onClick={(e) => e.stopPropagation()}
            >
                {/* כותרת */}
                <div className="bg-gradient-to-r from-indigo-50 to-white p-6 border-b border-indigo-100 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600 shadow-sm">
                            <FolderPlus size={24} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">יצירת תיקייה חדשה</h2>
                    </div>
                    <button 
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* טופס */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            שם התיקייה
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="לדוגמה: סיכומים, מבחנים משנים קודמות..."
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-gray-800 placeholder-gray-400 bg-gray-50 focus:bg-white"
                            autoFocus
                        />
                        {error && (
                            <p className="text-red-500 text-sm mt-3 flex items-center gap-1 bg-red-50 p-2 rounded-lg">
                                <AlertCircle size={16} />
                                {error}
                            </p>
                        )}
                    </div>

                    {/* כפתורים */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-4 py-3 bg-white text-gray-700 font-medium rounded-xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all"
                            disabled={loading}
                        >
                            ביטול
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/40 transition-all flex items-center justify-center gap-2"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    יוצר...
                                </>
                            ) : (
                                'צור תיקייה'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FolderForm;