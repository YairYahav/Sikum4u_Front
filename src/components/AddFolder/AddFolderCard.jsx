import React from 'react';
import { FolderPlus } from 'lucide-react';

const AddFolderCard = ({ onClick }) => {
    return (
        <div 
            onClick={onClick}
            className="h-[80px] w-full flex items-center justify-center p-4
                       border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 
                       cursor-pointer group hover:border-indigo-500 hover:bg-indigo-50/50 
                       transition-all duration-300 ease-in-out"
        >
            <div className="flex items-center gap-3">
                <FolderPlus size={24} className="text-gray-400 group-hover:text-indigo-600 transition-colors" />
                <span className="font-semibold text-gray-500 group-hover:text-indigo-700 transition-colors">
                    הוסף תיקייה חדשה
                </span>
            </div>
        </div>
    );
};

export default AddFolderCard;