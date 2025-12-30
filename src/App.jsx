import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate  } from 'react-router-dom';
import { authAPI } from './services/authApi';

import Header from './components/Header/Header';

// Import Pages
import Home from './pages/Home';
import Course from './pages/Course';
import Courses from './pages/Courses';
import Folder from './pages/Folder';
import FilePage from './pages/File';
import User from './pages/User';
import ContactUs from './pages/ContactUs';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import NotFound from './pages/NotFound';

import { AuthApi, PhotosApi, AlbumsApi, UserApi } from './services/index.js'

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
    <div className="app-container">
      <Header /> {/* התפריט העליון שתכף נסדר */}
      
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* התיקון לשגיאת 404: הוספת הנתיב הזה */}
          <Route path="/courses" element={<Courses />} />
          
          <Route path="/course/:id" element={<Course />} />
          <Route path="/user" element={<ProtectedRoute><User /></ProtectedRoute>} />
          
          {/* נתיב לאדמין */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly={true}>
              <AdminPanel />
            </ProtectedRoute>
          } />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;