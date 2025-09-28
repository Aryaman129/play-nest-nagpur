import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';

// Test with simplified auth provider to isolate React issues
import { AuthProvider } from '@/contexts/SimpleAuthContext';
import { BookingProvider } from '@/contexts/BookingContext';

// Import pages
import Home from '@/pages/Home';
import TurfList from '@/pages/TurfList';
import TurfDetail from '@/pages/TurfDetail';
import Booking from '@/pages/Booking';
import Profile from '@/pages/Profile';
import OwnerDashboard from '@/pages/OwnerDashboard';
import AboutUs from '@/pages/AboutUs';
import Contact from '@/pages/Contact';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfService from '@/pages/TermsOfService';
import NotFound from '@/pages/NotFound';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/turfs" element={<TurfList />} />
              <Route path="/turf/:id" element={<TurfDetail />} />
              <Route path="/booking/:turfId" element={<Booking />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/owner-dashboard" element={<OwnerDashboard />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
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