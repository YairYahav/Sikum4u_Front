import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseAPI } from '../services/courseApi';
import { userAPI } from '../services/userApi'; 
import CourseCard from '../components/Course/CourseCard';
import CourseForm from '../components/AddCourse/CourseForm';
import AddCourseCard from '../components/AddCourse/AddCourseCard';

const Courses = ({ user }) => {
  const [courses, setCourses] = useState([]);
  const [favoriteCourseIds, setFavoriteCourseIds] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. קבלת קורסים
        const coursesRes = await courseAPI.getAllCourses();
        if (coursesRes && coursesRes.data) setCourses(coursesRes.data);
        else setCourses([]);

        // 2. קבלת מועדפים (אם מחובר)
        if (user) {
            try {
                const favRes = await userAPI.getFavorites();
                // השרת החדש מחזיר מבנה: { data: { courses: [...], files: [...] } }
                // אנחנו צריכים את המערך של הקורסים
                const favCourses = favRes.data.courses || [];
                // המרה ל-IDs בלבד כדי שיהיה קל לבדוק
                const ids = favCourses.map(c => c._id || c);
                setFavoriteCourseIds(ids);
            } catch (err) {
                console.error("Failed to load favorites", err);
            }
        }
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleToggleFavorite = async (courseId) => {
      try {
          const isCurrentlyFavorite = favoriteCourseIds.includes(courseId);
          const action = isCurrentlyFavorite ? 'remove' : 'add';

          // 1. עדכון אופטימי במסך (מיידי)
          if (action === 'remove') {
              setFavoriteCourseIds(prev => prev.filter(id => id !== courseId));
          } else {
              setFavoriteCourseIds(prev => [...prev, courseId]);
          }

          // 2. שליחה לשרת עם הפורמט החדש
          await userAPI.updateFavorites(courseId, 'Course', action);
          
      } catch (error) {
          console.error("Error updating favorite", error);
      }
  };

  const handleCourseAdded = (newCourse) => {
    let courseToAdd = newCourse.data || newCourse;
    setCourses(prev => [...prev, courseToAdd]);
    setShowAddModal(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h2 className="text-3xl font-bold text-gray-800">כל הקורסים</h2>
            <p className="text-gray-500 mt-1">מצא את הסיכומים שאתה צריך בקלות</p>
        </div>
      </div>

      <CourseForm 
        show={showAddModal} 
        handleClose={() => setShowAddModal(false)} 
        onSuccess={handleCourseAdded}
        onError={(msg) => alert(msg)}
      />

      {loading ? (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map(course => (
            <Link 
                key={course._id} 
                to={`/courses/course/${course._id}`} 
                className="block h-full no-underline"
            >
              <CourseCard 
                course={course}
                isFavorite={favoriteCourseIds.includes(course._id)}
                onToggleFavorite={user ? handleToggleFavorite : null}
              />
            </Link>
          ))}

          {user?.role === 'admin' && (
            <div className="h-full">
                <AddCourseCard onClick={() => setShowAddModal(true)} />
            </div>
          )}
          
          {courses.length === 0 && user?.role !== 'admin' && (
             <div className="col-span-full text-center py-12 text-gray-400">
                <p className="text-xl">לא נמצאו קורסים במערכת.</p>
             </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Courses;