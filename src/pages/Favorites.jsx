import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userAPI } from '../services/userApi'; 
import CourseCard from '../components/Course/CourseCard';
import { Heart, FileText, AlertCircle } from 'lucide-react';

const Favorites = () => {
  const [courses, setCourses] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const response = await userAPI.getFavorites();
        
        // השרת מחזיר: { success: true, data: { courses: [...], files: [...] } }
        // userAPI מחזיר את ה-response.data, ולכן הגישה היא כזו:
        if (response && response.data) {
            setCourses(response.data.courses || []);
            setFiles(response.data.files || []);
        }
      } catch (err) {
        console.error("Failed to load favorites", err);
        setError("לא הצלחנו לטעון את המועדפים שלך");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  // פונקציה להסרה ממועדפים (אם לוחצים על הלב בתוך עמוד המועדפים)
  const handleRemoveFavorite = async (courseId) => {
      try {
          // עדכון אופטימי - הסרה מיידית מהמסך
          setCourses(prev => prev.filter(c => c._id !== courseId));
          
          // שליחה לשרת
          await userAPI.updateFavorites(courseId, 'Course', 'remove');
      } catch (error) {
          console.error("Error removing favorite", error);
          // במקרה שגיאה אפשר לטעון מחדש את הדף או להציג הודעה
      }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );

  if (error) return (
    <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900">{error}</h3>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
        <Heart className="text-red-500 fill-red-500" /> המועדפים שלי
      </h1>

      {/* אזור הקורסים */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-gray-700 mb-4 border-r-4 border-indigo-500 pr-3">
            קורסים ({courses.length})
        </h2>
        
        {courses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map(course => (
                <Link 
                    key={course._id} 
                    to={`/courses/course/${course._id}`} 
                    className="block h-full no-underline"
                >
                <CourseCard 
                    course={course}
                    isFavorite={true} // בדף הזה כולם מועדפים
                    onToggleFavorite={handleRemoveFavorite} // לחיצה תסיר את הקורס מהרשימה
                />
                </Link>
            ))}
            </div>
        ) : (
            <div className="bg-gray-50 rounded-xl p-8 text-center border border-dashed border-gray-300">
                <p className="text-gray-500">עדיין אין לך קורסים במועדפים.</p>
                <Link to="/courses" className="text-indigo-600 font-medium hover:underline mt-2 inline-block">
                    עבור לכל הקורסים והוסף למועדפים
                </Link>
            </div>
        )}
      </div>

      {/* אזור הקבצים (הכנה לעתיד, אם תרצה להציג גם קבצים) */}
      {files.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-700 mb-4 border-r-4 border-blue-500 pr-3">
                קבצים ({files.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {files.map(file => (
                    <div key={file._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center gap-3">
                        <div className="bg-blue-50 p-2 rounded text-blue-600">
                            <FileText size={20} />
                        </div>
                        <span className="font-medium text-gray-700">{file.name}</span>
                    </div>
                ))}
            </div>
          </div>
      )}
    </div>
  );
};

export default Favorites;