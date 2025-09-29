// Offline Fallback Page - PWA Offline Experience
// **BACKEND INTEGRATION**: Displays cached content when no network available

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { WifiOff, RefreshCw, MapPin, Calendar, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAppToast } from '@/components/common/Toast';
import { MOCK_TURFS } from '@/utils/mockData';

const OfflinePage: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [cachedTurfs] = useState(MOCK_TURFS.slice(0, 3)); // Simulate cached data
  const [lastUpdate] = useState(new Date(Date.now() - 2 * 60 * 60 * 1000)); // 2 hours ago
  const { info } = useAppToast();

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      info('🌐 Connection restored! Refreshing data...');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = () => {
    if (navigator.onLine) {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Offline Status Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <WifiOff className="w-10 h-10 text-orange-500" />
          </div>
          
          <h1 className="text-3xl font-bold text-foreground mb-2">
            You're Offline
          </h1>
          <p className="text-muted-foreground mb-4">
            No internet connection detected. Showing cached content from your last visit.
          </p>
          
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6">
            <Calendar className="w-4 h-4" />
            <span>Last updated: {lastUpdate.toLocaleString()}</span>
          </div>

          <Button onClick={handleRetry} disabled={!isOnline} className="mb-2">
            <RefreshCw className="w-4 h-4 mr-2" />
            {isOnline ? 'Refresh Page' : 'Check Connection'}
          </Button>
          
          {isOnline && (
            <p className="text-sm text-green-600">
              ✅ Connection restored! Refreshing automatically...
            </p>
          )}
        </motion.div>

        {/* Cached Turfs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-primary" />
                Recently Viewed Turfs
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                These turfs are available offline from your cache
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cachedTurfs.map((turf) => (
                  <motion.div
                    key={turf.id}
                    whileHover={{ scale: 1.02 }}
                    className="border rounded-lg p-4 bg-card"
                  >
                    <div className="aspect-video bg-muted rounded-lg mb-3 flex items-center justify-center">
                      <span className="text-4xl">🏟️</span>
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-2">{turf.name}</h3>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <MapPin className="w-4 h-4" />
                      <span>{turf.location.city}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {turf.sports.slice(0, 2).map((sport, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {sport}
                        </Badge>
                      ))}
                      {turf.sports.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{turf.sports.length - 2}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">₹{turf.basePrice}/hour</p>
                        <p className="text-sm text-muted-foreground">
                          ⭐ {turf.rating} ({turf.totalReviews})
                        </p>
                      </div>
                      
                      <Button 
                        size="sm" 
                        variant="outline" 
                        disabled
                        className="opacity-60"
                      >
                        Offline
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Offline Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bookmark className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Browse Cached Turfs</h3>
              <p className="text-sm text-muted-foreground">
                View previously loaded turf information and details
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">View Past Bookings</h3>
              <p className="text-sm text-muted-foreground">
                Access your booking history stored locally on your device
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Location Services</h3>
              <p className="text-sm text-muted-foreground">
                Basic location features work offline using device GPS
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Offline Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Offline Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Automatic Sync</p>
                    <p className="text-muted-foreground">
                      When connection is restored, any saved bookings will be automatically synced
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Cache Updates</p>
                    <p className="text-muted-foreground">
                      Regularly visit PlayNest online to keep your cached content fresh
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Save for Offline</p>
                    <p className="text-muted-foreground">
                      Bookmark favorite turfs to ensure they're available offline
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default OfflinePage;