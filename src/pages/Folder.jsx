import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { folderAPI } from '../services/folderApi';
import { courseAPI } from '../services/courseApi';
import { Folder as FolderIcon, FileText, AlertCircle, ArrowRight, Trash2 } from 'lucide-react';

import Breadcrumbs from '../components/Common/Breadcrumbs';
import AddFolderCard from '../components/AddFolder/AddFolderCard';
import FolderForm from '../components/AddFolder/FolderForm';
// הייבוא החדש שלנו:
import DeleteFolderModal from '../components/Folder/DeleteFolderModal';

const Folder = ({ user }) => {
    const { courseId, folderId } = useParams();
    const navigate = useNavigate();

    const [courseTitle, setCourseTitle] = useState('קורס');
    const [currentFolder, setCurrentFolder] = useState(null);
    const [folderContent, setFolderContent] = useState([]);
    const [breadcrumbsPath, setBreadcrumbsPath] = useState([]); 
    
    const [loading, setLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false); // הוספתי מצב מחיקה (ספינר)
    const [showFolderModal, setShowFolderModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!folderId || folderId === 'undefined') return;

        const fetchData = async () => {
            try {
                setLoading(true);
                try {
                    const courseRes = await courseAPI.getCourseById(courseId);
                    const cData = courseRes.data || courseRes;
                    setCourseTitle(cData.title);
                } catch (e) { console.log("Could not fetch course title"); }

                const folderRes = await folderAPI.getFolderContent(folderId);
                setCurrentFolder(folderRes.data.folder);
                setFolderContent(folderRes.data.content || []);
                setBreadcrumbsPath(folderRes.data.path || []);

            } catch (err) {
                console.error("Error fetching folder data:", err);
                setError("לא ניתן לטעון את התיקייה");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [courseId, folderId]);

    const handleFolderAdded = () => {
        window.location.reload(); 
    };


    const handleDeleteFolder = async () => {
        setIsDeleting(true);
        try {
            await folderAPI.deleteFolder(currentFolder._id);
            
            const targetUrl = currentFolder.parentFolder 
                ? `/courses/course/${courseId}/folder/${currentFolder.parentFolder}`
                : `/courses/course/${courseId}`;
            
            setIsDeleting(false);
            setShowDeleteModal(false);

            navigate(targetUrl);
            
        } catch (error) {
            console.error("Failed to delete folder", error);
            alert("שגיאה במחיקת התיקייה");
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
    );

    if (error || !currentFolder) return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
            <AlertCircle size={48} className="text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">{error || "תיקייה לא נמצאה"}</h2>
            <Link to={`/courses/course/${courseId}`} className="mt-4 text-indigo-600 hover:underline">חזרה לקורס</Link>
        </div>
    );

    const isAdmin = user?.role === 'admin';

    const breadcrumbItems = [
        { label: 'כל הקורסים', link: '/courses' },
        { label: courseTitle, link: `/courses/course/${courseId}` },
        ...breadcrumbsPath.map(folder => ({
            label: folder.name,
            link: `/courses/course/${courseId}/folder/${folder._id}`
        })),
        { label: currentFolder.name } 
    ];

    return (
        <div className="container mx-auto px-4 py-6 min-h-[calc(100vh-80px)]">
            
            <Breadcrumbs items={breadcrumbItems} />

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <Link to={currentFolder.parentFolder 
                            ? `/courses/course/${courseId}/folder/${currentFolder.parentFolder}`
                            : `/courses/course/${courseId}`
                        } className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="חזור למעלה">
                            <ArrowRight size={20} className="text-gray-500"/>
                        </Link>
                        
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <FolderIcon className="text-amber-500 fill-amber-100" />
                            {currentFolder.name}
                        </h1>
                    </div>

                    {isAdmin && (
                        <button 
                            onClick={() => setShowDeleteModal(true)}
                            className="flex items-center gap-2 px-3 py-2 text-red-500 bg-red-50 hover:bg-red-100 hover:text-red-600 rounded-lg transition-all border border-transparent hover:border-red-200"
                        >
                            <Trash2 size={20} />
                            <span className="hidden sm:inline font-medium text-sm">מחק תיקייה</span>
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {folderContent.length > 0 && folderContent.map((item) => {
                        const isFolder = item.type === 'folder';
                        const itemLink = isFolder 
                            ? `/courses/course/${courseId}/folder/${item._id}`
                            : `/courses/course/${courseId}/file/${item._id}`;

                        return (
                            <Link 
                                key={item._id}
                                to={itemLink}
                                className="group flex items-center p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all"
                            >
                                <div className={`p-3 rounded-lg ml-4 ${
                                    isFolder ? 'bg-amber-50 text-amber-500' : 'bg-blue-50 text-blue-500'
                                }`}>
                                    {isFolder ? <FolderIcon size={24} /> : <FileText size={24} />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-gray-800 truncate group-hover:text-indigo-600 transition-colors">
                                        {item.name}
                                    </h4>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {isFolder ? 'תיקייה' : 'קובץ'}
                                    </p>
                                </div>
                            </Link>
                        );
                    })}

                    {isAdmin && (
                        <AddFolderCard onClick={() => setShowFolderModal(true)} />
                    )}

                    {folderContent.length === 0 && !isAdmin && (
                        <div className="col-span-full py-12 text-center text-gray-400">
                            <FolderIcon size={48} className="mx-auto mb-2 opacity-20" />
                            <p>התיקייה ריקה</p>
                        </div>
                    )}
                </div>
            </div>

            {/* קומפוננטת יצירת תיקייה */}
            <FolderForm 
                show={showFolderModal} 
                handleClose={() => setShowFolderModal(false)}
                parentId={currentFolder._id}
                parentType="Folder"
                onSuccess={handleFolderAdded}
            />

            {/* הקומפוננטה החדשה והנקייה שלנו למחיקה */}
            <DeleteFolderModal 
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteFolder}
                folderName={currentFolder.name}
                isDeleting={isDeleting}
            />

        </div>
    );
};

export default Folder;