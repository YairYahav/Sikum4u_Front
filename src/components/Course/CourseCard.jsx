import React from 'react';
import { BookOpen, Star, Heart } from 'lucide-react';

const CourseCard = ({ course, isFavorite, onToggleFavorite }) => {
  if (!course) return null;

  return (
    <div className="group flex flex-col h-full bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-indigo-100 transition-all overflow-hidden relative">
      
      {/* --- כוכב צהוב: מופיע רק בקורסים מומלצים --- */}
      {course.isFeatured && (
        <div className="absolute top-3 left-3 z-10 bg-yellow-400 text-white p-1.5 rounded-full shadow-md animate-in fade-in zoom-in" title="קורס מומלץ">
          <Star size={14} fill="currentColor" />
        </div>
      )}

      <div className="h-32 bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center relative">
        {/* תמונה או אייקון ברירת מחדל */}
        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
           {course.thumbnail && course.thumbnail !== 'no-photo.jpg' ? (
               <img src={course.thumbnail} alt="" className="w-full h-full object-cover rounded-2xl" />
           ) : (
               <BookOpen className="text-indigo-600" size={28} />
           )}
        </div>
        
        {/* --- כפתור מועדפים: חזר להיות לב (Heart) --- */}
        {onToggleFavorite && (
            <button
            onClick={(e) => {
                e.preventDefault();
                onToggleFavorite(course._id);
            }}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white text-gray-400 hover:text-red-500 transition-colors shadow-sm backdrop-blur-sm"
            >
            <Heart 
                size={18} 
                className={isFavorite ? "fill-red-500 text-red-500" : ""} 
            />
            </button>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
          {course.title}
        </h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1">
          {course.description || 'אין תיאור זמין לקורס זה.'}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
           <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2.5 py-1 rounded-lg">
             קורס
           </span>
           <span className="text-sm font-bold text-indigo-600 flex items-center gap-1 group-hover:translate-x-[-4px] transition-transform">
             למעבר לקורס
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
           </span>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;