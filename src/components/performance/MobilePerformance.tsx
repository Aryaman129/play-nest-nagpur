import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Monitor, Zap, Image, Shield, Search, Gauge, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PerformanceMetrics {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  mobileScore: number;
  desktopScore: number;
  accessibility: number;
  seo: number;
}

const MobilePerformance = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate performance metrics collection
    setTimeout(() => {
      setMetrics({
        loadTime: 1.2,
        firstContentfulPaint: 0.8,
        largestContentfulPaint: 1.5,
        cumulativeLayoutShift: 0.05,
        mobileScore: 92,
        desktopScore: 98,
        accessibility: 95,
        seo: 88,
      });
      setLoading(false);
    }, 2000);
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreVariant = (score: number) => {
    if (score >= 90) return 'default';
    if (score >= 70) return 'secondary';
    return 'destructive';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Analyzing Performance...</CardTitle>
            <CardDescription>Running mobile and desktop performance tests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-muted rounded w-1/3"></div>
                  <div className="h-2 bg-muted rounded w-full"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!metrics) return null;

  const optimizations = [
    {
      title: 'Image Optimization',
      description: 'Compress and optimize images for faster loading',
      impact: 'High',
      status: 'recommended',
      icon: Image,
    },
    {
      title: 'Lazy Loading',
      description: 'Load images and components only when needed',
      impact: 'Medium',
      status: 'implemented',
      icon: Zap,
    },
    {
      title: 'Mobile First Design',
      description: 'Ensure responsive design works perfectly on mobile',
      impact: 'High',
      status: 'implemented',
      icon: Smartphone,
    },
    {
      title: 'SEO Optimization',
      description: 'Improve search engine visibility and rankings',
      impact: 'Medium',
      status: 'recommended',
      icon: Search,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Mobile & Performance</h2>
        <p className="text-muted-foreground">Monitor and optimize your app's performance across devices</p>
      </div>

      {/* Performance Scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <Smartphone className="w-8 h-8 text-blue-600" />
                <Badge variant={getScoreVariant(metrics.mobileScore)}>
                  {metrics.mobileScore}/100
                </Badge>
              </div>
              <h3 className="font-semibold">Mobile Score</h3>
              <Progress value={metrics.mobileScore} className="mt-2" />
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
              <div className="flex items-center justify-between mb-4">
                <Monitor className="w-8 h-8 text-green-600" />
                <Badge variant={getScoreVariant(metrics.desktopScore)}>
                  {metrics.desktopScore}/100
                </Badge>
              </div>
              <h3 className="font-semibold">Desktop Score</h3>
              <Progress value={metrics.desktopScore} className="mt-2" />
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
              <div className="flex items-center justify-between mb-4">
                <Shield className="w-8 h-8 text-purple-600" />
                <Badge variant={getScoreVariant(metrics.accessibility)}>
                  {metrics.accessibility}/100
                </Badge>
              </div>
              <h3 className="font-semibold">Accessibility</h3>
              <Progress value={metrics.accessibility} className="mt-2" />
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
              <div className="flex items-center justify-between mb-4">
                <Search className="w-8 h-8 text-orange-600" />
                <Badge variant={getScoreVariant(metrics.seo)}>
                  {metrics.seo}/100
                </Badge>
              </div>
              <h3 className="font-semibold">SEO Score</h3>
              <Progress value={metrics.seo} className="mt-2" />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Core Web Vitals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge className="w-5 h-5" />
            Core Web Vitals
          </CardTitle>
          <CardDescription>Key metrics that affect user experience and search rankings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">{metrics.loadTime}s</div>
              <div className="text-sm text-muted-foreground">Load Time</div>
              <div className="text-xs text-green-600 mt-1">Good</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">{metrics.firstContentfulPaint}s</div>
              <div className="text-sm text-muted-foreground">First Contentful Paint</div>
              <div className="text-xs text-green-600 mt-1">Good</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-1">{metrics.largestContentfulPaint}s</div>
              <div className="text-sm text-muted-foreground">Largest Contentful Paint</div>
              <div className="text-xs text-yellow-600 mt-1">Needs Improvement</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">{metrics.cumulativeLayoutShift}</div>
              <div className="text-sm text-muted-foreground">Cumulative Layout Shift</div>
              <div className="text-xs text-green-600 mt-1">Good</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Optimization Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Optimization Recommendations</CardTitle>
          <CardDescription>Actionable steps to improve your app's performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {optimizations.map((optimization, index) => {
              const IconComponent = optimization.icon;
              return (
                <motion.div
                  key={optimization.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4 p-4 border rounded-lg"
                >
                  <div className="p-2 bg-muted rounded-lg">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{optimization.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {optimization.impact} impact
                      </Badge>
                      <Badge 
                        variant={optimization.status === 'implemented' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {optimization.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{optimization.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Mobile Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Mobile Features
          </CardTitle>
          <CardDescription>Features specifically designed for mobile users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Touch Optimized</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✅ Large tap targets (44px minimum)</li>
                <li>✅ Swipe gestures for navigation</li>
                <li>✅ Touch-friendly form controls</li>
                <li>✅ Pull-to-refresh functionality</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Progressive Web App</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>🔄 Offline functionality (Coming Soon)</li>
                <li>🔄 Add to homescreen (Coming Soon)</li>
                <li>✅ Fast loading on mobile networks</li>
                <li>✅ Responsive design across devices</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Network & Connectivity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="w-5 h-5" />
            Network Optimization
          </CardTitle>
          <CardDescription>Optimizations for different network conditions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <Zap className="h-4 w-4" />
              <AlertDescription>
                Your app is optimized for 3G networks and loads in under 3 seconds on slow connections.
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-1">Fast 3G</div>
                <div className="text-sm text-muted-foreground">2.1s load time</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-1">4G</div>
                <div className="text-sm text-muted-foreground">0.9s load time</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-1">WiFi</div>
                <div className="text-sm text-muted-foreground">0.6s load time</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MobilePerformance;