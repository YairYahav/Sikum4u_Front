import React from 'react';

const AlertMessages = ({ message }) => {
    if (!message || !message.text) return null;

    return (
        <div className={`alert alert-${message.type} text-center`} role="alert">
            {message.text}
        </div>
    );
};

export default AlertMessages;