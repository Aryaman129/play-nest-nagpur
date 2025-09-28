import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Navigation, 
  Layers, 
  Search, 
  Filter,
  Star,
  Clock,
  DollarSign,
  Phone,
  Navigation2,
  Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Turf } from '@/types/turf';
import { MOCK_TURFS } from '@/utils/mockData';

interface TurfMapViewProps {
  turfs?: Turf[];
  selectedTurf?: string | null;
  onTurfSelect?: (turfId: string) => void;
  onGetDirections?: (turf: Turf) => void;
  center?: { lat: number; lng: number };
  zoom?: number;
}

const TurfMapView = ({ 
  turfs = MOCK_TURFS, 
  selectedTurf,
  onTurfSelect,
  onGetDirections,
  center = { lat: 28.6139, lng: 77.2090 },
  zoom = 12
}: TurfMapViewProps) => {
  const [mapMode, setMapMode] = useState<'satellite' | 'roadmap' | 'terrain'>('roadmap');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Mock map implementation (replace with actual map library)
  const [viewState, setViewState] = useState({
    latitude: center.lat,
    longitude: center.lng,
    zoom,
  });

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log('Location access denied:', error);
        }
      );
    }
  }, []);

  const filteredTurfs = turfs.filter(turf =>
    turf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    turf.location.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const calculateDistance = (turf: Turf): number => {
    if (!userLocation) return 0;
    // Simple distance calculation (replace with proper geolocation library)
    const R = 6371; // Earth's radius in km
    const dLat = (turf.location.lat - userLocation.lat) * Math.PI / 180;
    const dLon = (turf.location.lng - userLocation.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(turf.location.lat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const handleTurfClick = (turf: Turf) => {
    onTurfSelect?.(turf.id);
    setViewState({
      latitude: turf.location.lat,
      longitude: turf.location.lng,
      zoom: 15,
    });
  };

  const handleGetDirections = (turf: Turf) => {
    onGetDirections?.(turf);
    // Open in Google Maps
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${turf.location.lat},${turf.location.lng}`;
    window.open(googleMapsUrl, '_blank');
  };

  const handleShareLocation = (turf: Turf) => {
    if (navigator.share) {
      navigator.share({
        title: turf.name,
        text: `Check out this turf: ${turf.name}`,
        url: `https://maps.google.com/maps?q=${turf.location.lat},${turf.location.lng}`,
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(
        `${turf.name} - https://maps.google.com/maps?q=${turf.location.lat},${turf.location.lng}`
      );
    }
  };

  return (
    <div className="relative w-full h-full min-h-[600px] bg-gray-100 rounded-lg overflow-hidden">
      {/* Map Container */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100">
        {/* Mock Map Grid */}
        <div className="w-full h-full relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="grid grid-cols-12 h-full">
              {Array.from({ length: 144 }, (_, i) => (
                <div key={i} className="border border-gray-300"></div>
              ))}
            </div>
          </div>

          {/* Mock Turf Markers */}
          {filteredTurfs.map((turf, index) => {
            const x = 20 + (index % 4) * 20; // Distribute across map
            const y = 20 + Math.floor(index / 4) * 25;
            const isSelected = selectedTurf === turf.id;
            const distance = calculateDistance(turf);

            return (
              <motion.div
                key={turf.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 z-10`}
                style={{ left: `${x}%`, top: `${y}%` }}
                onClick={() => handleTurfClick(turf)}
              >
                <div className={`relative ${isSelected ? 'z-20' : 'z-10'}`}>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all ${
                      isSelected
                        ? 'bg-primary text-primary-foreground scale-125'
                        : 'bg-white text-primary hover:scale-110'
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                  </div>
                  
                  {/* Price Badge */}
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-1 py-0.5 rounded-full">
                    ₹{turf.basePrice}
                  </div>

                  {/* Turf Info Card (on selection) */}
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-10 left-1/2 transform -translate-x-1/2 w-72 z-30"
                    >
                      <Card className="shadow-xl">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">{turf.name}</CardTitle>
                          <CardDescription className="text-xs">
                            {turf.location.address}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span>{turf.rating}</span>
                                <span className="text-muted-foreground">({turf.totalReviews})</span>
                              </div>
                              {userLocation && (
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <Navigation className="w-3 h-3" />
                                  <span>{distance.toFixed(1)} km away</span>
                                </div>
                              )}
                            </div>

                            <div className="flex flex-wrap gap-1">
                              {turf.sports.slice(0, 3).map((sport, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {sport}
                                </Badge>
                              ))}
                              {turf.sports.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{turf.sports.length - 3} more
                                </Badge>
                              )}
                            </div>

                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-1">
                                <DollarSign className="w-3 h-3" />
                                <span>₹{turf.basePrice}/hour</span>
                              </div>
                              <div className="flex items-center gap-1 text-green-600">
                                <Clock className="w-3 h-3" />
                                <span>Available now</span>
                              </div>
                            </div>

                            <Separator />

                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                className="flex-1 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Navigate to booking
                                  console.log('Book turf:', turf.id);
                                }}
                              >
                                Book Now
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleGetDirections(turf);
                                }}
                              >
                                <Navigation2 className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleShareLocation(turf);
                                }}
                              >
                                <Share2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}

          {/* User Location Marker */}
          {userLocation && (
            <div
              className="absolute w-4 h-4 bg-blue-500 rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2 z-10"
              style={{ left: '50%', top: '50%' }}
            >
              <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75"></div>
            </div>
          )}
        </div>
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 left-4 right-4 z-20">
        <div className="flex gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search turfs or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/90 backdrop-blur-sm"
            />
          </div>

          {/* Map Controls */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={showFilters ? 'default' : 'outline'}
              onClick={() => setShowFilters(!showFilters)}
              className="bg-white/90 backdrop-blur-sm"
            >
              <Filter className="w-4 h-4" />
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => setMapMode(mapMode === 'roadmap' ? 'satellite' : 'roadmap')}
              className="bg-white/90 backdrop-blur-sm"
            >
              <Layers className="w-4 h-4" />
            </Button>

            {userLocation && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setViewState({
                  latitude: userLocation.lat,
                  longitude: userLocation.lng,
                  zoom: 15,
                })}
                className="bg-white/90 backdrop-blur-sm"
              >
                <Navigation className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Results Counter */}
      <div className="absolute bottom-4 left-4 z-20">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-sm">
          {filteredTurfs.length} turf{filteredTurfs.length !== 1 ? 's' : ''} found
        </div>
      </div>

      {/* Map Type Badge */}
      <div className="absolute bottom-4 right-4 z-20">
        <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
          {mapMode} view
        </Badge>
      </div>
    </div>
  );
};

export default TurfMapView;