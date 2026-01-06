import React, { useState, useEffect } from 'react';
import { Star, X } from 'lucide-react'; 
import { reviewAPI } from '../../services/reviewApi'; 

const CourseRating = ({ courseId, initialAverage, onRatingUpdate, user }) => {
    const [average, setAverage] = useState(initialAverage || 0);
    const [showModal, setShowModal] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setAverage(initialAverage);
    }, [initialAverage]);

    // פונקציה לפתיחת המודל וטעינת הדירוג האישי אם קיים
    const handleOpenModal = async () => {
        if (!user) {
            alert("עליך להתחבר כדי לדרג");
            return;
        }
        setShowModal(true);
        try {
            // ננסה להביא את הביקורות ולמצוא את של המשתמש
            // הערה: באידיאל היה endpoint שמחזיר my-review, אך נשתמש במה שיש
            const response = await reviewAPI.getReviews(courseId);
            const myReview = response.data.find(r => r.user._id === user._id || r.user === user._id);
            if (myReview) {
                setUserRating(myReview.rating);
            }
        } catch (error) {
            console.error("Error fetching user rating", error);
        }
    };

    const handleSubmitRating = async (ratingValue) => {
        setIsSubmitting(true);
        try {
            await reviewAPI.addReview({
                resourceId: courseId,
                resourceType: 'Course',
                rating: ratingValue,
                comment: '' 
            });
            
            setUserRating(ratingValue);
            // כאן היינו צריכים לקבל את הממוצע החדש מהשרת, 
            // לצורך הדוגמה נבצע refresh לדף או נקרא ל-onUpdate אם קיים
            if (onRatingUpdate) onRatingUpdate();
            setShowModal(false);
        } catch (error) {
            console.error("Error submitting rating", error);
            alert("שגיאה בשליחת הדירוג");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getDisplayRating = (rating) => {
        return Math.ceil(rating * 2) / 2;
    };

    const renderAverageStars = () => {
        const displayRating = getDisplayRating(average);
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            let fillClass = "text-gray-300"; 
            let fillPercent = "0%";

            if (displayRating >= i) {
                fillClass = "text-yellow-400 fill-yellow-400"; 
                fillPercent = "100%";
            } else if (displayRating === i - 0.5) {
                 fillClass = "text-yellow-400"; 
                 fillPercent = "50%";
            }

            stars.push(
                <div key={i} className="relative">
                    {/* כוכב רקע (אפור) */}
                    <Star size={20} className="text-gray-300 absolute top-0 left-0" />
                    {/* כוכב עליון (צהוב) עם חיתוך */}
                    <div style={{ width: fillPercent, overflow: 'hidden', position: 'absolute', top: 0, left: 0 }}>
                        <Star size={20} className="text-yellow-400 fill-yellow-400" />
                    </div>
                    {/* כוכב "מחזיק מקום" כדי לתפוס נפח */}
                    <Star size={20} className="opacity-0" />
                </div>
            );
        }
        return <div className="flex gap-1" dir="ltr">{stars}</div>;
    };

    return (
        <>
            {/* תצוגה ב-Sidebar */}
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100 mb-6">
                <div className="flex items-center gap-2">
                    {renderAverageStars()}
                    <span className="text-xs font-bold text-gray-500 pt-1">({average.toFixed(1)})</span>
                </div>
                <button 
                    onClick={handleOpenModal}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-3 py-1 rounded-lg transition-colors"
                >
                    דרג
                </button>
            </div>

            {/* מודל צף לדירוג */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xs p-6 relative">
                        <button 
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 left-4 text-gray-400 hover:text-gray-600"
                        >
                            <X size={20} />
                        </button>
                        
                        <div className="text-center">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">דירוג הקורס</h3>
                            <p className="text-sm text-gray-500 mb-6">איך היה הקורס? דעתך חשובה לנו!</p>
                            
                            <div className="flex justify-center gap-2 mb-6" dir="ltr">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        onClick={() => handleSubmitRating(star)}
                                        disabled={isSubmitting}
                                        className="transition-transform hover:scale-110 focus:outline-none"
                                    >
                                        <Star 
                                            size={32} 
                                            className={`${
                                                (hoverRating || userRating) >= star 
                                                ? "text-yellow-400 fill-yellow-400" 
                                                : "text-gray-300"
                                            } transition-colors duration-200`}
                                        />
                                    </button>
                                ))}
                            </div>
                            
                            {userRating > 0 && !hoverRating && (
                                <p className="text-xs text-green-600 font-medium animate-pulse">
                                    הדירוג שלך: {userRating} כוכבים
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CourseRating;