import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Clock, 
  Filter, 
  Star,
  Users,
  DollarSign,
  Activity,
  X,
  SlidersHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { SPORTS, AMENITIES } from '@/utils/mockData';

interface SearchFilters {
  query: string;
  location: string;
  date?: Date;
  timeSlot: string;
  sports: string[];
  priceRange: [number, number];
  rating: number;
  amenities: string[];
  capacity: number;
  distance: number;
  sortBy: 'price' | 'rating' | 'distance' | 'popularity';
  sortOrder: 'asc' | 'desc';
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  onClearFilters: () => void;
  initialFilters?: Partial<SearchFilters>;
}

const AdvancedSearch = ({ onSearch, onClearFilters, initialFilters }: AdvancedSearchProps) => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    location: '',
    timeSlot: '',
    sports: [],
    priceRange: [0, 5000],
    rating: 0,
    amenities: [],
    capacity: 10,
    distance: 25,
    sortBy: 'popularity',
    sortOrder: 'desc',
    ...initialFilters,
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Football turf near me',
    'Basketball court Andheri',
    'Tennis court weekend',
    'Cricket ground south Mumbai',
  ]);

  const timeSlots = [
    'Early Morning (5AM - 8AM)',
    'Morning (8AM - 12PM)',
    'Afternoon (12PM - 5PM)',
    'Evening (5PM - 8PM)',
    'Night (8PM - 11PM)',
  ];

  useEffect(() => {
    // Debounced search
    const timeout = setTimeout(() => {
      onSearch(filters);
    }, 300);

    return () => clearTimeout(timeout);
  }, [filters, onSearch]);

  const updateFilter = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleSport = (sport: string) => {
    setFilters(prev => ({
      ...prev,
      sports: prev.sports.includes(sport)
        ? prev.sports.filter(s => s !== sport)
        : [...prev.sports, sport]
    }));
  };

  const toggleAmenity = (amenityId: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(a => a !== amenityId)
        : [...prev.amenities, amenityId]
    }));
  };

  const clearAllFilters = () => {
    const clearedFilters: SearchFilters = {
      query: '',
      location: '',
      date: undefined,
      timeSlot: '',
      sports: [],
      priceRange: [0, 5000],
      rating: 0,
      amenities: [],
      capacity: 10,
      distance: 25,
      sortBy: 'popularity',
      sortOrder: 'desc',
    };
    setFilters(clearedFilters);
    onClearFilters();
  };

  const hasActiveFilters = 
    filters.sports.length > 0 ||
    filters.amenities.length > 0 ||
    filters.rating > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 5000 ||
    filters.capacity > 10 ||
    filters.distance < 25 ||
    filters.timeSlot ||
    filters.date;

  const handleRecentSearch = (searchQuery: string) => {
    updateFilter('query', searchQuery);
    // Move to top of recent searches
    setRecentSearches(prev => [
      searchQuery,
      ...prev.filter(q => q !== searchQuery)
    ]);
  };

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Query */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search turfs, sports, locations..."
                value={filters.query}
                onChange={(e) => updateFilter('query', e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Location */}
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Location or area"
                value={filters.location}
                onChange={(e) => updateFilter('location', e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Date */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="justify-start text-left font-normal"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {filters.date ? format(filters.date, 'PPP') : 'Select date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={filters.date}
                  onSelect={(date) => updateFilter('date', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Advanced Filters Toggle */}
          <div className="flex items-center justify-between mt-4">
            <Button
              variant="ghost"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              {showAdvanced ? 'Hide' : 'Show'} Advanced Filters
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {[
                    filters.sports.length,
                    filters.amenities.length,
                    filters.rating > 0 ? 1 : 0,
                    filters.priceRange[0] > 0 || filters.priceRange[1] < 5000 ? 1 : 0,
                    filters.capacity > 10 ? 1 : 0,
                    filters.distance < 25 ? 1 : 0,
                    filters.timeSlot ? 1 : 0,
                    filters.date ? 1 : 0,
                  ].reduce((sum, count) => sum + count, 0)}
                </Badge>
              )}
            </Button>

            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="text-xs"
              >
                <X className="w-3 h-3 mr-1" />
                Clear All
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Searches */}
      {!showAdvanced && filters.query === '' && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Recent Searches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleRecentSearch(search)}
                  className="text-xs"
                >
                  {search}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Advanced Filters */}
      {showAdvanced && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Advanced Filters
              </CardTitle>
              <CardDescription>
                Fine-tune your search to find the perfect turf
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Sports Selection */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Sports
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {SPORTS.map((sport) => (
                    <Button
                      key={sport}
                      variant={filters.sports.includes(sport) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleSport(sport)}
                      className="justify-start"
                    >
                      {sport}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Time Slot */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Preferred Time
                </h4>
                <Select value={filters.timeSlot} onValueChange={(value) => updateFilter('timeSlot', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Price Range */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Price Range per Hour
                </h4>
                <div className="space-y-4">
                  <Slider
                    value={filters.priceRange}
                    onValueChange={(value) => updateFilter('priceRange', value as [number, number])}
                    max={5000}
                    min={0}
                    step={100}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>₹{filters.priceRange[0]}</span>
                    <span>₹{filters.priceRange[1]}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Rating */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Minimum Rating
                </h4>
                <div className="flex gap-2">
                  {[0, 3, 4, 4.5].map((rating) => (
                    <Button
                      key={rating}
                      variant={filters.rating === rating ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateFilter('rating', rating)}
                    >
                      {rating === 0 ? 'Any' : `${rating}+ ⭐`}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Group Size */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Group Size: {filters.capacity} players
                </h4>
                <Slider
                  value={[filters.capacity]}
                  onValueChange={([value]) => updateFilter('capacity', value)}
                  max={50}
                  min={2}
                  step={2}
                  className="w-full"
                />
              </div>

              <Separator />

              {/* Distance */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Maximum Distance: {filters.distance} km
                </h4>
                <Slider
                  value={[filters.distance]}
                  onValueChange={([value]) => updateFilter('distance', value)}
                  max={50}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>

              <Separator />

              {/* Amenities */}
              <div>
                <h4 className="font-medium mb-3">Amenities</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {AMENITIES.map((amenity) => (
                    <div key={amenity.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={amenity.id}
                        checked={filters.amenities.includes(amenity.id)}
                        onCheckedChange={() => toggleAmenity(amenity.id)}
                      />
                      <label
                        htmlFor={amenity.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {amenity.icon} {amenity.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Sort Options */}
              <div>
                <h4 className="font-medium mb-3">Sort Results</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value as SearchFilters['sortBy'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popularity">Popularity</SelectItem>
                      <SelectItem value="price">Price</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                      <SelectItem value="distance">Distance</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={filters.sortOrder} onValueChange={(value) => updateFilter('sortOrder', value as SearchFilters['sortOrder'])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Order" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asc">Low to High</SelectItem>
                      <SelectItem value="desc">High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default AdvancedSearch;