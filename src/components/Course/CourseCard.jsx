import React from 'react';
import { BookOpen, Star, ArrowLeft, Heart } from 'lucide-react';

const CourseCard = ({ course, isFavorite, onToggleFavorite }) => {
    // מציג כותרת, ואם אין אז ברירת מחדל
    const displayName = course.title || "קורס ללא שם";

    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 flex flex-col justify-between hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 h-full relative group">
            
            {onToggleFavorite && (
                <button 
                    onClick={(e) => {
                        e.preventDefault();
                        onToggleFavorite(course._id);
                    }}
                    className="absolute top-4 left-4 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white transition-all transform hover:scale-110"
                    title={isFavorite ? "הסר ממועדפים" : "הוסף למועדפים"}
                >
                    <Heart 
                        size={20} 
                        className={`transition-colors duration-300 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-500"}`} 
                    />
                </button>
            )}

            <div>
                <div className="flex justify-between items-start mb-3">
                    <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                        <BookOpen size={20} />
                    </div>
                    {course.averageRating > 0 && (
                        <div className="flex items-center text-amber-400 text-sm font-bold bg-amber-50 px-2 py-1 rounded-md">
                            <Star size={14} fill="currentColor" className="mr-1" />
                            {course.averageRating}
                        </div>
                    )}
                </div>
                
                {/* כותרת הקורס */}
                <h3 className="font-bold text-lg text-gray-800 line-clamp-1 mb-1">{displayName}</h3>
                
                {/* תיאור הקורס (זה שערכנו ב-Sidebar תחת "תיאור קצר") */}
                <p className="text-gray-500 text-sm line-clamp-2 min-h-[2.5rem]">
                    {course.description || "אין תיאור לקורס זה"}
                </p>
            </div>
            
            <div className="mt-4 pt-3 border-t border-gray-50">
                <div className="flex items-center justify-end text-indigo-600 font-medium text-sm group-hover:translate-x-[-4px] transition-transform">
                    צפה בסיכומים <ArrowLeft size={16} className="mr-1" />
                </div>
            </div>
        </div>
    );
};

export default CourseCard;