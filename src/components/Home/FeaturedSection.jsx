import React, { useEffect, useState } from 'react';
import { courseAPI } from '../../services/courseApi';
import LoadingSection from './LoadingSection';
import EmptyFeaturedState from './EmptyFeaturedState';
import FeaturedCarousel from './FeaturedCarousel';

const FeaturedSection = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                // קריאה ל-API שהגדרת ב-courseApi.js
                const res = await courseAPI.getFeaturedCourses();
                // ה-API מחזיר אובייקט עם { data: [...] } או מערך ישירות, תלוי במימוש. 
                // ב-Controller שלך זה res.json({ ..., data: courses })
                setCourses(res.data || []); 
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch featured courses:", err);
                setError('לא ניתן לטעון קורסים מומלצים כרגע.');
                setLoading(false);
            }
        };

        fetchFeatured();
    }, []);

    if (loading) return <LoadingSection />;
    
    if (error) {
        return <div className="alert alert-warning text-center">{error}</div>;
    }

    return (
        <section className="my-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="border-end border-5 border-primary pe-3">קורסים מומלצים 🔥</h2>
            </div>
            
            {courses.length > 0 ? (
                <FeaturedCarousel courses={courses} />
            ) : (
                <EmptyFeaturedState />
            )}
        </section>
    );
};

export default FeaturedSection;