import React, { useState } from 'react';
import { Camera, X, Check, User } from 'lucide-react';
import { userAPI } from '../../services/userApi';

const ProfilePictureSection = ({ user, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!imageUrl.trim()) return;
        
        setLoading(true);
        try {
            await userAPI.updateProfilePicture(imageUrl);
            onUpdate("תמונת הפרופיל עודכנה בהצלחה!");
            setIsEditing(false);
            setImageUrl('');
        } catch (error) {
            console.error("Failed to update picture", error);
            alert("שגיאה בעדכון התמונה");
        } finally {
            setLoading(false);
        }
    };

    // בדיקה אם יש תמונה, אם לא - נציג עיגול עם אות ראשונה
    const hasImage = user?.profilePicture && user.profilePicture.length > 0;

    return (
        <div className="relative flex flex-col items-center mb-8">
            <div className="relative group">
                {/* מעגל התמונה או האייקון */}
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    {hasImage ? (
                        <img 
                            src={user.profilePicture} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-5xl font-bold text-white uppercase">
                            {user?.firstName?.charAt(0) || <User size={48} />}
                        </span>
                    )}
                </div>

                {/* כפתור עריכה קטן בצד */}
                <button 
                    onClick={() => setIsEditing(true)}
                    className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2.5 rounded-full shadow-md hover:bg-indigo-700 transition-all hover:scale-110"
                    title="שנה תמונת פרופיל"
                >
                    <Camera size={18} />
                </button>
            </div>

            <h2 className="mt-4 text-2xl font-bold text-gray-800">
                {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-gray-500 text-sm">@{user?.username}</p>

            {/* חלונית צפה (Modal) להזנת URL */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
                        <button 
                            onClick={() => setIsEditing(false)}
                            className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">עדכון תמונת פרופיל</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 text-right">קישור לתמונה (URL)</label>
                                <input 
                                    type="url" 
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    placeholder="https://example.com/my-photo.jpg"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-left"
                                    dir="ltr"
                                    autoFocus
                                />
                                <p className="text-xs text-gray-500 mt-2 text-right">הדבק כאן קישור ישיר לתמונה מהאינטרנט</p>
                            </div>

                            {imageUrl && (
                                <div className="flex justify-center my-4">
                                    <img src={imageUrl} alt="Preview" className="w-20 h-20 rounded-full object-cover border-2 border-indigo-100" />
                                </div>
                            )}

                            <button 
                                onClick={handleSave}
                                disabled={loading || !imageUrl}
                                className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'שומר...' : (
                                    <>
                                        <Check size={18} /> שמור תמונה
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePictureSection;