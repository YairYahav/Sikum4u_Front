import React from 'react';

const EditableField = ({ label, name, value, onChange, type = "text" }) => (
    <div className="flex flex-col sm:flex-row sm:items-center py-4 border-b border-gray-100 last:border-0">
        <label className="text-sm font-bold text-gray-700 w-32 sm:ml-6 shrink-0 pt-2 sm:pt-0">
            {label}
        </label>
        <div className="flex-1">
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-gray-900 text-left"
                dir="auto"
            />
        </div>
    </div>
);

export default EditableField;