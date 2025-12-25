import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// תודה רבה לשועה שהבין בשנייה איפה הבעיה אני חב לו חוב גדול ותודה רבה
// ייבוא CSS של Bootstrap (גרסת RTL מותאמת לעברית)
import 'bootstrap/dist/css/bootstrap.rtl.min.css';
// ייבוא JavaScript של Bootstrap (בשביל מודלים, תפריטים נפתחים וכו')
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// ייבוא האייקונים
import 'bootstrap-icons/font/bootstrap-icons.css';
// ---------------------------

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
