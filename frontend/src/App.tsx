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

function App() {
  return (
    <Router>
      <AuthProvider>
        <UrlProvider>
          <Routes>
            <Route path="/" element={<Layout><HomePage /></Layout>} />
            <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
            <Route path="/url/:shortCode" element={<Layout><UrlDetails /></Layout>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </UrlProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
