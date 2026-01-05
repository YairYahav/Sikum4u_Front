import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { folderAPI } from '../services/folderApi';
import { fileAPI } from '../services/fileApi'; 
import { Folder as FolderIcon, FileText, ArrowLeft, MoreVertical, Trash2, Edit2, Info } from 'lucide-react';
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
    const [breadcrumbsPath, setBreadcrumbsPath] = useState([]); // לשמירת נתיב התיקיות
    const [loading, setLoading] = useState(true);
    
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
            // 1. שליפת מידע על התיקייה + תוכן + נתיב
            const res = await folderAPI.getFolderById(folderId);
            const { folder, content, path } = res.data; // השרת מחזיר מבנה זה
            
            setFolder(folder);
            setBreadcrumbsPath(path || []); // שמירת הנתיב

            // 2. מיון התוכן (ילדים) לתיקיות
            // שינוי: השרת מחזיר את כל הילדים ב-content. נסנן את התיקיות משם.
            const subs = content ? content.filter(item => item.type === 'folder') : [];
            setSubFolders(subs);

            // 3. שליפת קבצים מלאים (כולל URL ופרטים נוספים)
            const folderFiles = await fileAPI.getFilesByFolder(folderId);
            setFiles(folderFiles.data || []);

        } catch (error) {
            console.error("Failed to load folder data:", error);
        } finally {
            setLoading(false);
        }
    };

    // --- בניית ה-Breadcrumbs ---
    const getBreadcrumbsItems = () => {
        if (!folder) return [];
        
        // 1. לינק לכל הקורסים
        const items = [{ label: 'כל הקורסים', link: '/courses' }];
        
        // 2. לינק לקורס הראשי
        if (folder.courseId) {
            const isPopulated = typeof folder.courseId === 'object' && folder.courseId !== null;
            const courseId = isPopulated ? folder.courseId._id : folder.courseId;
            const courseTitle = isPopulated ? folder.courseId.title : 'קורס'; // במקרה שאין title ב-populate
            items.push({ 
                label: courseTitle, 
                link: `/courses/course/${courseId}` 
            });
        }

        // 3. לינקים לתיקיות האב (בדרך)
        breadcrumbsPath.forEach(parent => {
            items.push({
                label: parent.name,
                link: `/folder/${parent._id}` // או הנתיב המלא אם תרצה
            });
        });

        // 4. התיקייה הנוכחית (ללא לינק)
        items.push({ label: folder.name });

        return items;
    };

    const handleCreateFolder = async (folderName) => {
        try {
            await folderAPI.createFolder({
                name: folderName,
                parentFolder: folderId,
                course: folder.courseId || folder.course 
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
            formData.append('file', fileToUpload);
            formData.append('name', displayName);
            formData.append('type', 'file');
            formData.append('folderId', folderId); 
            formData.append('courseId', folder.courseId || folder.course);

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

    if (loading) return <div className="text-center py-20">טוען תיקייה...</div>;
    if (!folder) return <div className="text-center py-20">תיקייה לא נמצאה</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                
                {/* תיקון: שימוש ב-items עבור ה-Breadcrumbs */}
                <Breadcrumbs items={getBreadcrumbsItems()} />

                {/* כותרת */}
                <div className="flex items-center gap-4 mb-8 mt-6">
                    <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                        <FolderIcon size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{folder.name}</h1>
                        <p className="text-gray-500">
                            {folder.course?.title ? `בתוך קורס: ${folder.course.title}` : 'תיקייה'}
                        </p>
                    </div>
                </div>

                {/* רשת התוכן */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    
                    {/* כפתורי אדמין - הוספה */}
                    {isAdmin && (
                        <>
                            <AddFolderCard onClick={() => setIsAddFolderOpen(true)} />
                            <AddFileButton onClick={() => setIsAddFileOpen(true)} />
                        </>
                    )}

                    {/* רשימת התיקיות */}
                    {subFolders.map((sub) => (
                        <Link 
                            key={sub._id} 
                            to={`/folder/${sub._id}`}
                            className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all flex flex-col items-center justify-center text-center gap-3 h-full min-h-[140px]"
                        >
                            <FolderIcon size={40} className="text-yellow-400 group-hover:scale-110 transition-transform" fill="currentColor" fillOpacity={0.4} />
                            <span className="font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                                {sub.name}
                            </span>
                        </Link>
                    ))}

                    {/* רשימת הקבצים */}
                    {files.map((file) => (
                        <Link 
                            key={file._id} 
                            to={`/file/${file._id}`}
                            className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all flex flex-col items-center justify-center text-center gap-3 h-full min-h-[140px] relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-full h-1 bg-red-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <FileText size={40} className="text-red-400 group-hover:scale-110 transition-transform" />
                            <span className="font-bold text-gray-800 group-hover:text-indigo-600 transition-colors line-clamp-2">
                                {file.name}
                            </span>
                        </Link>
                    ))}
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
                        isOpen={isAddFolderOpen}
                        onClose={() => setIsAddFolderOpen(false)}
                        onSubmit={handleCreateFolder}
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