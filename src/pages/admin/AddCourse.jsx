import React, { useState } from 'react';
import { courseAPI } from '../../services/courseApi';

const AddCourse = () => {
    const [name, setName] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        await courseAPI.createCourse({ name });
        alert('הקורס נוצר בהצלחה');
    };
    return (
        <form className="card" onSubmit={handleSubmit} style={{ textAlign: 'right' }}>
            <h3>הוספת קורס חדש</h3>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="שם הקורס" required style={{ width: '100%', margin: '1rem 0', padding: '10px' }} />
            <button type="submit">צור קורס</button>
        </form>
    );
};
export default AddCourse;