import { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Check, 
  X, 
  QrCode,
  Filter,
  Search,
  MoreVertical,
  DollarSign,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAppToast } from '@/components/common/Toast';

interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  date: Date;
  timeSlot: string;
  amount: number;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  paymentStatus: 'paid' | 'pending' | 'partial';
  checkedIn: boolean;
  specialRequests?: string;
}

const BookingsTab = () => {
  const { success, error } = useAppToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  // Enhanced mock bookings data with more realistic scenarios
  // TODO: Replace with actual API call to fetch turf owner's bookings
  // Backend Integration: GET /api/bookings/turf/{turfId}
  // Should include customer details, payment status, and check-in information
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: '1',
      customerName: 'Rajesh Kumar',
      customerPhone: '+91 98765 43210',
      customerEmail: 'rajesh@email.com',
      date: new Date('2024-01-25'),
      timeSlot: '18:00 - 20:00',
      amount: 2400,
      status: 'confirmed',
      paymentStatus: 'partial',
      checkedIn: false,
      specialRequests: 'Need extra footballs and bibs for team match'
    },
    {
      id: '2',
      customerName: 'Priya Sharma',
      customerPhone: '+91 87654 32109',
      customerEmail: 'priya@email.com',
      date: new Date('2024-01-25'),
      timeSlot: '19:00 - 20:00',
      amount: 1800,
      status: 'completed',
      paymentStatus: 'paid',
      checkedIn: true
    },
    {
      id: '3',
      customerName: 'Amit Patil',
      customerPhone: '+91 76543 21098',
      customerEmail: 'amit@email.com',
      date: new Date('2024-01-26'),
      timeSlot: '17:00 - 18:00',
      amount: 1200,
      status: 'pending',
      paymentStatus: 'pending',
      checkedIn: false
    },
    {
      id: '4',
      customerName: 'Sneha Reddy',
      customerPhone: '+91 91234 56789',
      customerEmail: 'sneha@email.com',
      date: new Date('2024-01-26'),
      timeSlot: '20:00 - 21:00',
      amount: 1500,
      status: 'confirmed',
      paymentStatus: 'paid',
      checkedIn: false,
      specialRequests: 'Birthday celebration - need decoration permission'
    },
    {
      id: '5',
      customerName: 'Vikram Singh',
      customerPhone: '+91 98765 11111',
      customerEmail: 'vikram@email.com',
      date: new Date('2024-01-27'),
      timeSlot: '16:00 - 17:00',
      amount: 1200,
      status: 'cancelled',
      paymentStatus: 'partial',
      checkedIn: false
    }
  ]);

  const handleStatusChange = (bookingId: string, newStatus: Booking['status']) => {
    setBookings(prev => prev.map(booking => 
      booking.id === bookingId 
        ? { ...booking, status: newStatus }
        : booking
    ));
    success('Booking status updated');
  };

  const handleCheckIn = (bookingId: string) => {
    setBookings(prev => prev.map(booking => 
      booking.id === bookingId 
        ? { ...booking, checkedIn: true, status: 'completed' }
        : booking
    ));
    success('Customer checked in successfully');
  };

  const handleCancel = (bookingId: string) => {
    setBookings(prev => prev.map(booking => 
      booking.id === bookingId 
        ? { ...booking, status: 'cancelled' }
        : booking
    ));
    success('Booking cancelled');
  };

  const getStatusBadge = (status: Booking['status']) => {
    const variants = {
      confirmed: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPaymentBadge = (paymentStatus: Booking['paymentStatus']) => {
    const variants = {
      paid: 'bg-green-100 text-green-800',
      pending: 'bg-red-100 text-red-800',
      partial: 'bg-yellow-100 text-yellow-800'
    };
    
    return (
      <Badge className={variants[paymentStatus]}>
        {paymentStatus === 'partial' ? '50% Paid' : paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
      </Badge>
    );
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.customerPhone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    const matchesDate = dateFilter === 'all' || 
                       (dateFilter === 'today' && format(booking.date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')) ||
                       (dateFilter === 'upcoming' && booking.date >= new Date());
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Today's Bookings</p>
                <p className="text-2xl font-bold text-foreground">6</p>
              </div>
              <Calendar className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Check-ins</p>
                <p className="text-2xl font-bold text-foreground">2</p>
              </div>
              <Clock className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Revenue Today</p>
                <p className="text-2xl font-bold text-foreground">₹8,400</p>
              </div>
              <DollarSign className="w-8 h-8 text-secondary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Occupancy Rate</p>
                <p className="text-2xl font-bold text-foreground">75%</p>
              </div>
              <BarChart3 className="w-8 h-8 text-turf-green" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Manage Bookings</CardTitle>
          <CardDescription>
            View and manage all your turf bookings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by customer name or phone..."
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
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bookings List */}
          <div className="space-y-4">
            {filteredBookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card-turf"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="font-semibold text-foreground flex items-center gap-2">
                          <User className="w-4 h-4 text-primary" />
                          {booking.customerName}
                        </h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <Phone className="w-3 h-3" />
                          {booking.customerPhone}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-primary" />
                        {format(booking.date, 'MMM d, yyyy')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-primary" />
                        {booking.timeSlot}
                      </span>
                      <span className="font-semibold text-primary">
                        ₹{booking.amount}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {getStatusBadge(booking.status)}
                      {getPaymentBadge(booking.paymentStatus)}
                      {booking.checkedIn && (
                        <Badge className="bg-green-100 text-green-800">
                          ✓ Checked In
                        </Badge>
                      )}
                    </div>
                    
                    {booking.specialRequests && (
                      <p className="text-sm text-muted-foreground">
                        <strong>Note:</strong> {booking.specialRequests}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {booking.status === 'confirmed' && !booking.checkedIn && (
                      <Button
                        size="sm"
                        onClick={() => handleCheckIn(booking.id)}
                        className="flex items-center gap-2"
                      >
                        <QrCode className="w-4 h-4" />
                        Check In
                      </Button>
                    )}
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {booking.status === 'pending' && (
                          <DropdownMenuItem onClick={() => handleStatusChange(booking.id, 'confirmed')}>
                            <Check className="w-4 h-4 mr-2" />
                            Confirm Booking
                          </DropdownMenuItem>
                        )}
                        {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                          <DropdownMenuItem 
                            onClick={() => handleCancel(booking.id)}
                            className="text-destructive"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Cancel Booking
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {filteredBookings.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No bookings found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' || dateFilter !== 'all' 
                  ? 'Try adjusting your filters'
                  : 'Your bookings will appear here'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingsTab;