import React from 'react';

const ProfileHeader = ({ user }) => {
    return (
        <div className="text-center mb-4">
            <h2 className="display-6">הפרופיל שלי</h2>
            <p className="text-muted">
                מחובר כ: <span className="badge bg-secondary">{user?.role === 'admin' ? 'מנהל מערכת' : 'סטודנט'}</span>
            </p>
        </div>
    );
};

export default ProfileHeader;