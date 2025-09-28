// Enhanced booking form with multi-step process and payment integration
// Frontend: Handles complete booking flow from slot selection to payment
// Backend: Integrates with bookings, payments, and notifications APIs

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, User, CreditCard, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useBooking } from '@/contexts/BookingContext';
import { useAuth } from '@/contexts/AuthContext';
import { useAppToast } from '@/components/common/Toast';
import { Turf, TimeSlot } from '@/types';
import { formatPrice, calculateBookingTotal } from '@/utils/formatPrice';
import { generateReceipt } from '@/utils/generateReceipt';
import { bookingService } from '@/services/bookings';
import { paymentService } from '@/services/payments';

interface EnhancedBookingFormProps {
  turfId: string;                        // Target turf for booking
  turfName: string;                      // Turf name for display
  turfPrice: number;                     // Base price per hour
  onBookingComplete?: (bookingId: string) => void; // Success callback
}

// Booking form steps with validation
const BOOKING_STEPS = [
  { id: 'slot', title: 'Select Slot', icon: Calendar },
  { id: 'details', title: 'Your Details', icon: User },
  { id: 'payment', title: 'Payment', icon: CreditCard },
  { id: 'confirmation', title: 'Confirmation', icon: CheckCircle },
] as const;

const EnhancedBookingForm: React.FC<EnhancedBookingFormProps> = ({
  turfId,
  turfName,
  turfPrice,
  onBookingComplete
}) => {
  // Context hooks for global state management
  const { user } = useAuth();
  const { success, error } = useAppToast();
  const {
    selectedSlot,
    selectedDate,
    customerDetails,
    currentStep,
    totalPrice,
    setSelectedSlot,
    setCustomerDetails,
    setCurrentStep,
    setBookingId,
    calculateTotalPrice,
    resetBooking
  } = useBooking();

  // Local state for form management
  const [isLoading, setIsLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cash'>('online');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  // Load available slots when date changes
  useEffect(() => {
    loadAvailableSlots(currentDate);
  }, [currentDate, turfId]);

  // Auto-fill user details if logged in
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
      });
      setCustomerDetails({
        name: user.name,
        email: user.email,
        phone: user.phone,
      });
    }
  }, [user, setCustomerDetails]);

  /**
   * Load available time slots for selected date
   * Backend: GET /turfs/:id/slots?date=YYYY-MM-DD
   */
  const loadAvailableSlots = async (date: Date) => {
    try {
      setIsLoading(true);
      // const response = await turfService.getTimeSlots(turfId, date);
      // setAvailableSlots(response.data);
      
      // Mock slots for demonstration
      const mockSlots: TimeSlot[] = [
        { id: '1', startTime: '06:00', endTime: '08:00', isAvailable: true, price: turfPrice, date },
        { id: '2', startTime: '08:00', endTime: '10:00', isAvailable: false, price: turfPrice, date },
        { id: '3', startTime: '10:00', endTime: '12:00', isAvailable: true, price: turfPrice, date },
        { id: '4', startTime: '18:00', endTime: '20:00', isAvailable: true, price: turfPrice * 1.25, date },
        { id: '5', startTime: '20:00', endTime: '22:00', isAvailable: true, price: turfPrice * 1.25, date },
      ];
      setAvailableSlots(mockSlots);
    } catch (err) {
      error('Failed to load available slots', 'Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle slot selection and move to next step
   */
  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot, currentDate);
    setCurrentStep('details');
  };

  /**
   * Handle customer details form submission
   */
  const handleDetailsSubmit = () => {
    // Validate form data
    if (!formData.name || !formData.email || !formData.phone) {
      error('Please fill all required fields');
      return;
    }

    setCustomerDetails(formData);
    setCurrentStep('payment');
  };

  /**
   * Process payment and create booking
   * Backend: POST /bookings and POST /payments/initiate
   */
  const handlePaymentSubmit = async () => {
    if (!selectedSlot || !customerDetails) {
      error('Missing booking information');
      return;
    }

    try {
      setIsLoading(true);

      // Step 1: Create booking record
      const bookingData = {
        turfId,
        customerId: user?.id || 'guest',
        slotStart: new Date(`${currentDate.toDateString()} ${selectedSlot.startTime}`),
        slotEnd: new Date(`${currentDate.toDateString()} ${selectedSlot.endTime}`),
        customerDetails,
        paymentMethod,
        notes: '',
      };

      const bookingResponse = await bookingService.createBooking(bookingData);
      const booking = bookingResponse.data;

      // Step 2: Process payment if online payment selected
      if (paymentMethod === 'online') {
        await processOnlinePayment(booking.id, totalPrice);
      }

      // Step 3: Update booking status and show success
      setBookingId(booking.id);
      setCurrentStep('confirmation');
      
      // Show success animation with basketball dunk
      success('Booking confirmed!', 'Your turf has been booked successfully');
      
      // Generate and offer receipt download
      const receipt = generateReceipt(booking);
      
      // Callback to parent component
      onBookingComplete?.(booking.id);

    } catch (err) {
      error('Booking failed', 'Please try again or contact support');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Process online payment with Razorpay
   * Backend: Razorpay order creation and verification
   */
  const processOnlinePayment = async (bookingId: string, amount: number) => {
    try {
      // Step 1: Initialize payment order
      const paymentInit = await paymentService.initiatePayment({
        amount,
        currency: 'INR',
        bookingId,
        customerEmail: formData.email,
        customerPhone: formData.phone,
      });

      // Step 2: Open Razorpay checkout
      const options = paymentService.getRazorpayOptions({
        orderId: paymentInit.data.orderId,
        amount,
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        description: `Booking for ${turfName}`,
      });

      // Mock Razorpay payment simulation
      const paymentResult = await paymentService.simulateRazorpayPayment(options);

      // Step 3: Verify payment
      await paymentService.verifyPayment({
        orderId: paymentInit.data.orderId,
        paymentId: paymentResult.razorpay_payment_id,
        signature: paymentResult.razorpay_signature,
        bookingId,
      });

      success('Payment successful!');
    } catch (err) {
      throw new Error('Payment processing failed');
    }
  };

  /**
   * Reset form and start new booking
   */
  const handleNewBooking = () => {
    resetBooking();
    setCurrentStep('slot');
    setFormData({ name: '', email: '', phone: '' });
  };

  // Calculate total amount with taxes
  const billing = selectedSlot 
    ? calculateBookingTotal(selectedSlot.price, 2) // 2 hours default
    : { subtotal: 0, tax: 0, total: 0, formattedSubtotal: '₹0', formattedTax: '₹0', formattedTotal: '₹0' };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {BOOKING_STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = BOOKING_STEPS.findIndex(s => s.id === currentStep) > index;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  isActive 
                    ? 'bg-primary border-primary text-white' 
                    : isCompleted 
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'bg-gray-100 border-gray-300 text-gray-500'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  isActive ? 'text-primary' : isCompleted ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
                {index < BOOKING_STEPS.length - 1 && (
                  <div className={`mx-4 h-0.5 w-16 ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step content with animations */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Step 1: Slot Selection */}
          {currentStep === 'slot' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Select Date & Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Date selector */}
                <div className="mb-6">
                  <Label className="text-base font-medium mb-3 block">Select Date</Label>
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 7 }, (_, i) => {
                      const date = new Date();
                      date.setDate(date.getDate() + i);
                      const isSelected = currentDate.toDateString() === date.toDateString();
                      
                      return (
                        <Button
                          key={i}
                          variant={isSelected ? 'default' : 'outline'}
                          onClick={() => setCurrentDate(date)}
                          className="flex flex-col p-3 h-auto"
                        >
                          <span className="text-xs">
                            {date.toLocaleDateString('en-US', { weekday: 'short' })}
                          </span>
                          <span className="text-lg font-bold">
                            {date.getDate()}
                          </span>
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Time slots */}
                <div>
                  <Label className="text-base font-medium mb-3 block">Available Slots</Label>
                  {isLoading ? (
                    <div className="text-center py-8">Loading slots...</div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {availableSlots.map((slot) => (
                        <Button
                          key={slot.id}
                          variant={slot.isAvailable ? 'outline' : 'secondary'}
                          disabled={!slot.isAvailable}
                          onClick={() => handleSlotSelect(slot)}
                          className={`flex flex-col p-4 h-auto ${
                            slot.isAvailable 
                              ? 'hover:bg-primary hover:text-white border-primary' 
                              : 'opacity-50 cursor-not-allowed'
                          }`}
                        >
                          <div className="flex items-center gap-1 mb-1">
                            <Clock className="w-4 h-4" />
                            <span className="font-medium">
                              {slot.startTime} - {slot.endTime}
                            </span>
                          </div>
                          <span className="text-sm">
                            {formatPrice(slot.price)}
                          </span>
                          {!slot.isAvailable && (
                            <span className="text-xs text-red-500 mt-1">Booked</span>
                          )}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Customer Details */}
          {currentStep === 'details' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Your Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep('slot')}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>
                  <Button
                    onClick={handleDetailsSubmit}
                    className="flex items-center gap-2 bg-primary hover:bg-primary-hover"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Payment */}
          {currentStep === 'payment' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Booking summary */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold mb-3">Booking Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Turf:</span>
                      <span className="font-medium">{turfName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span>{currentDate.toLocaleDateString()}</span>
                    </div>
                    {selectedSlot && (
                      <div className="flex justify-between">
                        <span>Time:</span>
                        <span>{selectedSlot.startTime} - {selectedSlot.endTime}</span>
                      </div>
                    )}
                    <Separator className="my-2" />
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{billing.formattedSubtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST (18%):</span>
                      <span>{billing.formattedTax}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span className="text-primary">{billing.formattedTotal}</span>
                    </div>
                  </div>
                </div>

                {/* Payment method selection */}
                <div className="mb-6">
                  <Label className="text-base font-medium mb-3 block">Payment Method</Label>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(value) => setPaymentMethod(value as 'online' | 'cash')}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="online" id="online" />
                      <Label htmlFor="online">Pay Online (Recommended)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label htmlFor="cash">Pay at Venue</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep('details')}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>
                  <Button
                    onClick={handlePaymentSubmit}
                    disabled={isLoading}
                    className="flex items-center gap-2 bg-primary hover:bg-primary-hover"
                  >
                    {isLoading ? 'Processing...' : `Pay ${billing.formattedTotal}`}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Confirmation */}
          {currentStep === 'confirmation' && (
            <Card>
              <CardContent className="text-center py-8">
                {/* Success animation */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 260,
                    damping: 20
                  }}
                  className="mb-6"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  {/* Basketball dunk animation placeholder */}
                  <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-4xl mb-4"
                  >
                    🏀
                  </motion.div>
                </motion.div>

                <h3 className="text-2xl font-bold text-green-600 mb-2">
                  Booking Confirmed!
                </h3>
                <p className="text-gray-600 mb-6">
                  Your turf booking has been successfully confirmed. 
                  A confirmation email has been sent to your email address.
                </p>

                <div className="flex gap-3 justify-center">
                  <Button
                    variant="outline"
                    onClick={handleNewBooking}
                  >
                    Book Another Slot
                  </Button>
                  <Button
                    onClick={() => window.location.href = '/profile'}
                    className="bg-primary hover:bg-primary-hover"
                  >
                    View My Bookings
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default EnhancedBookingForm;