import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { courseAPI } from '../services/courseApi';
import CourseCard from '../components/Course/CourseCard';
import { userAPI } from '../services/userApi';
import { Loader2, AlertCircle, Search, BookOpen } from 'lucide-react';

import AddCourseCard from '../components/AddCourse/AddCourseCard';
import CreateCourseStatusModal from '../components/AddCourse/CourseForm';
import CourseForm from '../components/AddCourse/CourseForm';

const Courses = ({ user }) => {
  const [courses, setCourses] = useState([]); 
  const [filteredCourses, setFilteredCourses] = useState([]); 
  const [searchTerm, setSearchTerm] = useState(''); 
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);

  const isAdmin = user?.role === 'admin';
  
  const fetchData = useCallback(async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await courseAPI.getAllCourses();
        let extractedCourses = [];

        if (Array.isArray(response)) {
            extractedCourses = response;
        } else if (response.data && Array.isArray(response.data)) {
            extractedCourses = response.data; 
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
            extractedCourses = response.data.data; 
        } else if (response.data && Array.isArray(response.data.courses)) {
            extractedCourses = response.data.courses;
        }

        if (!Array.isArray(extractedCourses)) {
            throw new Error("המידע שהתקבל אינו תקין (לא מערך)");
        }

        setCourses(extractedCourses);
        setFilteredCourses(extractedCourses);

        if (user) {
          try {
            const favRes = await userAPI.getFavorites();
            const rawFavs = favRes.data?.courses || favRes.data || [];
            const favIds = Array.isArray(rawFavs) ? rawFavs.map(c => c._id || c) : [];
            setFavorites(favIds);
          } catch (err) {
            console.warn("Failed to load favorites", err);
          }
        }

      } catch (err) {
        console.error("Error loading courses:", err);
        setError("לא הצלחנו לטעון את הקורסים");
      } finally {
        setLoading(false);
      }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredCourses(courses);
    } else {
      const lowerTerm = searchTerm.toLowerCase();
      const filtered = courses.filter(course => 
        (course.title || "").toLowerCase().includes(lowerTerm)
      );
      setFilteredCourses(filtered);
    }
  }, [searchTerm, courses]);

  const handleToggleFavorite = async (courseId) => {
      if (!user) return alert("עליך להתחבר כדי להוסיף למועדפים");
      
      const isFav = favorites.includes(courseId);
      setFavorites(prev => isFav ? prev.filter(id => id !== courseId) : [...prev, courseId]);

      try {
          await userAPI.updateFavorites(courseId, 'Course', isFav ? 'remove' : 'add');
      } catch (err) {
          setFavorites(prev => isFav ? [...prev, courseId] : prev.filter(id => id !== courseId));
      }
  };

  const handleCourseCreated = () => {
      setIsAddCourseOpen(false);
      fetchData();
  };

  const handleError = (msg) => {
      alert(msg || "אירעה שגיאה ביצירת הקורס");
  };

  if (loading) return (
    <div className="flex justify-center items-center h-[60vh]">
      <Loader2 className="animate-spin text-indigo-600 h-12 w-12" />
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center text-gray-800">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h2 className="text-xl font-bold">{error}</h2>
        <button onClick={() => window.location.reload()} className="mt-4 text-indigo-600 underline">
            נסה לרענן שוב
        </button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <BookOpen className="text-indigo-600" />
                כל הקורסים
            </h1>
            <p className="text-gray-500 mt-1">מצא את הסיכומים שאתה צריך בקלות</p>
          </div>

          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
                type="text"
                className="block w-full pr-10 pl-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none shadow-sm text-gray-800 placeholder-gray-400"
                placeholder="חפש קורס..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
      </div>

      {(filteredCourses.length > 0 || isAdmin) ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          
          {/* 1. קודם כל מציגים את הקורסים */}
          {filteredCourses.map((course) => (
            <Link 
                key={course._id} 
                to={`/courses/course/${course._id}`} 
                className="block h-full no-underline"
            >
              <CourseCard 
                course={course}
                isFavorite={favorites.includes(course._id)}
                onToggleFavorite={handleToggleFavorite}
              />
            </Link>
          ))}

          {/* 2. ורק בסוף מציגים את כפתור ההוספה (אם אדמין) */}
          {isAdmin && (
              <AddCourseCard onClick={() => setIsAddCourseOpen(true)} />
          )}

        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <Search size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">לא נמצאו קורסים התואמים לחיפוש</h3>
            <button 
                onClick={() => setSearchTerm('')}
                className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
            >
                נקה חיפוש והצג הכל
            </button>
        </div>
      )}

      {isAddCourseOpen && (
        <CourseForm 
            show={isAddCourseOpen}
            handleClose={() => setIsAddCourseOpen(false)}
            onSuccess={handleCourseCreated}
            onError={handleError}
        />
      )}

    </div>
  );
};

export default Courses;