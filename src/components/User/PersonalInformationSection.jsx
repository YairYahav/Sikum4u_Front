import React, { useState, useEffect } from 'react';
import ReadOnlyField from './ReadOnlyField';
import EditableField from './EditableField';
import { userAPI } from '../../services/userApi';
import { Pencil, X, Check, Save } from 'lucide-react'; // וודא שהתקנת את lucide-react

const PersonalInformationSection = ({ user, onUserUpdate, setMessage }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                username: user.username || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setLoading(true);
        if (setMessage) setMessage(null);
        
        try {
            const promises = [];
            
            if (formData.firstName !== user.firstName) promises.push(userAPI.updateFirstName(formData.firstName));
            if (formData.lastName !== user.lastName) promises.push(userAPI.updateLastName(formData.lastName));
            if (formData.username !== user.username) promises.push(userAPI.updateUsername(formData.username));

            if (promises.length > 0) {
                await Promise.all(promises);
                if (setMessage) setMessage({ type: 'success', text: 'הפרטים עודכנו בהצלחה!' });
                onUserUpdate(); 
                setIsEditing(false);
            } else {
                setIsEditing(false); // לא היו שינויים
            }
        } catch (err) {
            const errorMsg = err.response?.data?.error || err.message || 'שגיאה בעדכון פרטים';
            if (setMessage) setMessage({ type: 'danger', text: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        // שחזור הנתונים המקוריים
        setFormData({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            username: user.username || ''
        });
    };

    return (
        <div className="relative">
            {/* כפתור עריכה / ביטול - ממוקם בפינה */}
            <div className="absolute top-0 left-0 pl-4 pt-2">
                {!isEditing ? (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-1 text-gray-400 hover:text-indigo-600 transition-colors px-3 py-1 rounded-full hover:bg-indigo-50 font-medium text-sm"
                    >
                        <Pencil size={14} /> ערוך פרטים
                    </button>
                ) : (
                    <button 
                        onClick={handleCancel}
                        className="flex items-center gap-1 text-gray-400 hover:text-red-500 transition-colors px-3 py-1 rounded-full hover:bg-red-50 font-medium text-sm"
                    >
                        <X size={16} /> ביטול
                    </button>
                )}
            </div>

            {/* תוכן הטופס */}
            <div className="pt-8 px-2">
                {!isEditing ? (
                    <div className="space-y-1">
                        <ReadOnlyField label="שם פרטי" value={user?.firstName} />
                        <ReadOnlyField label="שם משפחה" value={user?.lastName} />
                        <ReadOnlyField label="שם משתמש" value={user?.username} />
                        <ReadOnlyField label="אימייל" value={user?.email} />
                    </div>
                ) : (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                        <EditableField label="שם פרטי" name="firstName" value={formData.firstName} onChange={handleChange} />
                        <EditableField label="שם משפחה" name="lastName" value={formData.lastName} onChange={handleChange} />
                        <EditableField label="שם משתמש" name="username" value={formData.username} onChange={handleChange} />
                        
                        {/* כפתור שמירה בולט */}
                        <div className="mt-6 flex justify-end">
                            <button 
                                onClick={handleSave} 
                                disabled={loading}
                                className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    'שמור'
                                ) : (
                                    <>
                                        <Save size={18} /> שמור שינויים
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PersonalInformationSection;