import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseAPI } from '../services/courseApi';
import { ArrowLeft, BookOpen, Star, ExternalLink } from 'lucide-react';

const Home = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    // רשימת קישורים מעודכנת - רק דברים רלוונטיים לסיכומים
    const [importantLinks] = useState([
        { 
            id: 1, 
            title: 'כניסה למודל (Moodle)', 
            url: 'https://moodle.jct.ac.il',
            color: 'from-orange-400 to-orange-600',
            icon: 'moodle'
        },
        // אפשר להוסיף כאן קישורים ידנית, להוסיף אח"כ באתר אפשרות גם דרך האתר לאדמין
    ]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                // מביא את כל הקורסים ומסנן לפי Featured או מציג את כולם
                const res = await courseAPI.getAllCourses(); 
                const featured = res.data.filter(c => c.isFeatured);
                // אם אין מומלצים, מציג את ה-5 הראשונים
                setCourses(featured.length > 0 ? featured : res.data.slice(0, 5));
            } catch (err) {
                console.error("Failed to fetch courses", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    // קומפוננטה לכרטיס קורס
    const CourseCard = ({ course }) => (
        <div className="flex-shrink-0 w-72 h-48 bg-white rounded-xl shadow-md border border-gray-100 p-5 flex flex-col justify-between hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 mx-2">
            <div>
                <div className="flex justify-between items-start mb-2">
                    <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                        <BookOpen size={20} />
                    </div>
                    {course.averageRating > 0 && (
                        <div className="flex items-center text-amber-400 text-sm font-bold">
                            <Star size={14} fill="currentColor" className="mr-1" />
                            {course.averageRating}
                        </div>
                    )}
                </div>
                <h3 className="font-bold text-lg text-gray-800 line-clamp-1">{course.name}</h3>
                <p className="text-gray-500 text-sm mt-1 line-clamp-2">{course.description || "אין תיאור לקורס זה"}</p>
            </div>
            <Link to={`/course/${course._id}`} className="flex items-center text-indigo-600 font-medium text-sm hover:text-indigo-800 mt-3">
                צפה בסיכומים <ArrowLeft size={16} className="mr-1" />
            </Link>
        </div>
    );

    // קומפוננטה לכרטיס קישור
    const LinkCard = ({ link }) => (
        <a 
            href={link.url} 
            target="_blank"
            rel="noreferrer"
            className={`flex-shrink-0 w-64 h-32 rounded-xl shadow-md p-6 flex flex-col justify-center items-center text-white bg-gradient-to-br ${link.color} hover:shadow-lg transition-all transform hover:scale-105 mx-2 cursor-pointer decoration-0`}
        >
            <ExternalLink size={24} className="mb-3 opacity-80" />
            <h3 className="font-bold text-xl text-center">{link.title}</h3>
        </a>
    );

    if (loading) return (
        <div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    return (
        <div className="space-y-12 pb-12">
            {/* Hero Section */}
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 text-center relative overflow-hidden">
                <div className="relative z-10 max-w-2xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                        הסיכומים שלך במקום אחד
                    </h1>
                    <p className="text-gray-600 text-lg mb-8">
                        ברוכים הבאים למאגר הסיכומים השיתופי. כאן תוכלו למצוא סיכומים, מבחנים וחומרי עזר לכל הקורסים בתואר.
                    </p>
                </div>
                {/* אלמנטים עיצוביים ברקע */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-50 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>
            </div>

            {/* רשימת קורסים מומלצים - גלילה אופקית */}
            <section>
                <div className="flex justify-between items-center mb-6 px-2">
                    <h2 className="text-2xl font-bold text-gray-800 border-r-4 border-indigo-500 pr-3">קורסים מומלצים</h2>
                </div>
                
                {courses.length > 0 ? (
                    <div className="flex overflow-x-auto pb-8 -mx-2 px-2 scrollbar-hide snap-x">
                        {courses.map(course => (
                            <CourseCard key={course._id} course={course} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-500">עדיין לא הועלו קורסים למערכת</p>
                    </div>
                )}
            </section>

            {/* רשימת קישורים חשובים - גלילה אופקית */}
            <section>
                <div className="flex justify-between items-center mb-6 px-2">
                    <h2 className="text-2xl font-bold text-gray-800 border-r-4 border-orange-500 pr-3">קישורים שימושיים</h2>
                </div>
                
                <div className="flex overflow-x-auto pb-6 -mx-2 px-2 scrollbar-hide snap-x">
                    {importantLinks.map(link => (
                        <LinkCard key={link.id} link={link} />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;