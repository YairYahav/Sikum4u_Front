import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fileAPI } from '../services/fileApi';
import { reviewAPI } from '../services/reviewApi';

const FilePage = () => {
    const { id } = useParams();
    const [file, setFile] = useState(null);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const fileRes = await fileAPI.getFileById(id);
            setFile(fileRes.data);
            const reviewRes = await reviewAPI.getReviews(id);
            setReviews(reviewRes.data);
        };
        fetchData();
    }, [id]);

    return (
        <div style={{ textAlign: 'right' }}>
            <h1>{file?.name}</h1>
            <div className="card" style={{ height: '600px', margin: '2rem 0' }}>
                {file?.url && (
                    <iframe src={file.url} width="100%" height="100%" title={file.name} style={{ border: 'none' }} />
                )}
            </div>
            <section className="reviews">
                <h3>תגובות ודירוגים</h3>
                {reviews.map(r => (
                    <div key={r._id} className="card" style={{ marginBottom: '10px' }}>
                        <strong>{r.user.name}</strong> ({r.rating} ⭐)
                        <p>{r.comment}</p>
                    </div>
                ))}
            </section>
        </div>
    );
};

export default FilePage;