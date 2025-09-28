import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  Users, 
  Star,
  Clock,
  MapPin,
  Filter,
  Download,
  RefreshCw,
  Target,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppToast } from '@/components/common/Toast';

interface AnalyticsData {
  totalBookings: number;
  totalRevenue: number;
  averageRating: number;
  repeatCustomers: number;
  peakHours: Array<{ hour: string; bookings: number }>;
  popularSports: Array<{ sport: string; percentage: number }>;
  monthlyTrends: Array<{ month: string; bookings: number; revenue: number }>;
  customerSatisfaction: number;
}

interface BusinessAnalyticsProps {
  turfId?: string;
  dateRange?: { from: Date; to: Date };
}

const BusinessAnalytics = ({ turfId, dateRange }: BusinessAnalyticsProps) => {
  const { success, info } = useAppToast();
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  // Mock analytics data
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const mockAnalytics: AnalyticsData = {
        totalBookings: 324,
        totalRevenue: 486000,
        averageRating: 4.6,
        repeatCustomers: 78,
        peakHours: [
          { hour: '06:00', bookings: 12 },
          { hour: '08:00', bookings: 8 },
          { hour: '10:00', bookings: 6 },
          { hour: '12:00', bookings: 4 },
          { hour: '14:00', bookings: 7 },
          { hour: '16:00', bookings: 15 },
          { hour: '18:00', bookings: 28 },
          { hour: '20:00', bookings: 22 },
          { hour: '22:00', bookings: 10 },
        ],
        popularSports: [
          { sport: 'Football', percentage: 45 },
          { sport: 'Cricket', percentage: 30 },
          { sport: 'Basketball', percentage: 15 },
          { sport: 'Tennis', percentage: 10 },
        ],
        monthlyTrends: [
          { month: 'Jan', bookings: 89, revenue: 133500 },
          { month: 'Feb', bookings: 94, revenue: 141000 },
          { month: 'Mar', bookings: 87, revenue: 130500 },
          { month: 'Apr', bookings: 102, revenue: 153000 },
          { month: 'May', bookings: 108, revenue: 162000 },
          { month: 'Jun', bookings: 95, revenue: 142500 },
        ],
        customerSatisfaction: 92,
      };
      setAnalytics(mockAnalytics);
      setLoading(false);
    }, 1000);
  }, [timeRange, turfId]);

  const exportData = () => {
    info('Analytics data exported to CSV');
    // Mock CSV export
    const csvData = 'Month,Bookings,Revenue\nJan,89,133500\nFeb,94,141000';
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'turf-analytics.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    success('Analytics report downloaded');
  };

  if (loading || !analytics) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Business Analytics</h2>
          <p className="text-muted-foreground">Insights and performance metrics for your turf</p>
        </div>
        <div className="flex gap-3">
          <Select value={timeRange} onValueChange={(value) => setTimeRange(value as typeof timeRange)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportData} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                  <p className="text-3xl font-bold">{analytics.totalBookings}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +12% from last period
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Calendar className="w-6 h-6 text-blue-600" />
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
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="text-3xl font-bold">₹{analytics.totalRevenue.toLocaleString()}</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +8% from last period
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
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
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
                  <p className="text-3xl font-bold">{analytics.averageRating}</p>
                  <p className="text-xs text-yellow-600 flex items-center mt-1">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    Excellent rating
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                  <Star className="w-6 h-6 text-yellow-600" />
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
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Repeat Customers</p>
                  <p className="text-3xl font-bold">{analytics.repeatCustomers}%</p>
                  <p className="text-xs text-purple-600 flex items-center mt-1">
                    <Users className="w-3 h-3 mr-1" />
                    High retention
                  </p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="peak-hours">Peak Hours</TabsTrigger>
          <TabsTrigger value="sports">Sports Analysis</TabsTrigger>
          <TabsTrigger value="satisfaction">Satisfaction</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Booking & Revenue Trends</CardTitle>
              <CardDescription>Monthly performance overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.monthlyTrends.map((data, index) => (
                  <motion.div
                    key={data.month}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{data.month}</span>
                        <div className="text-right">
                          <div className="font-semibold">{data.bookings} bookings</div>
                          <div className="text-sm text-muted-foreground">₹{data.revenue.toLocaleString()}</div>
                        </div>
                      </div>
                      <Progress value={(data.bookings / 120) * 100} className="h-2" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="peak-hours" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Peak Booking Hours</CardTitle>
              <CardDescription>When your turf is most busy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.peakHours.map((hour, index) => (
                  <motion.div
                    key={hour.hour}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-16 text-sm font-medium">{hour.hour}</div>
                    <div className="flex-1">
                      <Progress value={(hour.bookings / 30) * 100} className="h-4" />
                    </div>
                    <div className="w-16 text-sm text-right">{hour.bookings}</div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Popular Sports</CardTitle>
              <CardDescription>Breakdown of bookings by sport</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.popularSports.map((sport, index) => (
                  <motion.div
                    key={sport.sport}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{sport.sport}</Badge>
                    </div>
                    <div className="flex items-center gap-3 flex-1 ml-4">
                      <Progress value={sport.percentage} className="flex-1" />
                      <span className="text-sm font-medium w-12 text-right">{sport.percentage}%</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="satisfaction" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Satisfaction</CardTitle>
              <CardDescription>Overall satisfaction metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-6xl font-bold text-primary mb-2">
                    {analytics.customerSatisfaction}%
                  </div>
                  <p className="text-muted-foreground">Overall Satisfaction Score</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <Award className="w-8 h-8 text-gold-500 mx-auto mb-2" />
                    <div className="font-semibold">Excellent</div>
                    <div className="text-sm text-muted-foreground">67% of reviews</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                    <div className="font-semibold">Good</div>
                    <div className="text-sm text-muted-foreground">25% of reviews</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Target className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <div className="font-semibold">Average</div>
                    <div className="text-sm text-muted-foreground">8% of reviews</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessAnalytics;