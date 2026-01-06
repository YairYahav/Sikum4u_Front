import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { commentAPI } from '../services/commentApi';
import { ArrowRight, Send, Trash2, MessageCircle, User, AlertTriangle, X } from 'lucide-react';

const CourseComments = ({ user }) => {
    const { courseId } = useParams();
    const navigate = useNavigate();

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);

    // --- State עבור המודל מחיקה ---
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null); // שומר את ה-ID של התגובה למחיקה

    useEffect(() => {
        if (courseId) {
            fetchComments();
        }
    }, [courseId]);

    const fetchComments = async () => {
        try {
            const res = await commentAPI.getComments(courseId);
            setComments(res.data.data || []);
        } catch (error) {
            console.error("Error fetching comments", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            await commentAPI.addComment({
                resourceId: courseId,
                text: newComment
            });
            setNewComment('');
            fetchComments();
        } catch (error) {
            alert("שגיאה בשליחת התגובה");
        }
    };

    // 1. פונקציה שמופעלת כשלוחצים על האייקון של הפח (רק פותחת את המודל)
    const handleDeleteClick = (commentId) => {
        setCommentToDelete(commentId);
        setShowDeleteModal(true);
    };

    // 2. פונקציה שמופעלת כשלוחצים "כן, מחק" בתוך המודל
    const confirmDelete = async () => {
        if (!commentToDelete) return;
        
        try {
            await commentAPI.deleteComment(commentToDelete);
            setShowDeleteModal(false);
            setCommentToDelete(null);
            fetchComments(); // רענון הרשימה
        } catch (error) {
            alert("שגיאה במחיקה");
            setShowDeleteModal(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('he-IL', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 relative">
            <div className="max-w-3xl mx-auto">
                {/* כפתור חזרה וכותרת */}
                <div className="flex items-center gap-4 mb-8">
                    <button 
                        onClick={() => navigate(`/courses/course/${courseId}`)}
                        className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors"
                    >
                        <ArrowRight size={24} className="text-gray-600" />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <MessageCircle className="text-indigo-600" />
                        תגובות לקורס
                    </h1>
                </div>

                {/* אזור הוספת תגובה */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
                    <form onSubmit={handleSubmit} className="relative">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder={user ? "כתוב תגובה..." : "עליך להתחבר כדי להגיב"}
                            disabled={!user}
                            className="w-full p-4 pl-12 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none min-h-[100px]"
                        />
                        <button 
                            type="submit" 
                            disabled={!user || !newComment.trim()}
                            className="absolute bottom-4 left-4 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send size={20} />
                        </button>
                    </form>
                </div>

                {/* רשימת התגובות */}
                <div className="space-y-4">
                    {loading ? (
                        <p className="text-center text-gray-500">טוען תגובות...</p>
                    ) : comments.length === 0 ? (
                        <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-gray-200">
                            <p className="text-gray-500">אין עדיין תגובות. היה הראשון להגיב!</p>
                        </div>
                    ) : (
                        comments.map((comment) => (
                            <div key={comment._id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex gap-4 hover:shadow-md transition-shadow">
                                <div className="flex-shrink-0">
                                    {comment.user?.profilePicture ? (
                                        <img 
                                            src={comment.user.profilePicture} 
                                            alt={comment.user.username} 
                                            className="w-10 h-10 rounded-full object-cover border border-gray-200"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                            <User size={20} />
                                        </div>
                                    )}
                                </div>
                                
                                <div className="flex-grow">
                                    <div className="flex justify-between items-start mb-1">
                                        <div>
                                            <span className="font-bold text-gray-900 ml-2">
                                                {comment.user?.firstName || comment.user?.username || 'משתמש'}
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                {formatDate(comment.createdAt)}
                                            </span>
                                        </div>
                                        
                                        {/* כפתור מחיקה - מפעיל את handleDeleteClick במקום window.confirm */}
                                        {user && (user._id === comment.user._id || user._id === comment.user || user.role === 'admin') && (
                                            <button 
                                                onClick={() => handleDeleteClick(comment._id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                                title="מחק תגובה"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
                                        {comment.text}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* --- המודל למחיקה (מופיע רק כש-showDeleteModal הוא true) --- */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 transform scale-100 transition-all border-2 border-red-100 relative">
                        
                        <button 
                            onClick={() => setShowDeleteModal(false)}
                            className="absolute top-4 left-4 text-gray-400 hover:text-gray-600"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex flex-col items-center text-center mb-6">
                            <div className="bg-red-100 p-3 rounded-full mb-4">
                                <AlertTriangle size={32} className="text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">מחיקת תגובה</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                האם אתה בטוח שברצונך למחוק את התגובה הזו?
                                <br/>
                                לא ניתן לשחזר תגובה שנמחקה.
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
                                onClick={confirmDelete}
                                className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl shadow-md shadow-red-200 transition-colors"
                            >
                                כן, מחק
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseComments;