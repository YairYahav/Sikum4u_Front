import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../../services/authApi"; // ייבוא ישיר של ה-API
import { User, Mail, Lock, FileText, UserCircle, AlertCircle } from 'lucide-react';

export default function Register() {
    const navigate = useNavigate();
    
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const validateForm = () => {
        if (!firstName || !lastName || !username || !email || !password || !confirmPassword) {
            setError("נא למלא את כל השדות");
            return false;
        }
        if (password !== confirmPassword) {
            setError("הסיסמאות אינן תואמות");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setIsLoading(true);
        setError("");

        try {
            const userData = { firstName, lastName, username, email, password };
            
            // שימוש ב-authAPI שיבאנו למעלה
            const data = await authAPI.register(userData);
            
            if (data && data.token) {
                localStorage.setItem('token', data.token);
                // רענון כדי ש-App.jsx יזהה את הטוקן החדש ויעדכן את ה-Header
                window.location.href = '/'; 
            } else {
                navigate('/login');
            }
            
        } catch (err) {
            console.error("Registration failed:", err);
            const serverMsg = err.response?.data?.message || err.response?.data?.error || "ההרשמה נכשלה";
            setError(serverMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh] py-12 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 space-y-6">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">יצירת חשבון</h2>
                    <p className="text-gray-500 mt-2">הצטרף לקהילת הסיכומים שלנו</p>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100 text-right flex items-start gap-2">
                        <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 text-right" dir="rtl">
                    <div className="flex gap-4">
                        <div className="w-1/2">
                            <label className="text-sm font-medium text-gray-700">שם פרטי</label>
                            <input type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" placeholder="First name" />
                        </div>
                        <div className="w-1/2">
                            <label className="text-sm font-medium text-gray-700">שם משפחה</label>
                            <input type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" placeholder="Last Name" />
                        </div>
                    </div>
                    
                    <div>
                        <label className="text-sm font-medium text-gray-700">שם משתמש (באנגלית)</label>
                        <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-left" dir="ltr" placeholder="Username123" />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">אימייל</label>
                        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-left" dir="ltr" placeholder="mail@example.com" />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">סיסמה</label>
                        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-left" dir="ltr" placeholder="••••••••" />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">אימות סיסמה</label>
                        <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-left" dir="ltr" placeholder="••••••••" />
                    </div>

                    <button type="submit" disabled={isLoading} className="w-full py-3 px-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-all mt-4">
                        {isLoading ? 'יוצר משתמש...' : 'הירשם'}
                    </button>
                </form>

                <div className="text-center mt-4">
                    <Link to="/login" className="text-indigo-600 font-bold hover:underline">כבר רשום? התחבר כאן</Link>
                </div>
            </div>
        </div>
    );
}