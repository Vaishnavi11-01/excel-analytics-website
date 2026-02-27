import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  error: null
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set up axios defaults
  useEffect(() => {
    if (state.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
      localStorage.setItem('token', state.token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [state.token]);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      if (state.token) {
        try {
          dispatch({ type: 'AUTH_START' });
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/profile`, {
            headers: { Authorization: `Bearer ${state.token}` }
          });
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: {
              user: response.data.user,
              token: state.token
            }
          });
        } catch (error) {
          dispatch({
            type: 'AUTH_FAILURE',
            payload: 'Session expired. Please login again.'
          });
          toast.error('Session expired. Please login again.');
        }
      } else {
        dispatch({ type: 'AUTH_FAILURE', payload: null });
      }
    };

    checkAuth();
  }, [state.token]);

  const register = async (userData) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, userData);
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: response.data.user,
          token: response.data.token
        }
      });
      toast.success('Registration successful! Welcome aboard! 🎉');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Registration failed';
      dispatch({
        type: 'AUTH_FAILURE',
        payload: errorMessage
      });
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const login = async (credentials) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, credentials);
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: response.data.user,
          token: response.data.token
        }
      });
      toast.success(`Welcome back, ${response.data.user.username}! 👋`);
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Login failed';
      dispatch({
        type: 'AUTH_FAILURE',
        payload: errorMessage
      });
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    toast.success('Logged out successfully. See you soon! 👋');
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put('/api/auth/profile', profileData);
      dispatch({
        type: 'UPDATE_USER',
        payload: response.data.user
      });
      toast.success('Profile updated successfully! ✨');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Profile update failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const refreshToken = async () => {
    try {
      const response = await axios.post('/api/auth/refresh');
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: response.data.user,
          token: response.data.token
        }
      });
      return { success: true };
    } catch (error) {
      dispatch({ type: 'LOGOUT' });
      return { success: false };
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    register,
    login,
    logout,
    updateProfile,
    refreshToken,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 