import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { folderAPI } from '../services/folderApi';
import { fileAPI } from '../services/fileApi'; 
import { Folder as FolderIcon, FileText, ArrowLeft, MoreVertical, Trash2, Edit2, Info, AlertCircle } from 'lucide-react';
import Breadcrumbs from '../components/Common/Breadcrumbs';

// רכיבים להוספה
import AddFolderCard from '../components/AddFolder/AddFolderCard';
import FolderForm from '../components/AddFolder/FolderForm';
import AddFileButton from '../components/AddFile/AddFileButton'; 
import AddFileModal from '../components/AddFile/AddFileModal';   

const Folder = ({ user }) => {
    const { folderId } = useParams();
    const navigate = useNavigate();
    
    const [folder, setFolder] = useState(null);
    const [subFolders, setSubFolders] = useState([]);
    const [files, setFiles] = useState([]); 
    const [breadcrumbsPath, setBreadcrumbsPath] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // מצבי מודלים
    const [isAddFolderOpen, setIsAddFolderOpen] = useState(false);
    const [isAddFileOpen, setIsAddFileOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);    

    const isAdmin = user?.role === 'admin';

    useEffect(() => {
        if (folderId) {
            fetchFolderData();
        }
    }, [folderId]);

    const fetchFolderData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // 1. שליפת מידע על התיקייה
            const res = await folderAPI.getFolderById(folderId);
            const { folder: folderData, content, path } = res.data;
            
            setFolder(folderData);
            setBreadcrumbsPath(path || []);

            // 2. מיון התוכן: תיקיות מתוך ה-content, קבצים מתוך קריאה נפרדת (או content)
            const subs = content ? content.filter(item => item.type === 'folder') : [];
            setSubFolders(subs);

            // 3. שליפת הקבצים המלאים
            const folderFiles = await fileAPI.getFilesByFolder(folderId);
            setFiles(folderFiles.data || []);

        } catch (error) {
            console.error("Failed to load folder data:", error);
            setError("לא ניתן לטעון את התיקייה");
        } finally {
            setLoading(false);
        }
    };

    const getBreadcrumbsItems = () => {
        if (!folder) return [];
        
        const items = [{ label: 'כל הקורסים', link: '/courses' }];
        
        if (folder.courseId) {
            const isPopulated = typeof folder.courseId === 'object' && folder.courseId !== null;
            const cId = isPopulated ? folder.courseId._id : folder.courseId;
            const cTitle = isPopulated ? folder.courseId.title : 'קורס';
            items.push({ 
                label: cTitle, 
                link: `/courses/course/${cId}` 
            });
        }

        breadcrumbsPath.forEach(parent => {
            items.push({
                label: parent.name,
                link: `/courses/course/${folder.courseId}/folder/${parent._id}`
            });
        });

        items.push({ label: folder.name });
        return items;
    };

    const handleCreateFolder = async (folderName) => {
        try {
            // חילוץ ה-ID הנכון של הקורס למקרה שהוא אובייקט
            const cId = (folder.courseId && folder.courseId._id) ? folder.courseId._id : (folder.courseId || folder.course);

            await folderAPI.createFolder({
                name: folderName,
                parentFolder: folderId,
                course: cId
            });
            setIsAddFolderOpen(false);
            fetchFolderData();
        } catch (error) {
            console.error(error);
            alert("שגיאה ביצירת תיקייה");
        }
    };

    const handleUploadFile = async (fileToUpload, displayName) => {
        try {
            setIsUploading(true);
            const formData = new FormData();
            
            // --- התיקון הקריטי: חילוץ ID מחרוזת בלבד ---
            const cId = (folder.courseId && folder.courseId._id) ? folder.courseId._id : (folder.courseId || folder.course);
            
            formData.append('file', fileToUpload);
            formData.append('name', displayName);
            formData.append('type', 'file');
            formData.append('folderId', folderId); 
            formData.append('courseId', cId); // שליחת המחרוזת המתוקנת

            await fileAPI.uploadFile(formData);
            
            setIsAddFileOpen(false);
            fetchFolderData(); 
        } catch (error) {
            console.error("Upload failed:", error);
            alert("שגיאה בהעלאת הקובץ: " + (error.response?.data?.error || error.message));
        } finally {
            setIsUploading(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
    );

    if (error || !folder) return (
        <div className="flex flex-col items-center justify-center h-screen text-center px-4">
            <AlertCircle size={48} className="text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">{error || "תיקייה לא נמצאה"}</h2>
            <button onClick={() => navigate(-1)} className="mt-4 text-indigo-600 hover:underline">חזור אחורה</button>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                
                <Breadcrumbs items={getBreadcrumbsItems()} />

                {/* כותרת */}
                <div className="flex items-center gap-4 mb-8 mt-6">
                    <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                        <FolderIcon size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{folder.name}</h1>
                        <p className="text-gray-500">
                            {folder.courseId?.title ? `בתוך קורס: ${folder.courseId.title}` : 'תיקייה'}
                        </p>
                    </div>
                </div>

                {/* --- אזור התוכן: עיצוב זהה ל-Course.jsx (רשימה רחבה) --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* 1. קודם כל מציגים תיקיות */}
                    {subFolders.map((sub) => (
                        <Link 
                            key={sub._id} 
                            to={`/courses/course/${folder.courseId}/folder/${sub._id}`} // הנתיב לתיקייה, וודא שזה מה שמוגדר בראוטר שלך
                            className="group flex items-center p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all"
                        >
                            <div className="p-3 rounded-lg ml-4 bg-amber-50 text-amber-500">
                                <FolderIcon size={24} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-800 truncate group-hover:text-indigo-600 transition-colors">
                                    {sub.name}
                                </h4>
                                <p className="text-xs text-gray-400 mt-1">תיקייה</p>
                            </div>
                        </Link>
                    ))}

                    {/* 2. אחר כך מציגים קבצים */}
                    {files.map((file) => (
                        <Link 
                            key={file._id} 
                            to={`/courses/course/${folder.courseId}/file/${file._id}`}
                            className="group flex items-center p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all"
                        >
                            <div className="p-3 rounded-lg ml-4 bg-blue-50 text-blue-500">
                                <FileText size={24} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-800 truncate group-hover:text-indigo-600 transition-colors">
                                    {file.name}
                                </h4>
                                <p className="text-xs text-gray-400 mt-1">קובץ PDF</p>
                            </div>
                        </Link>
                    ))}

                    {/* 3. בסוף כפתורי אדמין - הוספה */}
                    {isAdmin && (
                        <>
                            <AddFolderCard onClick={() => setIsAddFolderOpen(true)} />
                            <AddFileButton onClick={() => setIsAddFileOpen(true)} />
                        </>
                    )}
                </div>

                {/* מצב ריק */}
                {subFolders.length === 0 && files.length === 0 && !isAdmin && (
                    <div className="text-center py-20 text-gray-400 bg-white rounded-3xl border border-dashed border-gray-200 mt-6">
                        <FolderIcon size={48} className="mx-auto mb-4 opacity-20" />
                        <p>התיקייה ריקה כרגע</p>
                    </div>
                )}

                {/* מודלים */}
                {isAddFolderOpen && (
                    <FolderForm 
                        show={isAddFolderOpen} // שים לב: שיניתי מ-isOpen ל-show כדי להתאים ל-Course.jsx
                        handleClose={() => setIsAddFolderOpen(false)} // שים לב: שיניתי מ-onClose ל-handleClose
                        parentId={folderId}
                        parentType="Folder"
                        onSuccess={() => {
                            setIsAddFolderOpen(false);
                            fetchFolderData();
                        }}
                    />
                )}

                <AddFileModal 
                    isOpen={isAddFileOpen}
                    onClose={() => setIsAddFileOpen(false)}
                    onUpload={handleUploadFile}
                    isLoading={isUploading}
                />

            </div>
        </div>
    );
};

export default Folder;