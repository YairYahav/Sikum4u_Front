import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { courseAPI } from '../services/courseApi'; 
import { userAPI } from '../services/userApi'; 
import { Folder, FileText, AlertCircle } from 'lucide-react';

import Breadcrumbs from '../components/Common/Breadcrumbs'; 
import CourseSidebar from '../components/Course/CourseSidebar';
import AddFolderCard from '../components/AddFolder/AddFolderCard';
import FolderForm from '../components/AddFolder/FolderForm'; 

const Course = ({ user }) => {
  const { id } = useParams();
  
  const [course, setCourse] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false); 
  const [loading, setLoading] = useState(true);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [error, setError] = useState(null);

  const fetchCourseAndFavorites = async () => {
      try {
        setLoading(true);
        const courseRes = await courseAPI.getCourseById(id);
        const courseData = courseRes.data || courseRes;
        setCourse(courseData);

        if (user) {
            try {
                const favRes = await userAPI.getFavorites();
                const favCourses = favRes.data.courses || [];
                const isFav = favCourses.some(c => (c._id || c) === id);
                setIsFavorite(isFav);
            } catch (err) {
                console.error("Error fetching favorites", err);
            }
        }

      } catch (err) {
        console.error("Error fetching data:", err);
        setError("לא ניתן לטעון את הקורס");
      } finally {
        setLoading(false);
      }
  };

  useEffect(() => {
    fetchCourseAndFavorites();
  }, [id, user]);

  const handleToggleFavorite = async () => {
      if (!user) return alert("יש להתחבר כדי להוסיף למועדפים");

      try {
          const action = isFavorite ? 'remove' : 'add';
          setIsFavorite(!isFavorite);
          await userAPI.updateFavorites(id, 'Course', action);
      } catch (error) {
          console.error("Failed to update favorite", error);
          setIsFavorite(!isFavorite); 
      }
  };

  const handleFolderAdded = () => {
      fetchCourseAndFavorites(); 
      setShowFolderModal(false);
  };

  const handleCourseUpdate = (updatedCourse) => {
      setCourse(updatedCourse);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );

  if (error || !course) return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
        <AlertCircle size={48} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">{error || "קורס לא נמצא"}</h2>
        <Link to="/courses" className="mt-4 text-indigo-600 hover:underline">חזרה לקורסים</Link>
    </div>
  );

  const isAdmin = user?.role === 'admin';

  return (
    <div className="container mx-auto px-4 py-6 min-h-[calc(100vh-80px)]"> 
      
      <Breadcrumbs items={[
          { label: 'כל הקורסים', link: '/courses' },
          { label: course.title }
      ]} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        <div className="lg:col-span-1">
            <CourseSidebar 
                course={course} 
                isAdmin={isAdmin} 
                onUpdate={handleCourseUpdate}
                isFavorite={isFavorite}
                onToggleFavorite={handleToggleFavorite}
                user={user}
            />
        </div>

        <div className="lg:col-span-2 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overflow-hidden">
             
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 border-r-4 border-indigo-500 pr-3">
                    תכני הקורס
                </h3>
            </div>

            <div className="flex-grow overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {course.children && course.children.length > 0 && (
                        // התיקון: הוספנו index לפרמטרים
                        course.children.map((item, index) => {
                            const isFolder = item.type === 'folder' || item.type === 'Folder';
                            
                            const itemLink = isFolder 
                                ? `/courses/course/${course._id}/folder/${item._id}`
                                : `/courses/course/${course._id}/file/${item._id}`;

                            return (
                                <Link 
                                  // התיקון: שימוש ב-ID או באינדקס כגיבוי
                                  key={item._id || index} 
                                  to={itemLink}
                                  className="group flex items-center p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all"
                                >
                                    <div className={`p-3 rounded-lg ml-4 ${
                                        isFolder ? 'bg-amber-50 text-amber-500' : 'bg-blue-50 text-blue-500'
                                    }`}>
                                        {isFolder ? <Folder size={24} /> : <FileText size={24} />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-gray-800 truncate group-hover:text-indigo-600 transition-colors">
                                            {item.name}
                                        </h4>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {isFolder ? 'תיקייה' : 'קובץ'}
                                        </p>
                                    </div>
                                </Link>
                            );
                        })
                    )}

                    {isAdmin && (
                        <AddFolderCard onClick={() => setShowFolderModal(true)} />
                    )}

                    {(!course.children || course.children.length === 0) && !isAdmin && (
                        <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">
                            <Folder size={48} className="mb-2 opacity-20" />
                            <p>עדיין לא הועלו תכנים לקורס זה</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>

      {showFolderModal && (
          <FolderForm 
              show={showFolderModal} 
              handleClose={() => setShowFolderModal(false)}
              parentId={course._id}
              parentType="Course"
              onSuccess={handleFolderAdded}
          />
      )}

    </div>
  );
};

export default Course;