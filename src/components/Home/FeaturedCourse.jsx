import React from 'react';
import { Link } from 'react-router-dom';

const FeaturedCourse = ({ course }) => {
    return (
        <div className="card h-100 shadow-sm border-0" style={{ minWidth: '280px', maxWidth: '300px' }}>

            <div className="card-header bg-warning h-100 p-1"></div>
            
            <div className="card-body d-flex flex-column">
                <h5 className="card-title text-primary fw-bold text-truncate" title={course.name}>
                    {course.name}
                </h5>
                <p className="card-text text-muted small flex-grow-1" style={{ minHeight: '3em' }}>
                    {course.description 
                        ? (course.description.length > 60 ? course.description.substring(0, 60) + '...' : course.description)
                        : 'ללא תיאור זמין לקורס זה.'}
                </p>
                
                <div className="d-flex justify-content-between align-items-center mt-3">
                    <span className="badge bg-light text-dark border">
                        {course.children?.length || 0} תיקיות
                    </span>
                    <Link to={`/course/${course._id}`} className="btn btn-outline-primary btn-sm rounded-pill px-3">
                        צפייה בקורס
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default FeaturedCourse;