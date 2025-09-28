import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
// Context providers for global state management
import { AuthProvider } from '@/contexts/AuthContext';
import { BookingProvider } from '@/contexts/BookingContext';

// Page components
import Home from '@/pages/Home';
import TurfList from '@/pages/TurfList';
import TurfDetail from '@/pages/TurfDetail';
import Booking from '@/pages/Booking';
import Profile from '@/pages/Profile';
import OwnerDashboard from '@/pages/OwnerDashboard';
import NotFound from '@/pages/NotFound';

import './App.css';

function App() {
  return (
    // Global providers for authentication and booking state
    // These contexts will handle all user sessions and booking flows
    <AuthProvider>
      <BookingProvider>
        <Router>
          <div className="App">
            {/* Main routing configuration for the PlayNest platform */}
            <Routes>
              {/* Public routes - accessible without authentication */}
              <Route path="/" element={<Home />} />
              <Route path="/turfs" element={<TurfList />} />
              <Route path="/turf/:id" element={<TurfDetail />} />
              
              {/* Protected routes - require user authentication */}
              {/* Backend integration: These routes should check user authentication status */}
              <Route path="/booking/:turfId" element={<Booking />} />
              <Route path="/profile" element={<Profile />} />
              
              {/* Owner routes - require owner role verification */}
              {/* Backend integration: Implement role-based access control */}
              <Route path="/dashboard" element={<OwnerDashboard />} />
              
              {/* Fallback route for unmatched URLs */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            
            {/* Global toast notifications for user feedback */}
            {/* Used for success/error messages throughout the app */}
            <Toaster />
          </div>
        </Router>
      </BookingProvider>
    </AuthProvider>
  );
}

export default App;
