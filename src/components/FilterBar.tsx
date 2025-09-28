import { motion } from 'framer-motion';
import { useState } from 'react';
import { FaFilter, FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import { MdSportsSoccer, MdSportsCricket, MdSportsTennis } from 'react-icons/md';
import { IoTennisball } from 'react-icons/io5';

interface FilterBarProps {
  onFilterChange?: (filters: any) => void;
}

const FilterBar = ({ onFilterChange }: FilterBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [sortBy, setSortBy] = useState('distance');
  const [showFilters, setShowFilters] = useState(false);

  const sports = [
    { id: 'football', name: 'Football', icon: <MdSportsSoccer /> },
    { id: 'cricket', name: 'Cricket', icon: <MdSportsCricket /> },
    { id: 'tennis', name: 'Tennis', icon: <MdSportsTennis /> },
    { id: 'badminton', name: 'Badminton', icon: <IoTennisball /> },
  ];

  const sortOptions = [
    { value: 'distance', label: 'Nearest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
  ];

  const toggleSport = (sportId: string) => {
    setSelectedSports(prev => 
      prev.includes(sportId) 
        ? prev.filter(id => id !== sportId)
        : [...prev, sportId]
    );
  };

  return (
    <div className="bg-white border-b border-border sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Main Search Bar */}
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          {/* Search Input */}
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search turfs, locations, or sports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Location Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-3 border border-border rounded-lg hover:border-primary transition-colors"
          >
            <FaMapMarkerAlt className="text-primary" />
            <span>Near Me</span>
          </motion.button>

          {/* Filter Toggle */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
          >
            <FaFilter />
            <span>Filters</span>
          </motion.button>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Expanded Filters */}
        <motion.div
          initial={false}
          animate={{
            height: showFilters ? 'auto' : 0,
            opacity: showFilters ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="pt-6 space-y-6">
            {/* Sports Filter */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Sports</h3>
              <div className="flex flex-wrap gap-3">
                {sports.map((sport) => (
                  <motion.button
                    key={sport.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleSport(sport.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                      selectedSports.includes(sport.id)
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white border-border hover:border-primary'
                    }`}
                  >
                    <span className="text-lg">{sport.icon}</span>
                    <span>{sport.name}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Price Range (per hour)</h3>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    step="100"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span>₹0</span>
                  <span>-</span>
                  <span>₹{priceRange[1]}</span>
                </div>
              </div>
            </div>

            {/* Quick Filters */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Quick Filters</h3>
              <div className="flex flex-wrap gap-3">
                {['Available Now', 'Open 24/7', 'Parking Available', 'AC Available'].map((filter) => (
                  <motion.button
                    key={filter}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
                  >
                    {filter}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FilterBar;