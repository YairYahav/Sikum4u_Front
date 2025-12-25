import React, { useEffect, useState } from 'react';
import { userAPI } from '../services/userApi';

const User = () => {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        userAPI.getProfile().then(res => setProfile(res.data));
    }, []);

    return (
        <div className="card" style={{ maxWidth: '500px', margin: '2rem auto', textAlign: 'right' }}>
            <h2>הפרופיל שלי</h2>
            <p><strong>שם:</strong> {profile?.name}</p>
            <p><strong>מייל:</strong> {profile?.email}</p>
            <p><strong>תפקיד:</strong> {profile?.role === 'admin' ? 'מנהל' : 'סטודנט'}</p>
        </div>
    );
};

export default User;