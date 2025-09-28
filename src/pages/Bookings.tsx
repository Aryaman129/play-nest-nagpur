import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import BookingsList from '@/components/customer/BookingsList';

const Bookings = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Page Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">My Bookings</h1>
            <p className="text-muted-foreground">
              Track your turf bookings and connect with owners
            </p>
          </div>

          {/* Bookings List */}
          <BookingsList />
        </motion.div>
      </div>
    </div>
  );
};

export default Bookings;