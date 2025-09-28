import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Star, 
  Clock, 
  Users, 
  DollarSign, 
  Calendar,
  Phone,
  Mail,
  Wifi,
  Car,
  Shield,
  Coffee
} from 'lucide-react';

// UI Components
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Custom components
import Navbar from '@/components/Navbar';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useAppToast } from '@/components/common/Toast';

// Services and types
import { turfService } from '@/services/turfs';
import { Turf, TimeSlot } from '@/types';

// Mock data (replace with actual API calls)
import { MOCK_TURFS } from '@/utils/mockData';

// Review interface for component
interface Review {
  id: string;
  rating: number;
  comment: string;
  userName: string;
  createdAt: Date;
}

const TurfDetail = () => {
  // Router hooks for navigation and parameter extraction
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { error } = useAppToast();

  // Component state management
  const [turf, setTurf] = useState<Turf | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImages, setSelectedImages] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Load turf details on component mount
  useEffect(() => {
    loadTurfDetails();
  }, [id]);

  // **BACKEND INTEGRATION POINT**
  // This function should be replaced with actual API call to fetch turf details
  const loadTurfDetails = async () => {
    try {
      setLoading(true);
      
      // TODO: Replace with actual API call
      // const turfData = await turfService.getTurfById(id);
      
      // Mock implementation - replace with backend call
      const turfData = MOCK_TURFS.find(t => t.id === id);
      
      if (!turfData) {
        error('Turf not found', 'The requested turf could not be found.');
        navigate('/turfs');
        return;
      }
      
      setTurf(turfData);
    } catch (err) {
      console.error('Error loading turf details:', err);
      error('Error loading turf', 'Failed to load turf details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle booking initiation
  const handleBookNow = () => {
    if (!turf) return;
    
    // Navigate to booking page with turf ID
    navigate(`/booking/${turf.id}`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center items-center min-h-[60vh]">
          <LoadingSpinner size="lg" text="Loading turf details..." />
        </div>
      </div>
    );
  }

  // Error state - turf not found
  if (!turf) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Turf Not Found</h2>
            <p className="text-muted-foreground mb-6">The requested turf could not be found.</p>
            <Button onClick={() => navigate('/turfs')}>Back to Turfs</Button>
          </div>
        </div>
      </div>
    );
  }

  // Mock data for additional details (replace with backend data)
  const amenities = [
    { icon: Wifi, label: 'Free WiFi' },
    { icon: Car, label: 'Parking' },
    { icon: Shield, label: 'Security' },
    { icon: Coffee, label: 'Refreshments' }
  ];

  const reviews: Review[] = [
    {
      id: '1',
      userName: 'Rajesh Kumar',
      rating: 5,
      comment: 'Excellent facilities and well-maintained turf. Great experience!',
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2',
      userName: 'Priya Sharma',
      rating: 4,
      comment: 'Good turf with proper lighting. Booking process was smooth.',
      createdAt: new Date('2024-01-10')
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section with Image Gallery */}
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Main Image */}
              <div className="relative aspect-video rounded-2xl overflow-hidden">
                <img
                  src={turf.photos?.[selectedImages] || turf.photos[0]}
                  alt={turf.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-primary text-primary-foreground">
                    ⭐ {turf.rating} Rating
                  </Badge>
                </div>
              </div>
              
              {/* Image Thumbnails */}
              <div className="grid grid-cols-2 gap-4">
                {(turf.photos || []).slice(0, 4).map((img, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`aspect-video rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                      selectedImages === index ? 'border-primary' : 'border-transparent'
                    }`}
                    onClick={() => setSelectedImages(index)}
                  >
                    <img
                      src={img}
                      alt={`${turf.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Turf Information */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {/* Header */}
                <div className="mb-6">
                  <h1 className="text-3xl font-bold mb-2">{turf.name}</h1>
                  <div className="flex items-center gap-4 text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{turf.location.address}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{turf.rating} ({turf.totalReviews || 45} reviews)</span>
                    </div>
                  </div>
                  
                  {/* Sports Tags */}
                  <div className="flex gap-2 mb-6">
                    {turf.sports.map((sport) => (
                      <Badge key={sport} variant="secondary">
                        {sport}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Tabs for detailed information */}
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="amenities">Amenities</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                    <TabsTrigger value="contact">Contact</TabsTrigger>
                  </TabsList>

                  {/* Overview Tab */}
                  <TabsContent value="overview" className="mt-6">
                    <Card>
                      <CardContent className="pt-6">
                        <h3 className="text-lg font-semibold mb-4">About This Turf</h3>
                        <p className="text-muted-foreground mb-6">
                          {turf.description || "A premium sports facility with state-of-the-art infrastructure. Perfect for both recreational and competitive games. Our well-maintained turf provides the ideal playing surface for an exceptional sporting experience."}
                        </p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-4 bg-muted/20 rounded-lg">
                            <Clock className="w-6 h-6 mx-auto mb-2 text-primary" />
                            <div className="text-sm font-medium">Operating Hours</div>
                            <div className="text-xs text-muted-foreground">6:00 AM - 10:00 PM</div>
                          </div>
                          <div className="text-center p-4 bg-muted/20 rounded-lg">
                            <Users className="w-6 h-6 mx-auto mb-2 text-primary" />
                            <div className="text-sm font-medium">Capacity</div>
                            <div className="text-xs text-muted-foreground">{turf.idealPlayers || 22} Players</div>
                          </div>
                          <div className="text-center p-4 bg-muted/20 rounded-lg">
                            <DollarSign className="w-6 h-6 mx-auto mb-2 text-primary" />
                            <div className="text-sm font-medium">Starting Price</div>
                            <div className="text-xs text-muted-foreground">₹{turf.basePrice}/hour</div>
                          </div>
                          <div className="text-center p-4 bg-muted/20 rounded-lg">
                            <Calendar className="w-6 h-6 mx-auto mb-2 text-primary" />
                            <div className="text-sm font-medium">Advance Booking</div>
                            <div className="text-xs text-muted-foreground">Up to 30 days</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Amenities Tab */}
                  <TabsContent value="amenities" className="mt-6">
                    <Card>
                      <CardContent className="pt-6">
                        <h3 className="text-lg font-semibold mb-4">Available Amenities</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {amenities.map((amenity, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                              <amenity.icon className="w-5 h-5 text-primary" />
                              <span className="text-sm">{amenity.label}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Reviews Tab */}
                  <TabsContent value="reviews" className="mt-6">
                    <Card>
                      <CardContent className="pt-6">
                        <h3 className="text-lg font-semibold mb-4">Customer Reviews</h3>
                        <div className="space-y-4">
                          {reviews.map((review) => (
                            <div key={review.id} className="border-b border-border pb-4 last:border-b-0">
                              <div className="flex items-start gap-3">
                                <Avatar className="w-10 h-10">
                                  <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="font-medium">{review.userName}</span>
                                    <div className="flex">
                                      {[...Array(5)].map((_, i) => (
                                        <Star
                                          key={i}
                                          className={`w-4 h-4 ${
                                            i < review.rating
                                              ? 'fill-yellow-400 text-yellow-400'
                                              : 'text-gray-300'
                                          }`}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                  <p className="text-muted-foreground text-sm">{review.comment}</p>
                                  <p className="text-xs text-muted-foreground mt-2">
                                    {review.createdAt.toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Contact Tab */}
                  <TabsContent value="contact" className="mt-6">
                    <Card>
                      <CardContent className="pt-6">
                        <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-primary" />
                            <span>+91 98765 43210</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-primary" />
                            <span>{'info@' + turf.name.toLowerCase().replace(/\s+/g, '') + '.com'}</span>
                          </div>
                          <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-primary mt-1" />
                            <span>{turf.location.address}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </motion.div>
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="sticky top-24"
              >
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl">Book This Turf</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Price Display */}
                      <div className="text-center p-4 bg-primary/10 rounded-lg">
                        <div className="text-2xl font-bold text-primary">₹{turf.basePrice}</div>
                        <div className="text-sm text-muted-foreground">per hour</div>
                      </div>

                      {/* Quick Stats */}
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="p-3 bg-muted/20 rounded-lg">
                          <div className="text-sm font-medium">Distance</div>
                          <div className="text-sm text-muted-foreground">2.5 km</div>
                        </div>
                        <div className="p-3 bg-muted/20 rounded-lg">
                          <div className="text-sm font-medium">Available</div>
                          <div className="text-sm text-muted-foreground">Today</div>
                        </div>
                      </div>

                      {/* Book Now Button */}
                      <Button 
                        onClick={handleBookNow}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                        size="lg"
                      >
                        Book Now
                      </Button>

                      {/* Additional Info */}
                      <div className="text-xs text-muted-foreground text-center">
                        <p>• Instant confirmation</p>
                        <p>• Free cancellation up to 2 hours before</p>
                        <p>• 24/7 customer support</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TurfDetail;