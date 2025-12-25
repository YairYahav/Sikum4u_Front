import React from 'react';
import FeaturedCourse from './FeaturedCourse';

const FeaturedCarousel = ({ courses }) => {
    return (
        <div className="position-relative">
            {/* מיכל הגלילה */}
            <div 
                className="d-flex overflow-auto py-3 px-1 gap-4"
                style={{ 
                    scrollBehavior: 'smooth', 
                    scrollbarWidth: 'thin', // לפיירפוקס
                    whiteSpace: 'nowrap'
                }}
            >
                {courses.map(course => (
                    <FeaturedCourse key={course._id} course={course} />
                ))}
            </div>
            
            {/* אפקט דהייה בצד שמאל */}
            <div 
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: '50px',
                    background: 'linear-gradient(to right, rgba(255,255,255,0.9), transparent)',
                    pointerEvents: 'none'
                }}
            />
        </div>
    );
};

export default FeaturedCarousel;