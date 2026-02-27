import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useAuth } from './contexts/AuthContext';
import { useTheme } from './contexts/ThemeContext';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LoadingSpinner from './components/common/LoadingSpinner';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import FileUpload from './pages/FileUpload';
import FileView from './pages/FileView';
import FileAnalysis from './pages/FileAnalysis';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import Analytics from './pages/Analytics';
import Download from './pages/Download';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route Component (redirects to dashboard if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

const App = () => {
  const { isAuthenticated } = useAuth();
  const { isDarkMode } = useTheme();

  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <>
      <Helmet>
        <title>Excel Analytics Pro - Professional Data Analysis Platform</title>
        <meta name="description" content="Upload, analyze, and visualize your Excel data with powerful charts and insights. Professional analytics platform built with modern technologies." />
        <meta name="keywords" content="excel analytics, data visualization, charts, data analysis, business intelligence" />
        <meta name="author" content="Excel Analytics Pro" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Excel Analytics Pro" />
        <meta property="og:description" content="Professional Excel data analysis and visualization platform" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Excel Analytics Pro" />
        <meta name="twitter:description" content="Professional Excel data analysis and visualization platform" />
        
        {/* Theme Color */}
        <meta name="theme-color" content={isDarkMode ? "#1f2937" : "#3b82f6"} />
      </Helmet>

      <div className="app">
        <Navbar />
        
        <main className="min-h-screen">
          <AnimatePresence mode="wait">
            <Routes>
              {/* Public Routes */}
              <Route 
                path="/" 
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Home />
                  </motion.div>
                } 
              />
              
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Login />
                    </motion.div>
                  </PublicRoute>
                } 
              />
              
              <Route 
                path="/register" 
                element={
                  <PublicRoute>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Register />
                    </motion.div>
                  </PublicRoute>
                } 
              />
              
              <Route path="/signin" element={<Navigate to="/login" replace />} />
              <Route path="/signup" element={<Navigate to="/register" replace />} />

              {/* Protected Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Dashboard />
                    </motion.div>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/upload" 
                element={
                  <ProtectedRoute>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FileUpload />
                    </motion.div>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/files/:id" 
                element={
                  <ProtectedRoute>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FileView />
                    </motion.div>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/files/:id/analysis" 
                element={
                  <ProtectedRoute>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FileAnalysis />
                    </motion.div>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Profile />
                    </motion.div>
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/analytics" 
                element={
                  <ProtectedRoute>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Analytics />
                    </motion.div>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/download" 
                element={
                  <ProtectedRoute>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Download />
                    </motion.div>
                  </ProtectedRoute>
                } 
              />

              {/* 404 Route */}
              <Route 
                path="*" 
                element={
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <NotFound />
                  </motion.div>
                } 
              />
            </Routes>
          </AnimatePresence>
        </main>

        {isAuthenticated && <Footer />}
      </div>
    </>
  );
};

export default App; 