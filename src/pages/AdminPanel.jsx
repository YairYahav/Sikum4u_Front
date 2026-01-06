import React, { useState, useEffect } from 'react';
import { contactAPI } from '../services/contactApi';
import { 
    Mail, Trash2, Reply, Search, Inbox, 
    CheckCircle, Clock, AlertCircle, RefreshCw, X 
} from 'lucide-react';

const AdminPanel = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all'); // 'all', 'new', 'read'

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const res = await contactAPI.getAllMessages();
            setMessages(res.data.data || []);
            setError(null);
        } catch (err) {
            console.error("Error fetching messages:", err);
            setError("שגיאה בטעינת ההודעות");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("האם למחוק את ההודעה לצמיתות?")) {
            try {
                await contactAPI.deleteMessage(id);
                setMessages(prev => prev.filter(msg => msg._id !== id));
            } catch (err) {
                alert("שגיאה במחיקת ההודעה");
            }
        }
    };

    // --- הפונקציה המעודכנת לפתיחת Gmail ---
    const handleReply = (msg) => {
        // 1. עדכון סטטוס ל"נקרא" בשרת
        if (msg.status === 'new') {
            contactAPI.markAsRead(msg._id).catch(console.error);
            setMessages(prev => prev.map(m => m._id === msg._id ? { ...m, status: 'read' } : m));
        }
        
        // 2. הכנת הנושא והתוכן
        const subject = `Re: ${msg.subject}`;
        const body = `\n\n--------------------------------\nבהמשך לפנייתך בתאריך ${new Date(msg.createdAt).toLocaleDateString()}:\n"${msg.message}"`;
        
        // 3. יצירת קישור ישיר ל-Gmail (Web)
        // view=cm -> Compose Mode (מצב כתיבה)
        // fs=1 -> Full Screen
        // to -> הנמען
        // su -> נושא
        // body -> תוכן ההודעה
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${msg.email}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        // פתיחה בטאב חדש
        window.open(gmailUrl, '_blank');
    };
    // ---------------------------------------

    const stats = {
        total: messages.length,
        new: messages.filter(m => m.status === 'new').length,
        read: messages.filter(m => m.status !== 'new').length
    };

    const filteredMessages = messages.filter(msg => {
        const matchesSearch = 
            msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            msg.subject.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesFilter = filter === 'all' || msg.status === filter;
        
        return matchesSearch && matchesFilter;
    });

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('he-IL', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* כותרת ורענון */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">תיבת פניות</h1>
                        <p className="text-gray-500">ניהול פניות מהאתר ("צור קשר")</p>
                    </div>
                    <button 
                        onClick={fetchMessages} 
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm text-gray-700"
                    >
                        <RefreshCw size={18} />
                        רענן נתונים
                    </button>
                </div>

                {/* כרטיסי סטטיסטיקה */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm mb-1">סה"כ הודעות</p>
                            <h3 className="text-3xl font-bold text-gray-900">{stats.total}</h3>
                        </div>
                        <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
                            <Inbox size={24} />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm mb-1">הודעות חדשות</p>
                            <h3 className="text-3xl font-bold text-indigo-600">{stats.new}</h3>
                        </div>
                        <div className="p-4 bg-indigo-50 text-indigo-600 rounded-xl">
                            <AlertCircle size={24} />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm mb-1">טופלו / נקראו</p>
                            <h3 className="text-3xl font-bold text-green-600">{stats.read}</h3>
                        </div>
                        <div className="p-4 bg-green-50 text-green-600 rounded-xl">
                            <CheckCircle size={24} />
                        </div>
                    </div>
                </div>

                {/* סרגל כלים - חיפוש וסינון */}
                <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <div className="relative flex-1">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input 
                            type="text"
                            placeholder="חפש לפי שם, מייל או נושא..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pr-10 pl-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-xl transition-colors font-medium text-sm ${filter === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            הכל
                        </button>
                        <button 
                            onClick={() => setFilter('new')}
                            className={`px-4 py-2 rounded-xl transition-colors font-medium text-sm ${filter === 'new' ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'}`}
                        >
                            חדש ({stats.new})
                        </button>
                    </div>
                </div>

                {/* רשימת ההודעות */}
                <div className="space-y-4">
                    {filteredMessages.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200">
                            <Mail size={48} className="mx-auto text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">אין הודעות להצגה</h3>
                            <p className="text-gray-500">נסה לשנות את הסינון או החיפוש</p>
                        </div>
                    ) : (
                        filteredMessages.map((msg) => (
                            <div 
                                key={msg._id} 
                                className={`bg-white rounded-2xl p-6 shadow-sm border transition-all hover:shadow-md ${
                                    msg.status === 'new' ? 'border-l-4 border-l-indigo-500 border-y-gray-100 border-r-gray-100' : 'border-gray-100 opacity-90'
                                }`}
                            >
                                <div className="flex flex-col md:flex-row justify-between gap-6">
                                    {/* פרטי השולח וההודעה */}
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${msg.status === 'new' ? 'bg-indigo-500 animate-pulse' : 'bg-gray-300'}`} />
                                            <h3 className="font-bold text-lg text-gray-900">{msg.subject}</h3>
                                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full flex items-center gap-1">
                                                <Clock size={12} />
                                                {formatDate(msg.createdAt)}
                                            </span>
                                        </div>
                                        
                                        <div className="text-sm text-gray-500 flex flex-col sm:flex-row gap-1 sm:gap-4">
                                            <span className="font-medium text-gray-700">{msg.name}</span>
                                            <span className="hidden sm:inline">•</span>
                                            <span className="text-indigo-600 font-mono bg-indigo-50 px-2 rounded">{msg.email}</span>
                                        </div>

                                        <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl text-sm border border-gray-100 whitespace-pre-wrap">
                                            {msg.message}
                                        </p>
                                    </div>

                                    {/* כפתורי פעולה */}
                                    <div className="flex md:flex-col gap-3 justify-start md:justify-center border-t md:border-t-0 md:border-r border-gray-100 pt-4 md:pt-0 md:pr-6 min-w-[140px]">
                                        <button 
                                            onClick={() => handleReply(msg)}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
                                        >
                                            <Reply size={18} />
                                            השב ב-Gmail
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(msg._id)}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-red-500 hover:bg-red-50 hover:border-red-200 rounded-xl transition-colors"
                                        >
                                            <Trash2 size={18} />
                                            מחק
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

            </div>
        </div>
    );
};

export default AdminPanel;