// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

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
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth in localStorage
    const savedToken = localStorage.getItem('tutorlink_token');
    const savedUser = localStorage.getItem('tutorlink_user');
    const savedRole = localStorage.getItem('tutorlink_role');
    
    if (savedToken && savedUser && savedRole) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      setRole(savedRole);
    }
    setLoading(false);
  }, []);

  const login = async (email, password, selectedRole) => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: selectedRole }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      
      setToken(data.token);
      setUser(data.user);
      setRole(data.role);
      
      localStorage.setItem('tutorlink_token', data.token);
      localStorage.setItem('tutorlink_user', JSON.stringify(data.user));
      localStorage.setItem('tutorlink_role', data.role);
      
      return data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (registerData) => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();
      
      setToken(data.token);
      setUser(data.user);
      setRole(data.role);
      
      localStorage.setItem('tutorlink_token', data.token);
      localStorage.setItem('tutorlink_user', JSON.stringify(data.user));
      localStorage.setItem('tutorlink_role', data.role);
      
      return data;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    setToken(null);
    localStorage.removeItem('tutorlink_token');
    localStorage.removeItem('tutorlink_user');
    localStorage.removeItem('tutorlink_role');
  };

  const value = {
    user,
    role,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user && !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

