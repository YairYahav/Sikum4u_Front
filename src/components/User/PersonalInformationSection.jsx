import React, { useState, useEffect } from 'react';
import ReadOnlyField from './ReadOnlyField';
import EditableField from './EditableField';
import { userAPI } from '../../services/userApi';

const PersonalInformationSection = ({ user, onUserUpdate, setMessage }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);

    // עדכון הטופס כשהמשתמש משתנה
    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setLoading(true);
        setMessage(null);
        
        try {
            const promises = [];
            
            if (formData.firstName !== user.firstName) promises.push(userAPI.updateFirstName(formData.firstName));
            if (formData.lastName !== user.lastName) promises.push(userAPI.updateLastName(formData.lastName));
            if (formData.username !== user.username) promises.push(userAPI.updateUsername(formData.username));

            if (promises.length > 0) {
                await Promise.all(promises);
                setMessage({ type: 'success', text: 'הפרטים עודכנו בהצלחה!' });
                onUserUpdate(); // רענון המידע למעלה
            }
            setIsEditing(false);
        } catch (err) {
            setMessage({ type: 'danger', text: err.response?.data?.error || 'שגיאה בעדכון פרטים' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card mb-4 shadow-sm">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0 text-primary">פרטים אישיים</h5>
                <button 
                    className={`btn btn-sm ${isEditing ? 'btn-outline-danger' : 'btn-outline-primary'}`}
                    onClick={() => {
                        setIsEditing(!isEditing);
                        // איפוס הטופס בביטול
                        if (isEditing) setFormData({
                            firstName: user.firstName,
                            lastName: user.lastName,
                            username: user.username
                        });
                    }}
                >
                    {isEditing ? 'ביטול עריכה' : 'עריכת פרטים'}
                </button>
            </div>
            <div className="card-body">
                {!isEditing ? (
                    <>
                        <ReadOnlyField label="שם פרטי" value={user?.firstName} />
                        <ReadOnlyField label="שם משפחה" value={user?.lastName} />
                        <ReadOnlyField label="שם משתמש" value={user?.username} />
                        <ReadOnlyField label="אימייל" value={user?.email} />
                    </>
                ) : (
                    <>
                        <EditableField label="שם פרטי" name="firstName" value={formData.firstName} onChange={handleChange} />
                        <EditableField label="שם משפחה" name="lastName" value={formData.lastName} onChange={handleChange} />
                        <EditableField label="שם משתמש" name="username" value={formData.username} onChange={handleChange} />
                        <div className="d-flex justify-content-end mt-3">
                            <button className="btn btn-success" onClick={handleSave} disabled={loading}>
                                {loading ? 'שומר...' : 'שמור שינויים'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PersonalInformationSection;