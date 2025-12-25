import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, FolderPlus, FilePlus } from 'lucide-react';

const AdminPanel = () => {
    return (
        <div style={{ textAlign: 'right' }}>
            <h1>פאנל ניהול</h1>
            <div className="grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginTop: '2rem' }}>
                <Link to="/admin/add-course" className="card flex-center" style={{ flexDirection: 'column', gap: '10px' }}>
                    <PlusCircle size={40} /> הוספת קורס
                </Link>
                <Link to="/admin/add-folder" className="card flex-center" style={{ flexDirection: 'column', gap: '10px' }}>
                    <FolderPlus size={40} /> הוספת תיקייה
                </Link>
                <Link to="/admin/add-file" className="card flex-center" style={{ flexDirection: 'column', gap: '10px' }}>
                    <FilePlus size={40} /> העלאת קובץ
                </Link>
            </div>
        </div>
    );
};

export default AdminPanel;