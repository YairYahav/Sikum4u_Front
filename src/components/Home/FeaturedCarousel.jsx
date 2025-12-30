import React, { useState, useEffect, useRef } from 'react';
import CourseCard from '../Course/CourseCard'; 
import './FeaturedCarousel.css'; 

const FeaturedCarousel = ({ items, onItemClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  
  const cardWidth = 300;
  const gap = 24; 
  const itemsPerView = 3; 
  
  const maxIndex = Math.max(0, items.length - itemsPerView);

  useEffect(() => {
    setCanScrollLeft(currentIndex > 0);
    setCanScrollRight(currentIndex < maxIndex);
  }, [currentIndex, maxIndex]);

  const scrollLeft = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const scrollRight = () => {
    if (currentIndex < maxIndex) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="carousel-container">
      {/* כפתור שמאלה */}
      {canScrollLeft && (
        <button onClick={scrollLeft} className="carousel-btn prev" aria-label="Previous">
          <i className="bi bi-chevron-left"></i> {/* שימוש ב-Bootstrap Icons */}
        </button>
      )}

      {/* כפתור ימינה */}
      {canScrollRight && (
        <button onClick={scrollRight} className="carousel-btn next" aria-label="Next">
          <i className="bi bi-chevron-right"></i>
        </button>
      )}

      {/* המסלול שזז */}
      <div className="carousel-track-container">
        <div 
          className="carousel-track"
          style={{
            transform: `translateX(-${currentIndex * (cardWidth + gap)}px)`
          }}
        >
          {items.map((course) => (
            <div key={course._id} className="carousel-item-wrapper" onClick={() => onItemClick(course._id)}>
              <CourseCard 
                course={course} 
              />
            </div>
          ))}
        </div>
      </div>

      {items.length > itemsPerView && (
        <div className="carousel-indicators">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`indicator-dot ${index === currentIndex ? 'active' : ''}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FeaturedCarousel;