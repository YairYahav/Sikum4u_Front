import React, { useEffect, useState } from 'react';
import { courseAPI } from '../services/courseApi';
import { ChevronRight, ChevronLeft, BookOpen, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
    const [featuredCourses, setFeaturedCourses] = useState([]);
    const [allCourses, setAllCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const [featuredRes, allRes] = await Promise.all([
                    courseAPI.getFeaturedCourses(),
                    courseAPI.getAllCourses()
                ]);
                setFeaturedCourses(featuredRes.data || []);
                setAllCourses(allRes.data || []);
            } catch (err) {
                setError('שגיאה בטעינת הקורסים. נסה שוב מאוחר יותר.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const scrollCarousel = (direction) => {
        const container = document.getElementById('featured-container');
        const scrollAmount = 300;
        container.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
    };

    if (loading) return <div className="flex-center" style={{ minHeight: '60vh' }}>טוען תוכן...</div>;
    if (error) return <div className="flex-center" style={{ color: 'var(--accent-color)' }}>{error}</div>;

    return (
        <div className="home-page">
            <header className="hero" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
                <h1 style={{ marginBottom: '0.5rem' }}>Sikum4U</h1>
                <p style={{ fontSize: '1.2rem', opacity: 0.8 }}>הבית של הסטודנטים לסיכומים וחומרי עזר</p>
            </header>

            {featuredCourses.length > 0 && (
                <section className="featured-section" style={{ margin: '3rem 0' }}>
                    <h2 style={{ marginBottom: '1.5rem', textAlign: 'right' }}>קורסים מומלצים</h2>
                    <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                        <button onClick={() => scrollCarousel('right')} style={{ position: 'absolute', right: '-20px', zIndex: 5, borderRadius: '50%', padding: '10px' }}>
                            <ChevronRight />
                        </button>
                        
                        <div id="featured-container" style={{ display: 'flex', overflowX: 'hidden', gap: '20px', padding: '10px', width: '100%' }}>
                            {featuredCourses.map(course => (
                                <Link to={`/course/${course._id}`} key={course._id} className="card" style={{ minWidth: '280px', textDecoration: 'none', textAlign: 'center' }}>
                                    <BookOpen size={48} style={{ color: 'var(--primary-color)', marginBottom: '1rem' }} />
                                    <h3>{course.name}</h3>
                                    <p style={{ fontSize: '0.9rem' }}>{course.description || 'אין תיאור זמין'}</p>
                                </Link>
                            ))}
                        </div>

                        <button onClick={() => scrollCarousel('left')} style={{ position: 'absolute', left: '-20px', zIndex: 5, borderRadius: '50%', padding: '10px' }}>
                            <ChevronLeft />
                        </button>
                    </div>
                </section>
            )}

            <section className="all-courses" style={{ margin: '3rem 0' }}>
                <h2 style={{ marginBottom: '1.5rem', textAlign: 'right' }}>כל הקורסים</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                    {allCourses.map(course => (
                        <Link to={`/course/${course._id}`} key={course._id} className="card" style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <GraduationCap size={32} />
                            <div>
                                <h4 style={{ margin: 0 }}>{course.name}</h4>
                                <small style={{ opacity: 0.7 }}>קוד קורס: {course.code}</small>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;