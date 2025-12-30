import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, User, LogOut, Shield, Heart } from 'lucide-react';

export default function Header({ user, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // נרמול נתוני המשתמש
  const userData = user?.data || user; 
  
  const isAuthenticated = !!userData;
  const isAdmin = userData?.role === 'admin';

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    onLogout();
    setIsMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path ? "text-indigo-600 bg-indigo-50" : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50";

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md">
              S
            </div>
            <span className="text-2xl font-bold text-gray-800">Sikum4U</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <Link to="/" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/')}`}>דף הבית</Link>
            <Link to="/courses" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/courses')}`}>כל הקורסים</Link>
            
            {isAuthenticated && (
                <Link to="/favorites" className={`group px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${isActive('/favorites')}`}>
                    {/* התיקון כאן: בדיקה אם אנחנו בעמוד המועדפים */}
                    <Heart 
                        size={16} 
                        className={`transition-colors ${
                            location.pathname === '/favorites' 
                                ? "text-red-500 fill-red-500" // אם אנחנו בעמוד - אדום קבוע
                                : "group-hover:text-red-500 group-hover:fill-red-500" // אחרת - אדום רק בהובר
                        }`} 
                    />
                    מועדפים
                </Link>
            )}

            <Link to="/contact" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/contact')}`}>צור קשר</Link>
          </nav>

          {/* User / Auth Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isAdmin && (
              <Link to="/admin" className="flex items-center gap-1 text-indigo-600 font-semibold bg-indigo-50 px-3 py-1 rounded-full text-sm border border-indigo-100 hover:bg-indigo-100 transition-colors">
                <Shield size={14} /> פאנל ניהול
              </Link>
            )}

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="w-px h-6 bg-gray-200 mx-2"></div>
                
                <Link to="/user" className="group relative" title="הפרופיל שלי">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-md transform transition-transform group-hover:scale-105 overflow-hidden">
                    {userData.profilePicture ? (
                        <img src={userData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        userData.firstName?.charAt(0) || <User size={20} />
                    )}
                  </div>
                </Link>

                <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-all">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-medium text-sm">התחברות</Link>
                <Link to="/register" className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-all text-sm font-medium">
                  הרשמה
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="text-gray-600 p-2">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

       {/* Mobile Menu */}
       {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 p-4 space-y-3 animate-in slide-in-from-top-5">
            <Link to="/" className="block text-gray-700 py-2">דף הבית</Link>
            <Link to="/courses" className="block text-gray-700 py-2">כל הקורסים</Link>
            
            {isAdmin && (
                <Link to="/admin" className="flex items-center gap-2 text-indigo-600 font-bold py-2 bg-indigo-50 rounded-lg px-3">
                    <Shield size={16} /> פאנל ניהול
                </Link>
            )}

            {isAuthenticated && <Link to="/favorites" className="block text-indigo-600 font-medium py-2">מועדפים</Link>}
            <Link to="/contact" className="block text-gray-700 py-2">צור קשר</Link>
            
            <div className="border-t pt-3 mt-2">
                {isAuthenticated ? (
                    <>
                        <Link to="/user" className="flex items-center gap-3 py-2 mb-2">
                            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                                {userData.firstName?.charAt(0)}
                            </div>
                            <span className="font-bold text-gray-800">הפרופיל שלי</span>
                        </Link>
                        <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 w-full py-2 hover:bg-red-50 rounded-lg px-2">
                            <LogOut size={18} /> התנתק
                        </button>
                    </>
                ) : (
                    <div className="flex gap-4 pt-2">
                        <Link to="/login" className="text-indigo-600 font-bold">התחברות</Link>
                        <Link to="/register" className="text-gray-600">הרשמה</Link>
                    </div>
                )}
            </div>
        </div>
      )}
    </header>
  );
}