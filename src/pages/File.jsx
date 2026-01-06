import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fileAPI } from '../services/fileApi';
import { folderAPI } from '../services/folderApi';
import { FileText, Download, ArrowLeft, ExternalLink, Trash2, AlertTriangle, X } from 'lucide-react';
import Breadcrumbs from '../components/Common/Breadcrumbs';

const FilePage = ({ user }) => {
    const { fileId } = useParams(); 
    const navigate = useNavigate();

    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [breadcrumbsPath, setBreadcrumbsPath] = useState([]);

    useEffect(() => {
        const fetchFile = async () => {
            try {
                setLoading(true);
                const response = await fileAPI.getFileById(fileId);
                const fileData = response.data || response;

                setFile(fileData);

                // טעינת נתיב הלחם (Breadcrumbs)
                if (fileData.parentFolder) {
                    try {
                        const folderRes = await folderAPI.getFolderById(fileData.parentFolder);
                        const { folder: parentFolder, path: folderPath } = folderRes.data;
                        // הנתיב המלא לקובץ הוא: הנתיב של התיקייה + התיקייה עצמה
                        setBreadcrumbsPath([...(folderPath || []), parentFolder]);
                    } catch (err) {
                        console.error("Error fetching breadcrumbs:", err);
                    }
                }
            } catch (err) {
                console.error("Error loading file:", err);
                setError("לא ניתן לטעון את הקובץ");
            } finally {
                setLoading(false);
            }
        };

        if (fileId) fetchFile();
    }, [fileId]);

    const getBreadcrumbs = () => {
        if (!file) return [];
        const items = [{ label: 'כל הקורסים', link: '/courses' }];
        
        const courseId = file.course?._id || file.course;

        if (file.course) {
            const cName = file.course.name || file.course.title || 'קורס'; 
            items.push({ label: cName, link: `/courses/course/${courseId}` });
        }

        // הוספת הנתיב של התיקיות
        breadcrumbsPath.forEach(parent => {
            items.push({
                label: parent.name,
                // בניית לינק זהה למבנה שיש לך ב-Folder
                link: `/courses/course/${courseId}/folder/${parent._id}`
            });
        });

        items.push({ label: file.name });
        return items;
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await fileAPI.deleteFile(fileId); // וודא שיש לך פונקציה כזו ב-fileApi
            
            // לאחר מחיקה מוצלחת, נחזיר את המשתמש לדף הקורס
            if (file.course) {
                const courseId = file.course._id || file.course;
                navigate(`/courses/course/${courseId}`);
            } else {
                navigate('/courses');
            }
        } catch (err) {
            console.error("Error deleting file:", err);
            alert("שגיאה במחיקת הקובץ");
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };


    if (loading) return <div className="text-center py-20">טוען קובץ...</div>;
    if (error || !file) return <div className="text-center py-20 text-red-500">{error || "קובץ לא נמצא"}</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-6xl mx-auto space-y-6">
                
                <Breadcrumbs items={getBreadcrumbs()} />

                {/* כותרת ופרטים - ללא תאריך ומשתמש */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-50 text-red-500 rounded-xl">
                            <FileText size={32} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{file.name}</h1>
                        </div>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                        <a 
                            href={file.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            download
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium shadow-lg shadow-indigo-100"
                        >
                            <Download size={18} />
                            הורד קובץ
                        </a>
                        <a 
                            href={file.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                        >
                            <ExternalLink size={18} />
                            פתח בכרטיסייה
                        </a>
                    </div>
                </div>

                {/* אזור התצוגה (Viewer) */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden h-[800px] relative group">
                    <iframe 
                        src={file.url} 
                        className="w-full h-full border-0"
                        title="PDF Viewer"
                    />
                    
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50 -z-10">
                        <div className="text-center text-gray-400">
                            <p>טוען תצוגה מקדימה...</p>
                            <p className="text-sm mt-2">אם הקובץ לא מופיע, נסה להוריד אותו</p>
                        </div>
                    </div>
                </div>

                {/* אזור מחיקה (רק לאדמין) */}
                {user?.role === 'admin' && (
                    <div className="mt-8 border-t border-gray-200 pt-8 pb-4">
                        <div className="bg-red-50 border border-red-100 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div>
                                <h3 className="text-lg font-bold text-red-800 flex items-center gap-2">
                                    <AlertTriangle size={20} />
                                    אזור מסוכן
                                </h3>
                                <p className="text-red-600/80 text-sm mt-1">
                                    שים לב, מחיקת הקובץ תסיר אותו לצמיתות מהשרת ומהקורס.
                                </p>
                            </div>
                            <button 
                                onClick={() => setShowDeleteModal(true)}
                                className="flex items-center gap-2 px-6 py-3 bg-white border border-red-200 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all font-bold shadow-sm"
                            >
                                <Trash2 size={20} />
                                מחק קובץ לצמיתות
                            </button>
                        </div>
                    </div>
                )}

            </div>

            {/* --- מודל אישור מחיקה --- */}
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
                            <h3 className="text-xl font-bold text-gray-900 mb-2">מחיקת קובץ</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                האם אתה בטוח שברצונך למחוק את הקובץ
                                <span className="font-bold block mt-1 text-gray-800">"{file.name}"</span>
                                פעולה זו היא בלתי הפיכה.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button 
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
                                disabled={isDeleting}
                            >
                                ביטול
                            </button>
                            <button 
                                onClick={handleDelete}
                                className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl shadow-md shadow-red-200 transition-colors flex justify-center items-center gap-2"
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'מוחק...' : 'כן, מחק'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilePage;