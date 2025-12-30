import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Folder, FileText, Star, ExternalLink, ArrowLeft, Users, GraduationCap } from 'lucide-react';
import api from '../services/api';

const Home = () => {
  const [links, setLinks] = useState([]);
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. שליפת קישורים
        const linksRes = await api.get('/important-links');
        if (linksRes.data && linksRes.data.data) {
            setLinks(linksRes.data.data);
        }

        // 2. שליפת קורסים וסינון המומלצים
        const coursesRes = await api.get('/courses');
        // הנחה: השרת מחזיר מערך של קורסים, ולכל קורס יש שדה isFeatured
        const allCourses = coursesRes.data || [];
        const featured = allCourses.filter(course => course.isFeatured);
        setFeaturedCourses(featured);

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
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-3xl shadow-xl overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center p-8 md:p-12 gap-12">
          
          <div className="lg:w-1/2 space-y-6 text-center lg:text-right z-10">
            <h1 className="text-3xl md:text-5xl font-bold leading-tight">
              הסיכומים שלך,<br />
              <span className="text-indigo-200">במקום אחד.</span>
            </h1>
            <p className="text-lg text-indigo-100 max-w-lg mx-auto lg:mx-0">
              הפלטפורמה המרכזית לניהול חומרי לימוד. גישה מהירה ונוחה לכל הקורסים והקבצים שלך.
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
                    <p className="text-indigo-100 text-sm">סידור היררכי נוח של כל התיקיות והקבצים.</p>
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
                    <p className="text-indigo-100 text-sm">קהילה שיתופית להעלאה והורדה של חומרים.</p>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Courses Section - החדש! */}
      <section>
          <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 border-r-4 border-yellow-500 pr-3">
                  קורסים מומלצים
              </h2>
          </div>

          {loading ? (
              <div className="text-center py-10 text-gray-400">טוען המלצות...</div>
          ) : featuredCourses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredCourses.map((course) => (
                      <Link 
                          key={course._id}
                          to={`/course/${course._id}`}
                          className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-100 transition-all overflow-hidden flex flex-col"
                      >
                          <div className="h-32 bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
                              <GraduationCap size={48} className="text-gray-400 group-hover:text-indigo-500 transition-colors" />
                          </div>
                          <div className="p-5 flex-1 flex flex-col">
                              <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
                                  {course.title}
                              </h3>
                              <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                                  {course.description || 'אין תיאור זמין לקורס זה.'}
                              </p>
                              <div className="flex items-center text-indigo-600 text-sm font-bold mt-auto">
                                  <span>למעבר לקורס</span>
                                  <ArrowLeft size={16} className="mr-2 transform group-hover:-translate-x-1 transition-transform" />
                              </div>
                          </div>
                      </Link>
                  ))}
              </div>
          ) : (
              <div className="bg-gray-50 rounded-2xl p-6 text-center border border-dashed border-gray-200">
                  <p className="text-gray-500 text-sm">כרגע אין קורסים שסומנו כמומלצים.</p>
              </div>
          )}
      </section>

      {/* Important Links Section */}
      <section>
          <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 border-r-4 border-indigo-500 pr-3">
                  קישורים שימושיים
              </h2>
          </div>

          {loading ? (
              <div className="text-center py-10 text-gray-400">טוען קישורים...</div>
          ) : links.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {links.map((link) => (
                      <a 
                          key={link._id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-100 transition-all flex flex-col h-full"
                      >
                          <div className="flex items-start justify-between mb-3">
                              <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                  <ExternalLink size={18} />
                              </div>
                              <ArrowLeft size={16} className="text-gray-300 group-hover:text-indigo-500 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                          </div>
                          <h3 className="font-bold text-gray-800 mb-1 group-hover:text-indigo-700 transition-colors truncate">
                              {link.title}
                          </h3>
                          <p className="text-xs text-gray-500 break-words line-clamp-1" dir="ltr">
                              {link.url}
                          </p>
                      </a>
                  ))}
              </div>
          ) : (
              <div className="bg-gray-50 rounded-2xl p-6 text-center border border-dashed border-gray-200">
                  <p className="text-gray-500 text-sm">עדיין לא הוגדרו קישורים שימושיים במערכת.</p>
              </div>
          )}
      </section>

    </div>
  );
};

export default Home;