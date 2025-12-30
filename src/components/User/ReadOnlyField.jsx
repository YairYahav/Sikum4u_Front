import React from 'react';

const ReadOnlyField = ({ label, value }) => (
    <div className="flex flex-col sm:flex-row sm:items-center py-4 border-b border-gray-100 last:border-0">
        <span className="text-sm font-bold text-gray-500 w-32 sm:ml-6 shrink-0">{label}</span>
        <span className="text-gray-900 font-medium text-lg flex-1 truncate" dir="ltr" style={{ textAlign: 'right' }}>
            {value || '-'}
        </span>
    </div>
);

export default ReadOnlyField;