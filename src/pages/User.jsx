import React, { useEffect, useState } from 'react';
import { userAPI } from '../services/userApi';

// ייבוא הקומפוננטות החדשות לפי המבנה שבחרת
import LoadingSpinner from '../components/User/LoadingSpinner';
import AlertMessages from '../components/User/AlertMessages';
import ProfileHeader from '../components/User/ProfileHeader';
import ProfilePictureSection from '../components/User/ProfilePictureSection';
import PersonalInformationSection from '../components/User/PersonalInformationSection';
import PasswordSection from '../components/User/PasswordSection';
import UserFavorites from '../components/User/UserFavorites';

const User = () => {
    const [user, setUser] = useState(null);
    const [favorites, setFavorites] = useState({ courses: [], files: [] });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null); // { type: 'success' | 'danger', text: '' }

    const fetchUserData = async () => {
        try {
            const profileRes = await userAPI.getProfile();
            setUser(profileRes.data);
            
            const favoritesRes = await userAPI.getFavorites();
            setFavorites(favoritesRes.data);
            
            setLoading(false);
        } catch (err) {
            setMessage({ type: 'danger', text: 'שגיאה בטעינת נתוני משתמש' });
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const handleMessageUpdate = (msg) => {
        setMessage(msg);
        // הסתרת הודעה אוטומטית אחרי 3 שניות אם זו הצלחה
        if (msg?.type === 'success') {
            setTimeout(() => setMessage(null), 3000);
        }
    };

    // פונקציה לעדכון תמונה שתועבר ל-ProfilePictureSection
    const handlePictureUpdate = (successText) => {
        handleMessageUpdate({ type: 'success', text: successText });
        fetchUserData();
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="container" style={{ maxWidth: '800px', margin: '2rem auto', direction: 'rtl', textAlign: 'right' }}>
            
            <AlertMessages message={message} />
            
            <div className="card shadow-lg border-0">
                <div className="card-body p-5">
                    
                    <ProfileHeader user={user} />
                    
                    <ProfilePictureSection 
                        profilePicture={user?.profilePicture} 
                        onUpdate={handlePictureUpdate}
                    />

                    <hr className="my-4" />

                    <PersonalInformationSection 
                        user={user} 
                        onUserUpdate={fetchUserData}
                        setMessage={handleMessageUpdate}
                    />

                    <PasswordSection 
                        setMessage={handleMessageUpdate}
                    />


                     <hr className="my-4" />
                     <h5 className="mb-3 text-secondary">מועדפים</h5>
                     <UserFavorites favorites={favorites} />

                </div>
            </div>
        </div>
    );
};

export default User;