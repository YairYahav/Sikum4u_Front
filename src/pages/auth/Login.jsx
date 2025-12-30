import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../../services/authApi";
import { AlertCircle } from 'lucide-react';

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        
        try {
            const data = await authAPI.login(email, password);
            
            if (data && data.token) {
                localStorage.setItem('token', data.token);
                window.location.href = '/'; 
            }
        } catch (err) {
            console.error("Login failed:", err);
            setError(err.response?.data?.message || "ההתחברות נכשלה, נא לבדוק את הפרטים");
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 space-y-6">
                <h2 className="text-3xl font-bold text-center text-gray-900">התחברות</h2>
                
                {error && (
                    <div className="p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100 text-right flex gap-2">
                        <AlertCircle size={18} /> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 text-right">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">אימייל</label>
                        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-left" dir="ltr" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">סיסמה</label>
                        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-left" dir="ltr" />
                    </div>
                    <button type="submit" disabled={isLoading} className="w-full py-3 px-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-all">
                        {isLoading ? 'מתחבר...' : 'התחבר'}
                    </button>
                </form>
                <div className="text-center mt-4">
                    <Link to="/register" className="text-indigo-600 font-bold hover:underline">אין לך חשבון? הירשם כאן</Link>
                </div>
            </div>
        </div>
    );
}