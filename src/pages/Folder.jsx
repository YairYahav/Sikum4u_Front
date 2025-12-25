import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { folderAPI } from '../services/folderApi';
import { Folder as FolderIcon, FileText, ArrowRight } from 'lucide-react';

const FolderPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFolder = async () => {
            try {
                const res = await folderAPI.getFolderContent(id);
                setData(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchFolder();
    }, [id]);

    if (loading) return <div className="flex-center">טוען תיקייה...</div>;

    return (
        <div style={{ textAlign: 'right' }}>
            <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '1rem' }}>
                <ArrowRight size={18} /> חזרה
            </button>
            <h2>{data?.folder?.name}</h2>
            <div className="grid" style={{ marginTop: '2rem', display: 'grid', gap: '10px' }}>
                {data?.folders?.map(f => (
                    <Link key={f._id} to={`/folder/${f._id}`} className="card" style={{ display: 'flex', gap: '10px' }}>
                        <FolderIcon /> {f.name}
                    </Link>
                ))}
                {data?.files?.map(f => (
                    <Link key={f._id} to={`/file/${f._id}`} className="card" style={{ display: 'flex', gap: '10px' }}>
                        <FileText /> {f.name}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default FolderPage;