import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // בדיקה אם המשתמש מחובר בטעינת האתר
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      // בדיקה ראשונית אם יש בכלל טוקן
      if (!authAPI.isAuthenticated()) {
        setLoading(false);
        return;
      }

      try {
        const userData = await authAPI.getMe(); 
        setUser(userData.user || userData); 
      } catch (error) {
        console.error("Failed to fetch user", error);
        authAPI.logout();
      } finally {
        setLoading(false);
      }
    };

    checkUserLoggedIn();
  }, []);

  const login = async (email, password) => {
    const data = await authAPI.login({ email, password });
    setUser(data.user || data); 
    return data;
  };

  const register = async (userData) => {
    const data = await authAPI.register(userData);
    setUser(data.user || data);
    return data;
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);