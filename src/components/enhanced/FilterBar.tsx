import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, X, MapPin, DollarSign, Users, Clock } from 'lucide-react';

// UI Components
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

// **BACKEND INTEGRATION INTERFACES**
// These interfaces define the structure for filtering turfs
// Backend should implement similar filtering logic

export interface TurfFilters {
  priceRange: [number, number];     // Price range filter in rupees per hour
  sports: string[];                 // Array of selected sports for filtering
  size: string;                     // Turf size preference (5v5, 7v7, 11v11)
  sortBy: string;                   // Sorting criteria (distance, price, rating)
  distance: number;                 // Maximum distance in kilometers
  timeSlot: string;                 // Preferred time slot for availability
  location?: string;                // Optional location filter
  amenities?: string[];             // Optional amenities filter
}

interface FilterBarProps {
  onFilterChange: (filters: TurfFilters) => void;
  className?: string;
  initialFilters?: TurfFilters;
}

// **BACKEND INTEGRATION COMPONENT**
// This component handles all turf filtering logic
// Backend should implement similar filter processing for optimal performance
const FilterBar: React.FC<FilterBarProps> = ({ 
  onFilterChange, 
  className,
  initialFilters 
}) => {
  // Initialize filters with default values or provided initial filters
  const [filters, setFilters] = useState<TurfFilters>(initialFilters || {
    priceRange: [500, 3000],
    sports: [],
    size: '',
    sortBy: 'distance',
    distance: 10,
    timeSlot: ''
  });

  const [isOpen, setIsOpen] = useState(false);

  // **BACKEND INTEGRATION DATA**
  // These options should be fetched from backend API endpoints
  // GET /api/sports - Available sports in the system
  const sportsOptions = [
    'Football', 'Cricket', 'Tennis', 'Badminton', 'Basketball', 'Volleyball'
  ];

  // GET /api/turf-sizes - Available turf size configurations
  const sizeOptions = [
    { value: '5v5', label: '5v5 (Small)' },
    { value: '7v7', label: '7v7 (Medium)' },
    { value: '11v11', label: '11v11 (Large)' }
  ];

  // Sorting options for turf listings
  const sortOptions = [
    { value: 'distance', label: 'Nearest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'availability', label: 'Most Available' }
  ];

  // Time slot options for availability filtering
  const timeSlotOptions = [
    { value: 'morning', label: 'Morning (6AM-12PM)' },
    { value: 'afternoon', label: 'Afternoon (12PM-6PM)' },
    { value: 'evening', label: 'Evening (6PM-10PM)' },
    { value: 'night', label: 'Night (10PM-12AM)' }
  ];

  // **BACKEND INTEGRATION FUNCTION**
  // Update filters and notify parent component
  // This triggers API calls to fetch filtered results
  const updateFilters = (newFilters: Partial<TurfFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    
    // Notify parent component to trigger API call with new filters
    onFilterChange(updatedFilters);
  };

  // Handle sports selection with multi-select capability
  const handleSportsChange = (sport: string, checked: boolean) => {
    const updatedSports = checked
      ? [...filters.sports, sport]
      : filters.sports.filter(s => s !== sport);
    updateFilters({ sports: updatedSports });
  };

  // Reset all filters to default values
  const clearFilters = () => {
    const defaultFilters: TurfFilters = {
      priceRange: [500, 3000],
      sports: [],
      size: '',
      sortBy: 'distance',
      distance: 10,
      timeSlot: ''
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  // Calculate number of active filters for badge display
  const activeFiltersCount = [
    filters.sports.length > 0,
    filters.size !== '',
    filters.timeSlot !== '',
    filters.priceRange[0] !== 500 || filters.priceRange[1] !== 3000,
    filters.distance !== 10
  ].filter(Boolean).length;

  // **UI COMPONENT - FILTER CONTENT**
  // This component renders all filter controls
  const FilterContent = () => (
    <div className="space-y-6">
      {/* Price Range Filter */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
          <DollarSign className="w-4 h-4 text-primary" />
          Price Range (₹/hour)
        </label>
        <Slider
          value={filters.priceRange}
          onValueChange={(value) => updateFilters({ priceRange: value as [number, number] })}
          max={5000}
          min={200}
          step={100}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>₹{filters.priceRange[0]}</span>
          <span>₹{filters.priceRange[1]}</span>
        </div>
      </div>

      {/* Sports Filter - Multi-select checkboxes */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
          ⚽ Sports Available
        </label>
        <div className="grid grid-cols-2 gap-2">
          {sportsOptions.map((sport) => (
            <label key={sport} className="flex items-center space-x-2 cursor-pointer">
              <Checkbox
                checked={filters.sports.includes(sport)}
                onCheckedChange={(checked) => handleSportsChange(sport, checked as boolean)}
              />
              <span className="text-sm">{sport}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Turf Size Filter */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
          <Users className="w-4 h-4 text-primary" />
          Turf Size
        </label>
        <Select value={filters.size} onValueChange={(value) => updateFilters({ size: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select turf size" />
          </SelectTrigger>
          <SelectContent>
            {sizeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Time Slot Filter */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
          <Clock className="w-4 h-4 text-primary" />
          Preferred Time
        </label>
        <Select value={filters.timeSlot} onValueChange={(value) => updateFilters({ timeSlot: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select time slot" />
          </SelectTrigger>
          <SelectContent>
            {timeSlotOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Distance Filter */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
          <MapPin className="w-4 h-4 text-primary" />
          Distance (km)
        </label>
        <Slider
          value={[filters.distance]}
          onValueChange={(value) => updateFilters({ distance: value[0] })}
          max={50}
          min={1}
          step={1}
          className="w-full"
        />
        <div className="text-xs text-muted-foreground mt-2">
          Within {filters.distance} km from your location
        </div>
      </div>

      {/* Sort By Filter */}
      <div>
        <label className="text-sm font-medium text-foreground mb-3 block">
          Sort By
        </label>
        <Select value={filters.sortBy} onValueChange={(value) => updateFilters({ sortBy: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters Button */}
      {activeFiltersCount > 0 && (
        <Button 
          variant="outline" 
          onClick={clearFilters} 
          className="w-full"
        >
          <X className="w-4 h-4 mr-2" />
          Clear All Filters ({activeFiltersCount})
        </Button>
      )}
    </div>
  );

  return (
    <div className={cn('bg-background py-6', className)}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-4">
          {/* Desktop Filters - Always visible on larger screens */}
          <div className="hidden lg:block bg-card rounded-xl p-6 shadow-lg min-w-[320px] max-w-[320px]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground">Filter Turfs</h3>
              {activeFiltersCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full"
                >
                  {activeFiltersCount} active
                </motion.span>
              )}
            </div>
            <FilterContent />
          </div>

          {/* Mobile Filter Button - Show on smaller screens */}
          <div className="lg:hidden flex items-start">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="relative">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center"
                    >
                      {activeFiltersCount}
                    </motion.span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:w-[400px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filter Turfs</SheetTitle>
                  <SheetDescription>
                    Find the perfect turf for your game
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Results Summary */}
          <div className="flex-1 lg:ml-0">
            <div className="bg-card rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Available Turfs</h2>
                  <p className="text-sm text-muted-foreground">
                    {activeFiltersCount > 0 
                      ? `Showing filtered results (${activeFiltersCount} filters applied)`
                      : 'Showing all available turfs'
                    }
                  </p>
                </div>
                
                {/* Quick Sort - Mobile */}
                <div className="lg:hidden">
                  <Select value={filters.sortBy} onValueChange={(value) => updateFilters({ sortBy: value })}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label.split(' ')[0]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;