import React, { useState } from 'react';
import { userAPI } from '../../services/userApi';

const ProfilePictureSection = ({ profilePicture, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [url, setUrl] = useState(profilePicture || '');

    const handleSave = async () => {
        try {
            await userAPI.updateProfilePicture(url);
            onUpdate('תמונת פרופיל עודכנה בהצלחה');
            setIsEditing(false);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="text-center mb-4">
            <div className="mb-3">
                <img 
                    src={profilePicture || 'https://via.placeholder.com/150'} 
                    alt="Profile" 
                    className="rounded-circle img-thumbnail"
                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                />
            </div>
            
            {/* כפתור עריכה מהירה לתמונה */}
            {!isEditing ? (
                <button className="btn btn-sm btn-outline-secondary" onClick={() => setIsEditing(true)}>
                    שינוי תמונה
                </button>
            ) : (
                <div className="d-flex justify-content-center gap-2">
                    <input 
                        type="text" 
                        className="form-control form-control-sm w-50" 
                        placeholder="URL לתמונה..." 
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                    <button className="btn btn-sm btn-success" onClick={handleSave}>שמור</button>
                    <button className="btn btn-sm btn-light" onClick={() => setIsEditing(false)}>ביטול</button>
                </div>
            )}
        </div>
    );
};

export default ProfilePictureSection;