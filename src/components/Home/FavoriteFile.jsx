import React from 'react';
import { Link } from 'react-router-dom';

const FavoriteFile = ({ file }) => {
    return (
        <div className="col-md-4 col-sm-6 mb-3">
            <Link to={`/file/${file._id}`} className="text-decoration-none">
                <div className="card h-100 border-start border-4 border-success shadow-sm hover-effect">
                    <div className="card-body d-flex align-items-center">
                        <div className="flex-shrink-0 bg-light p-2 rounded-circle text-success me-3">
                            <i className="bi bi-file-earmark-text fs-4"></i>
                        </div>
                        <div className="flex-grow-1">
                            <h6 className="mb-1 text-dark fw-bold text-truncate">{file.name}</h6>
                            <small className="text-muted">לחץ לצפייה</small>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default FavoriteFile;