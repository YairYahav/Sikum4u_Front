import React, { useState, useEffect } from 'react';
import { courseAPI } from '../services/courseApi';
import { userAPI } from '../services/userApi'; // נניח שיש כזה או שתשתמש בלוגיקה קיימת
import CourseCard from '../components/Course/CourseCard';
import { Search } from 'lucide-react';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [userFavorites, setUserFavorites] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [coursesRes, userRes] = await Promise.all([
                    courseAPI.getAllCourses(),
                    // ניסיון להביא מועדפים אם המשתמש מחובר (אופציונלי)
                    localStorage.getItem('token') ? userAPI.getMe().catch(() => ({ data: { favorites: [] } })) : Promise.resolve({ data: { favorites: [] } })
                ]);
                
                setCourses(coursesRes.data);
                setFilteredCourses(coursesRes.data);
                setUserFavorites(userRes.data?.favorites || []);
            } catch (err) {
                console.error("Error fetching courses:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const results = courses.filter(course =>
            course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCourses(results);
    }, [searchTerm, courses]);

    // פונקציה לטיפול בסימון מועדף
    const handleToggleFavorite = async (courseId) => {
        if (!localStorage.getItem('token')) {
            alert("עליך להתחבר כדי לשמור מועדפים");
            return;
        }
        
        try {
            // כאן צריך להיות קריאה לשרת לעדכון מועדפים
            // await userAPI.toggleFavorite(courseId); 
            
            // עדכון לוקאלי זמני
            setUserFavorites(prev => 
                prev.includes(courseId) 
                ? prev.filter(id => id !== courseId) 
                : [...prev, courseId]
            );
        } catch (error) {
            console.error("Failed to toggle favorite", error);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto py-8 space-y-8">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-gray-800">כל הקורסים</h1>
                <p className="text-gray-500 max-w-2xl mx-auto">
                    חפש ומצא את כל הקורסים הקיימים במערכת. לחץ על קורס כדי לצפות בסיכומים ובחומרים.
                </p>
            </div>

            {/* חיפוש */}
            <div className="max-w-md mx-auto relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                    <Search size={20} />
                </div>
                <input
                    type="text"
                    className="block w-full pr-10 pl-4 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                    placeholder="חפש קורס לפי שם..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* רשימת הקורסים */}
            {filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map(course => (
                        <CourseCard 
                            key={course._id} 
                            course={course} 
                            isFavorite={userFavorites.includes(course._id)}
                            onToggleFavorite={handleToggleFavorite}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
                    <p className="text-gray-500 text-lg">לא נמצאו קורסים התואמים לחיפוש שלך.</p>
                </div>
            )}
        </div>
    );
};

export default Courses;