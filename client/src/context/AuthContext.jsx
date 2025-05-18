import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        // Set default headers for all axios requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        const response = await axios.get('/api/auth/me');
        
        if (response.data.status === 'success') {
          setUser(response.data.data.user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Authentication error:', error);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email, password) => {
    setError(null);
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      
      if (response.data.status === 'success') {
        const { token, user } = response.data.data;
        
        // Save token to localStorage
        localStorage.setItem('token', token);
        
        // Set default headers for all axios requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        setUser(user);
        setIsAuthenticated(true);
        return true;
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed. Please try again.');
      return false;
    }
  };

  // Register function
  const register = async (name, email, password) => {
    setError(null);
    try {
      const response = await axios.post('/api/auth/register', { name, email, password });
      
      if (response.data.status === 'success') {
        const { token, user } = response.data.data;
        
        // Save token to localStorage
        localStorage.setItem('token', token);
        
        // Set default headers for all axios requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        setUser(user);
        setIsAuthenticated(true);
        return true;
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
      return false;
    }
  };

  // Logout function
  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    
    // Remove Authorization header
    delete axios.defaults.headers.common['Authorization'];
    
    setUser(null);
    setIsAuthenticated(false);
  };

  // Update profile function
  const updateProfile = async (userData) => {
    setError(null);
    try {
      const response = await axios.put('/api/auth/me', userData);
      
      if (response.data.status === 'success') {
        setUser(response.data.data.user);
        return true;
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update profile. Please try again.');
      return false;
    }
  };

  // Change password function
  const changePassword = async (currentPassword, newPassword) => {
    setError(null);
    try {
      const response = await axios.put('/api/auth/password', { currentPassword, newPassword });
      
      if (response.data.status === 'success') {
        return true;
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to change password. Please try again.');
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
