import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
    return (
        <div className="p-5 mb-4 bg-primary text-white rounded-3 shadow text-center bg-gradient">
            <div className="container-fluid py-3">
                <h1 className="display-4 fw-bold">ברוכים הבאים ל-Sikum4u</h1>
                <p className="col-md-8 fs-4 mx-auto">
                    המאגר המרכזי לסיכומים, תרגילים ופתרונות. כל החומר שצריך לתואר במקום אחד, נגיש ונוח לשימוש.
                </p>
                <div className="mt-4">
                    <Link to="/courses" className="btn btn-light btn-lg px-4 me-md-2 fw-bold text-primary">
                        לכל הקורסים
                    </Link>
                    {/* בדיקה אם המשתמש לא מחובר, אפשר להציג כפתור הרשמה */}
                    {!localStorage.getItem('token') && (
                        <Link to="/register" className="btn btn-outline-light btn-lg px-4">
                            הצטרפות בחינם
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HeroSection;