import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BusinessAnalytics from '@/components/business/BusinessAnalytics';
import TurfManagement from '@/components/business/TurfManagement';
import MobilePerformance from '@/components/performance/MobilePerformance';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MOCK_TURFS } from '@/utils/mockData';
import { BarChart3, Settings, Smartphone, MapPin, Calendar, Star } from 'lucide-react';
import Navbar from '@/components/Navbar';

const OwnerDashboard = () => {
  const [selectedTurf] = useState(MOCK_TURFS[0]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 mt-16">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Owner Dashboard</h1>
              <p className="text-muted-foreground">Manage your turf and track performance</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="flex items-center gap-2">
                <MapPin className="w-3 h-3" />
                {selectedTurf.name}
              </Badge>
              <Badge variant="default" className="flex items-center gap-2">
                <Star className="w-3 h-3 fill-current" />
                {selectedTurf.rating} Rating
              </Badge>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">Today's Bookings</span>
              </div>
              <div className="text-2xl font-bold mt-2">12</div>
              <p className="text-xs text-muted-foreground">+20% from yesterday</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium">Monthly Revenue</span>
              </div>
              <div className="text-2xl font-bold mt-2">₹48,600</div>
              <p className="text-xs text-muted-foreground">+8% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-medium">Customer Rating</span>
              </div>
              <div className="text-2xl font-bold mt-2">{selectedTurf.rating}</div>
              <p className="text-xs text-muted-foreground">{selectedTurf.totalReviews} reviews</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium">Mobile Users</span>
              </div>
              <div className="text-2xl font-bold mt-2">78%</div>
              <p className="text-xs text-muted-foreground">Mostly mobile traffic</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="management" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Turf Management
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Overview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics">
            <BusinessAnalytics turfId={selectedTurf.id} />
          </TabsContent>

          <TabsContent value="management">
            <TurfManagement 
              turf={selectedTurf} 
              onUpdate={(updatedTurf) => {
                console.log('Turf updated:', updatedTurf);
              }}
            />
          </TabsContent>

          <TabsContent value="performance">
            <MobilePerformance />
          </TabsContent>

          <TabsContent value="overview">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Overview</CardTitle>
                  <CardDescription>Summary of your turf's current status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Turf Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Name:</span>
                          <span className="font-medium">{selectedTurf.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Location:</span>
                          <span className="font-medium">{selectedTurf.location.city}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Sports:</span>
                          <span className="font-medium">{selectedTurf.sports.join(', ')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Base Price:</span>
                          <span className="font-medium">₹{selectedTurf.basePrice}/hour</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-3">Recent Activity</h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>New booking received</span>
                          <span className="text-muted-foreground ml-auto">2 min ago</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>Review added (5 stars)</span>
                          <span className="text-muted-foreground ml-auto">1 hour ago</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span>Payment received</span>
                          <span className="text-muted-foreground ml-auto">3 hours ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default OwnerDashboard;