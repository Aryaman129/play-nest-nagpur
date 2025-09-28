import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Navigation, 
  Target, 
  Clock, 
  Car,
  Train,
  User,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppToast } from '@/components/common/Toast';

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

interface DirectionsData {
  distance: string;
  duration: string;
  mode: 'driving' | 'walking' | 'transit';
  steps: Array<{
    instruction: string;
    distance: string;
    duration: string;
  }>;
}

interface LocationServicesProps {
  destination?: {
    latitude: number;
    longitude: number;
    name: string;
    address: string;
  };
  onLocationUpdate?: (location: LocationData) => void;
  showDirections?: boolean;
}

const LocationServices = ({ destination, onLocationUpdate, showDirections = false }: LocationServicesProps) => {
  const { success, error, info } = useAppToast();
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [directions, setDirections] = useState<DirectionsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<'prompt' | 'granted' | 'denied' | 'unknown'>('unknown');

  useEffect(() => {
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    if ('permissions' in navigator) {
      try {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        setPermissionStatus(permission.state);
        
        permission.addEventListener('change', () => {
          setPermissionStatus(permission.state);
        });
      } catch (err) {
        console.log('Permission API not supported');
      }
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser');
      return;
    }

    setLoading(true);
    setLocationError(null);

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000, // Cache for 1 minute
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };

        // Reverse geocoding (mock implementation)
        try {
          const address = await reverseGeocode(locationData.latitude, locationData.longitude);
          locationData.address = address.address;
          locationData.city = address.city;
          locationData.state = address.state;
          locationData.pincode = address.pincode;
        } catch (err) {
          console.log('Reverse geocoding failed:', err);
        }

        setCurrentLocation(locationData);
        onLocationUpdate?.(locationData);
        success('Location updated successfully');
        setLoading(false);

        // Get directions if destination is provided
        if (destination && showDirections) {
          getDirections(locationData, destination);
        }
      },
      (error) => {
        setLoading(false);
        let errorMessage = 'Failed to get location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            setPermissionStatus('denied');
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        
        setLocationError(errorMessage);
        error(errorMessage);
      },
      options
    );
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    // Mock reverse geocoding - replace with actual service
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      address: '123 Mock Street, Sample Area',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
    };
  };

  const getDirections = async (origin: LocationData, dest: typeof destination) => {
    if (!dest) return;

    setLoading(true);
    try {
      // Mock directions API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockDirections: DirectionsData = {
        distance: '2.5 km',
        duration: '8 minutes',
        mode: 'driving',
        steps: [
          {
            instruction: 'Head east on Mock Street toward Sample Road',
            distance: '0.5 km',
            duration: '2 min',
          },
          {
            instruction: 'Turn right onto Sample Road',
            distance: '1.2 km',
            duration: '4 min',
          },
          {
            instruction: 'Turn left onto Destination Avenue',
            distance: '0.8 km',
            duration: '2 min',
          },
          {
            instruction: 'Arrive at destination on the right',
            distance: '0 km',
            duration: '0 min',
          },
        ],
      };

      setDirections(mockDirections);
      info('Directions calculated successfully');
    } catch (err) {
      error('Failed to get directions');
    } finally {
      setLoading(false);
    }
  };

  const openInMaps = () => {
    if (!destination) return;
    
    const url = `https://www.google.com/maps/dir/?api=1&destination=${destination.latitude},${destination.longitude}`;
    window.open(url, '_blank');
  };

  const shareLocation = async () => {
    if (!currentLocation) return;

    const shareData = {
      title: 'My Current Location',
      text: 'Here is my current location',
      url: `https://www.google.com/maps/@${currentLocation.latitude},${currentLocation.longitude},15z`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        success('Location shared successfully');
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(shareData.url);
      success('Location link copied to clipboard');
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Location */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Current Location
          </CardTitle>
          <CardDescription>
            Your current position and location services
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {locationError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{locationError}</AlertDescription>
            </Alert>
          )}

          {permissionStatus === 'denied' && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Location access is disabled. Please enable location services in your browser settings to use this feature.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-3">
            <Button
              onClick={getCurrentLocation}
              disabled={loading || permissionStatus === 'denied'}
              className="flex-1"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <MapPin className="w-4 h-4 mr-2" />
              )}
              {loading ? 'Getting Location...' : 'Get Current Location'}
            </Button>

            {currentLocation && (
              <Button variant="outline" onClick={shareLocation}>
                Share Location
              </Button>
            )}
          </div>

          {currentLocation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="font-medium">Coordinates:</span>
                    <div className="font-mono text-xs">
                      {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Accuracy:</span>
                    <div>±{Math.round(currentLocation.accuracy)} meters</div>
                  </div>
                  {currentLocation.address && (
                    <div className="md:col-span-2">
                      <span className="font-medium">Address:</span>
                      <div>{currentLocation.address}</div>
                      {currentLocation.city && (
                        <div className="text-muted-foreground">
                          {currentLocation.city}, {currentLocation.state} {currentLocation.pincode}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Directions */}
      {destination && showDirections && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="w-5 h-5" />
              Directions to {destination.name}
            </CardTitle>
            <CardDescription>{destination.address}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Button
                onClick={() => currentLocation && getDirections(currentLocation, destination)}
                disabled={loading || !currentLocation}
                className="flex-1"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Navigation className="w-4 h-4 mr-2" />
                )}
                Get Directions
              </Button>
              <Button variant="outline" onClick={openInMaps}>
                Open in Maps
              </Button>
            </div>

            {directions && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="steps">Steps</TabsTrigger>
                    <TabsTrigger value="transport">Transport</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-muted/50 rounded-lg text-center">
                        <div className="text-2xl font-bold text-primary">{directions.distance}</div>
                        <div className="text-sm text-muted-foreground">Distance</div>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg text-center">
                        <div className="text-2xl font-bold text-primary">{directions.duration}</div>
                        <div className="text-sm text-muted-foreground">Duration</div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="steps" className="space-y-2">
                    {directions.steps.map((step, index) => (
                      <div key={index} className="flex gap-3 p-3 bg-muted/50 rounded-lg">
                        <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm">{step.instruction}</div>
                          <div className="text-xs text-muted-foreground">
                            {step.distance} • {step.duration}
                          </div>
                        </div>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="transport" className="space-y-3">
                    <div className="grid grid-cols-3 gap-3">
                      <Button variant="outline" className="flex-col h-auto p-4">
                        <Car className="w-6 h-6 mb-2" />
                        <span className="text-xs">Driving</span>
                        <span className="text-xs text-muted-foreground">8 min</span>
                      </Button>
                      <Button variant="outline" className="flex-col h-auto p-4">
                        <User className="w-6 h-6 mb-2" />
                        <span className="text-xs">Walking</span>
                        <span className="text-xs text-muted-foreground">25 min</span>
                      </Button>
                      <Button variant="outline" className="flex-col h-auto p-4">
                        <Train className="w-6 h-6 mb-2" />
                        <span className="text-xs">Transit</span>
                        <span className="text-xs text-muted-foreground">15 min</span>
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </motion.div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LocationServices;