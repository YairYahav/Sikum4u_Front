import { Navigate, useLocation } from 'react-router-dom';

/**
 * קומפוננטה להגנה על נתיבים באתר.
 * למי שיקרא את זה ויש לו בעיות עם ההערות שלי לעצמי בעברית - שיתמודד
 * @param {Object} props
 * @param {ReactNode} props.children - הרכיבים שיוצגו אם הגישה מותרת
 * @param {boolean} props.isAuthenticated - האם המשתמש מחובר למערכת
 * @param {string} props.userRole - תפקיד המשתמש 
 * @param {string} props.requiredRole - התפקיד הנדרש כדי לצפות בדף
 */
const ProtectedRoute = ({ children, isAuthenticated, userRole, requiredRole }) => {
  const location = useLocation();

  // 1. אם המשתמש לא מחובר והנתיב דורש הרשאה כלשהי (כמו תגובות או ניהול ושיט כזה)
  if (requiredRole && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. אם נדרשת הרשאת אדמין והמשתמש מחובר אך אינו אדמין ואז לא יכול להעלות קובץ וכאלה
  if (requiredRole === 'admin' && userRole !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // 3. מניעת גישה לדפי התחברות/הרשמה עבור משתמשים שכבר מחוברים
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  if (isAuthenticated && isAuthPage) {
    return <Navigate to="/" replace />;
  }

  // אם הכל תקין, הצג את הדף
  return children;
};

export default ProtectedRoute;