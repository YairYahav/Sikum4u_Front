import React, { useState, useEffect } from 'react';
import FeaturedCarousel from '../components/Home/FeaturedCarousel';
import { Link } from 'react-router-dom';
import axios from '../services/api'; 
import '../index.css'; 

const Home = () => {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [importantLinks, setImportantLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesRes = await axios.get('/courses?featured=true');
        const linksRes = await axios.get('/important-links');
        
        setFeaturedCourses(coursesRes.data);
        setImportantLinks(linksRes.data);
      } catch (error) {
        console.error("Error fetching home data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="loading-spinner">Loading...</div>;

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <h1>Welcome to Sikum4u</h1>
        <p>כל הסיכומים, במקום אחד.</p>
      </section>

      {/* Featured Courses - Horizontal Scroll */}

        <section className="my-5">
        <div className="d-flex justify-content-between align-items-center mb-4 px-3">
            <h2 className="h3 mb-0">קורסים מומלצים</h2>
            <Link to="/courses" className="text-decoration-none">הצג הכל</Link>
        </div>
        
        {/* שימוש בקרוסלה החדשה */}
        {loading ? (
            <div className="text-center">Loading...</div>
        ) : (
            <FeaturedCarousel 
            items={featuredCourses} 
            onItemClick={(id) => navigate(`/course/${id}`)} 
            />
        )}
        </section>

      {/* Important Links - Horizontal Scroll */}
      <section className="scroll-section alt-bg">
        <h2>קישורים חשובים 🔗</h2>
        <div className="horizontal-scroll-container">
          {importantLinks.length > 0 ? importantLinks.map((link) => (
            <a href={link.url} target="_blank" rel="noopener noreferrer" key={link._id} className="card link-card">
              <div className="link-icon">🌐</div>
              <h3>{link.title}</h3>
            </a>
          )) : <p className="empty-msg">אין קישורים כרגע.</p>}
        </div>
      </section>
    </div>
  );
};

export default Home;