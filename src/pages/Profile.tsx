import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Settings, 
  Calendar, 
  Bell, 
  CreditCard,
  Shield,
  LogOut,
  Edit,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import BookingsList from '@/components/customer/BookingsList';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useAppToast } from '@/components/common/Toast';

const Profile = () => {
  const { success } = useAppToast();
  
  // Mock user data - replace with actual user data from context/API
  // TODO: Get user data from authentication context
  // Backend Integration: GET /api/user/profile
  const [user] = useState({
    id: '1',
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+91 9876543210',
    avatar: '/api/placeholder/150/150',
    verified: true,
    joinedDate: new Date('2024-01-15'),
    location: {
      city: 'Delhi',
      state: 'Delhi'
    },
    stats: {
      totalBookings: 12,
      completedSessions: 8,
      favoriteSpots: 3,
      totalSpent: 18500
    }
  });

  const handleLogout = () => {
    // TODO: Implement logout functionality
    // Backend Integration: POST /api/auth/logout
    success('Logged out successfully');
  };

  const handleEditProfile = () => {
    // TODO: Implement profile editing
    // Backend Integration: PUT /api/user/profile
    success('Profile editing coming soon');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Profile Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="text-lg">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl font-bold text-foreground">{user.name}</h1>
                      {user.verified && (
                        <Badge variant="outline" className="text-xs">
                          ✓ Verified
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{user.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{user.location.city}, {user.location.state}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 ml-auto">
                  <Button variant="outline" onClick={handleEditProfile}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{user.stats.totalBookings}</div>
                <div className="text-sm text-muted-foreground">Total Bookings</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-secondary">{user.stats.completedSessions}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-accent">{user.stats.favoriteSpots}</div>
                <div className="text-sm text-muted-foreground">Favorite Spots</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-turf-green">₹{user.stats.totalSpent.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Spent</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="bookings" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="bookings" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                My Bookings
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="payments" className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Payments
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bookings">
              <BookingsList />
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account preferences and privacy settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Privacy Settings</h3>
                    <Separator />
                    <div className="space-y-4 pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Profile Visibility</p>
                          <p className="text-sm text-muted-foreground">Control who can see your profile information</p>
                        </div>
                        <Button variant="outline" size="sm">Configure</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Contact Information</p>
                          <p className="text-sm text-muted-foreground">Manage how others can contact you</p>
                        </div>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Security</h3>
                    <Separator />
                    <div className="space-y-4 pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Change Password</p>
                          <p className="text-sm text-muted-foreground">Update your account password</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Shield className="w-4 h-4 mr-2" />
                          Change
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Two-Factor Authentication</p>
                          <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                        </div>
                        <Button variant="outline" size="sm">Enable</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Choose what notifications you want to receive
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Booking Confirmations</p>
                        <p className="text-sm text-muted-foreground">Get notified when your bookings are confirmed</p>
                      </div>
                      <Button variant="outline" size="sm">Enabled</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Reminder Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive reminders before your sessions</p>
                      </div>
                      <Button variant="outline" size="sm">Enabled</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Promotional Offers</p>
                        <p className="text-sm text-muted-foreground">Stay updated with deals and offers</p>
                      </div>
                      <Button variant="outline" size="sm">Disabled</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>
                    Manage your saved payment methods and billing history
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center py-8">
                      <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">No saved payment methods</h3>
                      <p className="text-muted-foreground mb-4">Add a payment method to make booking easier</p>
                      <Button>Add Payment Method</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;