import React from 'react';
import HeroSection from '../components/Home/HeroSection';
import FeaturedSection from '../components/Home/FeaturedSection';

const Home = () => {
    return (
        <div className="container py-4">
            <HeroSection />
            <FeaturedSection />
        </div>
    );
};

export default Home;