import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  QrCode,
  Download,
  MessageCircle,
  Star,
  Filter,
  Search,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAppToast } from '@/components/common/Toast';
import { Booking } from '@/types/booking';
import { MOCK_BOOKINGS, MOCK_TURFS } from '@/utils/mockData';

const BookingsList = () => {
  const { success, error } = useAppToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Mock user bookings with turf owner details
  // TODO: Replace with actual API call to fetch user bookings
  // Backend Integration: GET /api/bookings/user/{userId}
  // Should include turf owner contact information and business details
  const [bookings, setBookings] = useState<(Booking & { 
    ownerDetails: {
      name: string;
      phone: string;
      email: string;
      businessName: string;
      verified: boolean;
    }
  })[]>([
    {
      ...MOCK_BOOKINGS[0],
      ownerDetails: {
        name: 'Rajesh Kumar',
        phone: '+91 98765 12345',
        email: 'rajesh@greenvallysports.com',
        businessName: 'Green Valley Sports Complex',
        verified: true,
      }
    },
    {
      ...MOCK_BOOKINGS[1],
      ownerDetails: {
        name: 'Priya Sharma',
        phone: '+91 98765 67890',
        email: 'priya@championsarena.com',
        businessName: 'Champions Arena',
        verified: true,
      }
    },
    // Add more mock bookings with completed and cancelled status
    {
      id: 'book_003',
      customerId: '1',
      turfId: '3',
      slotStart: new Date('2024-01-20T19:00:00'),
      slotEnd: new Date('2024-01-20T20:00:00'),
      price: 1500,
      advancePaid: 1500,
      status: 'completed',
      receiptId: 'rcpt_003',
      paymentMethod: 'online',
      createdAt: new Date('2024-01-18'),
      updatedAt: new Date('2024-01-20'),
      customerDetails: {
        name: 'John Doe',
        email: 'john.doe@email.com',
        phone: '+91 9876543210',
      },
      turfDetails: {
        name: 'Elite Tennis Club',
        address: 'Koramangala, 5th Block',
        sports: ['Tennis'],
      },
      qrCode: 'QR_book_003_verify',
      ownerDetails: {
        name: 'Amit Patil',
        phone: '+91 98765 11111',
        email: 'amit@elitetennisclub.com',
        businessName: 'Elite Tennis Club',
        verified: true,
      }
    }
  ]);

  // Filter bookings based on search and status
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.turfDetails.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.ownerDetails.businessName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Separate bookings by status for tab view
  const upcomingBookings = filteredBookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
  const completedBookings = filteredBookings.filter(b => b.status === 'completed');
  const cancelledBookings = filteredBookings.filter(b => b.status === 'canceled' || b.status === 'refunded');

  const getStatusBadge = (status: Booking['status']) => {
    const variants = {
      confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      canceled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      refunded: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
    };
    
    return (
      <Badge className={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const handleCancelBooking = async (bookingId: string) => {
    // TODO: Implement booking cancellation
    // Backend Integration: POST /api/bookings/{bookingId}/cancel
    // Should handle refund logic and cancellation policies
    try {
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'canceled' as const }
          : booking
      ));
      success('Booking cancelled successfully');
    } catch (err) {
      error('Failed to cancel booking');
    }
  };

  const handleDownloadReceipt = async (bookingId: string) => {
    // TODO: Implement receipt download
    // Backend Integration: GET /api/bookings/{bookingId}/receipt
    // Should generate and download PDF receipt
    success('Receipt download started');
  };

  const handleAddReview = async (bookingId: string) => {
    // TODO: Implement review addition
    // Backend Integration: POST /api/reviews
    // Should allow users to rate and review completed bookings
    success('Review feature coming soon');
  };

  const BookingCard = ({ booking, showActions = true }: { 
    booking: typeof bookings[0], 
    showActions?: boolean 
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-turf"
    >
      <div className="space-y-4">
        {/* Booking Header */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-foreground text-lg">
              {booking.turfDetails.name}
            </h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {booking.turfDetails.address}
            </p>
          </div>
          {getStatusBadge(booking.status)}
        </div>

        {/* Booking Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-primary" />
              <span>{format(booking.slotStart, 'MMM d, yyyy')}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-primary" />
              <span>
                {format(booking.slotStart, 'HH:mm')} - {format(booking.slotEnd, 'HH:mm')}
              </span>
            </div>
            <div className="text-sm">
              <strong>Sports:</strong> {booking.turfDetails.sports.join(', ')}
            </div>
            <div className="text-sm">
              <strong>Amount:</strong> ₹{booking.price}
              {booking.advancePaid < booking.price && (
                <span className="text-amber-600"> (₹{booking.advancePaid} paid)</span>
              )}
            </div>
          </div>

          {/* Owner Details */}
          <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
            <h4 className="font-medium text-sm text-foreground">Turf Owner Details</h4>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-medium">{booking.ownerDetails.name}</span>
                {booking.ownerDetails.verified && (
                  <Badge variant="outline" className="text-xs px-1 py-0">
                    ✓ Verified
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-3 h-3" />
                <span>{booking.ownerDetails.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-3 h-3" />
                <span>{booking.ownerDetails.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code Display for confirmed bookings */}
        {booking.status === 'confirmed' && booking.qrCode && (
          <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg">
            <QrCode className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm font-medium">Ready for Check-in</p>
              <p className="text-xs text-muted-foreground">
                Show this QR code: {booking.qrCode}
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {showActions && (
          <div className="flex flex-wrap gap-2">
            {booking.status === 'completed' && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddReview(booking.id)}
                  className="flex items-center gap-2"
                >
                  <Star className="w-4 h-4" />
                  Add Review
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownloadReceipt(booking.id)}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Receipt
                </Button>
              </>
            )}
            
            {(booking.status === 'confirmed' || booking.status === 'pending') && (
              <>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Contact Owner
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Contact Turf Owner</DialogTitle>
                      <DialogDescription>
                        Get in touch with {booking.ownerDetails.name} for any queries
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Button
                          onClick={() => window.open(`tel:${booking.ownerDetails.phone}`)}
                          className="flex items-center gap-2"
                        >
                          <Phone className="w-4 h-4" />
                          Call
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => window.open(`mailto:${booking.ownerDetails.email}`)}
                          className="flex items-center gap-2"
                        >
                          <Mail className="w-4 h-4" />
                          Email
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleCancelBooking(booking.id)}
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>My Bookings</CardTitle>
          <CardDescription>
            Manage your turf bookings and connect with owners
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by turf name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Bookings</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="canceled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Tabs */}
      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingBookings.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedBookings.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled ({cancelledBookings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingBookings.length > 0 ? (
            upcomingBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No upcoming bookings</h3>
              <p className="text-muted-foreground">Book a turf to see your upcoming sessions here</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedBookings.length > 0 ? (
            completedBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))
          ) : (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No completed bookings</h3>
              <p className="text-muted-foreground">Your completed sessions will appear here</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          {cancelledBookings.length > 0 ? (
            cancelledBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} showActions={false} />
            ))
          ) : (
            <div className="text-center py-12">
              <X className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No cancelled bookings</h3>
              <p className="text-muted-foreground">Cancelled bookings will appear here</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BookingsList;