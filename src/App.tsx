// Main App Component - Enhanced with Phase 5 Authentication
// **BACKEND INTEGRATION**: Connected to Supabase authentication system

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';

// Authentication Provider
import { AuthProvider, ProtectedRoute } from '@/contexts/SimpleAuthContext';
import { BookingProvider } from '@/contexts/BookingContext';

// Import pages
import Home from '@/pages/Home';
import TurfList from '@/pages/TurfList';
import TurfDetail from '@/pages/TurfDetail';
import Booking from '@/pages/Booking';
import Profile from '@/pages/Profile';
import Bookings from '@/pages/Bookings';
import OwnerDashboard from '@/pages/OwnerDashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import AboutUs from '@/pages/AboutUs';
import Contact from '@/pages/Contact';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfService from '@/pages/TermsOfService';
import NotFound from '@/pages/NotFound';
import OfflinePage from '@/pages/OfflinePage';

// Authentication pages
import Login from '@/pages/Login';
import Register from '@/pages/Register';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/turfs" element={<TurfList />} />
              <Route path="/turf/:id" element={<TurfDetail />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              
              {/* Authentication Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes - Require Authentication */}
              <Route path="/booking/:turfId" element={
                <ProtectedRoute>
                  <Booking />
                </ProtectedRoute>
              } />
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/offline" element={<OfflinePage />} />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              
              {/* Owner-Only Routes */}
              <Route path="/owner-dashboard" element={
                <ProtectedRoute requiredRole="owner">
                  <OwnerDashboard />
                </ProtectedRoute>
              } />
              
              {/* Admin-Only Routes */}
              <Route path="/admin-dashboard" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              
              {/* Catch all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </BookingProvider>
    </AuthProvider>
  );
}

export default App;