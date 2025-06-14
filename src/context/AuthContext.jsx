import React, { createContext, useContext, useState, useEffect } from 'react';
import { BACKEND_URL } from '@/config';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleTokenInvalidation = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        handleTokenInvalidation();
        return;
      }

      const data = await response.json();
      
      if (data.status) {
        setUser(data.data);
        setIsAuthenticated(true);
      } else {
        handleTokenInvalidation();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      handleTokenInvalidation();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (credentials) => {
    const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (data.status) {
      // Extract token and user from the nested data structure
      const { token, user } = data.data;
      localStorage.setItem('token', token);
      setUser(user);
      setIsAuthenticated(true);
    }
    return data;
  };

  const signup = async (userData) => {
    const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    return data;
  };

  const logout = () => {
    handleTokenInvalidation();
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoading,
      login, 
      signup, 
      logout,
      checkAuth,
      handleTokenInvalidation
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 