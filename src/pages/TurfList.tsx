import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaList } from 'react-icons/fa';

// Components
import Navbar from '../components/Navbar';
import { TurfFilters } from '../components/customer/FilterBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAppToast } from '@/components/common/Toast';

// Enhanced components with backend integration
import TurfCard from '../components/enhanced/TurfCard';
import FilterBar from '../components/enhanced/FilterBar';
import MapView from '../components/enhanced/MapView';

// Services and types
import { turfService } from '@/services/turfs';
import { Turf } from '@/types';

// Simple mock data to avoid import issues
const mockTurfsData: Turf[] = [
  {
    id: '1',
    name: 'Green Valley Sports Complex',
    description: 'Premium sports facility',
    location: {
      lat: 28.6139,
      lng: 77.2090,
      address: 'Sector 18, Near Metro Station',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110001',
    },
    basePrice: 1200,
    sports: ['Football', 'Cricket'],
    photos: ['/assets/hero-turf.jpg'],
    idealPlayers: 22,
    amenities: [],
    rating: 4.8,
    totalReviews: 156,
    ownerId: '2',
    verified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    availability: {
      openTime: '06:00',
      closeTime: '22:00',
      daysOpen: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    rules: [],
    size: { length: 100, width: 60, unit: 'm' },
  }
];

const TurfList = () => {
  // Router navigation
  const navigate = useNavigate();
  const { error } = useAppToast();

  // Component state management
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [loading, setLoading] = useState(true);
  const [turfs, setTurfs] = useState<Turf[]>([]);
  const [filteredTurfs, setFilteredTurfs] = useState<Turf[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<TurfFilters>({
    priceRange: [500, 3000],
    sports: [],
    size: '',
    sortBy: 'distance',
    distance: 10,
    timeSlot: ''
  });

  // **BACKEND INTEGRATION POINT**
  // Load turfs from API on component mount and when filters change
  useEffect(() => {
    loadTurfs();
  }, [filters, currentPage]);

  // **BACKEND INTEGRATION FUNCTION**
  // This function should be replaced with actual API call to fetch turfs
  const loadTurfs = async () => {
    try {
      setLoading(true);
      
      // TODO: Replace with actual API call
      // const response = await turfService.getTurfs({
      //   filters,
      //   page: currentPage,
      //   limit: 9
      // });
      
      // Mock implementation - replace with backend call
      let turfData = [...mockTurfsData];
      
      // Apply filters locally (this should be done on backend)
      if (filters.sports.length > 0) {
        turfData = turfData.filter(turf => 
          turf.sports.some(sport => filters.sports.includes(sport))
        );
      }
      
      if (filters.priceRange) {
        turfData = turfData.filter(turf => 
          turf.basePrice >= filters.priceRange[0] && 
          turf.basePrice <= filters.priceRange[1]
        );
      }
      
      // Apply sorting
      switch (filters.sortBy) {
        case 'price-low':
          turfData.sort((a, b) => a.basePrice - b.basePrice);
          break;
        case 'price-high':
          turfData.sort((a, b) => b.basePrice - a.basePrice);
          break;
        case 'rating':
          turfData.sort((a, b) => b.rating - a.rating);
          break;
        case 'distance':
        default:
          // Sort by some default criteria since distance isn't in Turf type
          turfData.sort((a, b) => a.name.localeCompare(b.name));
          break;
      }
      
      setTurfs(turfData);
      setFilteredTurfs(turfData);
      setTotalPages(Math.ceil(turfData.length / 9));
      
    } catch (err) {
      console.error('Error loading turfs:', err);
      error('Error loading turfs', 'Failed to load turf listings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: TurfFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Handle turf card click - navigate to turf detail page
  const handleTurfClick = (turfId: string) => {
    navigate(`/turf/${turfId}`);
  };

  // Handle load more turfs
  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };


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

      <FilterBar onFilterChange={handleFilterChange} />

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
                      onBookNow={() => navigate(`/booking/${turf.id}`)}
                      onViewDetails={() => handleTurfClick(turf.id)}
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