import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/authApi';
import { contactAPI } from '../services/contactApi'; 
import { Mail, User, Send, Lock, MessageSquare, Phone, MapPin } from 'lucide-react'; // הוספתי אייקונים חסרים

const ContactUs = ({ user }) => {
    const navigate = useNavigate();
    
    // ניהול מצבי טעינה והצלחה
    const [loading, setLoading] = useState(true); // לטעינת המשתמש הראשונית
    const [sending, setSending] = useState(false); // לשליחת הטופס
    const [success, setSuccess] = useState(false); // להצגת מסך תודה
    const [isAnonymous, setIsAnonymous] = useState(false); // למצב אנונימי

    // נתוני הטופס
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '' // חייב להיות message כמו ב-Schema בשרת
    });

    // בדיקת התחברות ועדכון הטופס בטעינה
    useEffect(() => {
        const initUser = async () => {
            try {
                // אם המשתמש כבר הועבר כ-prop (כמו ב-App.jsx שלך), נשתמש בו
                if (user) {
                    setFormData(prev => ({
                        ...prev,
                        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
                        email: user.email || ''
                    }));
                } else {
                    // ניסיון שליפה ידני (למקרה שה-prop לא עבר או בריענון)
                    const token = localStorage.getItem('token');
                    if (token) {
                        try {
                            const res = await authAPI.getMe();
                            const userData = res.data?.user || res.data || res.user || res;
                            
                            if (userData && userData.email) {
                                setFormData(prev => ({
                                    ...prev,
                                    name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
                                    email: userData.email || ''
                                }));
                            }
                        } catch (err) {
                            console.log("Silent auth check failed:", err);
                        }
                    }
                }
            } finally {
                setLoading(false);
            }
        };

        initUser();
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // ולידציה בסיסית
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            alert("נא למלא את כל השדות");
            return;
        }

        setSending(true);
        try {
            await contactAPI.sendMessage(formData);
            setSuccess(true);
        } catch (error) {
            console.error("Failed to send message", error);
            // אם השרת מחזיר שגיאה, נציג אותה למשתמש
            const msg = error.response?.data?.error || "אירעה שגיאה בשליחת ההודעה";
            alert(msg);
        } finally {
            setSending(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">טוען...</div>;

    // --- תצוגת הצלחה ---
    if (success) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-4">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6 animate-in zoom-in">
                    <Send size={32} />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">ההודעה נשלחה!</h2>
                <p className="text-gray-600 mb-8">תודה שפנית אלינו, נשתדל לחזור אליך בהקדם.</p>
                <button onClick={() => navigate('/')} className="text-indigo-600 font-bold hover:underline">
                    חזור לדף הבית
                </button>
            </div>
        );
    }

    // --- מצב 1: משתמש לא מחובר וגם לא בחר אנונימי (Auth Wall) ---
    if (!user && !isAnonymous) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
                <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                    
                    <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mx-auto mb-6">
                        <Lock size={32} />
                    </div>
                    
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">רוצה ליצור איתנו קשר?</h2>
                    <p className="text-gray-500 mb-8">על מנת לשלוח הודעה ולעקוב אחר הפנייה, מומלץ להתחבר למערכת.</p>
                    
                    <div className="space-y-3 mb-8">
                        <Link to="/login" className="block w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
                            התחברות
                        </Link>
                        <Link to="/register" className="block w-full py-3 bg-white text-indigo-600 border-2 border-indigo-100 rounded-xl font-bold hover:bg-indigo-50 transition-all">
                            צור משתמש חדש
                        </Link>
                    </div>

                    <div className="border-t border-gray-100 pt-4">
                        <button 
                            onClick={() => setIsAnonymous(true)}
                            className="text-sm text-gray-400 hover:text-gray-600 font-medium flex items-center justify-center gap-1 mx-auto transition-colors"
                        >
                            <User size={14} />
                            שלח הודעה באופן אנונימי
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // --- מצב 2: טופס השליחה (מחובר או אנונימי) ---
    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col md:flex-row">
                
                {/* צד ימין - מידע ועיצוב */}
                <div className="md:w-1/3 bg-gradient-to-br from-indigo-600 to-purple-700 p-8 text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-40 h-40 bg-white opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full translate-x-1/2 translate-y-1/2"></div>
                    
                    <div>
                        <h2 className="text-3xl font-bold mb-4">צור קשר</h2>
                        <p className="text-indigo-100 leading-relaxed">
                            יש לך שאלה? הצעה לשיפור? או סתם רוצה לומר תודה?
                            <br />
                            אנחנו כאן בשבילך. מלא את הטופס ונחזור אליך בהקדם.
                        </p>
                    </div>
                    
                    <div className="mt-8 space-y-4">
                        <div className="flex items-center gap-3 text-indigo-100">
                            <Mail size={20} />
                            <span>yairyahav5@gmail.com</span>
                        </div>
                        <div className="flex items-center gap-3 text-indigo-100">
                            <Phone size={20} />
                            <span>054-7000903</span>
                        </div>
                        <div className="flex items-center gap-3 text-indigo-100">
                            <MapPin size={20} />
                            <span>ישראל</span>
                        </div>
                        <div className="flex items-center gap-3 text-indigo-100">
                            <MessageSquare size={20} />
                            <span>מענה בהקדם האפשרי</span>
                        </div>
                    </div>
                </div>

                {/* צד שמאל - הטופס */}
                <div className="md:w-2/3 p-8 md:p-12">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        {user?.firstName ? `היי ${user.firstName}, איך אפשר לעזור?` : 'שלח לנו הודעה'}
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">שם מלא</label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 pl-10 ${user ? 'text-gray-500 cursor-not-allowed bg-gray-100' : ''}`}
                                        placeholder="ישראל ישראלי"
                                        disabled={!!user} 
                                        required
                                    />
                                    <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">אימייל</label>
                                <div className="relative">
                                    <input 
                                        type="email" 
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 pl-10 ${user ? 'text-gray-500 cursor-not-allowed bg-gray-100' : ''}`}
                                        placeholder="your@email.com"
                                        dir="ltr"
                                        disabled={!!user} 
                                        required
                                    />
                                    <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">נושא הפנייה</label>
                            <input 
                                type="text" 
                                value={formData.subject}
                                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="בנוגע לקורס..."
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">תוכן ההודעה</label>
                            <textarea 
                                value={formData.message}
                                onChange={(e) => setFormData({...formData, message: e.target.value})}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 h-32 resize-none"
                                placeholder="כתוב כאן את ההודעה שלך..."
                                required
                            ></textarea>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            {/* כפתור חזרה למצב אנונימי (אם לא מחובר) */}
                            {!user && isAnonymous && (
                                <button 
                                    type="button" 
                                    onClick={() => setIsAnonymous(false)}
                                    className="text-gray-400 hover:text-indigo-600 text-sm font-medium"
                                >
                                    חזור להתחברות
                                </button>
                            )}
                            
                            <button 
                                type="submit" 
                                disabled={sending}
                                className={`flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all ${(!user && isAnonymous) ? 'mr-auto' : 'w-full justify-center'}`}
                            >
                                {sending ? 'שולח...' : (
                                    <>
                                        <Send size={18} />
                                        שלח הודעה
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;