// Enhanced interactive map component for turf location display
// Frontend: Shows turfs on map with custom pins and popups
// Backend: Receives turf locations from /turfs/nearby API endpoint

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Filter, List } from 'lucide-react';
import { Turf } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/utils/formatPrice';

interface MapViewProps {
  turfs: Turf[];                           // Array of turfs to display on map
  selectedTurf?: Turf | null;             // Currently selected turf for highlighting
  onTurfSelect: (turf: Turf) => void;     // Callback when turf pin is clicked
  onBookNow: (turfId: string) => void;    // Callback for booking button
  userLocation?: {                         // User's current location for centering
    lat: number;
    lng: number;
  };
  showFilters?: boolean;                   // Whether to show map filters
}

// Mock map implementation - REPLACE WITH GOOGLE MAPS OR MAPBOX
// Backend: Integrate with Google Maps API or Mapbox for real mapping
const MapView: React.FC<MapViewProps> = ({
  turfs,
  selectedTurf,
  onTurfSelect,
  onBookNow,
  userLocation,
  showFilters = true
}) => {
  const [mapCenter, setMapCenter] = useState({
    lat: userLocation?.lat || 28.6139,    // Default to Delhi if no user location
    lng: userLocation?.lng || 77.2090
  });
  const [selectedPin, setSelectedPin] = useState<Turf | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  // Handle turf pin click - show info popup
  const handlePinClick = (turf: Turf) => {
    setSelectedPin(turf);
    onTurfSelect(turf);
    // Backend: Track map interactions for analytics
  };

  // Get user's current location using browser geolocation
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newCenter = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setMapCenter(newCenter);
          // Backend: Update user's preferred location
        },
        (error) => {
          console.error('Error getting location:', error);
          // Fallback to default location
        }
      );
    }
  };

  return (
    <div className="w-full h-full bg-white rounded-lg overflow-hidden">
      {/* Map controls header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-gray-900">
            {turfs.length} Turfs Found
          </h3>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Get current location button */}
          <Button
            variant="outline"
            size="sm"
            onClick={getCurrentLocation}
            className="flex items-center gap-1"
          >
            <Navigation className="w-4 h-4" />
            My Location
          </Button>
          
          {/* Toggle between map and list view */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <Button
              variant={viewMode === 'map' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('map')}
              className="flex items-center gap-1"
            >
              <MapPin className="w-4 h-4" />
              Map
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="flex items-center gap-1"
            >
              <List className="w-4 h-4" />
              List
            </Button>
          </div>
        </div>
      </div>

      {/* Map view content */}
      {viewMode === 'map' ? (
        <div className="relative h-96 bg-gray-100">
          {/* Mock map container - REPLACE WITH REAL MAP COMPONENT */}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-100">
            <div className="text-center text-gray-600">
              <MapPin className="w-12 h-12 mx-auto mb-2 text-primary" />
              <p className="text-lg font-medium">Interactive Map View</p>
              <p className="text-sm">
                Replace with Google Maps or Mapbox integration
              </p>
            </div>
          </div>

          {/* Mock turf pins positioned absolutely */}
          {turfs.map((turf, index) => (
            <motion.div
              key={turf.id}
              className="absolute cursor-pointer"
              style={{
                // Mock positioning - REPLACE WITH REAL COORDINATES
                left: `${20 + (index * 15)}%`,
                top: `${30 + (index % 3) * 20}%`,
              }}
              whileHover={{ scale: 1.1 }}
              onClick={() => handlePinClick(turf)}
            >
              {/* Custom map pin */}
              <div className={`relative w-8 h-8 rounded-full border-2 border-white shadow-lg ${
                selectedPin?.id === turf.id 
                  ? 'bg-primary scale-125' 
                  : 'bg-blue-500 hover:bg-primary'
              } transition-all duration-200`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {formatPrice(turf.basePrice).replace('₹', '₹').slice(0, 3)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Info popup for selected turf */}
          {selectedPin && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute bottom-4 left-4 right-4 z-10"
            >
              <Card className="shadow-xl">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-lg">{selectedPin.name}</h4>
                      <p className="text-gray-600 text-sm">
                        {selectedPin.location.address}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => setSelectedPin(null)}
                      variant="ghost"
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </Button>
                  </div>
                  
                  {/* Sports badges */}
                  <div className="flex gap-1 mb-3">
                    {selectedPin.sports.slice(0, 3).map((sport) => (
                      <Badge key={sport} variant="secondary" className="text-xs">
                        {sport}
                      </Badge>
                    ))}
                  </div>
                  
                  {/* Price and booking */}
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xl font-bold text-primary">
                        {formatPrice(selectedPin.basePrice)}
                      </span>
                      <span className="text-gray-600 text-sm">/hour</span>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => onBookNow(selectedPin.id)}
                      className="bg-primary hover:bg-primary-hover"
                    >
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      ) : (
        /* List view as fallback */
        <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
          {turfs.map((turf) => (
            <Card
              key={turf.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handlePinClick(turf)}
            >
              <CardContent className="p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">{turf.name}</h4>
                    <p className="text-sm text-gray-600">{turf.location.city}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">
                      {formatPrice(turf.basePrice)}
                    </p>
                    <p className="text-xs text-gray-500">/hour</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MapView;