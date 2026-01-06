import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Folder, Star, Users } from 'lucide-react';
import api from '../services/api';

// ייבוא הקומפוננטות החדשות
import LinksSection from '../components/Home/LinksSection';
import FeaturedSection from '../components/Home/FeaturedSection';

const Home = ({ user }) => {
  const [links, setLinks] = useState([]);
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. שליפת קורסים (השרת כבר מחזיר אותם ממויינים אם עדכנת את הקונטרולר)
        // אם הוספת את הנתיב הייעודי למומלצים ב-API, עדיף להשתמש בו.
        // אם לא, נשתמש ב-getAllCourses ונסנן (אבל אז המיון תלוי בלקוח)
        // לצורך הפשטות נשתמש בלוגיקה הקודמת אבל עדיף להשתמש ב-featured endpoint אם יצרת אותו
        
        const coursesRes = await api.get('/courses/featured'); // נתיב ייעודי שממיין לפי סדר
        // גיבוי למקרה שהנתיב לא קיים עדיין - נשתמש בנתיב הרגיל
        const rawData = coursesRes.data;
        let allFeatured = [];
        
        if (Array.isArray(rawData)) allFeatured = rawData;
        else if (rawData && Array.isArray(rawData.data)) allFeatured = rawData.data;
        
        // אם הנתיב החדש נכשל או החזיר ריק, ננסה לשלוף הכל ולסנן ידנית (Fallback)
        if (allFeatured.length === 0) {
             const allRes = await api.get('/courses');
             let all = [];
             if (allRes.data && Array.isArray(allRes.data.data)) all = allRes.data.data;
             // סינון ידני (אבל בלי מיון מותאם אישית מהשרת)
             allFeatured = all.filter(c => c.isFeatured);
        }

        setFeaturedCourses(allFeatured);

        // 2. שליפת קישורים
        const linksRes = await api.get('/important-links');
        if (linksRes.data && linksRes.data.data) {
            setLinks(linksRes.data.data);
        }

      } catch (err) {
        console.error("Failed to fetch home data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen py-8 px-4 max-w-7xl mx-auto space-y-12">
      
      {/* Hero Section (ללא שינוי) */}
      <section className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-3xl shadow-xl overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center p-8 md:p-12 gap-12">
          
          <div className="lg:w-1/2 space-y-6 text-center lg:text-right z-10">
            <h1 className="text-3xl md:text-5xl font-bold leading-tight">
              הסיכומים שלך,<br />
              <span className="text-indigo-200">במקום אחד.</span>
            </h1>
            <p className="text-lg text-indigo-100 max-w-lg mx-auto lg:mx-0">
              כל הקורסים, הקבצים והסיכומים מסודרים בדיוק איך שאתה צריך
            </p>
            
            <div className="flex flex-row gap-4 justify-center lg:justify-start pt-2">
              <Link to="/courses" className="px-6 py-2.5 bg-white text-indigo-600 rounded-xl font-bold shadow-md hover:bg-indigo-50 transition-all flex items-center gap-2 text-sm md:text-base">
                <BookOpen size={18} />
                לקורסים
              </Link>
              <Link to="/register" className="px-6 py-2.5 bg-indigo-500/30 border border-indigo-400/50 text-white rounded-xl font-bold hover:bg-indigo-500/50 transition-all text-sm md:text-base">
                הצטרף
              </Link>
            </div>
          </div>
          
          {/* Features */}
          <div className="lg:w-1/2 w-full flex flex-col gap-4">
            <div className="flex items-center gap-4 bg-white/10 border border-white/10 p-4 rounded-2xl backdrop-blur-sm hover:bg-white/20 transition-colors cursor-default">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                    <Folder size={24} className="text-white" />
                </div>
                <div>
                    <h3 className="font-bold text-lg">ארגון חכם</h3>
                    <p className="text-indigo-100 text-sm">תיקיות מסודרות לכל קורס, בלי שתצטרך לחפש שעות</p>
                </div>
            </div>

            <div className="flex items-center gap-4 bg-white/10 border border-white/10 p-4 rounded-2xl backdrop-blur-sm hover:bg-white/20 transition-colors cursor-default">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                    <Star size={24} className="text-white" />
                </div>
                <div>
                    <h3 className="font-bold text-lg">מועדפים</h3>
                    <p className="text-indigo-100 text-sm">גישה מהירה לסיכומים החשובים לך ביותר.</p>
                </div>
            </div>

            <div className="flex items-center gap-4 bg-white/10 border border-white/10 p-4 rounded-2xl backdrop-blur-sm hover:bg-white/20 transition-colors cursor-default">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                    <Users size={24} className="text-white" />
                </div>
                <div>
                    <h3 className="font-bold text-lg">שיתוף ידע</h3>
                    <p className="text-indigo-100 text-sm">אני מעלה סיכומים לטובת הכלל</p>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Courses Section - החדש! */}
      {/* החלפנו את הקוד הישן בקומפוננטה החכמה החדשה */}
      <FeaturedSection 
         initialCourses={featuredCourses}
         user={user}
         onCoursesChange={setFeaturedCourses}
      />

      {/* Important Links Section */}
      <LinksSection 
        initialLinks={links} 
        user={user} 
        onLinksChange={setLinks}
      />

    </div>
  );
};

export default Home;