import { motion } from 'framer-motion';
import { useState } from 'react';
import { FaMapMarkerAlt, FaList } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import FilterBar from '../components/FilterBar';
import TurfCard from '../components/TurfCard';
import LoadingSpinner from '../components/LoadingSpinner';
import cricketTurf from '../assets/cricket-turf.jpg';
import tennisTurf from '../assets/tennis-turf.jpg';
import badmintonTurf from '../assets/badminton-turf.jpg';

const TurfList = () => {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [loading, setLoading] = useState(false);

  // Mock data for turfs
  const turfs = [
    {
      id: '1',
      name: 'Green Valley Sports Complex',
      address: 'Dharampeth, Nagpur',
      basePrice: 800,
      rating: 4.8,
      sports: ['football', 'cricket'],
      image: cricketTurf,
      distance: 2.5,
    },
    {
      id: '2',
      name: 'Champions Tennis Arena',
      address: 'Civil Lines, Nagpur',
      basePrice: 600,
      rating: 4.6,
      sports: ['tennis', 'badminton'],
      image: tennisTurf,
      distance: 3.2,
    },
    {
      id: '3',
      name: 'Victory Badminton Hub',
      address: 'Sadar, Nagpur',
      basePrice: 400,
      rating: 4.7,
      sports: ['badminton'],
      image: badmintonTurf,
      distance: 1.8,
    },
    {
      id: '4',
      name: 'Striker Football Academy',
      address: 'Hingna, Nagpur',
      basePrice: 1000,
      rating: 4.9,
      sports: ['football'],
      image: cricketTurf,
      distance: 5.2,
    },
    {
      id: '5',
      name: 'Royal Cricket Ground',
      address: 'Kamptee Road, Nagpur',
      basePrice: 900,
      rating: 4.5,
      sports: ['cricket'],
      image: cricketTurf,
      distance: 4.1,
    },
    {
      id: '6',
      name: 'Ace Tennis Courts',
      address: 'Ramdaspeth, Nagpur',
      basePrice: 550,
      rating: 4.4,
      sports: ['tennis'],
      image: tennisTurf,
      distance: 2.8,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header */}
      <div className="pt-20 pb-8 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold mb-4">Find Sports Turfs in Nagpur</h1>
            <p className="text-xl text-muted-foreground mb-6">
              Discover {turfs.length} premium sports facilities near you
            </p>
            
            {/* View Toggle */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">View:</span>
              <div className="bg-white border border-border rounded-lg p-1 flex">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-2 px-4 py-2 rounded transition-all ${
                    viewMode === 'list'
                      ? 'bg-primary text-white'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <FaList />
                  <span>List</span>
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('map')}
                  className={`flex items-center gap-2 px-4 py-2 rounded transition-all ${
                    viewMode === 'map'
                      ? 'bg-primary text-white'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <FaMapMarkerAlt />
                  <span>Map</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <FilterBar />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner size="lg" text="Finding perfect turfs for you..." />
          </div>
        ) : (
          <>
            {viewMode === 'list' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {turfs.map((turf, index) => (
                  <motion.div
                    key={turf.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <TurfCard 
                      turf={turf} 
                      onClick={() => console.log('Navigate to booking:', turf.id)}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-muted/20 rounded-2xl p-8 text-center min-h-[500px] flex items-center justify-center"
              >
                <div>
                  <FaMapMarkerAlt className="text-6xl text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Map View Coming Soon</h3>
                  <p className="text-muted-foreground">
                    Interactive map with turf locations will be available after connecting to backend services.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Load More */}
            {viewMode === 'list' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center mt-12"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-sport text-lg px-8 py-4"
                  onClick={() => {
                    setLoading(true);
                    setTimeout(() => setLoading(false), 1500);
                  }}
                >
                  Load More Turfs
                </motion.button>
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Quick Stats */}
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <div className="text-3xl font-bold text-primary mb-2">15+</div>
              <div className="text-muted-foreground">Active Turfs</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <div className="text-3xl font-bold text-secondary mb-2">500+</div>
              <div className="text-muted-foreground">Happy Players</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <div className="text-3xl font-bold text-accent mb-2">4.8★</div>
              <div className="text-muted-foreground">Average Rating</div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">Booking Support</div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TurfList;