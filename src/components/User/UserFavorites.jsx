import React from 'react';
import CourseCard from '../Course/CourseCard';
import { Link } from 'react-router-dom';

const UserFavorites = ({ favorites }) => {

    if (!favorites || (!favorites.courses?.length && !favorites.files?.length)) {
        return (
            <div className="text-center py-10">
                <p className="text-gray-500">עדיין אין לך פריטים מועדפים</p>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            {/* קורסים מועדפים */}
            {favorites.courses?.length > 0 && (
                <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <span className="bg-indigo-100 text-indigo-600 p-2 rounded-lg text-sm">
                            {favorites.courses.length}
                        </span>
                        קורסים שאהבתי
                    </h3>
                    
                    {/* שינינו כאן ל-2 עמודות במקום 3 (הסרנו את lg:grid-cols-3) כדי שהקורסים יהיו רחבים יותר ולא "מעוכים" */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {favorites.courses.map((course) => (
                            <Link 
                                key={course._id} 
                                to={`/courses/course/${course._id}`} 
                                className="block h-full no-underline"
                            >
                                <CourseCard 
                                    course={course} 
                                    isAdmin={false} 
                                />
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* קבצים מועדפים */}
            {/* <div className="col-md-6 mb-3">
                <div className="card h-100 shadow-sm border-0">
                    <div className="card-header bg-success text-white bg-gradient">
                        <h5 className="mb-0 fs-6">
                            📄 קבצים מועדפים
                        </h5>
                    </div>
                    <ul className="list-group list-group-flush">
                        {favorites?.files && favorites.files.length > 0 ? (
                            favorites.files.map(file => (
                                <Link 
                                    key={file._id} 
                                    to={`/file/${file._id}`} 
                                    className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                                >
                                    <span>{file.name || 'קובץ ללא שם'}</span>
                                    <span className="badge bg-light text-dark">
                                        צפייה
                                    </span>
                                </Link>
                            ))
                        ) : (
                            <li className="list-group-item text-muted text-center py-3">
                                <small>עדיין לא הוספת קבצים למועדפים</small>
                            </li>
                        )}
                    </ul>
                </div>
            </div> */}
        </div>
    );
};

export default UserFavorites;