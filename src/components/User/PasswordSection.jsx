import React, { useState } from 'react';
import EditableField from './EditableField';
import { userAPI } from '../../services/userApi';

const PasswordSection = ({ setMessage }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [passData, setPassData] = useState({ currentPassword: '', newPassword: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setPassData({ ...passData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setLoading(true);
        setMessage(null);
        try {
            await userAPI.updatePassword(passData.currentPassword, passData.newPassword);
            setMessage({ type: 'success', text: 'הסיסמה שונתה בהצלחה!' });
            setPassData({ currentPassword: '', newPassword: '' });
            setIsOpen(false);
        } catch (err) {
            setMessage({ type: 'danger', text: err.response?.data?.error || 'שגיאה בשינוי הסיסמה' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card mb-4 shadow-sm">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0 text-secondary">אבטחה וסיסמה</h5>
                <button 
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? 'סגור' : 'שנה סיסמה'}
                </button>
            </div>
            {isOpen && (
                <div className="card-body">
                    <EditableField 
                        label="סיסמה נוכחית" 
                        name="currentPassword" 
                        type="password" 
                        value={passData.currentPassword} 
                        onChange={handleChange} 
                    />
                    <EditableField 
                        label="סיסמה חדשה" 
                        name="newPassword" 
                        type="password" 
                        value={passData.newPassword} 
                        onChange={handleChange} 
                    />
                    <div className="text-muted small mb-3 me-3">
                        * הסיסמה חייבת להכיל לפחות 8 תווים, אות ומספר.
                    </div>
                    <div className="d-flex justify-content-end">
                        <button className="btn btn-warning" onClick={handleSave} disabled={loading}>
                            {loading ? 'מעדכן...' : 'עדכן סיסמה'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PasswordSection;