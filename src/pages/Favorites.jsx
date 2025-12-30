import React, { useState, useEffect } from 'react';
import { courseAPI } from '../services/courseApi';
import { authAPI } from '../services/authApi';
import CourseCard from '../components/Course/CourseCard';
import { Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                // שלב 1: מביאים את פרטי המשתמש העדכניים כדי לקבל את ה-IDs של המועדפים
                const userRes = await authAPI.getMe();
                const favoriteIds = userRes.data.favorites || [];

                if (favoriteIds.length > 0) {
                    // שלב 2: מביאים את כל הקורסים (או endpoint שמביא ספציפית לפי IDs אם יש)
                    const coursesRes = await courseAPI.getAllCourses();
                    // מסננים רק את המועדפים
                    const favCourses = coursesRes.data.filter(c => favoriteIds.includes(c._id));
                    setFavorites(favCourses);
                }
            } catch (err) {
                console.error("Error fetching favorites:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, []);

    const handleRemoveFavorite = (courseId) => {
        // כאן יש להוסיף לוגיקה למחיקה מהשרת
        setFavorites(prev => prev.filter(c => c._id !== courseId));
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto py-8 space-y-8">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-5">
                <div className="p-3 bg-red-50 text-red-500 rounded-full">
                    <Heart size={24} fill="currentColor" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">המועדפים שלי</h1>
                    <p className="text-gray-500">קורסים ששמרת לגישה מהירה</p>
                </div>
            </div>

            {favorites.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {favorites.map(course => (
                        <CourseCard 
                            key={course._id} 
                            course={course} 
                            isFavorite={true}
                            onToggleFavorite={handleRemoveFavorite}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                    <div className="inline-block p-4 bg-gray-50 rounded-full mb-4">
                        <Heart size={40} className="text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">אין לך עדיין מועדפים</h3>
                    <p className="text-gray-500 mb-6">סמן קורסים בלב כדי לראות אותם כאן.</p>
                    <Link to="/courses" className="inline-flex items-center gap-2 text-indigo-600 font-medium hover:underline">
                        עבור לכל הקורסים <ArrowRight size={16} />
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Favorites;