// Enhanced MapView component - placeholder for Google Maps integration
// **BACKEND INTEGRATION**: Requires Google Maps API key and turf location data

import React from 'react';
import { MapPin } from 'lucide-react';
import { Turf } from '@/types';

interface MapViewProps {
  turfs: Turf[];
  onTurfSelect: (turf: Turf) => void;
  className?: string;
}

// **TODO: Implement Google Maps integration**
// 1. Add Google Maps API key to environment variables
// 2. Load Google Maps JavaScript API
// 3. Create markers for each turf location
// 4. Add click handlers for turf selection
const MapView: React.FC<MapViewProps> = ({ turfs, onTurfSelect, className }) => {
  return (
    <div className={`bg-muted/20 rounded-lg p-8 text-center min-h-[500px] flex items-center justify-center ${className}`}>
      <div>
        <MapPin className="text-6xl text-primary mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2">Interactive Map Coming Soon</h3>
        <p className="text-muted-foreground mb-4">
          Google Maps integration with {turfs.length} turfs will be available after backend setup.
        </p>
        <div className="text-sm text-muted-foreground">
          <p>• Real-time turf locations</p>
          <p>• Distance calculations</p>
          <p>• Interactive markers</p>
        </div>
      </div>
    </div>
  );
};

export default MapView;
