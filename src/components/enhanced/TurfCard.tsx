// Enhanced TurfCard component with comprehensive sports features
// Frontend: Displays turf information with booking integration
// Backend: Receives turf data from /turfs API endpoint

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, Users, Clock, Wifi, Car, Droplets } from 'lucide-react';
import { Turf } from '@/types';
import { formatPrice } from '@/utils/formatPrice';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface TurfCardProps {
  turf: Turf;                          // Turf data from backend
  onBookNow: (turfId: string) => void; // Callback for booking button click
  onViewDetails: (turfId: string) => void; // Callback for details view
  showDistance?: boolean;              // Whether to show distance from user
  distance?: number;                   // Distance in kilometers
}

// Amenity icons mapping for visual display
// Backend: Store amenity icons in amenities table
const amenityIcons: { [key: string]: React.ReactNode } = {
  'parking': <Car className="w-4 h-4" />,
  'wifi': <Wifi className="w-4 h-4" />,
  'water': <Droplets className="w-4 h-4" />,
  // Add more amenity icons as needed
};

const TurfCard: React.FC<TurfCardProps> = ({
  turf,
  onBookNow,
  onViewDetails,
  showDistance = false,
  distance
}) => {
  // Calculate availability status for today
  const isOpenToday = () => {
    const today = new Date().toLocaleString('en-US', { weekday: 'long' });
    return turf.availability.daysOpen.includes(today);
  };

  // Format opening hours for display
  const formatHours = () => {
    return `${turf.availability.openTime} - ${turf.availability.closeTime}`;
  };

  return (
    <motion.div
      // Smooth entry animation for better UX
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}        // Hover effect for interactivity
      className="w-full"
    >
      <Card className="overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-300">
        {/* Image carousel section */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={turf.photos[0] || '/assets/hero-turf.jpg'}  // Fallback image
            alt={`${turf.name} sports facility`}
            className="w-full h-full object-cover"
          />
          
          {/* Verification badge overlay */}
          {turf.verified && (
            <Badge className="absolute top-3 left-3 bg-primary text-white">
              ✓ Verified
            </Badge>
          )}
          
          {/* Distance badge if available */}
          {showDistance && distance && (
            <Badge className="absolute top-3 right-3 bg-white text-gray-700">
              {distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance}km`}
            </Badge>
          )}
        </div>

        <CardContent className="p-6">
          {/* Header section with name and rating */}
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {turf.name}
              </h3>
              <div className="flex items-center text-gray-600 text-sm">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{turf.location.city}</span>
                {turf.location.landmark && (
                  <span className="ml-1">• {turf.location.landmark}</span>
                )}
              </div>
            </div>
            
            {/* Rating display */}
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
              <span className="font-medium">{turf.rating}</span>
              <span className="text-gray-500 text-sm ml-1">
                ({turf.totalReviews})
              </span>
            </div>
          </div>

          {/* Sports badges */}
          <div className="flex flex-wrap gap-1 mb-3">
            {turf.sports.map((sport) => (
              <Badge
                key={sport}
                variant="secondary"
                className="text-xs"
              >
                {sport}
              </Badge>
            ))}
          </div>

          {/* Key information grid */}
          <div className="grid grid-cols-2 gap-3 mb-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              <span>{turf.idealPlayers} players</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              <span>{formatHours()}</span>
            </div>
          </div>

          {/* Amenities preview */}
          {turf.amenities.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-gray-600">Amenities:</span>
              <div className="flex gap-1">
                {turf.amenities.slice(0, 4).map((amenity) => (
                  <div
                    key={amenity.id}
                    className="flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full"
                    title={amenity.name}
                  >
                    {amenityIcons[amenity.id] || (
                      <span className="text-xs">{amenity.icon}</span>
                    )}
                  </div>
                ))}
                {turf.amenities.length > 4 && (
                  <span className="text-sm text-gray-500">
                    +{turf.amenities.length - 4} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Pricing and action buttons */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <div>
              <span className="text-2xl font-bold text-primary">
                {formatPrice(turf.basePrice)}
              </span>
              <span className="text-gray-600 text-sm">/hour</span>
            </div>
            
            <div className="flex gap-2">
              {/* View details button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetails(turf.id)}
                className="text-primary border-primary hover:bg-primary hover:text-white"
              >
                Details
              </Button>
              
              {/* Book now button */}
              <Button
                size="sm"
                onClick={() => onBookNow(turf.id)}
                disabled={!isOpenToday()}
                className="bg-primary hover:bg-primary-hover text-white"
              >
                {isOpenToday() ? 'Book Now' : 'Closed Today'}
              </Button>
            </div>
          </div>

          {/* Availability indicator */}
          <div className="mt-3 flex items-center justify-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${
              isOpenToday() ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className="text-xs text-gray-600">
              {isOpenToday() ? 'Open today' : 'Closed today'}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TurfCard;