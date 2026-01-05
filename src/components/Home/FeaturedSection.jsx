import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Check, X, Plus, GripVertical, GraduationCap, Trash2 } from 'lucide-react';
import { courseAPI } from '../../services/courseApi';
import CourseCard from '../Course/CourseCard';
import AddFeaturedModal from './AddFeaturedModal';

const FeaturedSection = ({ initialCourses, user, onCoursesChange }) => {
  const [courses, setCourses] = useState(initialCourses);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const isAdmin = user?.role === 'admin';
  
  // Drag refs
  const dragItem = useRef();
  const dragOverItem = useRef();

  useEffect(() => {
    setCourses(initialCourses);
  }, [initialCourses]);

  // --- הוספת קורס למומלצים ---
  const handleAddCourse = async (courseToAdd) => {
    try {
       // 1. עדכון בשרת (הפיכה ל-isFeatured: true)
       await courseAPI.toggleFeatured(courseToAdd._id, true);
       
       // 2. עדכון לוקאלי
       const newCourseList = [...courses, { ...courseToAdd, isFeatured: true }];
       setCourses(newCourseList);
       if (onCoursesChange) onCoursesChange(newCourseList);
       
       setIsAddModalOpen(false);
    } catch (err) {
       console.error(err);
       alert("שגיאה בהוספת הקורס");
    }
  };

  // --- הסרת קורס מהמומלצים ---
  const handleRemoveFeatured = async (e, courseId) => {
    e.preventDefault(); // מניעת כניסה לקורס
    if (!window.confirm("להסיר את הקורס מרשימת המומלצים? (הקורס עצמו לא יימחק)")) return;

    try {
        await courseAPI.toggleFeatured(courseId, false);
        const newList = courses.filter(c => c._id !== courseId);
        setCourses(newList);
        if (onCoursesChange) onCoursesChange(newList);
    } catch (err) {
        console.error(err);
        alert("שגיאה בהסרה");
    }
  };

  // --- שמירת הסדר ---
  const handleSaveOrder = async () => {
      try {
          // שליחת המערך החדש לשרת לעדכון הסדר
          await courseAPI.updateFeaturedOrder(courses);
          setIsEditMode(false);
          alert("סדר הקורסים עודכן בהצלחה");
      } catch (err) {
          console.error(err);
          alert("שגיאה בשמירת הסדר");
      }
  };

  const handleCancelEdit = () => {
      setCourses(initialCourses);
      setIsEditMode(false);
  };

  // --- Drag & Drop Handlers ---
  const handleDragStart = (e, position) => {
    dragItem.current = position;
    e.target.classList.add('opacity-50'); 
  };

  const handleDragEnter = (e, position) => {
    dragOverItem.current = position;
    const newCourses = [...courses];
    const dragItemContent = newCourses[dragItem.current];
    newCourses.splice(dragItem.current, 1);
    newCourses.splice(dragOverItem.current, 0, dragItemContent);
    dragItem.current = position;
    setCourses(newCourses);
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove('opacity-50');
    dragItem.current = null;
    dragOverItem.current = null;
  };

  return (
    <section>
        {/* כותרת וכפתורי ניהול */}
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 border-r-4 border-yellow-500 pr-3 flex items-center gap-2">
                קורסים מומלצים
            </h2>

            <div className="flex items-center gap-2">
                {isAdmin && !isEditMode && (
                    <button 
                    onClick={() => setIsEditMode(true)}
                    className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-full transition-colors flex items-center gap-2 px-4"
                    >
                        <span className="text-sm font-medium">עריכה</span>
                        <Edit2 size={18} />
                    </button>
                )}

                {isAdmin && isEditMode && (
                    <div className="flex items-center gap-2 animate-in slide-in-from-right duration-200">
                        <button 
                            onClick={handleCancelEdit}
                            className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 flex items-center gap-1"
                        >
                            <X size={16} /> ביטול
                        </button>
                        <button 
                            onClick={handleSaveOrder}
                            className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 flex items-center gap-1 shadow-sm"
                        >
                            <Check size={16} /> שמור סדר
                        </button>
                    </div>
                )}
            </div>
        </div>

        {/* --- אזור הגלילה (Carousel) --- */}
        <div className="flex overflow-x-auto pb-8 gap-6 custom-scrollbar snap-x p-1">
            
            {courses.length > 0 ? (
                courses.map((course, index) => (
                    <div
                        key={course._id || index}
                        draggable={isEditMode}
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragEnter={(e) => handleDragEnter(e, index)}
                        onDragEnd={handleDragEnd}
                        className={`relative flex-shrink-0 min-w-[280px] w-[280px] sm:min-w-[320px] sm:w-[320px] snap-start transition-all duration-200 ${
                            isEditMode ? 'cursor-grab animate-shake' : ''
                        }`}
                    >
                        {/* במצב עריכה - עטיפה שמונעת לחיצה על הלינק */}
                        {isEditMode ? (
                             <div className="relative h-full">
                                {/* כפתור מחיקה מהמומלצים */}
                                <button 
                                    onClick={(e) => handleRemoveFeatured(e, course._id)}
                                    className="absolute -top-3 -right-3 z-20 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                                    title="הסר ממומלצים"
                                >
                                    <Trash2 size={16} />
                                </button>
                                
                                {/* אייקון גרירה */}
                                <div className="absolute top-2 right-2 z-20 text-gray-400 bg-white/80 rounded-full p-1">
                                    <GripVertical size={20} />
                                </div>

                                <div className="pointer-events-none h-full">
                                    <CourseCard course={course} />
                                </div>
                             </div>
                        ) : (
                            <Link to={`/courses/course/${course._id}`} className="block h-full">
                                <CourseCard course={course} />
                            </Link>
                        )}
                    </div>
                ))
            ) : (
                !isAdmin && (
                    <div className="w-full text-center py-10 bg-gray-50 rounded-xl border border-dashed text-gray-400">
                        עדיין אין קורסים מומלצים
                    </div>
                )
            )}

            {/* --- ה-DIV המקווקו להוספה (רק לאדמין) --- */}
            {isAdmin && (
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="group flex flex-col items-center justify-center min-h-[300px] p-5 rounded-2xl border-2 border-dashed border-gray-300 hover:border-indigo-500 hover:bg-indigo-50/50 transition-all cursor-pointer text-gray-400 hover:text-indigo-600 flex-shrink-0 min-w-[280px] w-[280px] snap-start"
                >
                    <div className="w-16 h-16 rounded-full bg-gray-100 group-hover:bg-indigo-100 flex items-center justify-center mb-4 transition-colors shadow-inner">
                        <Plus size={32} />
                    </div>
                    <span className="font-bold text-lg">הוסף קורס למומלצים</span>
                    <p className="text-xs text-gray-400 mt-2 text-center max-w-[200px]">
                        בחר מתוך רשימת כל הקורסים הקיימים
                    </p>
                </button>
            )}
        </div>

        {/* המודל לבחירת קורס */}
        <AddFeaturedModal 
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onCourseSelect={handleAddCourse}
            currentFeaturedIds={courses.map(c => c._id)}
        />
    </section>
  );
};

export default FeaturedSection;