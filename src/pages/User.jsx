import React, { useEffect, useState } from 'react';
import { userAPI } from '../services/userApi';
import { Shield, User as UserIcon, AlertCircle } from 'lucide-react';

// Components
import ProfilePictureSection from '../components/User/ProfilePictureSection';
import PersonalInformationSection from '../components/User/PersonalInformationSection';
import PasswordSection from '../components/User/PasswordSection';
import UserFavorites from '../components/User/UserFavorites';

const User = () => {
    const [user, setUser] = useState(null);
    const [favorites, setFavorites] = useState({ courses: [], files: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUserData = async () => {
        try {
            // טעינת פרופיל
            const profileRes = await userAPI.getProfile();
            // השרת מחזיר { success: true, data: {...} }
            setUser(profileRes.data); 
            
            // טעינת מועדפים
            try {
                const favoritesRes = await userAPI.getFavorites();
                setFavorites(favoritesRes.data || { courses: [], files: [] });
            } catch (favErr) {
                console.warn("Favorites fetch issue", favErr);
            }

        } catch (err) {
            console.error("User fetch failed:", err);
            setError("לא ניתן לטעון את פרטי המשתמש. נסה לרענן או להתחבר מחדש.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const handleUpdate = () => {
        fetchUserData();
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    if (error) return (
        <div className="max-w-2xl mx-auto mt-10 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 text-center flex items-center justify-center gap-2">
             <AlertCircle size={20} />
             {error}
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                
                {/* רקע עליון */}
                <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
                
                <div className="px-8 pb-8">
                    {/* תמונת פרופיל */}
                    <div className="-mt-16 mb-6">
                        <ProfilePictureSection user={user} onUpdate={handleUpdate} />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* עמודה מרכזית - טפסים */}
                        <div className="lg:col-span-2 space-y-8">
                            <section>
                                <h3 className="text-xl font-bold text-gray-800 mb-4 border-r-4 border-indigo-500 pr-3">פרטים אישיים</h3>
                                <div className="bg-gray-50 rounded-2xl p-1 border border-gray-100">
                                    <PersonalInformationSection 
                                        user={user} 
                                        onUserUpdate={handleUpdate} 
                                        setMessage={() => {}}
                                    />
                                </div>
                            </section>

                            <section>
                                <h3 className="text-xl font-bold text-gray-800 mb-4 border-r-4 border-gray-500 pr-3">אבטחה</h3>
                                <div className="bg-white rounded-2xl border border-gray-200 p-4">
                                    <PasswordSection setMessage={() => {}} />
                                </div>
                            </section>

                            <section>
                                <h3 className="text-xl font-bold text-gray-800 mb-4 border-r-4 border-red-500 pr-3">המועדפים שלי</h3>
                                <UserFavorites favorites={favorites} />
                            </section>
                        </div>

                        {/* עמודה צדדית - סטטוס ומידע */}
                        <div className="space-y-6">
                            
                            {/* תצוגת הרשאות (Role) החדשה */}
                            <div className={`rounded-2xl p-6 text-center border ${user.role === 'admin' ? 'bg-indigo-50 border-indigo-100' : 'bg-gray-50 border-gray-100'}`}>
                                <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3 ${user.role === 'admin' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-200 text-gray-600'}`}>
                                    {user.role === 'admin' ? <Shield size={24} /> : <UserIcon size={24} />}
                                </div>
                                <h4 className="font-bold text-gray-800 mb-1">סוג חשבון</h4>
                                <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${user.role === 'admin' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                                    {user.role === 'admin' ? 'מנהל מערכת (Admin)' : 'סטודנט (User)'}
                                </div>
                                <p className="text-xs text-gray-500 mt-3">
                                    {user.role === 'admin' 
                                        ? 'יש לך גישה מלאה לניהול תכנים, הוספת קורסים ועריכת משתמשים.'
                                        : 'חשבון סטודנט מאפשר צפייה בתכנים, הורדת קבצים וניהול מועדפים.'}
                                </p>
                            </div>
                            
                            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                                <h4 className="font-bold text-gray-800 mb-4 text-sm">סטטיסטיקה</h4>
                                <ul className="space-y-3 text-sm text-gray-600">
                                    <li className="flex justify-between">
                                        <span>קורסים במועדפים:</span>
                                        <span className="font-bold">{favorites.courses?.length || 0}</span>
                                    </li>
                                    {/* <li className="flex justify-between">
                                        <span>קבצים במועדפים:</span>
                                        <span className="font-bold">{favorites.files?.length || 0}</span>
                                    </li> */}
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default User;