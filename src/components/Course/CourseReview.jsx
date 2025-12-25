import React from 'react';

const CourseReview = ({ reviews }) => {
    // אם אין מערך ביקורות או שהוא ריק
    if (!reviews || reviews.length === 0) {
        return (
            <div className="card shadow-sm mb-4">
                <div className="card-body text-center py-4">
                    <h5 className="text-muted">טרם נכתבו ביקורות לקורס זה</h5>
                    <p className="mb-0">היה הראשון לדרג!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-header bg-white">
                <h5 className="mb-0">ביקורות ודירוגים ({reviews.length})</h5>
            </div>
            <div className="list-group list-group-flush">
                {reviews.map((review) => (
                    <div key={review._id} className="list-group-item py-3">
                        <div className="d-flex justify-content-between mb-2">
                            <h6 className="fw-bold mb-0">
                                {review.user?.username || review.user?.firstName || 'משתמש אנונימי'}
                            </h6>
                            <div className="text-warning">
                                {/* יצירת כוכבים לפי הדירוג */}
                                {[...Array(5)].map((_, i) => (
                                    <i key={i} className={`bi ${i < review.rating ? 'bi-star-fill' : 'bi-star'}`}></i>
                                ))}
                            </div>
                        </div>
                        <p className="mb-1 text-muted small">{review.comment || review.text}</p>
                        <small className="text-muted">
                            {new Date(review.createdAt).toLocaleDateString('he-IL')}
                        </small>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CourseReview;