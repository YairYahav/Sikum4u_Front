import React from 'react';

const EditableField = ({ label, name, value, onChange, type = "text", required = true }) => {
    return (
        <div className="mb-3 row">
            <label className="col-sm-3 col-form-label fw-bold">{label}:</label>
            <div className="col-sm-9">
                <input 
                    type={type} 
                    name={name}
                    className="form-control" 
                    value={value || ''} 
                    onChange={onChange}
                    required={required}
                />
            </div>
        </div>
    );
};

export default EditableField;