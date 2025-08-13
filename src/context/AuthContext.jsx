import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CookieService from '../utils/cookieService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing auth token and user info on component mount
    const token = CookieService.getToken();
    const userInfo = CookieService.getUserInfo();
    
    if (token && userInfo) {
      setUser(userInfo);
    }
    
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      
      // Simulate API call - replace with actual login API
      console.log('Login attempt with credentials:', credentials);
      
      // For demo purposes, simulate a successful login
      if (credentials.email && credentials.password) {
        const mockUser = {
          id: '1',
          email: credentials.email,
          name: credentials.email.split('@')[0],
          role: 'user'
        };
        
        const mockToken = 'mock_jwt_token_' + Date.now();
        
        // Set cookies
        CookieService.setToken(mockToken);
        CookieService.setUserInfo(mockUser);
        
        setUser(mockUser);
        setLoading(false);
        
        // Navigate to dashboard or main app
        navigate('/en_GB/kendo/category');
        
        return true;
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = () => {
    CookieService.clearAuth();
    setUser(null);
    navigate('/');
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
