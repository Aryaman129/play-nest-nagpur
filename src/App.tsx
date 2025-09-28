import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';

// Test with simplified auth provider to isolate React issues
import { AuthProvider } from '@/contexts/SimpleAuthContext';
import { BookingProvider } from '@/contexts/BookingContext';

// Import pages
import Home from '@/pages/Home';
import TurfList from '@/pages/TurfList';
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