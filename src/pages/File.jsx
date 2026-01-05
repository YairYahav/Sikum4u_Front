import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fileAPI } from '../services/fileApi';
import { FileText, Download, ArrowLeft, ExternalLink } from 'lucide-react';
import Breadcrumbs from '../components/Common/Breadcrumbs';

const FilePage = () => {
    const { fileId } = useParams(); 
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFile = async () => {
            try {
                setLoading(true);
                const response = await fileAPI.getFileById(fileId);
                setFile(response.data || response);
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
        
        if (file.course) {
            const cId = file.course._id || file.course;
            const cName = file.course.name || file.course.title || 'קורס'; 
            items.push({ label: cName, link: `/courses/course/${cId}` });
        }

        // אם יש תיקיית אב, אפשר להוסיף גם אותה כאן (אופציונלי)

        items.push({ label: file.name });
        return items;
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

            </div>
        </div>
    );
};

export default FilePage;