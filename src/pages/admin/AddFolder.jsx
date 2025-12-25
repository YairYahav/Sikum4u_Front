import React, { useState } from 'react';
import { folderAPI } from '../../services/folderApi';

const AddFolder = ({ parentId }) => {
    const [name, setName] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        await folderAPI.createFolder({ name, parent: parentId });
        alert('התיקייה נוצרה');
    };
    return (
        <form className="card" onSubmit={handleSubmit} style={{ textAlign: 'right' }}>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="שם התיקייה" required style={{ padding: '10px' }} />
            <button type="submit">הוסף תיקייה</button>
        </form>
    );
};
export default AddFolder;