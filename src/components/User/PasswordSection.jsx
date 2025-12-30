import React, { useState } from 'react';
import { userAPI } from '../../services/userApi';
import { Lock, Key, Save, X } from 'lucide-react';
import EditableField from './EditableField'; // משתמשים באותו שדה שיצרנו קודם

const PasswordSection = ({ setMessage }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
            setMessage({ type: 'danger', text: 'נא למלא את כל השדות' });
            return;
        }

        if (passwords.newPassword !== passwords.confirmPassword) {
            setMessage({ type: 'danger', text: 'הסיסמאות החדשות אינן תואמות' });
            return;
        }

        if (passwords.newPassword.length < 6) {
            setMessage({ type: 'danger', text: 'הסיסמה החדשה חייבת להכיל לפחות 6 תווים' });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            await userAPI.updatePassword(passwords.currentPassword, passwords.newPassword);
            setMessage({ type: 'success', text: 'הסיסמה עודכנה בהצלחה!' });
            setIsEditing(false);
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            const errorMsg = err.response?.data?.error || err.message || 'שגיאה בעדכון הסיסמה';
            setMessage({ type: 'danger', text: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setMessage(null);
    };

    return (
        <div className="relative pt-8 px-2">
            {/* כפתור עריכה / ביטול - בפינה */}
            <div className="absolute top-0 left-0 pl-4 pt-2">
                {!isEditing ? (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-1 text-gray-400 hover:text-indigo-600 transition-colors px-3 py-1 rounded-full hover:bg-indigo-50 font-medium text-sm"
                    >
                        <Key size={14} /> שנה סיסמה
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

            {/* תוכן: מצב תצוגה רגיל */}
            {!isEditing ? (
                <div className="flex items-center gap-3 py-4 text-gray-500">
                    <div className="bg-gray-100 p-2 rounded-full">
                        <Lock size={20} className="text-gray-400" />
                    </div>
                    <span>הסיסמה מוסתרת מטעמי אבטחה</span>
                </div>
            ) : (
                // תוכן: מצב עריכה
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <EditableField 
                        label="סיסמה נוכחית" 
                        name="currentPassword" 
                        type="password" 
                        value={passwords.currentPassword} 
                        onChange={handleChange} 
                    />
                    <EditableField 
                        label="סיסמה חדשה" 
                        name="newPassword" 
                        type="password" 
                        value={passwords.newPassword} 
                        onChange={handleChange} 
                    />
                    <EditableField 
                        label="אימות סיסמה" 
                        name="confirmPassword" 
                        type="password" 
                        value={passwords.confirmPassword} 
                        onChange={handleChange} 
                    />

                    {/* כפתור שמירה גדול ובולט */}
                    <div className="mt-6 flex justify-end">
                        <button 
                            onClick={handleSave} 
                            disabled={loading}
                            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'מעדכן...' : (
                                <>
                                    <Save size={18} /> שמור סיסמה
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PasswordSection;