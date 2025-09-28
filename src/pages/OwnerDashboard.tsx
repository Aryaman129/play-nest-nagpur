import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import DashboardNav from '@/components/owner/DashboardNav';
import BookingsTab from '@/components/owner/BookingsTab';
import PricingTab from '@/components/owner/PricingTab';
import AnalyticsTab from '@/components/owner/AnalyticsTab';

const OwnerDashboard = () => {
  const [activeTab, setActiveTab] = useState('bookings');

  const renderContent = () => {
    switch (activeTab) {
      case 'bookings':
        return <BookingsTab />;
      case 'pricing':
        return <PricingTab />;
      case 'analytics':
        return <AnalyticsTab />;
      default:
        return <BookingsTab />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Turf Owner Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your turf bookings, pricing, and view analytics
            </p>
          </div>

          {/* Navigation */}
          <DashboardNav activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6"
          >
            {renderContent()}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default OwnerDashboard;