// Interactive Map with Turf Locations - Mapbox Integration
// **BACKEND INTEGRATION**: Requires Mapbox API key stored in Supabase Edge Function Secrets

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Layers, Settings, Key } from 'lucide-react'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAppToast } from '@/components/common/Toast';
import { Turf } from '@/types/turf';

interface InteractiveMapViewProps {
  turfs: Turf[];
  onTurfSelect?: (turf: Turf) => void;
  onGetDirections?: (turf: Turf) => void;
  center?: [number, number];
  zoom?: number;
  className?: string;
}

const InteractiveMapView: React.FC<InteractiveMapViewProps> = ({
  turfs = [],
  onTurfSelect,
  onGetDirections,
  center = [77.5946, 12.9716], // Default: Bangalore coordinates
  zoom = 11,
  className = ''
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const [selectedTurf, setSelectedTurf] = useState<Turf | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [mapStyle, setMapStyle] = useState<string>('mapbox://styles/mapbox/light-v11');
  
  const { success, error, info } = useAppToast();

  // **BACKEND INTEGRATION**: Get Mapbox token from Supabase secrets
  useEffect(() => {
    const getMapboxToken = async () => {
      try {
        // TODO: If connected to Supabase, get token from Edge Function secrets
        // const { data } = await supabase.functions.invoke('get-mapbox-token');
        // setMapboxToken(data.token);
        
        // For now, check localStorage for demo token
        const storedToken = localStorage.getItem('mapbox_demo_token');
        if (storedToken) {
          setMapboxToken(storedToken);
        }
      } catch (err) {
        console.log('Mapbox token not found in backend, using manual input');
      }
    };

    getMapboxToken();
  }, []);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([longitude, latitude]);
          success('📍 Location access granted');
        },
        (error) => {
          console.log('Location access denied:', error);
          info('💡 Enable location for better turf recommendations');
        }
      );
    }
  }, []);

  // Initialize map when token is available
  useEffect(() => {
    if (!mapboxToken || !mapContainer.current || isMapInitialized) return;

    try {
      mapboxgl.accessToken = mapboxToken;
      
      // Create map instance
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: mapStyle,
        center: userLocation || center,
        zoom: zoom,
        pitch: 45,
        bearing: 0,
        antialias: true
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
          showZoom: true,
          showCompass: true
        }),
        'top-right'
      );

      // Add geolocate control
      const geolocate = new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
        showUserHeading: true
      });
      map.current.addControl(geolocate, 'top-right');

      // Add scale control
      map.current.addControl(new mapboxgl.ScaleControl(), 'bottom-left');

      // Map loaded event
      map.current.on('load', () => {
        setIsMapInitialized(true);
        addTurfMarkers();
        success('🗺️ Interactive map loaded successfully!');
      });

      // Handle map style load for custom styling
      map.current.on('style.load', () => {
        // Add custom layer styling if needed
        if (map.current?.getStyle().name?.includes('satellite')) {
          // Add terrain for satellite view
          map.current.addSource('mapbox-dem', {
            type: 'raster-dem',
            url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
            tileSize: 512,
            maxzoom: 14
          });
          map.current.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });
        }
      });

      // Cleanup function
      return () => {
        map.current?.remove();
        setIsMapInitialized(false);
      };

    } catch (err) {
      error('Failed to initialize map. Please check your Mapbox token.');
      console.error('Map initialization error:', err);
    }
  }, [mapboxToken, mapStyle, userLocation]);

  // Add turf markers to the map
  const addTurfMarkers = () => {
    if (!map.current) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    turfs.forEach(turf => {
      // Create custom marker element
      const markerElement = document.createElement('div');
      markerElement.className = 'turf-marker';
      markerElement.style.cssText = `
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, #22c55e, #16a34a);
        border: 3px solid white;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        box-shadow: 0 4px 12px rgba(34, 197, 94, 0.4);
        transition: all 0.3s ease;
      `;
      markerElement.innerHTML = '⚽';

      // Add hover effects
      markerElement.addEventListener('mouseenter', () => {
        markerElement.style.transform = 'scale(1.2)';
        markerElement.style.boxShadow = '0 6px 20px rgba(34, 197, 94, 0.6)';
      });
      
      markerElement.addEventListener('mouseleave', () => {
        markerElement.style.transform = 'scale(1)';
        markerElement.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.4)';
      });

      // Create marker
      const marker = new mapboxgl.Marker(markerElement)
        .setLngLat([turf.location.lng, turf.location.lat])
        .addTo(map.current!);

      // Create popup content
      const popupContent = document.createElement('div');
      popupContent.innerHTML = `
        <div class="p-3 min-w-64">
          <h3 class="font-bold text-lg mb-2">${turf.name}</h3>
          <p class="text-sm text-muted-foreground mb-2">${turf.location.address}</p>
          <div class="flex flex-wrap gap-1 mb-3">
            ${turf.sports.map(sport => `<span class="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">${sport}</span>`).join('')}
          </div>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-semibold">₹${turf.basePrice}/hour</p>
              <p class="text-xs text-muted-foreground">⭐ ${turf.rating} (${turf.totalReviews})</p>
            </div>
            <div class="flex gap-2">
              <button class="book-btn bg-primary text-primary-foreground px-3 py-1 rounded text-sm hover:bg-primary/90">
                Book Now
              </button>
            </div>
          </div>
        </div>
      `;

      // Add popup
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: true,
        closeOnClick: false,
        className: 'turf-popup'
      }).setDOMContent(popupContent);

      marker.setPopup(popup);

      // Handle marker click
      markerElement.addEventListener('click', () => {
        setSelectedTurf(turf);
        onTurfSelect?.(turf);
        
        // Fly to turf location
        map.current?.flyTo({
          center: [turf.location.lng, turf.location.lat],
          zoom: 15,
          pitch: 60,
          bearing: 0,
          duration: 2000
        });
      });

      // Handle popup book button click
      const bookBtn = popupContent.querySelector('.book-btn');
      bookBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        onTurfSelect?.(turf);
        success(`🏃‍♂️ Redirecting to book ${turf.name}`);
      });

      markers.current.push(marker);
    });
  };

  // Handle map style change
  const handleStyleChange = (newStyle: string) => {
    if (map.current) {
      setMapStyle(newStyle);
      map.current.setStyle(newStyle);
    }
  };

  // Handle token input
  const handleTokenSubmit = () => {
    if (mapboxToken.trim()) {
      localStorage.setItem('mapbox_demo_token', mapboxToken.trim());
      success('🔑 Mapbox token saved! Refreshing map...');
      // Trigger map re-initialization by clearing the initialized state
      setIsMapInitialized(false);
    } else {
      error('Please enter a valid Mapbox token');
    }
  };

  // Get directions to turf
  const handleGetDirections = (turf: Turf) => {
    if (userLocation) {
      const directionsUrl = `https://www.mapbox.com/directions/?origin=${userLocation[1]},${userLocation[0]}&destination=${turf.location.lat},${turf.location.lng}&profile=driving`;
      window.open(directionsUrl, '_blank');
      onGetDirections?.(turf);
    } else {
      error('Location access required for directions');
    }
  };

  return (
    <div className={`relative w-full h-[600px] rounded-lg overflow-hidden ${className}`}>
      {/* Map Container */}
      <div ref={mapContainer} className="absolute inset-0" />

      {/* Token Input Dialog (if no token available) */}
      {!mapboxToken && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                Mapbox Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="mapbox-token">Mapbox Public Token</Label>
                <Input
                  id="mapbox-token"
                  type="text"
                  placeholder="pk.eyJ1IjoieW91cnVzZXJuYW1lIiwiYSI6IjEyMzQ1Njc4OSJ9..."
                  value={mapboxToken}
                  onChange={(e) => setMapboxToken(e.target.value)}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Get your free token from{' '}
                  <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    mapbox.com
                  </a>
                </p>
              </div>
              
              <Button onClick={handleTokenSubmit} className="w-full">
                Initialize Map
              </Button>

              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg text-sm">
                <p className="text-blue-800 dark:text-blue-200">
                  💡 <strong>For production:</strong> Connect to Supabase and store the Mapbox token in Edge Function Secrets for better security.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Map Controls */}
      {isMapInitialized && (
        <>
          {/* Style Selector */}
          <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
            <div className="flex gap-2">
              <Button
                variant={mapStyle.includes('light') ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleStyleChange('mapbox://styles/mapbox/light-v11')}
              >
                <Layers className="w-4 h-4" />
              </Button>
              <Button
                variant={mapStyle.includes('satellite') ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleStyleChange('mapbox://styles/mapbox/satellite-streets-v12')}
              >
                🛰️
              </Button>
              <Button
                variant={mapStyle.includes('dark') ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleStyleChange('mapbox://styles/mapbox/dark-v11')}
              >
                🌙
              </Button>
            </div>
          </div>

          {/* Turf Counter */}
          <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="font-medium">{turfs.length} turfs found</span>
            </div>
          </div>

          {/* Selected Turf Info */}
          {selectedTurf && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-4 right-4 bg-background/95 backdrop-blur-sm rounded-lg p-4 shadow-lg max-w-sm"
            >
              <div>
                <h4 className="font-bold text-lg">{selectedTurf.name}</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  {selectedTurf.location.address}
                </p>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {selectedTurf.sports.map((sport, index) => (
                    <Badge key={index} variant="secondary">{sport}</Badge>
                  ))}
                </div>
                  
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">₹{selectedTurf.basePrice}/hour</p>
                    <p className="text-sm text-muted-foreground">
                      ⭐ {selectedTurf.rating} ({selectedTurf.totalReviews})
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleGetDirections(selectedTurf)}
                    >
                      <Navigation className="w-3 h-3 mr-1" />
                      Directions
                    </Button>
                    <Button size="sm" onClick={() => onTurfSelect?.(selectedTurf)}>
                      Book Now
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </>
      )}

      {/* Loading State */}
      {mapboxToken && !isMapInitialized && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading interactive map...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveMapView;