import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

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

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.get('/api/auth/me');
      setUser(response.data.user);
      }
    } catch (error) {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, googleToken = null) => {
    try {
      let response;
      
      if (googleToken) {
        // Google OAuth login
        response = await axios.post('/api/auth/google-login', { 
          credential: googleToken 
        });
      } else {
        // Regular email/password login
        response = await axios.post('/api/auth/login', { email, password });
      }
      
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      
      toast.success('Login successful!');
      return { success: true, user }; // Return user for role-based redirect
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      console.log('📝 Registering user:', { email: userData.email, firstName: userData.firstName });
      
      const response = await axios.post('/api/auth/register', userData);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      
      console.log('✅ Registration successful');
      console.log('✅ User role:', user?.role || 'user');
      toast.success('Registration successful!');
      return { success: true, user }; // Return user for role-based redirect
    } catch (error) {
      console.error('❌ Registration error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      const message = error.response?.data?.message || error.message || 'Registration failed';
      const errorDetails = error.response?.data?.errors;
      
      if (errorDetails && errorDetails.length > 0) {
        const firstError = errorDetails[0];
        toast.error(`${firstError.param || 'Field'}: ${firstError.msg || message}`);
      } else {
        toast.error(message);
      }
      
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateProfile = async (userData) => {
    try {
      const response = await axios.put('/api/auth/profile', userData);
      setUser(response.data.user);
      toast.success('Profile updated successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Update failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};



