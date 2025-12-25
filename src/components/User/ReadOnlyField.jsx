import React from 'react';

const ReadOnlyField = ({ label, value }) => {
    return (
        <div className="mb-2 row">
            <label className="col-sm-3 col-form-label fw-bold">{label}:</label>
            <div className="col-sm-9">
                <input type="text" readOnly className="form-control-plaintext" value={value || ''} />
            </div>
        </div>
    );
};

export default ReadOnlyField;