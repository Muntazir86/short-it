import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { UrlProvider } from './context/UrlContext';
import './App.css';

// Pages
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import UrlDetails from './pages/UrlDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
// Layout
import Layout from './components/layout/Layout';
// Auth
import ProtectedRoute from './components/auth/ProtectedRoute';
// Redirect
import Redirect from './components/redirect/Redirect';

function App() {
  return (
    <Router>
      <AuthProvider>
        <UrlProvider>
          <Routes>
            <Route path="/" element={<Layout><HomePage /></Layout>} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Layout><Dashboard /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/url/:shortCode" 
              element={
                <ProtectedRoute>
                  <Layout><UrlDetails /></Layout>
                </ProtectedRoute>
              } 
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Add route for short URL redirection */}
            <Route path="/:shortCode" element={<Redirect />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </UrlProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
