import React from 'react';
import { Plus } from 'lucide-react';

const AddCourseCard = ({ onClick }) => {
    return (
        <div 
            onClick={onClick}
            className="h-full min-h-[200px] flex flex-col items-center justify-center p-6 
                       border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 
                       cursor-pointer group hover:border-indigo-500 hover:bg-indigo-50/50 
                       transition-all duration-300 ease-in-out"
        >
            <div className="bg-white p-3 rounded-full shadow-sm group-hover:shadow-md group-hover:scale-110 transition-transform duration-300 mb-3">
                <Plus size={32} className="text-gray-400 group-hover:text-indigo-600 transition-colors" />
            </div>
            <span className="font-semibold text-gray-500 group-hover:text-indigo-700 transition-colors">
                הוסף קורס חדש
            </span>
        </div>
    );
};

export default AddCourseCard;