import React from 'react';

const ContactUs = () => {
    return (
        <div className="card" style={{ maxWidth: '600px', margin: '2rem auto', textAlign: 'right' }}>
            <h1>צור קשר</h1>
            <p>נתקלתם בבעיה? יש לכם סיכומים להציע? שלחו לנו הודעה.</p>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '1rem' }}>
                <input type="text" placeholder="שם מלא" className="input" style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
                <textarea placeholder="הודעה" rows="5" style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}></textarea>
                <button style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}>שלח הודעה</button>
            </form>
        </div>
    );
};

export default ContactUs;