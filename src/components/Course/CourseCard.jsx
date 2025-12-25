import React from 'react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
    return (
        <div className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm hover-effect">
                {/* פס צבעוני עליון */}
                <div className="bg-primary" style={{ height: '6px' }}></div>
                
                <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="card-title fw-bold text-primary mb-0">{course.name}</h5>
                        {course.averageRating > 0 && (
                            <span className="badge bg-warning text-dark">
                                <i className="bi bi-star-fill me-1"></i>{course.averageRating}
                            </span>
                        )}
                    </div>

                    <p className="card-text text-muted small flex-grow-1">
                        {course.description 
                            ? (course.description.length > 80 ? course.description.substring(0, 80) + '...' : course.description)
                            : 'אין תיאור זמין.'}
                    </p>

                    <div className="mt-3 pt-3 border-top d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                            <i className="bi bi-folder me-1"></i>
                            {course.folders?.length || 0} תיקיות
                        </small>
                        <Link to={`/course/${course._id}`} className="btn btn-sm btn-outline-primary rounded-pill px-3">
                            כניסה לקורס
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;