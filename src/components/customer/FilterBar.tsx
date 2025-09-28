import { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, X, MapPin, DollarSign, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface FilterBarProps {
  onFilterChange: (filters: TurfFilters) => void;
  className?: string;
}

export interface TurfFilters {
  priceRange: [number, number];
  sports: string[];
  size: string;
  sortBy: string;
  distance: number;
  timeSlot: string;
}

const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange, className }) => {
  const [filters, setFilters] = useState<TurfFilters>({
    priceRange: [500, 3000],
    sports: [],
    size: '',
    sortBy: 'distance',
    distance: 10,
    timeSlot: ''
  });

  const [isOpen, setIsOpen] = useState(false);

  const sportsOptions = [
    'Football', 'Cricket', 'Tennis', 'Badminton', 'Basketball', 'Volleyball'
  ];

  const sizeOptions = [
    { value: '5v5', label: '5v5 (Small)' },
    { value: '7v7', label: '7v7 (Medium)' },
    { value: '11v11', label: '11v11 (Large)' }
  ];

  const sortOptions = [
    { value: 'distance', label: 'Nearest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' }
  ];

  const timeSlotOptions = [
    { value: 'morning', label: 'Morning (6AM-12PM)' },
    { value: 'afternoon', label: 'Afternoon (12PM-6PM)' },
    { value: 'evening', label: 'Evening (6PM-10PM)' }
  ];

  const updateFilters = (newFilters: Partial<TurfFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleSportsChange = (sport: string, checked: boolean) => {
    const updatedSports = checked
      ? [...filters.sports, sport]
      : filters.sports.filter(s => s !== sport);
    updateFilters({ sports: updatedSports });
  };

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

  const activeFiltersCount = [
    filters.sports.length > 0,
    filters.size !== '',
    filters.timeSlot !== '',
    filters.priceRange[0] !== 500 || filters.priceRange[1] !== 3000
  ].filter(Boolean).length;

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Price Range */}
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

      {/* Sports */}
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

      {/* Turf Size */}
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

      {/* Time Slot */}
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

      {/* Distance */}
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
          Within {filters.distance} km
        </div>
      </div>

      {/* Sort By */}
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

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <Button 
          variant="outline" 
          onClick={clearFilters} 
          className="w-full"
        >
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className={cn('flex gap-4', className)}>
      {/* Desktop Filters */}
      <div className="hidden lg:block bg-card rounded-xl p-6 shadow-lg min-w-[300px]">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Filters</h3>
          {activeFiltersCount > 0 && (
            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        <FilterContent />
      </div>

      {/* Mobile Filter Button */}
      <div className="lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="relative">
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full sm:w-[400px]">
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
    </div>
  );
};

export default FilterBar;