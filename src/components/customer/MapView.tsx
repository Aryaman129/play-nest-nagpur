import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Locate } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TurfLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  price: number;
  rating: number;
  sports: string[];
  distance?: number;
}

interface MapViewProps {
  turfs: TurfLocation[];
  selectedTurf?: string;
  onTurfSelect: (turfId: string) => void;
  userLocation?: { lat: number; lng: number };
  className?: string;
}

const MapView: React.FC<MapViewProps> = ({
  turfs,
  selectedTurf,
  onTurfSelect,
  userLocation,
  className
}) => {
  const [currentLocation, setCurrentLocation] = useState(userLocation);
  const [isLocating, setIsLocating] = useState(false);

  // Mock turf locations for Nagpur
  const mockTurfs: TurfLocation[] = [
    {
      id: '1',
      name: 'Sports Arena Nagpur',
      lat: 21.1458,
      lng: 79.0882,
      price: 1200,
      rating: 4.5,
      sports: ['Football', 'Cricket'],
      distance: 2.3
    },
    {
      id: '2',
      name: 'Green Field Sports',
      lat: 21.1619,
      lng: 79.1003,
      price: 1000,
      rating: 4.2,
      sports: ['Tennis', 'Badminton'],
      distance: 3.1
    },
    {
      id: '3',
      name: 'Victory Ground',
      lat: 21.1347,
      lng: 79.0669,
      price: 1500,
      rating: 4.8,
      sports: ['Football', 'Basketball'],
      distance: 1.8
    }
  ];

  const displayTurfs = turfs.length > 0 ? turfs : mockTurfs;

  const getCurrentLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setIsLocating(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default to Nagpur center
          setCurrentLocation({ lat: 21.1458, lng: 79.0882 });
          setIsLocating(false);
        }
      );
    } else {
      setCurrentLocation({ lat: 21.1458, lng: 79.0882 });
      setIsLocating(false);
    }
  };

  useEffect(() => {
    if (!currentLocation) {
      getCurrentLocation();
    }
  }, []);

  // Calculate distance between two points (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Generate Google Maps URL for static map
  const generateMapUrl = () => {
    if (!currentLocation) return '';
    
    const markers = displayTurfs.map(turf => 
      `markers=color:green|label:${turf.name.charAt(0)}|${turf.lat},${turf.lng}`
    ).join('&');
    
    const userMarker = `markers=color:blue|label:You|${currentLocation.lat},${currentLocation.lng}`;
    
    return `https://maps.googleapis.com/maps/api/staticmap?center=${currentLocation.lat},${currentLocation.lng}&zoom=12&size=600x400&maptype=roadmap&${markers}&${userMarker}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'demo'}`;
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Map Header */}
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <MapPin className="w-5 h-5 text-primary" />
          Nearby Turfs
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={getCurrentLocation}
          disabled={isLocating}
          className="flex items-center gap-2"
        >
          {isLocating ? (
            <div className="animate-spin-ball">📍</div>
          ) : (
            <Locate className="w-4 h-4" />
          )}
          {isLocating ? 'Locating...' : 'My Location'}
        </Button>
      </div>

      {/* Map Container */}
      <div className="relative bg-card rounded-xl shadow-lg overflow-hidden">
        {currentLocation ? (
          <div className="relative">
            <img
              src={generateMapUrl()}
              alt="Turf locations map"
              className="w-full h-96 object-cover"
              onError={(e) => {
                // Fallback to a placeholder map
                e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMDAgMjAwTDMyMCAxODBMMzQwIDIwMEwzMjAgMjIwTDMwMCAyMDBaIiBmaWxsPSIjMjJDNTVFIi8+Cjx0ZXh0IHg9IjMwMCIgeT0iMjUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjU3Mzk5IiBmb250LXNpemU9IjE0Ij5NYXAgVW5hdmFpbGFibGU8L3RleHQ+Cjwvc3ZnPg==';
              }}
            />
            
            {/* Map Overlay with Turf Pins */}
            <div className="absolute inset-0 pointer-events-none">
              {displayTurfs.map((turf, index) => (
                <motion.div
                  key={turf.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    'absolute transform -translate-x-1/2 -translate-y-full pointer-events-auto cursor-pointer',
                    selectedTurf === turf.id ? 'z-10' : 'z-0'
                  )}
                  style={{
                    left: `${Math.random() * 80 + 10}%`,
                    top: `${Math.random() * 60 + 20}%`
                  }}
                  onClick={() => onTurfSelect(turf.id)}
                >
                  <div className={cn(
                    'bg-primary text-primary-foreground p-2 rounded-lg shadow-lg border-2 transition-all duration-200',
                    selectedTurf === turf.id 
                      ? 'border-accent scale-110' 
                      : 'border-white hover:scale-105'
                  )}>
                    <div className="text-xs font-medium">{turf.name}</div>
                    <div className="text-xs">₹{turf.price}/hr</div>
                  </div>
                  <div className="w-3 h-3 bg-primary border-2 border-white rounded-full mx-auto"></div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-96 flex items-center justify-center bg-muted">
            <div className="text-center">
              <div className="animate-spin-ball text-4xl mb-4">🗺️</div>
              <p className="text-muted-foreground">Loading map...</p>
            </div>
          </div>
        )}
      </div>

      {/* Turf List */}
      <div className="space-y-3">
        {displayTurfs.map((turf, index) => {
          const distance = currentLocation 
            ? calculateDistance(currentLocation.lat, currentLocation.lng, turf.lat, turf.lng)
            : turf.distance || 0;

          return (
            <motion.div
              key={turf.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onTurfSelect(turf.id)}
              className={cn(
                'card-turf cursor-pointer transition-all duration-200',
                selectedTurf === turf.id && 'ring-2 ring-primary'
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">{turf.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {turf.sports.join(', ')}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-sm font-medium text-primary">
                      ₹{turf.price}/hr
                    </span>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Navigation className="w-3 h-3" />
                      {distance.toFixed(1)} km
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ⭐ {turf.rating}
                    </span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default MapView;