import React, { useState, useEffect } from 'react';
import { X, Search, Check, Star } from 'lucide-react';
import { courseAPI } from '../../services/courseApi';

const AddFeaturedModal = ({ isOpen, onClose, onCourseSelect, currentFeaturedIds }) => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCourses();
    }
  }, [isOpen]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await courseAPI.getAllCourses();
      // טיפול במבני נתונים שונים (כמו שעשינו ב-Home)
      let allCourses = [];
      const rawData = res.data;
      if (Array.isArray(rawData)) allCourses = rawData;
      else if (rawData && Array.isArray(rawData.data)) allCourses = rawData.data;
      else if (rawData && rawData.courses && Array.isArray(rawData.courses)) allCourses = rawData.courses;
      
      setCourses(allCourses);
    } catch (error) {
      console.error("Failed to load courses", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // סינון: חפש לפי שם, וגם אל תראה קורסים שכבר מופיעים ברשימת המומלצים
  const filteredCourses = courses.filter(course => 
    !currentFeaturedIds.includes(course._id) && 
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg h-[80vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <Star className="text-yellow-400 fill-yellow-400" size={20} />
            בחר קורס להוספה למומלצים
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-100">
           <div className="relative">
             <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
             <input 
               type="text" 
               placeholder="חפש קורס..." 
               className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
           {loading ? (
             <div className="text-center py-10 text-gray-400">טוען קורסים...</div>
           ) : filteredCourses.length === 0 ? (
             <div className="text-center py-10 text-gray-400">לא נמצאו קורסים מתאימים</div>
           ) : (
             filteredCourses.map(course => (
               <button
                 key={course._id}
                 onClick={() => onCourseSelect(course)}
                 className="w-full text-right p-3 hover:bg-indigo-50 rounded-xl transition-colors flex items-center justify-between group border border-transparent hover:border-indigo-100"
               >
                 <div>
                   <div className="font-bold text-gray-800">{course.title}</div>
                   <div className="text-xs text-gray-500 line-clamp-1">{course.description}</div>
                 </div>
                 <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-300 group-hover:border-indigo-500 group-hover:text-indigo-600">
                    <Check size={16} />
                 </div>
               </button>
             ))
           )}
        </div>
      </div>
    </div>
  );
};

export default AddFeaturedModal;