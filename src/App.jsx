import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { authAPI } from './services/authApi';

// Import Pages
import Home from './pages/Home';
import Courses from './pages/Courses'; 
import Favorites from './pages/Favorites'; 
import Course from './pages/Course';
import Folder from './pages/Folder';
import FilePage from './pages/File';
import User from './pages/User';
import ContactUs from './pages/ContactUs';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import NotFound from './pages/NotFound';
import CourseComments from './pages/CourseComments';

// Admin Pages
import AdminPanel from './pages/AdminPanel';
import AddCourse from './pages/admin/AddCourse';
import AddFolder from './pages/admin/AddFolder';
import AddFile from './pages/admin/AddFile';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header/Header'; 

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await authAPI.getMe();
          
          const validUser = res.data || res.user || res;
          
          // console.log("App.jsx - User Loaded:", validUser);
          setUser(validUser); 
        } catch (err) {
          console.error("Session expired", err);
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

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 text-indigo-600 font-medium">
      טוען מערכת...
    </div>
  );

  const isAuthenticated = !!user;

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        
        <Header user={user} onLogout={handleLogout} />

        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home user={user} />} />
            <Route path="/courses" element={<Courses user={user} />} />
            <Route path="/courses/course/:courseId" element={<ProtectedRoute user={user}><Course user={user} /></ProtectedRoute>} />
            <Route path="/courses/course/:courseId/folder/:folderId" element={<ProtectedRoute user={user}><Folder user={user} /></ProtectedRoute>} />
            <Route path="/courses/course/:courseId/file/:fileId" element={<ProtectedRoute user={user}><FilePage user={user} /></ProtectedRoute>} />
            <Route path="/courses/course/:courseId/comments" element={<ProtectedRoute user={user}><CourseComments user={user} /></ProtectedRoute>} />


            <Route path="/contact" element={<ContactUs user={user} />} />

            {/* Auth Routes */}
            <Route path="/login" element={
              <ProtectedRoute isAuthenticated={isAuthenticated} redirectPath="/">
                <Login />
              </ProtectedRoute>
            } />
            <Route path="/register" element={
              <ProtectedRoute isAuthenticated={isAuthenticated} redirectPath="/">
                <Register />
              </ProtectedRoute>
            } />

            {/* User Routes */}
            <Route path="/user" element={
              <ProtectedRoute isAuthenticated={isAuthenticated} requiredRole="user">
                <User />
              </ProtectedRoute>
            } />
            
            <Route path="/favorites" element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Favorites />
              </ProtectedRoute>
            } />

            {/* Admin Routes */}
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

        <footer className="bg-white border-t border-gray-200 mt-auto py-1">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-600 font-medium mb-2">
              © {new Date().getFullYear()} כל הזכויות שמורות ליאיר יהב
            </p>
            <p className="text-gray-400 text-sm italic font-serif">
              "זה נכון כי זה נכון, ובגלל שזה נכון, זה נכון"
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;