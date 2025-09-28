// Enhanced AnalyticsTab Component - Phase 4 Implementation  
// **BACKEND INTEGRATION**: All analytics data should come from database with real-time metrics

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign,
  Clock,
  MapPin,
  Star,
  BarChart3,
  PieChart as PieChartIcon,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppToast } from '@/components/common/Toast';

// **DATABASE INTEGRATION TYPES**
interface AnalyticsData {
  totalRevenue: number;
  totalBookings: number;
  uniqueCustomers: number;
  averageRating: number;
  utilizationRate: number;
  peakHours: string[];
  topSports: { sport: string; bookings: number; revenue: number }[];
  monthlyTrend: { month: string; revenue: number; bookings: number }[];
  customerDemographics: { ageGroup: string; percentage: number }[];
  competitorComparison: { metric: string; yours: number; average: number }[];
}

interface BookingMetrics {
  date: string;
  bookings: number;
  revenue: number;
  cancellations: number;
  newCustomers: number;
}

const AnalyticsTab = () => {
  const { success, error } = useAppToast();

  // **BACKEND INTEGRATION STATE**
  // All analytics data should come from database
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalRevenue: 245000,
    totalBookings: 189,
    uniqueCustomers: 156,
    averageRating: 4.7,
    utilizationRate: 78,
    peakHours: ['18:00-20:00', '19:00-21:00', '20:00-22:00'],
    topSports: [
      { sport: 'Football', bookings: 78, revenue: 98000 },
      { sport: 'Cricket', bookings: 65, revenue: 87500 },
      { sport: 'Badminton', bookings: 46, revenue: 59500 }
    ],
    monthlyTrend: [
      { month: 'Jan', revenue: 45000, bookings: 35 },
      { month: 'Feb', revenue: 52000, bookings: 42 },
      { month: 'Mar', revenue: 48000, bookings: 38 },
      { month: 'Apr', revenue: 61000, bookings: 47 },
      { month: 'May', revenue: 58000, bookings: 45 },
      { month: 'Jun', revenue: 67000, bookings: 52 }
    ],
    customerDemographics: [
      { ageGroup: '18-25', percentage: 35 },
      { ageGroup: '26-35', percentage: 42 },
      { ageGroup: '36-45', percentage: 18 },
      { ageGroup: '45+', percentage: 5 }
    ],
    competitorComparison: [
      { metric: 'Average Price', yours: 1200, average: 1100 },
      { metric: 'Rating', yours: 4.7, average: 4.3 },
      { metric: 'Utilization', yours: 78, average: 65 }
    ]
  });

  const [recentBookings, setRecentBookings] = useState<BookingMetrics[]>([
    { date: '2024-01-15', bookings: 8, revenue: 12000, cancellations: 1, newCustomers: 3 },
    { date: '2024-01-14', bookings: 6, revenue: 9000, cancellations: 0, newCustomers: 2 },
    { date: '2024-01-13', bookings: 10, revenue: 15000, cancellations: 2, newCustomers: 4 },
    { date: '2024-01-12', bookings: 7, revenue: 10500, cancellations: 1, newCustomers: 1 },
    { date: '2024-01-11', bookings: 9, revenue: 13500, cancellations: 0, newCustomers: 5 }
  ]);

  // **DATABASE INTEGRATION FUNCTION**
  // Load analytics data from database
  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await analyticsService.getOwnerAnalytics(timeRange);
      // setAnalyticsData(response.data);
      
      // Mock implementation with realistic data
      console.log(`Loading analytics for ${timeRange}`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (err) {
      error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  // **DATABASE INTEGRATION FUNCTION**
  // Export analytics report
  const exportReport = async () => {
    try {
      // TODO: Replace with actual API call
      // await analyticsService.exportReport(timeRange, 'pdf');
      success('Analytics report exported successfully');
    } catch (err) {
      error('Failed to export report');
    }
  };

  const refreshData = () => {
    loadAnalyticsData();
  };
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Comprehensive insights into your turf performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={refreshData}>
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button onClick={exportReport} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">₹{analyticsData.totalRevenue.toLocaleString()}</p>
                  <p className="text-xs text-green-600">+12% from last month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-secondary/10 rounded-lg">
                  <Calendar className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Bookings</p>
                  <p className="text-2xl font-bold">{analyticsData.totalBookings}</p>
                  <p className="text-xs text-green-600">+8% from last month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Unique Customers</p>
                  <p className="text-2xl font-bold">{analyticsData.uniqueCustomers}</p>
                  <p className="text-xs text-green-600">+15% from last month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-500/10 rounded-lg">
                  <Star className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Rating</p>
                  <p className="text-2xl font-bold">{analyticsData.averageRating}</p>
                  <p className="text-xs text-green-600">+0.2 from last month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500/10 rounded-lg">
                  <Clock className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Utilization</p>
                  <p className="text-2xl font-bold">{analyticsData.utilizationRate}%</p>
                  <p className="text-xs text-green-600">+5% from last month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Sports Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Sports Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.topSports.map((sport, index) => (
                    <motion.div
                      key={sport.sport}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                    >
                      <div>
                        <h4 className="font-semibold">{sport.sport}</h4>
                        <p className="text-sm text-muted-foreground">
                          {sport.bookings} bookings
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{sport.revenue.toLocaleString()}</p>
                        <Badge variant="secondary">
                          {Math.round((sport.bookings / analyticsData.totalBookings) * 100)}%
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Peak Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Peak Hours Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    Highest demand time slots for optimization
                  </p>
                  {analyticsData.peakHours.map((hour, index) => (
                    <motion.div
                      key={hour}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/20"
                    >
                      <span className="font-medium">{hour}</span>
                      <Badge variant="default">Peak Time</Badge>
                    </motion.div>
                  ))}
                  
                  <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold mb-2">Optimization Tips</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Consider premium pricing during peak hours</li>
                      <li>• Offer discounts for off-peak bookings</li>
                      <li>• Schedule maintenance during low-demand periods</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Competitor Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Competitive Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {analyticsData.competitorComparison.map((item, index) => (
                  <motion.div
                    key={item.metric}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center space-y-2"
                  >
                    <h4 className="font-semibold">{item.metric}</h4>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">You:</span>
                        <span className="font-bold text-primary">
                          {item.metric.includes('Price') ? `₹${item.yours}` : 
                           item.metric.includes('Rating') ? `${item.yours}★` :
                           `${item.yours}%`}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Market Avg:</span>
                        <span className="font-medium">
                          {item.metric.includes('Price') ? `₹${item.average}` : 
                           item.metric.includes('Rating') ? `${item.average}★` :
                           `${item.average}%`}
                        </span>
                      </div>
                      <Badge 
                        variant={item.yours > item.average ? "default" : "secondary"}
                        className="w-full"
                      >
                        {item.yours > item.average ? 
                          `+${((item.yours - item.average) / item.average * 100).toFixed(1)}% Above` :
                          `${((item.yours - item.average) / item.average * 100).toFixed(1)}% Below`
                        }
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bookings Tab */}
        <TabsContent value="bookings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Booking Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBookings.map((booking, index) => (
                  <motion.div
                    key={booking.date}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="grid grid-cols-5 gap-4 p-4 border rounded-lg"
                  >
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-semibold">{new Date(booking.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Bookings</p>
                      <p className="font-semibold">{booking.bookings}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Revenue</p>
                      <p className="font-semibold">₹{booking.revenue.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Cancellations</p>
                      <p className="font-semibold text-red-600">{booking.cancellations}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">New Customers</p>
                      <p className="font-semibold text-green-600">{booking.newCustomers}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  {analyticsData.monthlyTrend.map((month, index) => (
                    <motion.div
                      key={month.month}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="text-center space-y-2 p-4 border rounded-lg"
                    >
                      <h4 className="font-semibold">{month.month}</h4>
                      <p className="text-lg font-bold text-primary">₹{month.revenue.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">{month.bookings} bookings</p>
                    </motion.div>
                  ))}
                </div>
                
                <div className="mt-8 p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
                  <h4 className="font-semibold mb-4">Revenue Insights</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Average per booking:</p>
                      <p className="font-bold text-lg">₹{Math.round(analyticsData.totalRevenue / analyticsData.totalBookings)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Best performing month:</p>
                      <p className="font-bold text-lg">June</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Growth rate:</p>
                      <p className="font-bold text-lg text-green-600">+18%</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customers Tab */}
        <TabsContent value="customers" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5" />
                  Customer Demographics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.customerDemographics.map((demo, index) => (
                    <motion.div
                      key={demo.ageGroup}
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: '100%' }}
                      transition={{ delay: index * 0.2, duration: 0.5 }}
                      className="space-y-2"
                    >
                      <div className="flex justify-between">
                        <span className="font-medium">{demo.ageGroup}</span>
                        <span className="text-muted-foreground">{demo.percentage}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${demo.percentage}%` }}
                          transition={{ delay: index * 0.2 + 0.3, duration: 0.8 }}
                          className="bg-primary h-2 rounded-full"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Key Metrics</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Repeat customers:</span>
                        <span className="font-semibold">68%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Average visits per customer:</span>
                        <span className="font-semibold">3.2</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Customer retention rate:</span>
                        <span className="font-semibold text-green-600">74%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold">Growth Opportunities</h4>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>• 45+ age group shows lowest engagement</li>
                      <li>• Weekend bookings could target families</li>
                      <li>• Loyalty program could boost retention</li>
                      <li>• Corporate events untapped market</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsTab;