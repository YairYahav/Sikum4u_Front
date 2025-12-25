import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { courseAPI } from '../services/courseApi';
import { folderAPI } from '../services/folderApi';
import { Folder, FileText, ChevronLeft } from 'lucide-react';

const Course = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [content, setContent] = useState({ folders: [], files: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const courseRes = await courseAPI.getCourseById(id);
                setCourse(courseRes.data);
                const contentRes = await folderAPI.getFolderContent(courseRes.data.rootFolder);
                setContent(contentRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourseData();
    }, [id]);

    if (loading) return <div className="flex-center">טוען קורס...</div>;

    return (
        <div className="course-page" style={{ textAlign: 'right' }}>
            <header style={{ marginBottom: '2rem' }}>
                <h1>{course?.name}</h1>
                <p>{course?.description}</p>
            </header>

            <section className="content-grid" style={{ display: 'grid', gap: '15px' }}>
                {content.folders.map(folder => (
                    <Link key={folder._id} to={`/folder/${folder._id}`} className="card" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '1rem' }}>
                        <Folder color="var(--primary-color)" />
                        <span>{folder.name}</span>
                        <ChevronLeft style={{ marginRight: 'auto' }} size={16} />
                    </Link>
                ))}
                {content.files.map(file => (
                    <Link key={file._id} to={`/file/${file._id}`} className="card" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '1rem' }}>
                        <FileText color="#999" />
                        <span>{file.name}</span>
                    </Link>
                ))}
            </section>
        </div>
    );
};

export default Course;