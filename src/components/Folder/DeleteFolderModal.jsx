import React from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

const DeleteFolderModal = ({ show, onClose, onConfirm, folderName, isDeleting }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div 
                className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 transform scale-100 transition-all border-2 border-red-100"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex flex-col items-center text-center mb-6">
                    <div className="bg-red-100 p-3 rounded-full mb-4">
                        <AlertTriangle size={32} className="text-red-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">מחיקת תיקייה</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        האם אתה בטוח שברצונך למחוק את התיקייה 
                        <span className="font-bold text-gray-800"> "{folderName}" </span>?
                        <br/>
                        <span className="text-red-500 font-bold">שים לב:</span> כל הקבצים והתיקיות שבתוכה יימחקו לצמיתות!
                    </p>
                </div>

                <div className="flex gap-3">
                    <button 
                        onClick={onClose}
                        className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
                        disabled={isDeleting}
                    >
                        ביטול
                    </button>
                    <button 
                        onClick={onConfirm}
                        className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl shadow-md shadow-red-200 transition-colors flex items-center justify-center gap-2"
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                מוחק...
                            </>
                        ) : (
                            'כן, מחק הכל'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteFolderModal;