import React from 'react';
import { Link } from 'react-router-dom';

const UserFavorites = ({ favorites }) => {
    return (
        <div className="row">
            {/* קורסים מועדפים */}
            <div className="col-md-6 mb-3">
                <div className="card h-100 shadow-sm border-0">
                    <div className="card-header bg-info text-white bg-gradient">
                        <h5 className="mb-0 fs-6">
                            ⭐ קורסים מועדפים
                        </h5>
                    </div>
                    <ul className="list-group list-group-flush">
                        {favorites?.courses && favorites.courses.length > 0 ? (
                            favorites.courses.map(course => (
                                <Link 
                                    key={course._id} 
                                    to={`/course/${course._id}`} 
                                    className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                                >
                                    <span>{course.name || 'קורס ללא שם'}</span>
                                    <span className="badge bg-light text-dark">
                                        מעבר <i className="bi bi-arrow-left-short"></i>
                                    </span>
                                </Link>
                            ))
                        ) : (
                            <li className="list-group-item text-muted text-center py-3">
                                <small>עדיין לא הוספת קורסים למועדפים</small>
                            </li>
                        )}
                    </ul>
                </div>
            </div>

            {/* קבצים מועדפים */}
            <div className="col-md-6 mb-3">
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
            </div>
        </div>
    );
};

export default UserFavorites;