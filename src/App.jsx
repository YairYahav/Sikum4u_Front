import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { authAPI } from './services/authApi';

// Import Pages
import Home from './pages/Home';
import Course from './pages/Course';
import Folder from './pages/Folder';
import FilePage from './pages/File';
import User from './pages/User';
import ContactUs from './pages/ContactUs';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminPanel from './pages/AdminPanel';
import AddCourse from './pages/admin/addcourse';
import AddFolder from './pages/admin/addfolder';
import AddFile from './pages/admin/addfile';

// Components
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // בדיקת סטטוס משתמש בטעינת האתר
  useEffect(() => {
    const checkAuth = async () => {
      if (localStorage.getItem('token')) {
        try {
          const res = await authAPI.getMe();
          setUser(res.data);
        } catch (err) {
          console.error("Session expired or invalid");
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleLogout = () => {
    authAPI.logout();
    setUser(null);
    window.location.href = '/';
  };

  if (loading) return <div className="flex-center" style={{ minHeight: '100vh' }}>טוען מערכת...</div>;

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <Router>
      <div className="app-wrapper">
        <nav className="navbar" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          padding: '1rem 5%', 
          backgroundColor: 'var(--nav-bg)',
          borderBottom: '1px solid var(--border-color)',
          position: 'sticky',
          top: 0,
          zIndex: 1000
        }}>
          <div className="nav-right" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <Link to="/" style={{ fontWeight: 'bold', fontSize: '1.5rem', color: 'var(--primary-color)' }}>Sikum4U</Link>
            <Link to="/">דף הבית</Link>
            <Link to="/contact">צור קשר</Link>
          </div>

          <div className="nav-left" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            {isAdmin && <Link to="/admin" style={{ color: 'var(--primary-color)', fontWeight: '600' }}>פאנל ניהול</Link>}
            
            {isAuthenticated ? (
              <>
                <Link to="/user">שלום, {user.name}</Link>
                <button onClick={handleLogout} style={{ padding: '5px 12px', fontSize: '0.9rem' }}>התנתק</button>
              </>
            ) : (
              <>
                <Link to="/login">התחברות</Link>
                <Link to="/register" style={{ 
                  backgroundColor: 'var(--primary-color)', 
                  color: 'white', 
                  padding: '8px 16px', 
                  borderRadius: '8px' 
                }}>הרשמה</Link>
              </>
            )}
          </div>
        </nav>

        <main className="container" style={{ padding: '2rem 0' }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/course/:id" element={<Course />} />
            <Route path="/folder/:id" element={<Folder />} />
            <Route path="/file/:id" element={<FilePage />} />
            <Route path="/contact" element={<ContactUs />} />

            {/* Auth Routes (רק אם לא מחובר) */}
            <Route path="/login" element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Login />
              </ProtectedRoute>
            } />
            <Route path="/register" element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Register />
              </ProtectedRoute>
            } />

            {/* User Routes (רק אם מחובר) */}
            <Route path="/user" element={
              <ProtectedRoute isAuthenticated={isAuthenticated} requiredRole="user">
                <User />
              </ProtectedRoute>
            } />

            {/* Admin Routes (רק אם אדמין) */}
            <Route path="/admin" element={
              <ProtectedRoute isAuthenticated={isAuthenticated} userRole={user?.role} requiredRole="admin">
                <AdminPanel />
              </ProtectedRoute>
            } />
            <Route path="/admin/add-course" element={
              <ProtectedRoute isAuthenticated={isAuthenticated} userRole={user?.role} requiredRole="admin">
                <AddCourse />
              </ProtectedRoute>
            } />
            <Route path="/admin/add-folder" element={
              <ProtectedRoute isAuthenticated={isAuthenticated} userRole={user?.role} requiredRole="admin">
                <AddFolder />
              </ProtectedRoute>
            } />
            <Route path="/admin/add-file" element={
              <ProtectedRoute isAuthenticated={isAuthenticated} userRole={user?.role} requiredRole="admin">
                <AddFile />
              </ProtectedRoute>
            } />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <footer style={{ 
          textAlign: 'center', 
          padding: '2rem', 
          borderTop: '1px solid var(--border-color)',
          marginTop: '3rem',
          opacity: 0.7
        }}>
          <p>© {new Date().getFullYear()} Sikum4U - כל הסיכומים במקום אחד</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;