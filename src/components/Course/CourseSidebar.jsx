import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { courseAPI } from '../../services/courseApi';
import { Edit2, Save, X, Bold, Underline, Check, Heart, Trash2, AlertTriangle, MessageCircle, ArrowRight} from 'lucide-react';
import CourseRating from './CourseRating';


const CourseSidebar = ({ course, isAdmin, onUpdate, isFavorite, onToggleFavorite, user }) => {
    const navigate = useNavigate(); // Hook למעבר עמודים

    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [isEditingDesc, setIsEditingDesc] = useState(false);
    const [isEditingInfo, setIsEditingInfo] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false); 

    const [title, setTitle] = useState(course.title || '');
    const [description, setDescription] = useState(course.description || '');
    const [infoText, setInfoText] = useState(course.infoText || '');
    const [currentAvgRating, setCurrentAvgRating] = useState(course.averageRating || 0);

    
    const editorRef = useRef(null);

    useEffect(() => {
        setTitle(course.title);
        setDescription(course.description);
        setInfoText(course.infoText || '');
        setCurrentAvgRating(course.averageRating || 0);
    }, [course]);

    useEffect(() => {
        if (isEditingInfo && editorRef.current) {
            editorRef.current.innerHTML = infoText;
        }
    }, [isEditingInfo]);

    const handleUpdateField = async (field, value, closeEditCallback) => {
        try {
            await courseAPI.updateCourse(course._id, { [field]: value });
            if (onUpdate) onUpdate({ ...course, [field]: value });
            closeEditCallback(false);
        } catch (error) {
            console.error(`Failed to update ${field}`, error);
            alert("שגיאה בשמירה");
        }
    };

    const handleSaveInfoText = () => {
        const content = editorRef.current.innerHTML;
        setInfoText(content);
        handleUpdateField('infoText', content, setIsEditingInfo);
    };

    // פונקציה לביצוע המחיקה בפועל
    const handleDeleteCourse = async () => {
        try {
            await courseAPI.deleteCourse(course._id);
            // אחרי מחיקה מוצלחת, מעבירים את המשתמש לדף הראשי של הקורסים
            navigate('/courses');
        } catch (error) {
            console.error("Failed to delete course", error);
            alert("שגיאה במחיקת הקורס");
            setShowDeleteModal(false);
        }
    };

    const applyFormat = (command) => {
        document.execCommand(command, false, null);
        editorRef.current.focus();
    };

    const handleRatingUpdate = () => {
        if (onUpdate) {
            window.location.reload(); 
        }
    };


    return (
        <>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col overflow-hidden relative">
                
                {/* --- כותרת הקורס + כפתור מועדפים --- */}
                <div className="mb-6 border-b border-gray-100 pb-4">
                    {isEditingTitle ? (
                        <div className="flex items-center gap-2">
                            <input 
                                type="text" 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full text-xl font-bold border-b-2 border-indigo-500 focus:outline-none bg-transparent"
                                autoFocus
                            />
                            <button onClick={() => handleUpdateField('title', title, setIsEditingTitle)} className="text-green-600 hover:bg-green-50 p-1 rounded"><Check size={20}/></button>
                            <button onClick={() => {setTitle(course.title); setIsEditingTitle(false)}} className="text-red-500 hover:bg-red-50 p-1 rounded"><X size={20}/></button>
                        </div>
                    ) : (
                        <div className="flex justify-between items-start gap-2 group">
                            <div className="flex items-center gap-3 w-full">
                                {user && (
                                    <button 
                                        onClick={onToggleFavorite}
                                        className="p-1.5 rounded-full hover:bg-red-50 transition-colors"
                                        title={isFavorite ? "הסר ממועדפים" : "הוסף למועדפים"}
                                    >
                                        <Heart 
                                            size={24} 
                                            className={`transition-all duration-300 ${
                                                isFavorite 
                                                ? "fill-red-500 text-red-500 scale-110" 
                                                : "text-gray-400 hover:text-red-500"
                                            }`} 
                                        />
                                    </button>
                                    
                                )}
                                
                                <h2 className="text-2xl font-bold text-gray-900 break-words flex-1">
                                    {title}
                                </h2>
                            </div>

                            {isAdmin && (
                                <button onClick={() => setIsEditingTitle(true)} className="text-gray-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity p-1 mt-1">
                                    <Edit2 size={16} />
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* --- תיאור קצר --- */}
                <div className="mb-6 bg-amber-50 p-4 rounded-xl border border-amber-100">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">תיאור קצר</span>
                        {isAdmin && !isEditingDesc && (
                            <button onClick={() => setIsEditingDesc(true)} className="text-amber-400 hover:text-amber-700">
                                <Edit2 size={14} />
                            </button>
                        )}
                    </div>
                    
                    {isEditingDesc ? (
                        <div>
                            <textarea 
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full p-2 text-sm bg-white border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500/50 outline-none resize-none"
                                rows={3}
                            />
                            <div className="flex justify-end gap-2 mt-2">
                                <button onClick={() => {setDescription(course.description); setIsEditingDesc(false)}} className="text-xs text-gray-500 hover:text-gray-700">ביטול</button>
                                <button onClick={() => handleUpdateField('description', description, setIsEditingDesc)} className="text-xs bg-amber-500 text-white px-3 py-1 rounded-md hover:bg-amber-600">שמור</button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-700 leading-relaxed">
                            {description || "אין תיאור קצר..."}
                        </p>
                    )}
                </div>

                <CourseRating 
                    courseId={course._id}
                    initialAverage={currentAvgRating}
                    onRatingUpdate={handleRatingUpdate}
                    user={user}
                />

                <div className="mb-6">
                    <button 
                        onClick={() => navigate(`/courses/course/${course._id}/comments`)}
                        className="w-full flex items-center justify-between p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-indigo-300 transition-all group shadow-sm"
                    >
                        <div className="flex items-center gap-2 text-gray-700 group-hover:text-indigo-700">
                            <MessageCircle size={20} className="text-indigo-500" />
                            <span className="font-medium text-sm">תגובות ודיונים</span>
                        </div>
                        <ArrowRight size={16} className="text-gray-400 group-hover:text-indigo-500 transform group-hover:-translate-x-1 transition-transform" />
                    </button>
                </div>

                {/* --- מידע נוסף (גמיש) --- */}
                <div className="flex-grow flex flex-col min-h-0">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold text-gray-800">מידע על הקורס</h3>
                        {isAdmin && !isEditingInfo && (
                            <button 
                                onClick={() => setIsEditingInfo(true)}
                                className="flex items-center gap-1 text-xs text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded transition-colors"
                            >
                                <Edit2 size={14} /> ערוך תוכן
                            </button>
                        )}
                    </div>

                    <div className="flex-grow overflow-y-auto custom-scrollbar relative">
                        {isEditingInfo ? (
                            <div className="animate-in fade-in duration-200 h-full flex flex-col">
                                <div className="flex gap-2 mb-2 bg-gray-50 p-2 rounded-lg border border-gray-200 sticky top-0 z-10">
                                    <button onMouseDown={(e) => {e.preventDefault(); applyFormat('bold');}} className="p-1 hover:bg-gray-200 rounded"><Bold size={18}/></button>
                                    <button onMouseDown={(e) => {e.preventDefault(); applyFormat('underline');}} className="p-1 hover:bg-gray-200 rounded"><Underline size={18}/></button>
                                    <div className="flex-grow"></div>
                                    <button onClick={() => handleSaveInfoText()} className="text-green-600 hover:bg-green-100 p-1 rounded"><Save size={18}/></button>
                                    <button onClick={() => {setInfoText(course.infoText); setIsEditingInfo(false)}} className="text-red-500 hover:bg-red-100 p-1 rounded"><X size={18}/></button>
                                </div>
                                
                                <div 
                                    ref={editorRef}
                                    contentEditable
                                    className="flex-grow p-4 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-gray-50 text-gray-700"
                                    style={{ direction: 'rtl', minHeight: '200px' }}
                                />
                            </div>
                        ) : (
                            <div className="prose prose-indigo max-w-none text-gray-600 text-sm leading-relaxed pb-4">
                                {infoText ? (
                                    <div dangerouslySetInnerHTML={{ __html: infoText }} />
                                ) : (
                                    <p className="text-gray-400 italic text-center mt-10">
                                        {isAdmin ? "לחץ על 'ערוך תוכן' כדי להוסיף מידע לקורס" : "אין מידע נוסף זמין."}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* --- אזור כפתור מחיקה (נדבק לתחתית) --- */}
                {isAdmin && (
                    <div className="mt-auto pt-6 border-t border-gray-100">
                        <button 
                            onClick={() => setShowDeleteModal(true)}
                            className="w-full flex items-center justify-center gap-2 p-3 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-colors font-medium text-sm group"
                        >
                            <Trash2 size={18} className="group-hover:scale-110 transition-transform" />
                            מחק קורס לצמיתות
                        </button>
                    </div>
                )}
            </div>

            {/* --- חלונית (Modal) אישור מחיקה --- */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 transform scale-100 transition-all border-2 border-red-100">
                        
                        <div className="flex flex-col items-center text-center mb-6">
                            <div className="bg-red-100 p-3 rounded-full mb-4">
                                <AlertTriangle size={32} className="text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">מחיקת קורס</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                האם אתה בטוח שברצונך למחוק את הקורס 
                                <span className="font-bold text-gray-800"> "{course.title}" </span>?
                                <br/>
                                פעולה זו היא בלתי הפיכה ותמחק את כל הקבצים והתיקיות שבתוכו.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button 
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
                            >
                                ביטול
                            </button>
                            <button 
                                onClick={handleDeleteCourse}
                                className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl shadow-md shadow-red-200 transition-colors"
                            >
                                כן, מחק קורס
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CourseSidebar;