import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, CreditCard, User, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SlotPicker from '@/components/common/SlotPicker';
import { useAppToast } from '@/components/common/Toast';
import { format } from 'date-fns';

interface BookingFormProps {
  turfId: string;
  turfName: string;
  turfPrice: number;
}

interface BookingData {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  specialRequests: string;
  selectedDate?: Date;
  selectedSlot?: any;
}

const BookingForm: React.FC<BookingFormProps> = ({ turfId, turfName, turfPrice }) => {
  const navigate = useNavigate();
  const { bookingSuccess, error } = useAppToast();
  
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingData, setBookingData] = useState<BookingData>({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    specialRequests: ''
  });

  const handleSlotSelect = (date: Date, timeSlot: any) => {
    setBookingData(prev => ({
      ...prev,
      selectedDate: date,
      selectedSlot: timeSlot
    }));
    setStep(2);
  };

  const handleBookingSubmit = async () => {
    if (!bookingData.selectedDate || !bookingData.selectedSlot) {
      error('Please select a time slot');
      return;
    }

    if (!bookingData.customerName || !bookingData.customerPhone) {
      error('Please fill in required fields');
      return;
    }

    setIsLoading(true);

    try {
      // Mock booking creation - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock payment initiation - replace with Razorpay integration
      const advanceAmount = bookingData.selectedSlot.price * 0.5;
      await mockPayment(advanceAmount);
      
      bookingSuccess();
      navigate('/profile');
      
    } catch (err) {
      error('Booking failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const mockPayment = async (amount: number): Promise<void> => {
    // Mock Razorpay payment
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate 90% success rate
        if (Math.random() > 0.1) {
          resolve();
        } else {
          reject(new Error('Payment failed'));
        }
      }, 1500);
    });
  };

  const totalAmount = bookingData.selectedSlot?.price || turfPrice;
  const advanceAmount = totalAmount * 0.5;
  const remainingAmount = totalAmount - advanceAmount;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        {[1, 2, 3].map((stepNumber) => (
          <div key={stepNumber} className="flex items-center">
            <motion.div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                step >= stepNumber
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
              whileHover={{ scale: 1.1 }}
            >
              {stepNumber}
            </motion.div>
            {stepNumber < 3 && (
              <div className={`w-16 h-1 mx-2 transition-all duration-200 ${
                step > stepNumber ? 'bg-primary' : 'bg-muted'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Titles */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {step === 1 && 'Select Your Slot'}
          {step === 2 && 'Your Details'}
          {step === 3 && 'Confirm & Pay'}
        </h2>
        <p className="text-muted-foreground">
          {step === 1 && 'Choose your preferred date and time'}
          {step === 2 && 'Enter your contact information'}
          {step === 3 && 'Review and complete your booking'}
        </p>
      </div>

      {/* Step 1: Slot Selection */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                {turfName}
              </CardTitle>
              <CardDescription>
                Base price: ₹{turfPrice}/hour
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SlotPicker
                onSelect={handleSlotSelect}
                selectedDate={bookingData.selectedDate}
                selectedSlot={bookingData.selectedSlot}
              />
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Step 2: Customer Details */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Contact Information
              </CardTitle>
              <CardDescription>
                We'll use this to send you booking confirmations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name *
                </Label>
                <Input
                  id="name"
                  value={bookingData.customerName}
                  onChange={(e) => setBookingData(prev => ({ ...prev, customerName: e.target.value }))}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={bookingData.customerPhone}
                  onChange={(e) => setBookingData(prev => ({ ...prev, customerPhone: e.target.value }))}
                  placeholder="+91 98765 43210"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={bookingData.customerEmail}
                  onChange={(e) => setBookingData(prev => ({ ...prev, customerEmail: e.target.value }))}
                  placeholder="your@email.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requests">Special Requests</Label>
                <Textarea
                  id="requests"
                  value={bookingData.specialRequests}
                  onChange={(e) => setBookingData(prev => ({ ...prev, specialRequests: e.target.value }))}
                  placeholder="Any special requirements or requests..."
                  rows={3}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  className="flex-1"
                  disabled={!bookingData.customerName || !bookingData.customerPhone}
                >
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Step 3: Confirmation & Payment */}
      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="space-y-6"
        >
          {/* Booking Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Turf:</span>
                <span className="font-medium">{turfName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Date:</span>
                <span className="font-medium">
                  {bookingData.selectedDate && format(bookingData.selectedDate, 'EEEE, MMMM d, yyyy')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Time:</span>
                <span className="font-medium">
                  {bookingData.selectedSlot?.startTime} - {bookingData.selectedSlot?.endTime}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Customer:</span>
                <span className="font-medium">{bookingData.customerName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Phone:</span>
                <span className="font-medium">{bookingData.customerPhone}</span>
              </div>
            </CardContent>
          </Card>

          {/* Payment Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Payment Details
              </CardTitle>
              <CardDescription>
                Pay 50% advance now, remaining at the turf
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Amount:</span>
                <span className="font-medium">₹{totalAmount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Advance Payment (50%):</span>
                <span className="font-bold text-primary">₹{advanceAmount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Pay at Turf:</span>
                <span className="font-medium">₹{remainingAmount}</span>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => setStep(2)}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              onClick={handleBookingSubmit}
              disabled={isLoading}
              className="flex-1 btn-hero"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin-ball">⚽</div>
                  Processing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Pay ₹{advanceAmount} & Book
                </div>
              )}
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default BookingForm;